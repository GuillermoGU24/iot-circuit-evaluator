import { useLocation, useNavigate } from "react-router-dom";

export default function FinalPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const projectName = location.state?.projectName;
  const projectId = location.state?.projectId;

  // Si alguien entra directo sin datos -> redirigir a inicio
  if (!result || !projectName) {
    navigate("/", { replace: true });
    return null;
  }

  const handleRetry = () => {
    navigate(`/circuit/${projectId}`, { state: { projectName } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-700 text-white font-['Press_Start_2P'] p-6">
      <div className="bg-gray-800 border-4 border-gray-600 rounded-3xl shadow-2xl p-10 w-full max-w-2xl text-center space-y-8">
        <h1 className="text-3xl font-extrabold text-yellow-400">
          🎉 ¡Has finalizado la prueba!
        </h1>

        <p className="text-lg text-gray-300">
          Proyecto resuelto:{" "}
          <span className="font-bold text-white">{projectName}</span>
        </p>

        <p className="text-xl">
          Tu puntaje final es:{" "}
          <span
            className={`font-extrabold ${
              result.score === 100 ? "text-green-400" : "text-red-400"
            }`}
          >
            {result.score}%
          </span>
        </p>

        {/* ✅ Correctas */}
        {result.correct.length > 0 && (
          <div className="text-left">
            <h3 className="font-bold text-green-400 mb-2">
              ✅ Conexiones correctas:
            </h3>
            <ul className="list-disc list-inside text-gray-200 text-sm space-y-1">
              {result.correct.map((c: any, i: number) => (
                <li key={i}>
                  {c.from} → {c.to}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ⚠️ Faltantes */}
        {result.missing.length > 0 && (
          <div className="text-left">
            <h3 className="font-bold text-yellow-400 mb-2">
              ⚠️ Conexiones faltantes:
            </h3>
            <ul className="list-disc list-inside text-gray-200 text-sm space-y-1">
              {result.missing.map((c: any, i: number) => (
                <li key={i}>
                  {c.from} → {c.to}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ❌ Sobran */}
        {result.extras.length > 0 && (
          <div className="text-left">
            <h3 className="font-bold text-red-400 mb-2">
              ❌ Conexiones incorrectas :
            </h3>
            <ul className="list-disc list-inside text-gray-200 text-sm space-y-1">
              {result.extras.map((w: any, i: number) => (
                <li key={i}>
                  {w.from.id} → {w.to.id}
                </li>
              ))}
            </ul>
          </div>
        )}
        {result.score < 60 && (
          <button
            onClick={handleRetry}
            className="mt-6 px-6 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-lg transition"
          >
            🔁 Reintentar
          </button>
        )}

        <p className="text-sm text-gray-400 italic pt-6">
          Gracias por participar 🔌⚡
        </p>
      </div>
    </div>
  );
}
