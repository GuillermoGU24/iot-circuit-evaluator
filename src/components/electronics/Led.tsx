// En Led.tsx
import { Group, Text, Image as KonvaImage } from "react-konva";
import { ledPins, type Pin } from "../../data/pin";
import PinView from "../PinView";
import useImage from "use-image";
import led from "../../assets/led.webp";

interface LedProps {
  x: number;
  y: number;
  id: string;
  selectedPin: Pin | null;
  onPinClick: (pin: Pin) => void;
  wires: { id: string; from: Pin; to: Pin; color: string }[];
  selectedWire: string | null;
  setSelectedWire: (id: string | null) => void;
}

export default function Led({ x, y, id, selectedPin, onPinClick }: LedProps) {
  const [image] = useImage(led);

  return (
    <Group x={x} y={y}>
      <KonvaImage
        image={image}
        width={70}
        height={100}
        shadowBlur={4}
        shadowColor="black"
        shadowOffset={{ x: 2, y: 2 }}
      />
      <Text x={22} y={-10} text={`${id}`} fontSize={12} fill="black" />

      {ledPins.map((pin) => (
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
