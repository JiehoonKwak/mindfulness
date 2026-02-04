import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Meditate from "./pages/Meditate";
import Settings from "./pages/Settings";
import Breathe from "./pages/Breathe";
import BellPlayer from "./components/BellPlayer";

export default function App() {
  return (
    <BrowserRouter>
      <BellPlayer />
      <div className="min-h-screen bg-background text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/meditate" element={<Meditate />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/breathe" element={<Breathe />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
