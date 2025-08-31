export const projects = {
  "led-basic": {
    name: "Hola Mundo",
    correctConnections: [
      { from: "D13", to: "RES1" },
      { from: "RES1", to: "LED1_ANODO(+)" }, // Coincide con ledPins
      { from: "LED1_CATODO(-)", to: "GND" }, // Coincide con ledPins
    ],
    description:
      "Construir el circuito introductorio “Hola Mundo” en Arduino, conectando un diodo LED a la placa Arduino UNO mediante una resistencia de protección. El cátodo del LED debe ir a tierra (GND) y el ánodo, a través de la resistencia, al pin digital 13.",
  },
};

export type ProjectId = keyof typeof projects;

export type CorrectConnection = {
  from: string;
  to: string;
};
