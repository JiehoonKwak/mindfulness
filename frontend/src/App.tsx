import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Meditate from "./pages/Meditate";
import Settings from "./pages/Settings";
import Breathe from "./pages/Breathe";
import Stats from "./pages/Stats";
import History from "./pages/History";
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
          <Route path="/stats" element={<Stats />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
