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
}

export default function CircuitCanvas({
  wires,
  selectedPin,
  selectedWire,
  handlePinClick,
  setSelectedWire,
}: CircuitCanvasProps) {
  return (
    <Stage width={800} height={600} className="bg-gray-50 rounded-lg">
      <Layer>
        {/* --- Componentes electrónicos --- */}
        <ArduinoUno
          x={400}
          y={50}
          onPinClick={handlePinClick}
          selectedPin={selectedPin}
          wires={wires}
          selectedWire={selectedWire}
          setSelectedWire={setSelectedWire}
        />
        <Resistor
          x={500}
          y={90}
          id="RES1"
          selectedPin={selectedPin}
          onPinClick={handlePinClick}
          wires={wires}
          selectedWire={selectedWire}
          setSelectedWire={setSelectedWire}
        />
        <Led
          x={600}
          y={200}
          id="LED1"
          selectedPin={selectedPin}
          onPinClick={handlePinClick}
          wires={wires}
          selectedWire={selectedWire}
          setSelectedWire={setSelectedWire}
        />

        {/* --- Dibujar cables ENCIMA --- */}
        {wires.map((wire) => (
          <Line
            key={wire.id}
            points={[wire.from.x, wire.from.y, wire.to.x, wire.to.y]}
            stroke={wire.color}
            strokeWidth={4}
            onClick={() => setSelectedWire(wire.id)}
            shadowBlur={selectedWire === wire.id ? 10 : 0}
          />
        ))}
      </Layer>
    </Stage>
  );
}
