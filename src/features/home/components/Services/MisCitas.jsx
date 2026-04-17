import { useState, useEffect } from "react";
import { getMisCitas, cancelarCita } from "./citasLandingService";

// Formatear fecha de YYYY-MM-DD a DD/MM/AAAA
const formatDate = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

// Mapeo de estado a clases CSS y texto
const estadoInfo = {
  1: { texto: "Confirmada", clase: "estado-confirmada", icono: "✅" },
  2: { texto: "Pendiente", clase: "estado-pendiente", icono: "⏳" },
  3: { texto: "Completada", clase: "estado-completada", icono: "✔️" },
  4: { texto: "Cancelada", clase: "estado-cancelada", icono: "❌" },
};

// Modal de confirmación
const ConfirmCancelModal = ({ cita, onConfirm, onClose }) => {
  const fechaFormateada = formatDate(cita.fecha);
  const horaFormateada = cita.hora.substring(0, 5);

  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon" style={{ background: "#fee2e2", color: "#991b1b" }}>⚠️</div>
        <h3>Cancelar cita</h3>
        <p>¿Estás seguro de cancelar esta cita?</p>
        <div className="success-details">
          <p><strong>Servicio:</strong> {cita.servicio_nombre}</p>
          <p><strong>Fecha:</strong> {fechaFormateada}</p>
          <p><strong>Hora:</strong> {horaFormateada}</p>
        </div>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button className="success-btn" style={{ background: "#dc2626" }} onClick={onConfirm}>
            Sí, cancelar
          </button>
          <button className="success-btn" style={{ background: "#4e6e6e" }} onClick={onClose}>
            No, mantener
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal de éxito al cancelar
const CancelSuccessModal = ({ cita, onClose, onSendWhatsApp }) => {
  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">✅</div>
        <h3>¡Cita cancelada!</h3>
        <p>Tu cita ha sido cancelada correctamente.</p>
        <div className="success-details">
          <p><strong>Servicio:</strong> {cita.servicio}</p>
          <p><strong>Fecha:</strong> {cita.fecha}</p>
          <p><strong>Hora:</strong> {cita.hora}</p>
        </div>
        <p style={{ fontSize: "0.8rem", color: "#4e6e6e" }}>
          ¿Quieres notificar a la óptica por WhatsApp?
        </p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          <button className="success-btn" onClick={onSendWhatsApp}>
            Enviar WhatsApp
          </button>
          <button className="success-btn" style={{ background: "#4e6e6e" }} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

const MisCitas = ({ onCitaCancelada }) => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelandoId, setCancelandoId] = useState(null);
  const [citaParaCancelar, setCitaParaCancelar] = useState(null);
  const [citaCanceladaExito, setCitaCanceladaExito] = useState(null);

  const cargarCitas = async () => {
    setLoading(true);
    try {
      const data = await getMisCitas();
      setCitas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const handleConfirmCancel = async () => {
    if (!citaParaCancelar) return;
    setCancelandoId(citaParaCancelar.id);
    try {
      const result = await cancelarCita(citaParaCancelar.id);
      // Recargar lista de citas
      await cargarCitas();
      // Guardar datos de la cita cancelada para mostrar en modal de éxito
      setCitaCanceladaExito({
        servicio: citaParaCancelar.servicio_nombre,
        fecha: formatDate(citaParaCancelar.fecha),
        hora: citaParaCancelar.hora.substring(0, 5),
      });
      // Cerrar modal de confirmación
      setCitaParaCancelar(null);
      if (onCitaCancelada) onCitaCancelada();
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelandoId(null);
    }
  };

  const handleSendWhatsApp = () => {
    if (!citaCanceladaExito) return;
    const telefonoOptica = "573006139449"; // Cambia por el número real
    const mensaje = `Hola, he cancelado mi cita del ${citaCanceladaExito.fecha} a las ${citaCanceladaExito.hora} para el servicio de ${citaCanceladaExito.servicio}. Mi nombre es ${citaCanceladaExito.cliente || "Cliente"}. Gracias.`;
    const url = `https://wa.me/${telefonoOptica}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  if (loading) return <div className="mis-citas-loading">📋 Cargando tus citas...</div>;
  if (error) return <div className="mis-citas-error">❌ Error: {error}</div>;
  if (citas.length === 0) return <div className="mis-citas-empty">📅 No tienes citas agendadas aún.</div>;

  return (
    <>
      <div className="mis-citas-container">
        <h3>📋 Mis citas</h3>
        <div className="citas-grid">
          {citas.map(cita => {
            const estado = estadoInfo[cita.estado_cita_id] || { texto: "Desconocido", clase: "", icono: "❓" };
            const esCancelable = cita.estado_cita_id === 1 || cita.estado_cita_id === 2;
            const fechaFormateada = formatDate(cita.fecha);
            const horaFormateada = cita.hora.substring(0, 5);

            return (
              <div key={cita.id} className={`cita-card ${estado.clase}`}>
                <div className="cita-header">
                  <span className="cita-servicio">{cita.servicio_nombre}</span>
                  <span className="cita-estado">{estado.icono} {estado.texto}</span>
                </div>
                <div className="cita-body">
                  <div className="cita-fecha">📅 {fechaFormateada}</div>
                  <div className="cita-hora">⏰ {horaFormateada}</div>
                  <div className="cita-empleado">👨‍⚕️ {cita.empleado_nombre || "Optómetra"}</div>
                </div>
                {esCancelable && (
                  <button
                    className="cancelar-btn"
                    onClick={() => setCitaParaCancelar(cita)}
                    disabled={cancelandoId === cita.id}
                  >
                    {cancelandoId === cita.id ? "Cancelando..." : "Cancelar cita"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de confirmación */}
      {citaParaCancelar && (
        <ConfirmCancelModal
          cita={citaParaCancelar}
          onConfirm={handleConfirmCancel}
          onClose={() => setCitaParaCancelar(null)}
        />
      )}

      {/* Modal de éxito después de cancelar */}
      {citaCanceladaExito && (
        <CancelSuccessModal
          cita={citaCanceladaExito}
          onClose={() => setCitaCanceladaExito(null)}
          onSendWhatsApp={handleSendWhatsApp}
        />
      )}
    </>
  );
};

export default MisCitas;