import { Group, Image as KonvaImage } from "react-konva";
import { BombilloPins, type Pin } from "../../data/pin";
import PinView from "../PinView";
import useImage from "use-image";
import bombillo from "../../assets/Bombillo.webp";

interface BombilloProps {
  x: number;
  y: number;
  id: string;
  onPinClick: (pin: Pin) => void;
  selectedPin: Pin | null;
  wires: { id: string; from: Pin; to: Pin; color: string }[];
  selectedWire: string | null;
  setSelectedWire: (id: string | null) => void;
}

export default function Bombillo({
  x,
  y,
  onPinClick,
  selectedPin,
  id,
}: BombilloProps) {
  const [image] = useImage(bombillo);

  return (
    <Group x={x} y={y}>
      <KonvaImage
        image={image}
        width={150}
        height={200}
        shadowBlur={4}
        shadowColor="black"
        shadowOffset={{ x: 2, y: 2 }}
      />

      {BombilloPins.map((pin) => (
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
