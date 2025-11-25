import { useNavigate } from "react-router-dom";
import "/src/shared/styles/features/home/Home.css";

const AuthHome = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleDashboardAccess = () => {
    if (user) navigate("/admin/dashboard");
    else navigate("/login");
  };

  return (
    <div className="home">
      <nav className="home-navbar">
        <div className="navbar-brand">
          <h1>Visual Outlet</h1>
          <p>Sistema de Gestión para Ópticas</p>
        </div>
        <div className="nav-buttons">
          {user ? (
            <>
              <span className="user-welcome">Hola, {user?.name}</span>
              <button className="btn btn-primary" onClick={handleDashboardAccess}>
                Ir al Dashboard
              </button>
              <button className="btn btn-danger" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={handleLoginClick}>
              Entrar al Sistema
            </button>
          )}
        </div>
      </nav>

      <main className="home-content">
        <div className="hero-section">
          <h2>Visual Outlet</h2>
          <p>Sistema de gestión administrativa para ópticas</p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-large" onClick={handleDashboardAccess}>
              Acceder al Panel Admin
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthHome;