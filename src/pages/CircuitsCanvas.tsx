import { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import { getPinPosition } from "../utils/getPinPosition";
import { projects, type ProjectId } from "../data/projects";

// Importa tus componentes electrónicos
import ArduinoUno from "../components/electronics/ArduinoUno";
import Resistor from "../components/electronics/Resistor";
import Led from "../components/electronics/Led";
import type Konva from "konva";

import HSR04 from "../components/electronics/HSR04";
import Bombillo from "../components/electronics/Bombillo";
import i2cPantalla from "../components/electronics/i2cPantalla";
import Rele from "../components/electronics/Rele";
import HC06 from "../components/electronics/HC06";
import Toma from "../components/electronics/Toma";
import Bomba from "../components/electronics/Bomba";
import Espe32s3 from "../components/electronics/Esp32s3";
import Humedad from "../components/electronics/Humedad";

interface CircuitCanvasProps {
  projectId: ProjectId;
  wires: { id: string; from: any; to: any; color: string }[];
  selectedPin: any | null;
  selectedWire: string | null;
  handlePinClick: (pin: any) => void;
  setSelectedWire: (id: string | null) => void;
  clearWires: () => void;
  currentColor: string;
  setCurrentColor: (color: string) => void;
  useRandomColors?: boolean;
  setUseRandomColors?: (value: boolean) => void;
}

// 🔹 Interface para cable que se está dibujando progresivamente
interface DrawingWire {
  id: string;
  from: any;
  to: any;
  color: string;
  progress: number; // 0 a 1
  startTime: number;
  isDrawing: boolean;
}

// 🔹 Registro dinámico de componentes
const componentRegistry: Record<string, React.FC<any>> = {
  ArduinoUno,
  Resistor,
  Led,
  i2cPantalla,
  HSR04,
  Bombillo,
  Rele,
  HC06,
  Toma,
  Bomba,
  Espe32s3,
  Humedad,
};

// 🎨 Colores disponibles con nombres y valores hex
const colorPalette = [
  { name: "Rojo", value: "#ef4444", hex: "#ef4444" },
  { name: "Azul", value: "#3b82f6", hex: "#3b82f6" },
  { name: "Verde", value: "#10b981", hex: "#10b981" },
  { name: "Naranja", value: "#f97316", hex: "#f97316" },
  { name: "Púrpura", value: "#8b5cf6", hex: "#8b5cf6" },
  { name: "Amarillo", value: "#eab308", hex: "#eab308" },
  { name: "Rosa", value: "#ec4899", hex: "#ec4899" },
  { name: "Cian", value: "#06b6d4", hex: "#06b6d4" },
  { name: "Lima", value: "#84cc16", hex: "#84cc16" },
  { name: "Índigo", value: "#6366f1", hex: "#6366f1" },
  { name: "Marrón", value: "#a16207", hex: "#a16207" },
  { name: "Gris", value: "#6b7280", hex: "#6b7280" },
];

export default function CircuitCanvas({
  projectId,
  wires,
  selectedPin,
  selectedWire,
  handlePinClick,
  setSelectedWire,
  clearWires,
  currentColor = "#ef4444",
  setCurrentColor = () => {},
  useRandomColors = false,
  setUseRandomColors = () => {},
}: CircuitCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);
  const [drawingWires, setDrawingWires] = useState<DrawingWire[]>([]);
  const [completedWires, setCompletedWires] = useState<
    { id: string; from: any; to: any; color: string }[]
  >([]);

  // 🆘 Estados para mensajes de ayuda y selector de colores
  const [showHelp, setShowHelp] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // 🔹 Detectar cuando se añade un nuevo cable para animarlo
  useEffect(() => {
    // Encontrar cables nuevos que no están siendo dibujados ni completados
    const newWires = wires.filter(
      (wire) =>
        !completedWires.some((completed) => completed.id === wire.id) &&
        !drawingWires.some((drawing) => drawing.id === wire.id)
    );

    if (newWires.length > 0) {
      const now = Date.now();
      const newDrawingWires = newWires.map((wire) => ({
        ...wire,
        progress: 0,
        startTime: now,
        isDrawing: true,
      }));

      setDrawingWires((prev) => [...prev, ...newDrawingWires]);
    }
  }, [wires, completedWires, drawingWires]);

  // 🔹 Animación frame por frame
  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const animationDuration = 600; // ms para completar la animación

      setDrawingWires((prevDrawing) => {
        const stillDrawing: DrawingWire[] = [];
        const justCompleted: {
          id: string;
          from: any;
          to: any;
          color: string;
        }[] = [];

        prevDrawing.forEach((wire) => {
          const elapsed = now - wire.startTime;
          const progress = Math.min(elapsed / animationDuration, 1);

          if (progress >= 1) {
            // Animación completada
            justCompleted.push({
              id: wire.id,
              from: wire.from,
              to: wire.to,
              color: wire.color,
            });
          } else {
            // Continuar animando
            stillDrawing.push({
              ...wire,
              progress: easeOutCubic(progress),
            });
          }
        });

        // Mover cables completados a la lista final
        if (justCompleted.length > 0) {
          setCompletedWires((prev) => [...prev, ...justCompleted]);
        }

        return stillDrawing;
      });

      if (drawingWires.length > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    if (drawingWires.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawingWires.length > 0]);

  // 🔹 Función de easing para animación suave
  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  // 🔹 Calcular puntos de línea animada con curva suave
  const getAnimatedLinePoints = (
    from: { x: number; y: number },
    to: { x: number; y: number },
    progress: number
  ) => {
    // Punto actual basado en el progreso
    const currentX = from.x + (to.x - from.x) * progress;
    const currentY = from.y + (to.y - from.y) * progress;

    // Añadir una ligera curva para hacer el dibujo más natural
    const midX = (from.x + currentX) / 2;
    const midY = (from.y + currentY) / 2;
    const curveOffset = Math.sin(progress * Math.PI) * 10; // Curva sutil

    return [from.x, from.y, midX, midY + curveOffset, currentX, currentY];
  };

  // 🔹 Limpiar animaciones cuando se limpian los cables
  const handleClearWires = () => {
    setDrawingWires([]);
    setCompletedWires([]);
    clearWires();
  };

  // 🔹 Actualizar completedWires cuando wires cambia (para eliminar cables)
  useEffect(() => {
    setCompletedWires((prev) =>
      prev.filter((completed) => wires.some((wire) => wire.id === completed.id))
    );
  }, [wires]);

  // ResizeObserver para responsividad
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect) {
          const { width } = entry.contentRect;
          const height = (width * 3) / 4; // relación 4:3
          setDimensions({ width, height });
        }
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Manejar zoom con scroll
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    const oldScale = stage.scaleX();

    const pointer = stage.getPointerPosition();
    const scaleBy = 1.1;
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    zoomAtPointer(stage, oldScale, newScale, pointer);
  };

  const zoomAtPointer = (
    stage: any,
    oldScale: number,
    newScale: number,
    pointer: any
  ) => {
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    stage.scale({ x: newScale, y: newScale });
    setScale(newScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();
  };

  const handleZoom = (zoomIn: boolean) => {
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const scaleBy = 1.2;
    const newScale = zoomIn ? oldScale * scaleBy : oldScale / scaleBy;

    const center = {
      x: dimensions.width / 2,
      y: dimensions.height / 2,
    };

    zoomAtPointer(stage, oldScale, newScale, center);
  };

  const handleReset = () => {
    const stage = stageRef.current;
    stage.scale({ x: 1, y: 1 });
    stage.position({ x: 0, y: 0 });
    setScale(1);
    stage.batchDraw();
  };

  return (
    <div className="flex justify-center items-center w-full h-full p-4">
      <div
        ref={containerRef}
        className="relative w-full max-w-5xl aspect-[4/3] rounded-2xl shadow-lg border border-gray-300 bg-white overflow-hidden"
      >
        {/* Fondo tipo grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#e5e7eb_1px,_transparent_1px)] [background-size:20px_20px] rounded-2xl pointer-events-none" />

        <Stage
          ref={stageRef}
          width={dimensions.width}
          height={dimensions.height}
          draggable
          onWheel={handleWheel}
          className="rounded-2xl relative z-10"
        >
          <Layer>
            {/* --- Renderizado dinámico de componentes --- */}
            {projects[projectId].components.map((comp) => {
              const Comp = componentRegistry[comp.type];
              if (!Comp) return null;

              return (
                <Comp
                  key={comp.id}
                  id={comp.id}
                  x={dimensions.width * comp.x}
                  y={dimensions.height * comp.y}
                  selectedPin={selectedPin}
                  onPinClick={handlePinClick}
                  wires={wires}
                  selectedWire={selectedWire}
                  setSelectedWire={setSelectedWire}
                />
              );
            })}

            {/* --- Dibujar cables completados --- */}
            {completedWires.map((wire) => {
              const fromPos = getPinPosition(wire.from, dimensions);
              const toPos = getPinPosition(wire.to, dimensions);

              return (
                <Line
                  key={wire.id}
                  points={[fromPos.x, fromPos.y, toPos.x, toPos.y]}
                  stroke={wire.color}
                  lineCap="round"
                  lineJoin="round"
                  strokeWidth={selectedWire === wire.id ? 5 : 3}
                  onClick={() => setSelectedWire(wire.id)}
                  shadowBlur={selectedWire === wire.id ? 10 : 0}
                  shadowColor={wire.color}
                  opacity={selectedWire === wire.id ? 1 : 0.9}
                  perfectDrawEnabled={false}
                  onMouseEnter={(e) => {
                    const stage = e.target.getStage();
                    if (stage) stage.container().style.cursor = "pointer";
                    const line = e.target as Konva.Line;
                    line.strokeWidth(5);
                    line.getLayer()?.batchDraw();
                  }}
                  onMouseLeave={(e) => {
                    const stage = e.target.getStage();
                    if (stage) stage.container().style.cursor = "default";
                    const line = e.target as Konva.Line;
                    line.strokeWidth(3);
                    line.getLayer()?.batchDraw();
                  }}
                />
              );
            })}

            {/* --- Dibujar cables que se están animando --- */}
            {drawingWires.map((wire) => {
              const fromPos = getPinPosition(wire.from, dimensions);
              const toPos = getPinPosition(wire.to, dimensions);
              const animatedPoints = getAnimatedLinePoints(
                fromPos,
                toPos,
                wire.progress
              );

              return (
                <Line
                  key={`drawing-${wire.id}`}
                  points={animatedPoints}
                  stroke={wire.color}
                  lineCap="round"
                  lineJoin="round"
                  strokeWidth={4}
                  shadowBlur={8}
                  shadowColor={wire.color}
                  opacity={0.9}
                  perfectDrawEnabled={false}
                  tension={0.4} // Suavizar las curvas
                  listening={false} // No responde a eventos mientras se dibuja
                />
              );
            })}
          </Layer>
        </Stage>

        {/* 🎨 Selector de Colores */}
        <div className="absolute top-3 left-3 z-20">
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex items-center space-x-2 bg-white shadow-lg rounded-lg px-3 py-2 border border-gray-200 hover:shadow-xl transition-all duration-200"
            >
              <div
                className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
                style={{
                  backgroundColor: useRandomColors ? "#888" : currentColor,
                }}
              ></div>
              <span className="text-sm font-medium text-gray-700 cursor-pointer">
                {useRandomColors ? "Aleatorio" : "Color"}
              </span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  showColorPicker ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showColorPicker && (
              <div className="absolute top-12 left-0 bg-white rounded-xl shadow-2xl p-4 border border-gray-200 min-w-[320px]">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Seleccionar Color de Cable
                </h3>

                {/* Toggle para modo aleatorio */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useRandomColors}
                      onChange={(e) => setUseRandomColors(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                        useRandomColors ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                          useRandomColors ? "translate-x-5" : "translate-x-0"
                        }`}
                      ></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      🎲 Colores aleatorios
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Cada cable tendrá un color diferente automáticamente
                  </p>
                </div>

                {/* Paleta de colores (deshabilitada si está activo el modo aleatorio) */}
                <div
                  className={`grid grid-cols-4 gap-2 ${
                    useRandomColors ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {colorPalette.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentColor(color.value);
                        setShowColorPicker(false);
                      }}
                      disabled={useRandomColors}
                      className={`group relative w-12 h-12 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110 ${
                        currentColor === color.value && !useRandomColors
                          ? "ring-2 ring-offset-2 ring-blue-500"
                          : ""
                      } ${
                        useRandomColors
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={
                        useRandomColors
                          ? "Desactiva el modo aleatorio para usar"
                          : color.name
                      }
                    >
                      {currentColor === color.value && !useRandomColors && (
                        <svg
                          className="absolute inset-0 m-auto w-6 h-6 text-white drop-shadow-lg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controles de zoom y utilidades */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 z-20">
          {/* Botón de Ayuda */}
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="bg-indigo-600 text-white w-10 h-10 rounded-lg shadow-md flex items-center justify-center hover:bg-indigo-700 cursor-pointer transition-colors duration-200"
            title="Ayuda"
          >
            ?
          </button>

          <button
            onClick={() => handleZoom(true)}
            className="bg-gray-800 text-white w-10 h-10 rounded-lg shadow-md flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors duration-200"
            title="Acercar"
          >
            +
          </button>
          <button
            onClick={() => handleZoom(false)}
            className="bg-gray-800 text-white w-10 h-10 rounded-lg shadow-md flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors duration-200"
            title="Alejar"
          >
            −
          </button>
          <button
            onClick={handleReset}
            className="bg-blue-600 text-white w-10 h-10 rounded-lg shadow-md flex items-center justify-center hover:bg-blue-500 cursor-pointer transition-colors duration-200"
            title="Resetear vista"
          >
            ⟳
          </button>
          <button
            onClick={handleClearWires}
            className="bg-red-600 text-white w-10 h-10 rounded-lg shadow-md flex items-center justify-center hover:bg-red-500 cursor-pointer transition-colors duration-200"
            title="Limpiar cables"
          >
            🗑️
          </button>
        </div>

        {showHelp && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
              {/* Header fijo */}
              <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center mb-1">
                      <span className="mr-3 text-3xl">🔧</span>
                      Guía del Simulador Chispa
                    </h2>
                    <p className="text-blue-100 opacity-90">
                      Todo lo que necesitas saber para crear circuitos
                    </p>
                  </div>
                  <button
                    onClick={() => setShowHelp(false)}
                    className="cursor-pointer text-white/80 hover:text-white hover:bg-white/20 text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Contenido con scroll */}
              <div className="flex-1 overflow-y-auto p-6 min-h-0">
                {/* Inicio Rápido - Destacado */}
                <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl border-2 border-blue-200 shadow-sm">
                  <h3 className="text-xl font-bold text-blue-800 flex items-center mb-4">
                    <span className="mr-3 text-2xl">🚀</span>
                    Inicio Rápido
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-blue-800">
                          Seleccionar Pin
                        </p>
                        <p className="text-sm text-blue-600">
                          Haz clic en el primer pin que quieras conectar
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-green-800">Conectar</p>
                        <p className="text-sm text-green-600">
                          Haz clic en el segundo pin para crear la conexión
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-purple-800">¡Listo!</p>
                        <p className="text-sm text-purple-600">
                          El cable se dibuja automáticamente
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid principal de contenido */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Hacer Conexiones */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center mb-4">
                      <span className="mr-2 text-xl">🔌</span>
                      Hacer Conexiones
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          1
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            Primer clic
                          </p>
                          <p className="text-sm text-gray-600">
                            El pin se resalta en verde indicando selección
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          2
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            Segundo clic
                          </p>
                          <p className="text-sm text-gray-600">
                            El cable se dibuja con una animación suave
                          </p>
                        </div>
                      </div>
                      <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                        <div className="flex">
                          <span className="text-red-500 mr-2">⚠️</span>
                          <div>
                            <p className="font-medium text-red-800">
                              Restricción importante
                            </p>
                            <p className="text-sm text-red-700">
                              No se pueden conectar pines del mismo componente
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navegación */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center mb-4">
                      <span className="mr-2 text-xl">🗺️</span>
                      Navegación y Vista
                    </h3>
                    <div className="space-y-3">
                      {[
                        { action: "Mover vista", key: "Arrastrar canvas" },
                        { action: "Hacer zoom", key: "Rueda del ratón" },
                        { action: "Resetear vista", key: "Botón ⟳" },
                        { action: "Eliminar cable", key: "Delete/Backspace" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100"
                        >
                          <span className="text-sm font-medium text-gray-800">
                            {item.action}
                          </span>
                          <kbd className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-xs font-mono border border-gray-300">
                            {item.key}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sistema de Colores */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-bold text-purple-800 flex items-center mb-4">
                      <span className="mr-2 text-xl">🎨</span>
                      Sistema de Colores
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-white/70 rounded-lg border border-purple-200">
                        <div className="flex items-center mb-2">
                          <span className="w-4 h-4 bg-purple-500 rounded-full mr-3"></span>
                          <strong className="text-purple-800">
                            Modo Específico
                          </strong>
                        </div>
                        <p className="text-sm text-purple-700">
                          Elige un color fijo para todos los cables nuevos
                        </p>
                      </div>
                      <div className="p-4 bg-white/70 rounded-lg border border-orange-200">
                        <div className="flex items-center mb-2">
                          <span className="mr-3 text-lg">🎲</span>
                          <strong className="text-orange-800">
                            Modo Aleatorio
                          </strong>
                        </div>
                        <p className="text-sm text-orange-700">
                          Cada cable tendrá un color diferente automáticamente
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Consejos Pro */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-bold text-green-800 flex items-center mb-4">
                      <span className="mr-2 text-xl">💡</span>
                      Consejos Profesionales
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          title: "Organización por colores",
                          desc: "Usa rojo para VCC, negro para GND, azul para señales",
                          icon: "✓",
                        },
                        {
                          title: "Pines especiales",
                          desc: "VCC pueden tener múltiples conexiones",
                          icon: "✓",
                        },
                        {
                          title: "Modo aleatorio",
                          desc: "Ideal para circuitos complejos con muchas conexiones",
                          icon: "💡",
                        },
                      ].map((tip, i) => (
                        <div
                          key={i}
                          className="flex items-start space-x-3 p-3 bg-white/70 rounded-lg border border-green-200"
                        >
                          <span
                            className={`${
                              tip.icon === "💡"
                                ? "text-blue-500"
                                : "text-green-500"
                            } mt-0.5 text-sm`}
                          >
                            {tip.icon}
                          </span>
                          <div>
                            <p className="font-medium text-green-800 text-sm">
                              {tip.title}
                            </p>
                            <p className="text-xs text-green-700">{tip.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Estados del sistema */}
                <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2 text-lg">📊</span>
                    Estados del Sistema
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {
                        color: "bg-green-500",
                        label: "Pin disponible",
                        animate: "",
                      },
                      {
                        color: "bg-blue-500",
                        label: "Pin seleccionado",
                        animate: "animate-pulse",
                      },
                      {
                        color: "bg-red-500",
                        label: "Pin ocupado",
                        animate: "",
                      },
                      {
                        color: "bg-purple-500",
                        label: "Cable seleccionado",
                        animate: "",
                      },
                    ].map((state, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100"
                      >
                        <div
                          className={`w-3 h-3 ${state.color} rounded-full ${state.animate}`}
                        ></div>
                        <span className="text-sm font-medium text-gray-700">
                          {state.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer fijo */}
              <div className="flex-shrink-0 bg-white border-t border-gray-200 p-6">
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowHelp(false)}
                    className="cursor-pointer px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    ¡Entendido! Comenzar a crear
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Indicador de cables dibujándose */}
        {drawingWires.length > 0 && (
          <div className="absolute top-16 left-3 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-medium z-20 flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>Dibujando {drawingWires.length} cable(s)...</span>
          </div>
        )}

        {/* Indicador de pin seleccionado */}
        {selectedPin && (
          <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium z-20 flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <span>Pin seleccionado: {selectedPin.id}</span>
          </div>
        )}

        {/* Indicador de color actual */}
        <div className="absolute bottom-3 right-3 bg-white shadow-lg rounded-lg px-3 py-1 text-sm font-medium z-20 flex items-center space-x-2 border border-gray-200">
          <span className="text-gray-600">Próximo cable:</span>
          {useRandomColors ? (
            <span className="text-purple-600 font-semibold">🎲 Aleatorio</span>
          ) : (
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: currentColor }}
            ></div>
          )}
        </div>
      </div>
    </div>
  );
}
