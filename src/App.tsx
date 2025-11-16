import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import NuestraIglesia from "./pages/NuestraIglesia";
import Departamentos from "./pages/Departamentos";
import Recursos from "./pages/Recursos";
import Noticias from "./pages/Noticias";
import Eventos from "./pages/Eventos";
import Login from "./pages/Login";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nuestra-iglesia" element={<NuestraIglesia />} />
          <Route path="/departamentos" element={<Departamentos />} />
          <Route path="/recursos" element={<Recursos />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
