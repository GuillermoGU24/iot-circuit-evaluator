# Simulador Chispa

**Herramienta interactiva para validación de circuitos electrónicos IoT**

## Descripción

Simulador Chispa es una plataforma educativa desarrollada para la tesis "Implementación de un curso en la aplicación de tecnologías IoT para la Universidad Francisco de Paula Santander". Permite a estudiantes crear y validar circuitos electrónicos de forma interactiva, proporcionando retroalimentación automática sobre la correctitud de las conexiones realizadas.

## Características Principales

- Canvas interactivo con zoom, paneo y controles intuitivos
- Animaciones fluidas al crear conexiones entre componentes
- Sistema de validación automática de circuitos contra soluciones esperadas
- Integración con Moodle para envío automático de calificaciones
- Selector de colores con modo específico y aleatorio para cables
- Componentes IoT: Arduino, ESP32, sensores, actuadores y módulos

## Tecnologías

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| React | 19.1.1 | Framework UI |
| TypeScript | 5.8.3 | Tipado estático |
| Vite | 7.1.2 | Build tool |
| React Konva | 19.0.7 | Renderizado canvas |
| React Router | 7.8.2 | Navegación |
| Tailwind CSS | 4.1.12 | Estilos |
| Framer Motion | 12.23.12 | Animaciones |

## Instalación
```bash

Uso

Seleccionar proyecto de circuito desde el menú
Hacer clic en un pin para iniciar la conexión (se resalta en verde)
Hacer clic en el pin destino para completar la conexión
Validar circuito cuando esté completo para obtener calificación automática

Controles
AcciónControlMover vistaArrastrar canvasZoomScroll o botones +/-Resetear vistaBotón de resetEliminar cableSeleccionar + DeleteLimpiar todosBotón de limpiar
Sistema de Validación
El simulador compara las conexiones realizadas contra una solución esperada, proporcionando:

Conexiones correctas - Muestra cuáles están bien hechas
Conexiones faltantes - Indica qué conexiones faltan por realizar
Conexiones incorrectas - Señala conexiones que no deberían existir

La puntuación final se calcula como: (correctas / total esperadas) × 100
Estructura del Proyecto
src/
├── components/
│   ├── electronics/      # Componentes (Arduino, LED, sensores, etc.)
│   └── CircuitsCanvas.tsx
├── pages/
│   ├── CircuitPage.tsx   # Página principal del simulador
│   └── FinalPage.tsx     # Página de resultados
├── hooks/
│   └── useConnections.ts # Lógica de gestión de conexiones
├── data/
│   └── projects.ts       # Definición de proyectos y validaciones
└── utils/
Componentes Disponibles

Arduino Uno / ESP32-S3
LEDs y resistencias
Sensor ultrasónico HSR04
Sensor de humedad
Módulo Bluetooth HC-06
Display I2C
Relé y bombillo
Bomba de agua

Autor
Proyecto de tesis - Universidad Francisco de Paula Santander
Tesis: Implementación de un curso en la aplicación de tecnologías IoT
Licencia
MIT License
