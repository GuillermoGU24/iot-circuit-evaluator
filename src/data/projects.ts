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
    description:
      "Construir el circuito denominado “Metro con pantalla I2C” utilizando la placa Arduino UNO. La pantalla I2C debe alimentarse con 5V y GND de la placa, conectando además la línea SCL al pin analógico A5 y la línea SDA al pin analógico A4. El sensor ultrasónico se incorpora al montaje conectando el pin Echo al puerto digital 9 y el pin Trigger al puerto digital 10, garantizando así la comunicación correcta entre los componentes.",
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
    description:
      "Construir el circuito denominado “Bombillo Programable” utilizando la placa Arduino UNO. Para la comunicación inalámbrica se debe integrar el módulo Bluetooth HC-06, conectando su pin TXD al puerto digital 3 y su pin RXD al puerto digital 2 de la placa, mientras que sus pines de alimentación deben adecuarse al sistema de 5V. En el control de potencia se emplea un relé, conectando su pin de señal IN al puerto digital 9 del Arduino. La salida del relé debe vincularse de modo que el contacto normalmente abierto (NO) se conecte con la alimentación del bombillo y el común (COM) se derive hacia la toma de corriente. Finalmente, se debe garantizar la correcta conexión de tierra entre el bombillo y la toma, asegurando el cierre del circuito.",
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
    description:
      "Construir el circuito denominado “Sistema de Riego IoT” empleando la placa ESP32-S3 como controlador principal. El sensor de humedad de suelo debe integrarse al sistema conectando su salida de señal (S) al pin digital 0 del ESP32-S3, mientras que la alimentación se establece con 3.3V y GND. Para el control de la bomba de agua se utiliza un relé, conectando su pin de entrada (IN) al pin digital 1 de la placa, alimentándolo con 3.3V y GND. La salida del relé se configura de modo que el contacto normalmente abierto (NO) reciba los 5V de la fuente, mientras que el común (COM) se dirige hacia la bomba, la cual debe cerrarse correctamente con su conexión a tierra (GND).",
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
