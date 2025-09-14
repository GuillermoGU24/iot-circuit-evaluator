import { Group, Image as KonvaImage } from "react-konva";
import { RelePins, type Pin } from "../../data/pin";
import PinView from "../PinView";
import useImage from "use-image";
import rele from "../../assets/Rele.webp";

interface ReleProps {
  x: number;
  y: number;
  id: string;
  onPinClick: (pin: Pin) => void;
  selectedPin: Pin | null;
  wires: { id: string; from: Pin; to: Pin; color: string }[];
  selectedWire: string | null;
  setSelectedWire: (id: string | null) => void;
}

export default function Rele({
  x,
  y,
  onPinClick,
  selectedPin,
  id,
}: ReleProps) {
  const [image] = useImage(rele);

  return (
    <Group x={x} y={y}>
      <KonvaImage
        image={image}
        width={300}
        height={200}
        shadowBlur={4}
        shadowColor="black"
        shadowOffset={{ x: 2, y: 2 }}
      />

      {RelePins.map((pin) => (
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
