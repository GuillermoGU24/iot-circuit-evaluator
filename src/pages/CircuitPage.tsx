// CircuitPage.tsx
import { useParams, useLocation } from "react-router-dom";
import { useConnections } from "../hooks/useConnections";
import { useState } from "react";
import { projects, type ProjectId } from "../data/projects";
import CircuitCanvas from "./CircuitsCanvas";
import Page404 from "./Page404";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";

export default function CircuitPage() {
  const { projectId } = useParams<{ projectId: ProjectId }>();
  const location = useLocation();
  const {
    wires,
    selectedPin,
    selectedWire,
    currentColor,
    useRandomColors,
    handlePinClick,
    setSelectedWire,
    setCurrentColor,
    setUseRandomColors,
    validateConnections,
    clearWires,
  } = useConnections();

  const [validationResult, setValidationResult] = useState<{
    score: number;
    correct: { from: string; to: string }[];
    missing: { from: string; to: string }[];
    extras: { id: string; from: { id: string }; to: { id: string } }[];
  } | null>(null);
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [finished, setFinished] = useState(false);

  if (!projectId || !projects[projectId]) {
    return <Page404 />;
  }

  // ✅ Función actualizada para obtener token desde sessionStorage
  const getToken = () => {
    // Primero intentar desde sessionStorage
    const tokenFromStorage = sessionStorage.getItem("moodle_token");
    if (tokenFromStorage) {
      return tokenFromStorage;
    }

    // Fallback: intentar desde URL (por si acaso)
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");

    // Si encontramos token en URL, guardarlo en sessionStorage
    if (tokenFromUrl) {
      sessionStorage.setItem("moodle_token", tokenFromUrl);
      return tokenFromUrl;
    }

    return null;
  };

  const handleValidate = () => {
    const project = projects[projectId]!;
    const ignoredPins = project.ignoredPins ?? [];
    const totalConnections = project.correctConnections.filter(
      (c) => !ignoredPins.includes(c.from) && !ignoredPins.includes(c.to)
    );

    const result = validateConnections(projectId);
    setValidationResult(result);
    setShowConfirm(true);
  };

  const handleFinish = async () => {
    if (!validationResult) return;

    setFinished(true);
    setShowConfirm(false);

    // ✅ Usar la función actualizada
    const token = getToken();
    if (token) {
      try {
        const response = await fetch(
          "https://pruebamoodle-production.up.railway.app/api/calificar_moodle",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token,
              nota: validationResult.score / 100,
            }),
          }
        );
        if (!response.ok) {
          console.error("❌ Error al enviar la nota:", response.statusText);
        } else {
          console.log("✅ Nota enviada correctamente");
        }
      } catch (error) {
        console.error("❌ Error en la petición:", error);
      }
    } else {
      console.warn("⚠️ No se encontró token para enviar la calificación");
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-b from-gray-900 to-gray-700 font-['Press_Start_2P']">
      {/* HEADER */}
      <header className="bg-gray-800 text-gray-100 p-4 shadow-lg border-b-4 border-gray-600">
        <h1 className="text-lg sm:text-xl font-bold text-center tracking-widest drop-shadow">
          Simulador Chispa 🔌
        </h1>
      </header>

      {/* MAIN */}
      <main className="flex-1 grid grid-cols-1 min-[1440px]:grid-cols-2 gap-4 p-4">
        {/* PANEL DE INFORMACIÓN Y VALIDACIÓN */}
        <div className="flex flex-col justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-2 border-indigo-200/50 rounded-3xl shadow-xl backdrop-blur-sm p-6 space-y-5">
          {/* Título con diseño llamativo */}
          <div className="relative overflow-hidden bg-gradient-to-r from-gray-800 via-blue-900 to-gray-700 rounded-2xl p-6 shadow-2xl">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <h2 className="relative text-2xl text-white font-bold tracking-wide flex items-center justify-center gap-3">
              <span className="text-3xl animate-pulse">⚡</span>
              Validador de Circuitos
              <span className="text-3xl animate-pulse">⚡</span>
            </h2>
          </div>

          {/* Card de información del proyecto */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-blue-100/50 space-y-5 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center gap-4 pb-4 border-b border-blue-100">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-3 rounded-xl shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
              </div>
              <div className="text-left flex-1">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                  Proyecto Actual
                </p>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {projects[projectId].name}
                </h3>
              </div>
            </div>

            <div className="text-sm text-gray-700 leading-relaxed space-y-4">
              <div className="cursor-pointer relative bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border-l-4 border-blue-500 shadow-sm">
                <p className="text-justify text-gray-800">
                  {projects[projectId].description}
                </p>
              </div>

              <div className="relative bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 p-5 rounded-xl shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0 mt-0.5">💡</span>
                  <p className="text-gray-800">
                    Cuando creas que está listo, pulsa el botón de validar para
                    verificar tus conexiones.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de validación mejorado */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleValidate}
              className="cursor-pointer group relative px-10 py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white rounded-2xl shadow-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-green-500/50 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Validar Circuito
              </span>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center bg-white rounded-xl shadow-md border-4 border-gray-700 p-4">
          <CircuitCanvas
            projectId={projectId}
            wires={wires}
            selectedPin={selectedPin}
            selectedWire={selectedWire}
            handlePinClick={handlePinClick}
            setSelectedWire={setSelectedWire}
            clearWires={clearWires}
            currentColor={currentColor}
            setCurrentColor={setCurrentColor}
            useRandomColors={useRandomColors}
            setUseRandomColors={setUseRandomColors}
          />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-300 text-center py-2 text-xs border-t-4 border-gray-600">
        © 2025 Circuit Validator Chispa ⚡
      </footer>

      {/* MODAL CONFIRMAR */}
      {showConfirm &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 ">
            <div className="bg-white border border-gray-300 rounded-3xl shadow-2xl p-12 w-full max-w-3xl text-center space-y-10 transform transition-all duration-300 ease-out scale-100 opacity-100">
              {/* Icono */}
              <div className="flex justify-center">
                <div className="bg-yellow-100 text-yellow-600 p-8 rounded-full shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-20 w-20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M10.29 3.86l-7.4 12.84A1.5 1.5 0 004.21 19h15.58a1.5 1.5 0 001.32-2.3l-7.4-12.84a1.5 1.5 0 00-2.62 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Título */}
              <h2 className="text-3xl font-extrabold text-gray-900">
                ¿Finalizar intento?
              </h2>

              {/* Texto */}
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Si confirmas, se mostrará tu{" "}
                <span className="font-semibold text-gray-800">
                  calificación final
                </span>
                . Una vez finalices,{" "}
                <span className="text-red-600 font-semibold">
                  no podrás volver atrás
                </span>
                .
              </p>

              {/* Botones */}
              <div className="flex justify-center gap-10 pt-6">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-10 py-5 rounded-xl text-xl font-medium text-gray-600 border border-gray-300 hover:bg-gray-100 transition shadow-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleFinish}
                  className="px-10 py-5 rounded-xl text-xl font-semibold text-white bg-green-600 hover:bg-green-700 shadow-lg transition"
                >
                  Terminar intento
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* MODAL RESULTADO */}
      {finished &&
        validationResult &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="bg-white border-4 border-gray-700 rounded-3xl shadow-2xl p-12 w-full max-w-2xl text-center space-y-8 transform transition-all duration-300 ease-out">
              <h2 className="text-3xl font-extrabold text-blue-700">
                🏆 Resultado 🏆
              </h2>
              <p className="text-xl text-gray-800">
                Tu puntaje es:{" "}
                <span
                  className={`font-extrabold ${
                    validationResult.score === 100
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {validationResult.score}%
                </span>
              </p>

              {/* ✅ Correctas */}
              {validationResult.correct.length > 0 && (
                <div className="mt-6 text-left">
                  <h3 className="font-bold text-green-600 mb-2 text-lg">
                    ✅ Correctas:
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
                    {validationResult.correct.map((c, i) => (
                      <li key={i}>
                        {c.from} → {c.to}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ⚠️ Faltantes */}
              {validationResult.missing.length > 0 && (
                <div className="mt-6 text-left">
                  <h3 className="font-bold text-yellow-600 mb-2 text-lg">
                    ⚠️ Faltantes:
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
                    {validationResult.missing.map((c, i) => (
                      <li key={i}>
                        {c.from} → {c.to}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ❌ Sobran */}
              {validationResult.extras.length > 0 && (
                <div className="mt-6 text-left">
                  <h3 className="font-bold text-red-600 mb-2 text-lg">
                    ❌ Conexiones incorrectas :
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
                    {validationResult.extras.map((w, i) => (
                      <li key={i}>
                        {w.from.id} → {w.to.id}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={() =>
                  navigate("/final", {
                    replace: true,
                    state: {
                      result: validationResult,
                      projectName: projects[projectId].name,
                      projectId: projectId,
                    },
                  })
                }
                className="mt-8 cursor-pointer px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg text-lg font-semibold transition"
              >
                OK
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
