import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import "../styles/Home.css";

export default function Home({ user, setUser }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div className="home">
      <nav className="home-navbar">
        <h1>Visual Outlet</h1>
        <div className="nav-buttons">
          {!user ? (
            <>
              <button onClick={() => setShowLogin(true)}>Iniciar Sesión</button>
              <button onClick={() => setShowRegister(true)}>Registrarse</button>
            </>
          ) : (
            <>
              <span className="user-welcome">👋 Hola, {user.name}</span>
              <button className="admin-btn" onClick={() => navigate("/admin")}>
                Administrar
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </nav>

      <div className="home-content">
        <h2>Bienvenido a la página del cliente</h2>
        <p>Gestiona tus pedidos, servicios y más.</p>
      </div>

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onLogin={(name) => {
            setUser({ name });
            setShowLogin(false);
          }}
        />
      )}

      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onRegister={(name) => {
            setUser({ name });
            setShowRegister(false);
          }}
        />
      )}
    </div>
  );
}
