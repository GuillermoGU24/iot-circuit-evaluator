import { Group, Image as KonvaImage } from "react-konva";
import PinView from "../PinView";
import useImage from "use-image";
import pantalla from "../../assets/I2CPANTALLA.webp";
import { i2cPantallaPins, type Pin } from "../../data/pin";

interface i2cPantallaProps {
  x: number;
  y: number;
  id: string;
  onPinClick: (pin: Pin) => void;
  selectedPin: Pin | null;
  wires: { id: string; from: Pin; to: Pin; color: string }[];
  selectedWire: string | null;
  setSelectedWire: (id: string | null) => void;
}

export default function i2cPantalla({
  x,
  y,
  onPinClick,
  selectedPin,
  id,
}: i2cPantallaProps) {
  const [image] = useImage(pantalla);

  return (
    <Group x={x} y={y}>
      <KonvaImage
        image={image}
        width={350}
        height={300}
        shadowBlur={4}
        rotation={180}
        shadowColor="black"
        shadowOffset={{ x: 2, y: 2 }}
      />

      {i2cPantallaPins.map((pin) => (
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
