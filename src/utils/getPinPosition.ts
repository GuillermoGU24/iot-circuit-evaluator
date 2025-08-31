import { arduinoUnoPins } from "../data/pin";


export function getPinPosition(pinId: string): { x: number; y: number } {
  const pin = arduinoUnoPins.find((p) => p.id === pinId);
  if (!pin) {
    console.warn(`⚠️ Pin no encontrado: ${pinId}`);
    return { x: 0, y: 0 }; // fallback
  }
  return { x: pin.x, y: pin.y };
}
