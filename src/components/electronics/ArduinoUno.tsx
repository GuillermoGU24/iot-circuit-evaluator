import { Group, Image as KonvaImage } from "react-konva";
import { arduinoUnoPins, type Pin } from "../../data/pin";
import PinView from "../PinView";
import useImage from "use-image";
import  arduinoi from "../../assets/arduino.webp";

interface ArduinoUnoProps {
  x: number;
  y: number;
  onPinClick: (pin: Pin) => void;
  selectedPin: Pin | null;
  wires: { id: string; from: Pin; to: Pin; color: string }[];
  selectedWire: string | null;
  setSelectedWire: (id: string | null) => void;
}

export default function ArduinoUno({
  x,
  y,
  onPinClick,
  selectedPin,
}: ArduinoUnoProps) {
  const [image] = useImage(arduinoi); // Reemplaza con tu URL de imagen PNG transparente

  return (
    <Group x={x} y={y}>
      {/* Imagen base del Arduino Uno */}
      <KonvaImage
        image={image}
        width={350}
        height={300}
        rotation={90}
        shadowBlur={4}
        shadowColor="black"
        shadowOffset={{ x: 2, y: 2 }}
      />

      {/* Pines superpuestos sobre la imagen */}
      {arduinoUnoPins.map((pin) => (
        <PinView
          key={pin.id}
          pin={pin}
          selected={selectedPin?.id === pin.id}
          onClick={(clickedPin) =>
            onPinClick({
              ...clickedPin,
              x: clickedPin.x + x,
              y: clickedPin.y + y,
            })
          }
        />
      ))}
    </Group>
  );
}
