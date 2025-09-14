import { Rect, Label, Tag, Text } from "react-konva";
import { useState } from "react";
import type { Pin } from "../data/pin";

type Props = {
  pin: Pin;
  selected?: boolean;
  onClick: (pin: Pin) => void;
};

export default function PinView({ pin, onClick, selected }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <Rect
        x={pin.x - (selected ? 6 : 5) / 2} // Para centrar el cuadrado
        y={pin.y - (selected ? 6 : 5) / 2}
        width={selected ? 7 : 6}
        height={selected ? 7 : 6}
        fill={selected ? "yellow" : "black"}
        stroke="gray"
        strokeWidth={1}
        shadowBlur={selected ? 5 : 0}
        onClick={() => onClick(pin)}
        onMouseEnter={(e) => {
          e.target.getStage()!.container().style.cursor = "pointer";
          setHovered(true);
        }}
        onMouseLeave={(e) => {
          e.target.getStage()!.container().style.cursor = "default";
          setHovered(false);
        }}
      />

      {hovered && (
        <Label x={pin.x + 12} y={pin.y - 20}>
          <Tag fill="black" opacity={0.75} cornerRadius={6} />
          <Text text={` ${pin.id} `} fontSize={12} fill="white" padding={3} />
        </Label>
      )}
    </>
  );
}
