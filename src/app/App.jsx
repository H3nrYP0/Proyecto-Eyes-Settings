import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

// Estilos globales
import "/src/shared/styles/globals/app.css";
import "/src/shared/styles/globals/reset.css";
import "/src/shared/styles/globals/variables.css";

import AppRoutes from "./AppRoutes";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar usuario guardado al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  // 🔹 Guardar o limpiar usuario en localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando Visual Outlet...</p>
      </div>
    );
  }

  return (
    <BrowserRouter basename="/Proyecto-Eyes-Settings">
      <AppRoutes 
        user={user}
        setUser={setUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </BrowserRouter>
  );
}
