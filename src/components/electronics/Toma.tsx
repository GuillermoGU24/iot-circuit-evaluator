import { Group, Image as KonvaImage } from "react-konva";
import { TomaPins, type Pin } from "../../data/pin";
import PinView from "../PinView";
import useImage from "use-image";
import toma from "../../assets/TomaCorriente.webp";

interface TomaProps {
  x: number;
  y: number;
  id: string;
  onPinClick: (pin: Pin) => void;
  selectedPin: Pin | null;
  wires: { id: string; from: Pin; to: Pin; color: string }[];
  selectedWire: string | null;
  setSelectedWire: (id: string | null) => void;
}

export default function Toma({ x, y, onPinClick, selectedPin, id }: TomaProps) {
  const [image] = useImage(toma);

  return (
    <Group x={x} y={y}>
      <KonvaImage
        image={image}
        width={200}
        height={200}
        rotation={270}
        shadowBlur={4}
        shadowColor="black"
        shadowOffset={{ x: 2, y: 2 }}
      />

      {TomaPins.map((pin) => (
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
