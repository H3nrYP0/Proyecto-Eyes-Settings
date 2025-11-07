// src/features/home/pages/Home.jsx
import React from 'react';
// ELIMINAR esta importación si el archivo no existe
// import '../../../shared/styles/features/Home.css';

const Home = ({ user, setUser }) => {
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
                onClick={() => window.location.href = '/admin'}
              >
                Panel Admin
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
                className="btn btn-primary"
                onClick={() => window.location.href = '/login'}
              >
                Iniciar Sesión
              </button>
            </>
          )}
        </div>
      </nav>

      <main className="home-content">
        <div className="hero-section">
          <h2>Bienvenido a Visual Outlet</h2>
          <p>Tu sistema integral de gestión para ópticas</p>
          {!user && (
            <div className="hero-actions">
              <button 
                className="btn btn-primary btn-large"
                onClick={() => window.location.href = '/login'}
              >
                Comenzar
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;