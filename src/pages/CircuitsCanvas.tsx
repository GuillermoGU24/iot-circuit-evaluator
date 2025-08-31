import { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import Led from "../components/electronics/Led";
import Resistor from "../components/electronics/Resistor";
import ArduinoUno from "../components/electronics/ArduinoUno";
import type { Pin } from "../data/pin";

interface CircuitCanvasProps {
  wires: { id: string; from: Pin; to: Pin; color: string }[];
  selectedPin: Pin | null;
  selectedWire: string | null;
  handlePinClick: (pin: Pin) => void;
  setSelectedWire: (id: string | null) => void;
  clearWires: () => void;
}

export default function CircuitCanvas({
  wires,
  selectedPin,
  selectedWire,
  handlePinClick,
  setSelectedWire,
  clearWires,
}: CircuitCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<any>(null);

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);

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
    const scaleBy = 1.1; // velocidad del zoom
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    zoomAtPointer(stage, oldScale, newScale, pointer);
  };

  // Zoom centrado en un punto
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

  // Zoom manual con botones
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

  // Reset de posición y zoom
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
            {/* --- Componentes electrónicos --- */}
            <ArduinoUno
              x={dimensions.width * 0.5}
              y={dimensions.height * 0.1}
              onPinClick={handlePinClick}
              selectedPin={selectedPin}
              wires={wires}
              selectedWire={selectedWire}
              setSelectedWire={setSelectedWire}
            />
            <Resistor
              x={dimensions.width * 0.65}
              y={dimensions.height * 0.15}
              id="RES1"
              selectedPin={selectedPin}
              onPinClick={handlePinClick}
              wires={wires}
              selectedWire={selectedWire}
              setSelectedWire={setSelectedWire}
            />
            <Led
              x={dimensions.width * 0.75}
              y={dimensions.height * 0.35}
              id="LED1"
              selectedPin={selectedPin}
              onPinClick={handlePinClick}
              wires={wires}
              selectedWire={selectedWire}
              setSelectedWire={setSelectedWire}
            />

            {/* --- Dibujar cables --- */}
            {wires.map((wire) => (
              <Line
                key={wire.id}
                points={[wire.from.x, wire.from.y, wire.to.x, wire.to.y]}
                stroke={wire.color}
                strokeWidth={3}
                onClick={() => setSelectedWire(wire.id)}
                shadowBlur={selectedWire === wire.id ? 10 : 0}
                shadowColor={wire.color}
                opacity={selectedWire === wire.id ? 1 : 0.9}
                perfectDrawEnabled={false}
              />
            ))}
          </Layer>
        </Stage>

        {/* Controles de zoom */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 z-20">
          <button
            onClick={() => handleZoom(true)}
            className="bg-gray-800 text-white w-10 h-10 rounded-lg shadow-md flex items-center justify-center hover:bg-gray-700 cursor-pointer"
          >
            +
          </button>
          <button
            onClick={() => handleZoom(false)}
            className="bg-gray-800 text-white w-10 h-10 rounded-lg shadow-md flex items-center justify-center hover:bg-gray-700 cursor-pointer"
          >
            −
          </button>
          <button
            onClick={handleReset}
            className="bg-blue-600 text-white w-10 h-10 rounded-lg shadow-md flex items-center justify-center hover:bg-blue-500  cursor-pointer"
          >
            ⟳
          </button>
          <button
            onClick={clearWires}
            className="bg-red-600 text-white w-10 h-10 rounded-lg shadow-md flex items-center justify-center hover:bg-red-500  cursor-pointer"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
