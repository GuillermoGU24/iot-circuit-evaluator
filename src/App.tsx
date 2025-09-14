import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CircuitPage from "./pages/CircuitPage";
import FinalPage from "./pages/FinalPage";

function App() {
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
