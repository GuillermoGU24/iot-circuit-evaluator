export const projects: Record<string, Project> = {
  "led-basic": {
    name: "Hola Mundo",
    description:
      "Construir el circuito introductorio “Hola Mundo” en Arduino, conectando un diodo LED a la placa Arduino UNO mediante una resistencia de protección. El cátodo del LED debe ir a tierra (GND) y el ánodo, a través de la resistencia, al pin digital 13.",
    components: [
      {
        type: "ArduinoUno", // Componente de la placa Arduino UNO
        id: "ARDUINO", // Identificador único del componente
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
        x: 0.37,
        y: 0.6,
      },
      {
        type: "HSR04",
        id: "HSR04",
        x: 1.2,
        y: 0.1,
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
  "bombillo-programable": {
    name: "Bombillo Programable",
    description: "Conectar un bombillo programable al Arduino UNO...",
    components: [
      {
        type: "ArduinoUno",
        id: "ARDUINO3",
        x: 0.4,
        y: 0.4,
      },
      {
        type: "Bombillo",
        id: "BOMBILLO",
        x: 0.7,
        y: 0.0,
      },
      {
        type: "Rele",
        id: "RELE",
        x: 0.6,
        y: 0.6,
      },
      {
        type: "HC06",
        id: "HC06",
        x: 0.2,
        y: 0.2,
      },
      {
        type: "Toma",
        id: "TOMA",
        x: 1,
        y: 0.6,
      },
    ],
    correctConnections: [
      { from: "H_TXD", to: "D3" },
      { from: "H_RXD", to: "D2" },
      { from: "H_VCC", to: "5V" },
      { from: "H_GND", to: "GND" },
      { from: "R_IN", to: "D9" },
      { from: "R_VCC", to: "5V" },
      { from: "R_GND", to: "GND" },
      { from: "R_NO", to: "B_VCC" },
      { from: "R_COM", to: "T_VCC" },
      { from: "T_GND", to: "B_GND" },
    ],
    ignoredPins: ["R_NC"],
  },
  "riego-iot": {
    name: "Sistema de Riego IoT",
    description: "Conectar un IoT...",
    components: [
      {
        type: "Espe32s3",
        id: "ESP32S3",
        x: 0.7,
        y: 0,
      },
      {
        type: "Humedad",
        id: "HUMEDAD",
        x: 0.0,
        y: 0.4,
      },
      {
        type: "Rele",
        id: "RELE",
        x: 0.6,
        y: 0.6,
      },
      {
        type: "Bomba",
        id: "BOMBA",
        x: 1,
        y: -0.1,
      },
    ],
    correctConnections: [
      { from: "BM_GND", to: "GND" },
      { from: "BM_VCC", to: "R_COM" },
      { from: "R_NO", to: "5V" },
      { from: "R_IN", to: "D1" },
      { from: "R_VCC", to: "3V3" },
      { from: "R_GND", to: "GND" },
      { from: "H_VCC", to: "3V3" },
      { from: "H_GND", to: "GND" },
      { from: "H_S", to: "D0" },
    ],
    ignoredPins: ["R_NC"],
  },
};


export type Project = {
  name: string;
  description: string;
  components: { type: string; id: string; x: number; y: number }[];
  correctConnections: CorrectConnection[];
  ignoredPins?: string[];
};

export type ProjectId = keyof typeof projects;

export type CorrectConnection = {
  from: string;
  to: string;
};
