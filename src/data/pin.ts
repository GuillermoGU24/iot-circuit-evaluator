// En ../../data/arduinoPins.ts
export type Pin = {
  id: string;
  x: number;
  y: number;
  type?: "digital" | "analog"; // Mantenemos el type opcional para compatibilidad
  componentId: string; // Nueva propiedad
};

// Digital pins (D0–D13) con salto entre 7 y 8
const digitalPins: Pin[] = [
  // D0–D7
  ...Array.from({ length: 8 }).map((_, i) => ({
    id: `D${7 - i}`,
    x: -15,
    y: 243 + i * 12,
    type: "digital" as const,
    componentId: "arduino1",
  })),
  // D8–D13 (con el salto extra)
  ...Array.from({ length: 6 }).map((_, i) => ({
    id: `D${7 - i + 6}`,
    x: -15,
    y: 87 + (i + 6) * 12 + 5, //
    type: "digital" as const,
    componentId: "arduino1",
  })),
  { id: "GND3", x: -15, y: 153, componentId: "arduino1" },
];

export const arduinoUnoPins: Pin[] = [
  ...digitalPins,
  // Analog pins (A0–A5)
  ...Array.from({ length: 6 }).map((_, i) => ({
    id: `A${i}`,
    x: -285,
    y: 266 + i * 12,
    type: "analog" as const,
    componentId: "arduino1",
  })),
  // Power pins
  { id: "VIN", x: -285, y: 242, componentId: "arduino1" },
  // Ground pins
  { id: "GND1", x: -285, y: 230, componentId: "arduino1" },
  { id: "GND2", x: -285, y: 219, componentId: "arduino1" },

  { id: "5V", x: -285, y: 208, componentId: "arduino1" },
  { id: "3.3V", x: -285, y: 196, componentId: "arduino1" },
];

// En ../../data/componentPins.ts
export const resistorPins: Pin[] = [
  { id: "RES1_A", x: -43, y: 57, componentId: "resistor1" },
  { id: "RES1_B", x: 43, y: 57, componentId: "resistor1" },
];

export const ledPins: Pin[] = [
  { id: "LED1_ANODO(+)", x: 43, y: 90, componentId: "led1" },
  { id: "LED1_CATODO(-)", x: 30, y: 85, componentId: "led1" },
];
