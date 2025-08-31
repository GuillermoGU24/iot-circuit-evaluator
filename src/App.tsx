// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CircuitPage from "./pages/CircuitPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/circuit/:projectId" element={<CircuitPage />} />
        <Route
          path="/"
          element={<Navigate to="/circuit/led-basic" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
