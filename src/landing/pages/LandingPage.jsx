export default function LandingPage() {
  return (
    <div style={{ 
      padding: '2rem',
      textAlign: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏪 Visual Outlet</h1>
      <p style={{ fontSize: '1.5rem', color: '#666', marginBottom: '2rem' }}>
        Sistema de Gestión para Ópticas
      </p>
      
      <div style={{ 
        backgroundColor: '#fff3cd', 
        padding: '2rem', 
        borderRadius: '8px',
        margin: '2rem auto',
        maxWidth: '600px',
        border: '1px solid #ffeaa7'
      }}>
        <h2 style={{ color: '#856404', marginBottom: '1rem' }}>🚧 Página en Construcción</h2>
        <p style={{ color: '#856404', marginBottom: '0.5rem' }}>
          Estamos trabajando para mejorar tu experiencia
        </p>
        <p style={{ color: '#856404', fontSize: '0.9rem' }}>
          Esta página estará disponible pronto
        </p>
      </div>
    </div>
  );
}