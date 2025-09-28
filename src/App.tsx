import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CircuitPage from "./pages/CircuitPage";
import FinalPage from "./pages/FinalPage";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Capturar token de la URL al cargar la aplicación
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Guardar en sessionStorage
      sessionStorage.setItem("moodle_token", token);

      // Limpiar la URL sin recargar la página
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/circuit/:projectId" element={<CircuitPage />} />
        <Route path="/final" element={<FinalPage />} />
        <Route path="*" element={<Navigate to="/circuit/NotFound" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
