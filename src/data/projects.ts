export const projects = {
  "led-basic": {
    name: "Encender un LED",
    correctConnections: [
      { from: "D13", to: "RES1" },
      { from: "RES1", to: "LED1_ANODO(+)" }, // Coincide con ledPins
      { from: "LED1_CATODO(-)", to: "GND" }, // Coincide con ledPins
    ],
    description: "Un proyecto básico para encender un LED utilizando una resistencia.",
  },
};

export type ProjectId = keyof typeof projects;

export type CorrectConnection = {
  from: string;
  to: string;
};
