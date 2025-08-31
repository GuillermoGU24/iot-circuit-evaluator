import { useLocation, useNavigate } from "react-router-dom";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score ?? 0;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">
        {score === 100 ? "¡Excelente! ✅" : "Revisa tus conexiones ❌"}
      </h1>
      <p className="text-xl mb-6">Tu puntaje: {score}</p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-bold shadow-md transition"
      >
        Volver a intentar
      </button>
    </div>
  );
}
