import HC06 from "../components/electronics/HC06";

// 📌 Tabla con offsets base de cada componente
const COMPONENT_BASE_OFFSETS: Record<
  string,
  (dimensions: { width: number; height: number }) => { x: number; y: number }
> = {
  ARDUINO: (d) => ({ x: d.width * 0.5, y: d.height * 0.1 }),
  RES1: (d) => ({ x: d.width * 0.65, y: d.height * 0.15 }),
  LED1: (d) => ({ x: d.width * 0.75, y: d.height * 0.35 }),
  I2CPANTALLA: (d) => ({ x: d.width * 0.27, y: d.height * 0.6 }),
  HSR04: (d) => ({ x: d.width * 0.6, y: d.height * -0.3 }),
  ARDUINO2: (d) => ({ x: d.width * 0.8, y: d.height * 0.1 }),
  BOMBILLO: (d) => ({ x: d.width * 0.7, y: d.height * 0 }),
  ARDUINO3: (d) => ({ x: d.width * 0.4, y: d.height * 0.4 }),
  RELE: (d) => ({ x: d.width * 0.6, y: d.height * 0.6 }),
  HC06: (d) => ({ x: d.width * 0.2, y: d.height * 0.2 }),
  TOMA: (d) => ({ x: d.width * 1, y: d.height * 0.6 }),
  // 👇 Aquí puedes ir agregando más componentes fácilmente
  // MOTOR1: (d) => ({ x: d.width * 0.3, y: d.height * 0.5 }),
  // DISPLAY1: (d) => ({ x: d.width * 0.2, y: d.height * 0.2 }),
};

export function getPinPosition(
  pin: { id: string; componentId: string; x: number; y: number },
  dimensions: { width: number; height: number }
) {
  const baseFn = COMPONENT_BASE_OFFSETS[pin.componentId];
  if (!baseFn) {
    console.warn(`⚠️ No se encontró offset base para ${pin.componentId}`);
    return { x: pin.x, y: pin.y };
  }

  const base = baseFn(dimensions);
  return {
    x: base.x + pin.x,
    y: base.y + pin.y,
  };
}
