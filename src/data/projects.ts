export const projects = {
  "led-basic": {
    name: "Hola Mundo",
    description:
      "Construir el circuito introductorio “Hola Mundo” en Arduino, conectando un diodo LED a la placa Arduino UNO mediante una resistencia de protección. El cátodo del LED debe ir a tierra (GND) y el ánodo, a través de la resistencia, al pin digital 13.",
    components: [
      {
        type: "ArduinoUno",
        id: "ARDUINO",
        x: 0.5,
        y: 0.1,
      },
      {
        type: "Resistor",
        id: "RES1",
        x: 0.65,
        y: 0.15,
      },
      {
        type: "Led",
        id: "LED1",
        x: 0.75,
        y: 0.35,
      },
    ],
    correctConnections: [
      { from: "D13", to: "RES1" },
      { from: "RES1", to: "LED1_ANODO(+)" },
      { from: "LED1_CATODO(-)", to: "GND" },
    ],
  },
  "metro-i2c": {
    name: "Metro Con Pantalla I2C",
    description: "Conectar un sensor LM35 al Arduino UNO...",
    components: [
      {
        type: "ArduinoUno",
        id: "ARDUINO2",
        x: 0.8,
        y: 0.1,
      },
      {
        type: "i2cPantalla",
        id: "I2CPANTALLA",
        x: 0.27,
        y: 0.6,
      },
      {
        type: "HSR04",
        id: "HSR04",
        x: 0.6,
        y: -0.3,
      },
    ],
    correctConnections: [
      { from: "HSR04_VCC", to: "5V" },
      { from: "HSR04_GND", to: "GND" },
      { from: "HSR04_TRIG", to: "D10" },
      { from: "HSR04_ECHO", to: "D9" },
      { from: "i2c_VCC", to: "5V" },
      { from: "i2c_GND", to: "GND" },
      { from: "i2c_SCL", to: "A5" },
      { from: "i2c_SDA", to: "A4" },
    ],
  },
};

export type ProjectId = keyof typeof projects;

export type CorrectConnection = {
  from: string;
  to: string;
};
