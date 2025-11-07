// src/app/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// RUTAS CORREGIDAS - desde src/app/
import Home from "../features/home/pages/Home";
import AdminLayout from "../shared/components/layouts/AdminLayout";
import Login from "../features/auth/pages/Login";

// ELIMINAR importaciones de CSS que no existen
// import "../styles/globals/index.css";
// import "../styles/globals/reset.css";
// import "../styles/globals/variables.css";

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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando Visual Outlet...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home user={user} setUser={setUser} />} />
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/admin" replace /> : <Login setUser={setUser} />
            } 
          />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}