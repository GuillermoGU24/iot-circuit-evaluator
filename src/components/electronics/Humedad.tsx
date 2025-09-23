import { Group, Image as KonvaImage } from "react-konva";
import { HumedadPins, type Pin } from "../../data/pin";
import PinView from "../PinView";
import useImage from "use-image";
import humedad from "../../assets/humedad.webp";

interface HumedadProps {
  x: number;
  y: number;
  id: string;
  onPinClick: (pin: Pin) => void;
  selectedPin: Pin | null;
  wires: { id: string; from: Pin; to: Pin; color: string }[];
  selectedWire: string | null;
  setSelectedWire: (id: string | null) => void;
}

export default function Humedad({
  x,
  y,
  onPinClick,
  selectedPin,
  id,
}: HumedadProps) {
  const [image] = useImage(humedad);

  return (
    <Group x={x} y={y}>
      <KonvaImage
        image={image}
        width={120}
        height={200}
        rotation={270}
        shadowBlur={4}
        shadowColor="black"
        shadowOffset={{ x: 2, y: 2 }}
      />

      {HumedadPins.map((pin) => (
        <PinView
          key={pin.id}
          pin={pin}
          selected={selectedPin?.id === pin.id}
          onClick={(clickedPin) =>
            onPinClick({
              ...clickedPin,
              componentId: id,
              x: clickedPin.x,
              y: clickedPin.y,
            })
          }
        />
      ))}
    </Group>
  );
}
