import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Importar estilos globales principales
import "/src/shared/styles/globals/app.css";
import "/src/shared/styles/globals/reset.css";
import "/src/shared/styles/globals/variables.css";

import Home from "../features/home/pages/Home";
import OpticaDashboardLayout from "../shared/components/layouts/OpticaDashboardLayout";
import Login from "../features/auth/pages/Login";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando Visual Outlet...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                user={user} 
                setUser={setUser} 
                onLoginClick={() => window.location.href = '/login'}
              />
            } 
          />
          <Route 
            path="/login" 
            element={
              user ? 
              <Navigate to="/admin/dashboard" replace /> : 
              <Login setUser={handleLogin} />
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              user ? (
                <OpticaDashboardLayout 
                  user={user} 
                  setUser={setUser} 
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}