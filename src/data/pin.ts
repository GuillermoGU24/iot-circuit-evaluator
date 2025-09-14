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
    componentId: "ARDUINO",
  })),
  // D8–D13 (con el salto extra)
  ...Array.from({ length: 6 }).map((_, i) => ({
    id: `D${7 - i + 6}`,
    x: -15,
    y: 87 + (i + 6) * 12 + 5, //
    type: "digital" as const,
    componentId: "ARDUINO",
  })),
  { id: "GND3", x: -15, y: 153, componentId: "ARDUINO" },
];

export const arduinoUnoPins: Pin[] = [
  ...digitalPins,
  // Analog pins (A0–A5)
  ...Array.from({ length: 6 }).map((_, i) => ({
    id: `A${i}`,
    x: -285,
    y: 266 + i * 12,
    type: "analog" as const,
    componentId: "ARDUINO",
  })),
  // Power pins
  { id: "VIN", x: -285, y: 242, componentId: "ARDUINO" },
  // Ground pins
  { id: "GND1", x: -285, y: 230, componentId: "ARDUINO" },
  { id: "GND2", x: -285, y: 219, componentId: "ARDUINO" },

  { id: "5V", x: -285, y: 208, componentId: "ARDUINO" },
  { id: "3.3V", x: -285, y: 196, componentId: "ARDUINO" },
];

// En ../../data/componentPins.ts
export const resistorPins: Pin[] = [
  { id: "RES1_A", x: -43, y: 57, componentId: "RES1" },
  { id: "RES1_B", x: 43, y: 57, componentId: "RES1" },
];

export const ledPins: Pin[] = [
  { id: "LED1_ANODO(+)", x: 43, y: 90, componentId: "LED1" },
  { id: "LED1_CATODO(-)", x: 30, y: 85, componentId: "LED1" },
];

export const i2cPantallaPins: Pin[] = [
  { id: "i2c_SDA", x: -35, y: -156, componentId: "I2CPANTALLA" },
  { id: "i2c_SCL", x: -35, y: -166, componentId: "I2CPANTALLA" },
  { id: "i2c_VCC", x: -35, y: -146, componentId: "I2CPANTALLA" },
  { id: "i2c_GND", x: -35, y: -136, componentId: "I2CPANTALLA" },
];

export const HSR04Pins: Pin[] = [
  { id: "HSR04_VCC", x: 150, y: 220, componentId: "HSR04" },
  { id: "HSR04_TRIG", x: 165, y: 220, componentId: "HSR04" },
  { id: "HSR04_ECHO", x: 180, y: 220, componentId: "HSR04" },
  { id: "HSR04_GND", x: 195, y: 220, componentId: "HSR04" },
];
