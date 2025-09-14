// CircuitPage.tsx
import { useParams, useLocation } from "react-router-dom";
import { useConnections } from "../hooks/useConnections";
import { useState } from "react";
import { projects, type Project, type ProjectId } from "../data/projects";
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
    handlePinClick,
    setSelectedWire,
    validateConnections,
    clearWires,
  } = useConnections();

  const [validationResult, setValidationResult] = useState<{
    score: number;
    correct: { from: string; to: string }[];
    incorrect: { from: string; to: string }[];
  } | null>(null);
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [finished, setFinished] = useState(false);

  if (!projectId || !projects[projectId]) {
    return <Page404 />;
  }

  const getTokenFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get("token");
  };

const handleValidate = () => {
  const project = projects[projectId]!;
  const ignoredPins = project.ignoredPins ?? [];
  const totalConnections = project.correctConnections.filter(
    (c) => !ignoredPins.includes(c.from) && !ignoredPins.includes(c.to)
  );

  console.log("👉 wires:", wires);
  console.log("👉 totalConnections:", totalConnections);
  console.log(
    "👉 wires.length:",
    wires.length,
    " totalConnections.length:",
    totalConnections.length
  );

  if (wires.length < totalConnections.length) {
    alert("⚠️ Faltan conexiones por completar");
    return;
  }

  const result = validateConnections(projectId);
  setValidationResult(result);
  setShowConfirm(true);
};

  const handleFinish = async () => {
    if (!validationResult) return;

    setFinished(true); // 👉 ahora sí mostramos nota y errores
    setShowConfirm(false);

    const token = getTokenFromUrl();
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
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <div className="flex items-center justify-center bg-white rounded-xl shadow-md border-4 border-gray-700 p-4">
          <CircuitCanvas
            projectId={projectId}
            wires={wires}
            selectedPin={selectedPin}
            selectedWire={selectedWire}
            handlePinClick={handlePinClick}
            setSelectedWire={setSelectedWire}
            clearWires={clearWires}
          />
        </div>

        <div className="flex flex-col justify-center bg-gray-100 border-4 border-gray-600 rounded-xl shadow-md p-6 text-center space-y-6">
          <h2 className="text-base text-blue-700">
            ⚡ Validador de Circuitos ⚡
          </h2>
          <div className="text-gray-800 text-sm leading-relaxed space-y-2 text-justify">
            <h2 className="text-base font-semibold text-gray-900">
              Proyecto:{" "}
              <span className="font-bold">{projects[projectId].name}</span>
            </h2>
            <p className="text-gray-700">{projects[projectId].description}</p>
            <p className="text-gray-700">
              Cuando creas que está listo, pulsa el botón de validar.
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleValidate}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md text-sm transition "
            >
              ▶ Validar
            </button>
          </div>
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

              {/* ❌ Incorrectas */}
              {validationResult.incorrect.length > 0 && (
                <div className="mt-6 text-left">
                  <h3 className="font-bold text-red-600 mb-2 text-lg">
                    ❌ Incorrectas:
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 text-base space-y-1">
                    {validationResult.incorrect.map((c, i) => (
                      <li key={i}>
                        {c.from} → {c.to}
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
                      projectName: projects[projectId].name, // 👈 pasamos el nombre
                    },
                  })
                }
                className="mt-8 px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg text-lg font-semibold transition"
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
