// src/app/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AdminLayout from "./shared/components/layouts/AdminLayout";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";

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
    <Router basename="/Proyecto-Eyes-Settings">
      <Routes>
        {/* Ruta pública - Landing */}
        <Route path="/" element={<Home user={user} setUser={setUser} />} />
        
        {/* Rutas de autenticación */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        
        {/* Rutas protegidas del admin */}
        <Route 
          path="/admin/*" 
          element={
            user ? (
              <AdminLayout user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        
        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}