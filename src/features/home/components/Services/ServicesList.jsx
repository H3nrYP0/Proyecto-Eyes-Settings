// ServicesList.jsx
// Lista de servicios con datos reales desde la API
// Usa serviciosLandingData.js para la conexión al backend

import { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";
import LoadingSpinner from "../Shared/LoadingSpinner";
import PageHeader from "../Shared/PageHeader";
import { getServiciosActivos } from "../Services/serviciosLandingData";

const ServicesList = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchServicios = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getServiciosActivos();
        if (mounted) setServicios(data);
      } catch (err) {
        if (mounted) {
          console.error("Error cargando servicios:", err);
          setError("No pudimos cargar los servicios. Por favor intenta más tarde.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchServicios();
    return () => { mounted = false; };
  }, []);

  const handleAgendar = (servicio) => {
    // Scroll al formulario de cita en ServicesPage
    const form = document.getElementById("appointment-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth" });
    } else {
      // Si no hay formulario en la página actual, ir a /servicios
      const mensaje = `Hola, me interesa agendar: *${servicio.nombre}*`;
      window.open(`https://wa.me/573006139449?text=${encodeURIComponent(mensaje)}`, "_blank");
    }
  };

  return (
    <section id="services" className="services-section">
      <div className="services-container">
        <PageHeader
          titulo="Servicios"
          acento="Especializados"
          subtitulo="Atención personalizada con tecnología de vanguardia para el cuidado de tu visión."
        />

        {loading && <LoadingSpinner mensaje="Cargando servicios..." />}

        {error && !loading && (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.75rem',
            color: '#dc2626',
            fontSize: '0.9rem',
            maxWidth: '500px',
            margin: '0 auto',
          }}>
            {error}
          </div>
        )}

        {!loading && !error && servicios.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#64748b',
            fontSize: '0.95rem',
          }}>
            No hay servicios disponibles en este momento.
          </div>
        )}

        {!loading && !error && servicios.length > 0 && (
          <div className="services-grid">
            {servicios.map(servicio => (
              <ServiceCard
                key={servicio.id}
                servicio={servicio}
                onAgendar={handleAgendar}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesList;