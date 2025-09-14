import { Group, Image as KonvaImage } from "react-konva";
import { HC06Pins, type Pin } from "../../data/pin";
import PinView from "../PinView";
import useImage from "use-image";
import hc06 from "../../assets/hc06.webp";

interface HC06Props {
  x: number;
  y: number;
  id: string;
  onPinClick: (pin: Pin) => void;
  selectedPin: Pin | null;
  wires: { id: string; from: Pin; to: Pin; color: string }[];
  selectedWire: string | null;
  setSelectedWire: (id: string | null) => void;
}

export default function HC06({
  x,
  y,
  onPinClick,
  selectedPin,
  id,
}: HC06Props) {
  const [image] = useImage(hc06);

  return (
    <Group x={x} y={y}>
      <KonvaImage
        image={image}
        width={250}
        height={200}
        rotation={270}
        shadowBlur={4}
        shadowColor="black"
        shadowOffset={{ x: 2, y: 2 }}
      />

      {HC06Pins.map((pin) => (
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
