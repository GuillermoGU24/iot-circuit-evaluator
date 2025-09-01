import { useParams, useLocation } from "react-router-dom";
import { useConnections } from "../hooks/useConnections";
import { useState } from "react";
import { projects, type ProjectId } from "../data/projects";
import CircuitCanvas from "./CircuitsCanvas";
import Page404 from "./Page404";
import ReactDOM from "react-dom";

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

  const [score, setScore] = useState<number | null>(null);

  if (!projectId || !projects[projectId]) {
    return <Page404 />;
  }

  // 👉 Función para extraer el token de la URL
  const getTokenFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get("token");
  };

  const handleValidate = async () => {
    if (wires.length < projects[projectId].correctConnections.length) {
      alert("⚠️ Faltan conexiones por completar");
      return;
    }

    const result = validateConnections(projectId);
    setScore(result);

    const token = getTokenFromUrl();
    if (token) {
      try {
        const response = await fetch(
          "http://pruebamoodle-production.up.railway.app/calificar_moodle",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: token,
              nota: result / 100,
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
      console.warn("⚠️ No se encontró el token en la URL");
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

      {/* MAIN LAYOUT */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        {/* Circuit container */}
        <div className="flex items-center justify-center bg-white rounded-xl shadow-md border-4 border-gray-700 p-4">
          <CircuitCanvas
            wires={wires}
            selectedPin={selectedPin}
            selectedWire={selectedWire}
            handlePinClick={handlePinClick}
            setSelectedWire={setSelectedWire}
            clearWires={clearWires}
          />
        </div>

        {/* Info + actions */}
        <div className="flex flex-col justify-center bg-gray-100 border-4 border-gray-600 rounded-xl shadow-md p-6 text-center space-y-6">
          <h2 className="text-base text-blue-700">
            ⚡ Validador de Circuitos ⚡
          </h2>
          <div className="text-gray-800 text-sm leading-relaxed space-y-2 text-justify">
            <h2 className="text-base font-semibold text-gray-900">
              Proyecto:{" "}
              <span className="font-bold">{projects[projectId].name}</span>
            </h2>

            <p className="text-gray-700">
              <br />
              {projects[projectId].description}
            </p>
            <p className="text-gray-700">
              <br /> Cuando creas que está listo, pulsa el botón de validar.
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

      {/* RESULT MODAL */}
      {score !== null &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-white border-4 border-gray-700 rounded-xl shadow-xl p-6 max-w-sm w-full text-center space-y-4">
              <h2 className="text-base text-blue-700">🏆 Resultado 🏆</h2>
              <p className="text-sm text-gray-800">
                Tu puntaje es:{" "}
                <span
                  className={`font-bold ${
                    score === 100 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {score}%
                </span>
              </p>
              <button
                onClick={() => setScore(null)}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-md text-xs transition"
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
