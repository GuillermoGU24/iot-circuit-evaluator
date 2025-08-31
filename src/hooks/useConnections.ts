import { useState, useEffect } from "react";
import {
  projects,
  type CorrectConnection,
  type ProjectId,
} from "../data/projects";
import type { Pin } from "../data/pin";

type Wire = { id: string; from: Pin; to: Pin; color: string };

const colors = ["red", "blue", "green", "orange", "purple"];

// Lista de pines equivalentes
const GND_PINS = ["GND1", "GND2", "GND3"];
const RESISTOR_PINS = ["RES1_A", "RES1_B"];

export function useConnections() {
  const [wires, setWires] = useState<Wire[]>([]);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [colorIndex, setColorIndex] = useState(0);
  const [selectedWire, setSelectedWire] = useState<string | null>(null);

  const isPinUsed = (pinId: string) =>
    wires.some((w) => w.from.id === pinId || w.to.id === pinId);

  const handlePinClick = (pin: Pin) => {
    if (isPinUsed(pin.id)) {
      alert(`⚠️ El pin ${pin.id} ya está conectado`);
      return;
    }

    if (!selectedPin) {
      setSelectedPin(pin);
    } else {
      if (selectedPin.componentId === pin.componentId) {
        alert(
          `⚠️ No se pueden conectar pines del mismo componente (${pin.componentId})`
        );
        setSelectedPin(null);
        return;
      }

      if (selectedPin.id !== pin.id && !isPinUsed(selectedPin.id)) {
        const newWire: Wire = {
          id: `${selectedPin.id}-${pin.id}-${Date.now()}`,
          from: selectedPin,
          to: pin,
          color: colors[colorIndex % colors.length],
        };
        console.log("Nuevo cable creado:", newWire); // Depuración
        setWires((prev) => [...prev, newWire]);
        setColorIndex((i) => i + 1);
      }
      setSelectedPin(null);
    }
  };

  const validateConnections = (projectId: ProjectId): number => {
    const project = projects[projectId];
    if (!project) {
      console.log("⚠️ Proyecto no encontrado:", projectId);
      return 0;
    }

    console.log("🔍 Validando wires:", wires);
    console.log(
      "✅ Conexiones correctas esperadas:",
      project.correctConnections
    );

    const total = project.correctConnections.length;
    let correct = 0;

    // Normalizar nombres de pines (quita espacios, + y -)
    const normalize = (id: string) =>
      id.replace(/\s+/g, "").replace(/[+\-]/g, "").toUpperCase();

    const isGND = (pinId: string) =>
      GND_PINS.map(normalize).includes(normalize(pinId)) ||
      normalize(pinId) === "GND";

    const isResistorPin = (pinId: string) =>
      RESISTOR_PINS.map(normalize).includes(normalize(pinId)) ||
      normalize(pinId) === "RES1";

    project.correctConnections.forEach((c: CorrectConnection) => {
      const exists = wires.some((w) => {
        const fromId = normalize(w.from.id);
        const toId = normalize(w.to.id);
        const cFrom = normalize(c.from);
        const cTo = normalize(c.to);

        const fromMatch =
          cFrom === fromId ||
          (cFrom === "GND" && isGND(fromId)) ||
          (cFrom === "RES1" && isResistorPin(fromId));

        const toMatch =
          cTo === toId ||
          (cTo === "GND" && isGND(toId)) ||
          (cTo === "RES1" && isResistorPin(toId));

        // Verificar también en dirección inversa
        const reverseFromMatch =
          cFrom === toId ||
          (cFrom === "GND" && isGND(toId)) ||
          (cFrom === "RES1" && isResistorPin(toId));

        const reverseToMatch =
          cTo === fromId ||
          (cTo === "GND" && isGND(fromId)) ||
          (cTo === "RES1" && isResistorPin(fromId));

        const forwardMatch = fromMatch && toMatch;
        const reverseMatch = reverseFromMatch && reverseToMatch;

        console.log(
          `Comparando: wire(${fromId} -> ${toId}) con conexión esperada(${cFrom} -> ${cTo})`,
          { forwardMatch, reverseMatch }
        );

        return forwardMatch || reverseMatch;
      });

      if (exists) {
        console.log(`✅ Conexión correcta encontrada: ${c.from} -> ${c.to}`);
        correct++;
      } else {
        console.log(`❌ No se encontró conexión: ${c.from} -> ${c.to}`);
      }
    });

    const score = Math.round((correct / total) * 100);
    console.log(
      `Puntaje calculado: ${score}% (correctas: ${correct}/${total})`
    );
    return score;
  };

const clearWires = () => setWires([]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedWire) {
        setWires((prev) => prev.filter((w) => w.id !== selectedWire));
        setSelectedWire(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedWire]);

  return {
    wires,
    selectedPin,
    selectedWire,
    handlePinClick,
    setSelectedWire,
    validateConnections,
    clearWires,
  };
}
