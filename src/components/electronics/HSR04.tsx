import { Group, Image as KonvaImage } from "react-konva";
import PinView from "../PinView";
import useImage from "use-image";
import pantalla from "../../assets/HSR04.webp";
import { HSR04Pins, type Pin } from "../../data/pin";

interface HSR04Props {
  x: number;
  y: number;
  id: string;
  onPinClick: (pin: Pin) => void;
  selectedPin: Pin | null;
  wires: { id: string; from: Pin; to: Pin; color: string }[];
  selectedWire: string | null;
  setSelectedWire: (id: string | null) => void;
}

export default function HSR04({
  x,
  y,
  onPinClick,
  selectedPin,
  id,
}: HSR04Props) {
  const [image] = useImage(pantalla);

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

      {HSR04Pins.map((pin) => (
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
