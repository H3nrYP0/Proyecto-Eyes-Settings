// LoadingSpinner.jsx
// Spinner de carga con estilos consistentes con el dashboard

const LoadingSpinner = ({ mensaje = "Cargando..." }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
      gap: '1rem',
    }}>
      <div style={{
        width: '44px',
        height: '44px',
        border: '3px solid #e2e8f0',
        borderTop: '3px solid #2563eb',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{
        color: '#64748b',
        fontSize: '0.875rem',
        fontWeight: '500',
        margin: 0,
      }}>
        {mensaje}
      </p>
      <style>{`
        @keyframes spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;