import { useState, useEffect } from "react";
import {
  projects,
  type CorrectConnection,
  type ProjectId,
} from "../data/projects";
import type { Pin } from "../data/pin";

type Wire = { id: string; from: Pin; to: Pin; color: string };

// Colores disponibles en formato hex
const colors = [
  "#ef4444",
  "#3b82f6",
  "#10b981",
  "#f97316",
  "#8b5cf6",
  "#eab308",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#6366f1",
  "#a16207",
  "#6b7280",
  "#f59e0b",
  "#14b8a6",
  "#8b5a2b",
  "#dc2626",
  "#7c3aed",
  "#059669",
  "#ea580c",
  "#be185d",
];

// Lista de pines equivalentes
const GND_PINS = ["GND1", "GND2", "GND3"];
const p3V3_PINS = ["3V3_1", "3V3_2", "3V3_3"];
const RESISTOR_PINS = ["RES1_A", "RES1_B"];

export function useConnections() {
  const [wires, setWires] = useState<Wire[]>([]);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [colorIndex, setColorIndex] = useState(0);
  const [selectedWire, setSelectedWire] = useState<string | null>(null);
  const [currentColor, setCurrentColor] = useState<string>("#ef4444"); // Color por defecto
  const [useRandomColors, setUseRandomColors] = useState<boolean>(false); // Si usar colores aleatorios

  const isExclusivePin = (pinId: string) => {
    const normalized = pinId.trim().toUpperCase();
    return !["VCC5V", "5V", "+5V", "GND"].includes(normalized);
  };

  const isPinUsed = (pinId: string) => {
    if (!isExclusivePin(pinId)) return false;
    return wires.some((w) => w.from.id === pinId || w.to.id === pinId);
  };

  // Función para obtener un color aleatorio
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Función para obtener el color a usar
  const getWireColor = () => {
    if (useRandomColors) {
      return getRandomColor();
    }
    return currentColor;
  };

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
          color: getWireColor(), // Usar el color seleccionado o aleatorio
        };
        setWires((prev) => [...prev, newWire]);
        setColorIndex((i) => i + 1);
      }
      setSelectedPin(null);
    }
  };

  const validateConnections = (projectId: ProjectId) => {
    const project = projects[projectId];
    if (!project) {
      console.log("⚠️ Proyecto no encontrado:", projectId);
      return { score: 0, correct: [], incorrect: [], extras: [] };
    }

    const ignoredPins = project.ignoredPins || [];

    const totalConnections = project.correctConnections.filter(
      (c) => !ignoredPins.includes(c.from) && !ignoredPins.includes(c.to)
    );

    const total = totalConnections.length;
    const correctConnections: CorrectConnection[] = [];
    const missingConnections: CorrectConnection[] = [];
    const extraConnections: Wire[] = [];

    const normalize = (id: string) =>
      id.replace(/\s+/g, "").replace(/[+-]/g, "").toUpperCase();

    const isGND = (pinId: string) =>
      GND_PINS.map(normalize).includes(normalize(pinId)) ||
      normalize(pinId) === "GND";

    const is3V3 = (pinId: string) =>
      p3V3_PINS.map(normalize).includes(normalize(pinId)) ||
      normalize(pinId) === "3V3";

    const isResistorPin = (pinId: string) =>
      RESISTOR_PINS.map(normalize).includes(normalize(pinId)) ||
      normalize(pinId) === "RES1";

    // --- revisar correctas y faltantes ---
    totalConnections.forEach((c: CorrectConnection) => {
      const exists = wires.some((w) => {
        const fromId = normalize(w.from.id);
        const toId = normalize(w.to.id);
        const cFrom = normalize(c.from);
        const cTo = normalize(c.to);

        const fromMatch =
          cFrom === fromId ||
          (cFrom === "GND" && isGND(fromId)) ||
          (cFrom === "3V3" && is3V3(fromId)) ||
          (cFrom === "RES1" && isResistorPin(fromId));

        const toMatch =
          cTo === toId ||
          (cTo === "GND" && isGND(toId)) ||
          (cTo === "3V3" && is3V3(toId)) ||
          (cTo === "RES1" && isResistorPin(toId));

        const reverseFromMatch =
          cFrom === toId ||
          (cFrom === "GND" && isGND(toId)) ||
          (cFrom === "3V3" && is3V3(toId)) ||
          (cFrom === "RES1" && isResistorPin(toId));

        const reverseToMatch =
          cTo === fromId ||
          (cTo === "GND" && isGND(fromId)) ||
          (cTo === "3V3" && is3V3(fromId)) ||
          (cTo === "RES1" && isResistorPin(fromId));

        return (fromMatch && toMatch) || (reverseFromMatch && reverseToMatch);
      });

      if (exists) {
        correctConnections.push(c);
      } else {
        missingConnections.push(c);
      }
    });

    // --- detectar extras ---
    wires.forEach((w) => {
      const fromId = normalize(w.from.id);
      const toId = normalize(w.to.id);

      const matchesCorrect = totalConnections.some((c) => {
        const cFrom = normalize(c.from);
        const cTo = normalize(c.to);

        const fromMatch =
          cFrom === fromId ||
          (cFrom === "GND" && isGND(fromId)) ||
          (cFrom === "3V3" && is3V3(fromId)) ||
          (cFrom === "RES1" && isResistorPin(fromId));

        const toMatch =
          cTo === toId ||
          (cTo === "GND" && isGND(toId)) ||
          (cTo === "3V3" && is3V3(toId)) ||
          (cTo === "RES1" && isResistorPin(toId));

        const reverseFromMatch =
          cFrom === toId ||
          (cFrom === "GND" && isGND(toId)) ||
          (cFrom === "3V3" && is3V3(toId)) ||
          (cFrom === "RES1" && isResistorPin(toId));

        const reverseToMatch =
          cTo === fromId ||
          (cTo === "GND" && isGND(fromId)) ||
          (cTo === "3V3" && is3V3(fromId)) ||
          (cTo === "RES1" && isResistorPin(fromId));

        return (fromMatch && toMatch) || (reverseFromMatch && reverseToMatch);
      });

      if (!matchesCorrect) {
        extraConnections.push(w);
      }
    });

    const score = Math.round((correctConnections.length / total) * 100);

    return {
      score,
      correct: correctConnections,
      missing: missingConnections,
      extras: extraConnections,
    };
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
    currentColor,
    useRandomColors,
    handlePinClick,
    setSelectedWire,
    setCurrentColor,
    setUseRandomColors,
    validateConnections,
    clearWires,
  };
}
