import { useParams } from "react-router-dom";
import { useConnections } from "../hooks/useConnections";
import { useEffect, useState } from "react";
import { projects, type ProjectId } from "../data/projects";
import CircuitCanvas from "./CircuitsCanvas";

export default function CircuitPage() {
  const { projectId } = useParams<{ projectId: ProjectId }>();
  const {
    wires,
    selectedPin,
    selectedWire,
    handlePinClick,
    setSelectedWire,
    validateConnections,
  } = useConnections();

  const [score, setScore] = useState<number | null>(null);

  if (!projectId || !projects[projectId]) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-bold">
        Proyecto no encontrado 🚫
      </div>
    );
  }

  const handleValidate = () => {
    if (wires.length < projects[projectId].correctConnections.length) {
      alert("⚠️ Faltan conexiones por completar");
      return;
    }
    const result = validateConnections(projectId);
    setScore(result);
  };

  return (
    <div className="flex flex-col w-full h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">{projects[projectId].name}</h1>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-2">
          <CircuitCanvas
            wires={wires}
            selectedPin={selectedPin}
            selectedWire={selectedWire}
            handlePinClick={handlePinClick}
            setSelectedWire={setSelectedWire}
          />
        </div>
      </main>
      <footer className="p-4 bg-gray-200 flex justify-center">
        <button
          onClick={handleValidate}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-xl text-white font-bold shadow-md transition"
        >
          Validar
        </button>
      </footer>
      {score !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4">Resultado</h2>
            <p className="text-lg">
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
              className="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
