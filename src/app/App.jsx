import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Estilos globales
import "/src/shared/styles/globals/app.css";
import "/src/shared/styles/globals/reset.css";
import "/src/shared/styles/globals/variables.css";

// PÁGINAS
import LandingPage from "../features/home/pages/LandingPage";
import ProductsPage from "../features/home/pages/ProductsPage";
import ServicesPage from "../features/home/pages/ServicesPage";
import Login from "../features/auth/components/Login";
import Register from "../features/auth/components/Register";
import ForgotPassword from "../features/auth/components/ForgotPassword";

// DASHBOARD
import OpticaDashboardLayout from "../shared/components/layouts/OpticaDashboardLayout";

// COMPONENTE PROTECTED ROUTE
function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Guardar usuario
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const handleLogin = (userData) => setUser(userData);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👁️</div>
          <h2>Visual Outlet</h2>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router basename="/Proyecto-Eyes-Settings">
      <Routes>
        {/* RUTA PRINCIPAL */}
        <Route path="/" element={<LandingPage user={user} setUser={setUser} />} />
        
        {/* NUEVAS RUTAS DEL LANDING PAGE */}
        <Route path="/productos" element={<ProductsPage user={user} setUser={setUser} />} />
        <Route path="/servicios" element={<ServicesPage user={user} setUser={setUser} />} />
        
        {/* RUTAS DE AUTENTICACIÓN */}
        <Route 
          path="/login" 
          element={
            user ? <Navigate to="/admin/dashboard" replace /> : <Login setUser={handleLogin} />
          } 
        />
        <Route 
          path="/register" 
          element={
            user ? <Navigate to="/admin/dashboard" replace /> : <Register />
          } 
        />
        <Route 
          path="/forgot-password" 
          element={
            user ? <Navigate to="/admin/dashboard" replace /> : <ForgotPassword />
          } 
        />
        
        {/* RUTAS PROTEGIDAS DEL DASHBOARD */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute user={user}>
              <OpticaDashboardLayout user={user} setUser={setUser} />
            </ProtectedRoute>
          } 
        />
        
        {/* RUTA 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}