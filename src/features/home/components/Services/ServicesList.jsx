// ServicesList.jsx
// Lista de servicios con datos reales desde la API

import { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { getServiciosActivos } from "../Services/serviciosLandingData";

const ServicesList = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

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
    const form = document.getElementById("appointment-form");
    if (form) {
      form.scrollIntoView({ behavior: "smooth" });
    } else {
      const mensaje = `Hola, me interesa agendar: *${servicio.nombre}*`;
      window.open(`https://wa.me/573006139449?text=${encodeURIComponent(mensaje)}`, "_blank");
    }
  };

  return (
    <section id="services" className="services-section">
      <div className="services-container">

        {/* Encabezado — teal hardcoded, sin PageHeader */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 700,
            marginBottom: "0.6rem",
            lineHeight: 1.2,
            background: "linear-gradient(135deg, #0d2e2e, #1a4a4a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Servicios{" "}
            <span style={{
              background: "linear-gradient(135deg, #1a4a4a, #3d8080)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Especializados
            </span>
          </h2>
          <p style={{
            color: "#4e6e6e",
            fontSize: "1rem",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}>
            Atención personalizada con tecnología de vanguardia para el cuidado de tu visión.
          </p>
          <div style={{
            width: "44px",
            height: "3px",
            background: "linear-gradient(90deg, #1a4a4a, #3d8080)",
            borderRadius: "4px",
            margin: "0.875rem auto 0",
          }} />
        </div>

        {loading && <LoadingSpinner mensaje="Cargando servicios..." />}

        {error && !loading && (
          <div style={{
            textAlign: "center",
            padding: "1.5rem 2rem",
            background: "#f3f8f8",
            border: "1px solid #d4e6e6",
            borderRadius: "0.75rem",
            color: "#4e6e6e",
            fontSize: "0.9rem",
            maxWidth: "500px",
            margin: "0 auto",
          }}>
            {error}
          </div>
        )}

        {!loading && !error && servicios.length === 0 && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#4e6e6e", fontSize: "0.95rem" }}>
            No hay servicios disponibles en este momento.
          </div>
        )}

        {!loading && !error && servicios.length > 0 && (
          <div className="services-grid" style={{ alignItems: "stretch" }}>
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