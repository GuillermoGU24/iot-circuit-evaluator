import { Group, Image as KonvaImage } from "react-konva";
import { Esp32Pins, type Pin } from "../../data/pin";
import PinView from "../PinView";
import useImage from "use-image";
import esp32 from "../../assets/esp32.webp";

interface Espe32s3Props {
  x: number;
  y: number;
  id: string;
  onPinClick: (pin: Pin) => void;
  selectedPin: Pin | null;
  wires: { id: string; from: Pin; to: Pin; color: string }[];
  selectedWire: string | null;
  setSelectedWire: (id: string | null) => void;
}

export default function Espe32s3({
  x,
  y,
  onPinClick,
  selectedPin,
  id,
}: Espe32s3Props) {
  const [image] = useImage(esp32);

  return (
    <Group x={x} y={y}>
      <KonvaImage
        image={image}
        width={500}
        height={400}
        rotation={90}
        shadowBlur={4}
        shadowColor="black"
        shadowOffset={{ x: 2, y: 2 }}
      />

      {Esp32Pins.map((pin) => (
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
