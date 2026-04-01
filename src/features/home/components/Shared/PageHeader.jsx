// PageHeader.jsx
// Header de sección reutilizable, consistente con estilos del dashboard

const PageHeader = ({ titulo, subtitulo, acento }) => {
  return (
    <div style={{
      textAlign: 'center',
      marginBottom: '2.5rem',
    }}>
      <h2 style={{
        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
        fontWeight: '700',
        color: '#1e293b',
        margin: '0 0 0.75rem 0',
        lineHeight: '1.2',
        background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        {titulo}{' '}
        {acento && (
          <span style={{
            background: 'linear-gradient(135deg, #2563eb, #60a5fa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {acento}
          </span>
        )}
      </h2>
      {subtitulo && (
        <p style={{
          color: '#64748b',
          fontSize: '1rem',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6',
        }}>
          {subtitulo}
        </p>
      )}
      <div style={{
        width: '60px',
        height: '3px',
        background: 'linear-gradient(90deg, #1e3a8a, #3b82f6)',
        borderRadius: '2px',
        margin: '1.25rem auto 0',
      }} />
    </div>
  );
};

export default PageHeader;