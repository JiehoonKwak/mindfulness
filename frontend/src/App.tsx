import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Meditate from "./pages/Meditate";
import Settings from "./pages/Settings";
import Breathe from "./pages/Breathe";
import Insights from "./pages/Insights";
import BellPlayer from "./components/BellPlayer";

export default function App() {
  return (
    <BrowserRouter>
      <BellPlayer />
      <div className="min-h-screen bg-background text-[var(--color-text)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meditate" element={<Meditate />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/breathe" element={<Breathe />} />
          <Route path="/insights" element={<Insights />} />
          {/* Legacy routes redirect to insights */}
          <Route path="/stats" element={<Insights />} />
          <Route path="/history" element={<Insights />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
