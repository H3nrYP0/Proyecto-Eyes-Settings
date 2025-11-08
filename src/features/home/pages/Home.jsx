// Styles
import "/src/shared/styles/features/Home.css";

const Home = ({ user, setUser }) => {
  const handleLogin = () => {
    // Para desarrollo, simula un login automático
    const demoUser = {
      name: "Usuario Demo",
      email: "demo@visualoutlet.com",
      role: "admin"
    };
    setUser(demoUser);
    window.location.href = '/admin/dashboard';
  };

  const handleLogout = () => {
    setUser(null);
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
              <button 
                className="btn btn-primary"
                onClick={() => window.location.href = '/admin/dashboard'}
              >
                Ir al Dashboard
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <button 
                className="btn btn-primary btn-large"
                onClick={handleLogin}
              >
                Entrar al Sistema
              </button>
            </>
          )}
        </div>
      </nav>

      <main className="home-content">
        <div className="hero-section">
          <h2>Visual Outlet</h2>
          <p>Sistema de gestión administrativa para ópticas</p>
          {!user && (
            <div className="hero-actions">
              <button 
                className="btn btn-primary btn-large"
                onClick={handleLogin}
              >
                Acceder al Panel Admin
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;