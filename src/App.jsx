import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLayout from "./admin/layouts/AdminLayout";

export default function App() {
  const [user, setUser] = useState(null);

  // Cargar usuario guardado
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Guardar usuario cuando cambia
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} setUser={setUser} />} />
        {/* 👇 se cambia /admin por /admin/* para permitir rutas internas */}
        <Route path="/admin/*" element={<AdminLayout user={user} />} />
      </Routes>
    </Router>
  );
}
