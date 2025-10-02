# ⚡ Chispa - Simulador de Circuitos Electrónicos

<div align="center">

![Chispa Logo](https://img.shields.io/badge/⚡-Chispa-blue?style=for-the-badge)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)

**Una herramienta interactiva para el aprendizaje de circuitos electrónicos**

[Características](#-características) • [Tecnologías](#-tecnologías) • [Instalación](#-instalación) • [Uso](#-uso) • [Arquitectura](#-arquitectura)

</div>

---

## 📖 Descripción

**Chispa** es un simulador de circuitos electrónicos desarrollado como proyecto de tesis, diseñado para facilitar el aprendizaje práctico de electrónica mediante una interfaz gráfica intuitiva e interactiva. La herramienta permite a los estudiantes crear conexiones entre componentes electrónicos, validar sus circuitos en tiempo real y recibir retroalimentación inmediata sobre la correctitud de sus diseños.

### 🎯 Objetivo

Proporcionar una plataforma educativa que combine la teoría y la práctica de circuitos electrónicos, permitiendo a los usuarios experimentar sin riesgo de dañar componentes físicos, mientras desarrollan habilidades fundamentales en electrónica.

---

## ✨ Características

### 🔌 Conexiones Interactivas
- **Sistema de cableado punto a punto**: Haz clic en dos pines para crear conexiones
- **Animaciones fluidas**: Los cables se dibujan con animaciones suaves y naturales
- **Validación en tiempo real**: El sistema previene conexiones inválidas automáticamente
- **Feedback visual inmediato**: Los pines cambian de color según su estado (disponible, seleccionado, ocupado)

### 🎨 Sistema de Colores Avanzado
- **Paleta de 12 colores predefinidos**: Organiza tus circuitos con colores personalizados
- **Modo aleatorio**: Cada cable recibe automáticamente un color único
- **Selector visual intuitivo**: Interfaz desplegable con vista previa de colores

### 🔍 Navegación y Visualización
- **Zoom dinámico**: Acércate o aléjate usando la rueda del mouse
- **Desplazamiento libre**: Arrastra el canvas para explorar circuitos grandes
- **Reseteo rápido**: Vuelve a la vista inicial con un solo clic
- **Grid de referencia**: Fondo con cuadrícula para mejor orientación espacial

### ✅ Sistema de Validación
- **Evaluación automática**: Compara tus conexiones con el circuito correcto
- **Puntuación detallada**: Recibe un porcentaje basado en conexiones correctas
- **Retroalimentación específica**: 
  - ✅ Conexiones correctas
  - ⚠️ Conexiones faltantes
  - ❌ Conexiones incorrectas
- **Integración con Moodle**: Envío automático de calificaciones

### 🧩 Componentes Soportados
- **Microcontroladores**: Arduino Uno, ESP32-S3
- **Sensores**: HC-SR04 (ultrasónico), módulo de humedad
- **Actuadores**: LEDs, bombillos, relés, bombas
- **Comunicación**: HC-06 (Bluetooth), pantalla I2C
- **Componentes pasivos**: Resistencias, tomas de corriente
- **Arquitectura extensible**: Fácil adición de nuevos componentes

### 📚 Sistema de Ayuda Integrado
- Guía completa de uso en la interfaz
- Tutoriales paso a paso
- Consejos profesionales para organización de circuitos
- Descripción de estados del sistema

---

## 🛠 Tecnologías

### Core
- **React 19.1.1**: Librería principal para la interfaz de usuario
- **TypeScript 5.8.3**: Tipado estático para mayor robustez
- **Vite 7.1.2**: Build tool ultrarrápido con HMR

### Renderizado Gráfico
- **Konva 9.3.22**: Motor de renderizado canvas 2D de alto rendimiento
- **React-Konva 19.0.7**: Bindings de React para Konva
- **use-image 1.1.4**: Hook para carga optimizada de imágenes

### Estilos y Animaciones
- **Tailwind CSS 4.1.12**: Framework utility-first para estilos
- **Framer Motion 12.23.12**: Librería de animaciones fluidas

### Navegación
- **React Router DOM 7.8.2**: Enrutamiento entre páginas del simulador

### Desarrollo
- **ESLint**: Linting con configuración estricta para TypeScript
- **Babel / SWC**: Transpilación y Fast Refresh
- **Plugins específicos**: 
  - `@vitejs/plugin-react`: Integración React + Vite
  - `eslint-plugin-react-hooks`: Validación de hooks
  - `eslint-plugin-react-refresh`: Soporte para Fast Refresh

---

## 🚀 Instalación

### Prerrequisitos
- Node.js >= 18.0.0
- npm >= 9.0.0 o yarn >= 1.22.0

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/chispa.git
cd chispa
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:5173
```

---

## 📦 Scripts Disponibles

```bash
# Desarrollo - Inicia servidor con HMR
npm run dev

# Build - Compila para producción
npm run build

# Preview - Previsualiza el build de producción
npm run preview

# Lint - Ejecuta ESLint en el código
npm run lint
```

---

## 💻 Uso

### Crear una Conexión
1. **Selecciona el primer pin**: Haz clic en cualquier pin disponible (se resaltará en verde)
2. **Selecciona el segundo pin**: Haz clic en otro pin de un componente diferente
3. **¡Listo!**: El cable se dibujará automáticamente con animación

### Cambiar Colores
- Haz clic en el selector de color (esquina superior izquierda)
- Elige un color específico o activa el modo aleatorio
- Los nuevos cables usarán el color seleccionado

### Validar el Circuito
1. Completa todas las conexiones necesarias
2. Haz clic en **"Validar Circuito"**
3. Revisa el resultado detallado
4. Haz clic en **"Terminar intento"** para finalizar

### Atajos de Teclado
- **Delete/Backspace**: Eliminar cable seleccionado
- **Rueda del mouse**: Zoom in/out
- **Arrastrar canvas**: Mover vista

---

## 🏗 Arquitectura

### Estructura del Proyecto
```
src/
├── components/
│   └── electronics/          # Componentes electrónicos
│       ├── ArduinoUno.tsx
│       ├── Led.tsx
│       ├── Resistor.tsx
│       └── ...
├── data/
│   └── projects.ts           # Definición de proyectos y circuitos
├── hooks/
│   └── useConnections.ts     # Lógica de conexiones y validación
├── pages/
│   ├── CircuitPage.tsx       # Página principal del simulador
│   └── CircuitsCanvas.tsx    # Canvas de renderizado
└── utils/
    └── getPinPosition.ts     # Cálculo de posiciones de pines
```

### Flujo de Datos
```
Usuario hace clic en pin
    ↓
useConnections actualiza estado
    ↓
CircuitsCanvas renderiza conexión
    ↓
Animación de dibujado
    ↓
Cable completado agregado a la lista
```

### Sistema de Validación
```typescript
interface ValidationResult {
  score: number;                    // Puntuación 0-100
  correct: Connection[];            // Conexiones correctas
  missing: Connection[];            // Conexiones faltantes
  extras: Wire[];                   // Conexiones incorrectas
}
```

---

## 🎓 Casos de Uso Educativos

### 1. Laboratorios Virtuales
- Práctica de circuitos sin necesidad de equipos físicos
- Acceso remoto para estudiantes

### 2. Evaluación Automatizada
- Calificación objetiva y consistente
- Retroalimentación inmediata
- Integración con LMS (Moodle)

### 3. Aprendizaje Autodirigido
- Experimentación segura sin riesgo de daños
- Sistema de ayuda integrado
- Múltiples intentos sin costos

---

## 🔧 Configuración de ESLint (Opcional)

Para aplicaciones en producción, se recomienda habilitar reglas más estrictas:

```typescript
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto fue desarrollado como trabajo de tesis. Los términos de uso serán definidos por la institución educativa correspondiente.

---

## 👨‍💻 Autor

**Proyecto de Tesis**  
Simulador de Circuitos Electrónicos Chispa

---

## 🙏 Agradecimientos

- A los profesores y tutores que guiaron este proyecto
- A la comunidad de React y TypeScript por las herramientas increíbles
- A todos los estudiantes que probarán y darán feedback sobre Chispa

---

<div align="center">

**⚡ Desarrollado con pasión por la educación en electrónica ⚡**

[⬆️ Volver arriba](#-chispa---simulador-de-circuitos-electrónicos)

</div>
