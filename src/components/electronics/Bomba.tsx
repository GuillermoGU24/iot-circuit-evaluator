import { Group, Image as KonvaImage } from "react-konva";
import { BombaPins, type Pin } from "../../data/pin";
import PinView from "../PinView";
import useImage from "use-image";
import bomba from "../../assets/bomba.webp";

interface BombaProps {
  x: number;
  y: number;
  id: string;
  onPinClick: (pin: Pin) => void;
  selectedPin: Pin | null;
  wires: { id: string; from: Pin; to: Pin; color: string }[];
  selectedWire: string | null;
  setSelectedWire: (id: string | null) => void;
}

export default function Bomba({
  x,
  y,
  onPinClick,
  selectedPin,
  id,
}: BombaProps) {
  const [image] = useImage(bomba);

  return (
    <Group x={x} y={y}>
      <KonvaImage
        image={image}
        width={350}
        height={300}
        shadowBlur={4}
        rotation={90}
        shadowColor="black"
        shadowOffset={{ x: 2, y: 2 }}
      />

      {BombaPins.map((pin) => (
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
