import { Group, Image as KonvaImage, Text } from "react-konva";
import { resistorPins, type Pin } from "../../data/pin";
import PinView from "../PinView";
import resistencia from "../../assets/resistencia.webp";
import useImage from "use-image";

interface ResistorProps {
  x: number;
  y: number;
  id: string;
  selectedPin: Pin | null;
  onPinClick: (pin: Pin) => void;
  wires: { id: string; from: Pin; to: Pin; color: string }[];
  selectedWire: string | null;
  setSelectedWire: (id: string | null) => void;
}

export default function Resistor({
  x,
  y,
  id,
  selectedPin,
  onPinClick,
}: ResistorProps) {
  const [image] = useImage(resistencia);

  return (
    <Group x={x} y={y}>
      <KonvaImage
        image={image}
        width={80}
        height={80}
        rotation={45}
        shadowBlur={4}
        shadowColor="black"
        shadowOffset={{ x: 2, y: 2 }}
      />
      <Text x={-11} y={33} text={id} fontSize={12} fill="black" />

      {resistorPins.map((pin) => (
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
