import { useState, useEffect } from "react";
import { getEmpleadosActivosLanding, getHorasDisponiblesMultiple, crearCitaLanding } from "./citasLandingService";
import SuccessModal from "./SuccessModal";

// Material UI icons
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

const formatTimeLabel = (t) => {
  const [hour, minute] = t.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${minute.toString().padStart(2, '0')} ${ampm}`;
};

const fmtCOP = (v) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(v);

const nextDays = (() => {
  const days = [];
  const today = new Date();
  let current = new Date(today);
  if (current.getDay() === 0) current.setDate(current.getDate() + 1);
  while (days.length < 15) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0) {
      days.push({
        date: current.toISOString().split('T')[0],
        formatted: current.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
      });
    }
    current.setDate(current.getDate() + 1);
  }
  return days;
})();

const CitaForm = ({ cliente, servicios, estadosCita, preServicioId, onCitaAgendada }) => {
  if (!cliente) {
    return <div className="admin-readonly-message">Cargando información del cliente...</div>;
  }

  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [horasMap, setHorasMap] = useState(new Map());
  const [loadingHoras, setLoadingHoras] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successCita, setSuccessCita] = useState(null);

  useEffect(() => {
    if (preServicioId && servicios.length) {
      const servicio = servicios.find(s => String(s.id) === String(preServicioId));
      if (servicio) setSelectedService(servicio);
    }
  }, [preServicioId, servicios]);

  useEffect(() => {
    setSelectedDate(null);
    setSelectedTime(null);
    setHorasMap(new Map());
    setErrorMsg("");
  }, [selectedService]);

  useEffect(() => {
    setSelectedTime(null);
    setErrorMsg("");
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedService || !selectedDate) {
      setHorasMap(new Map());
      return;
    }
    setLoadingHoras(true);
    setSelectedTime(null);
    const intervalo = Math.max(15, selectedService.duracion);
    getHorasDisponiblesMultiple(selectedService.id, selectedDate, intervalo)
      .then(({ horasMap }) => setHorasMap(horasMap))
      .catch(err => console.error(err))
      .finally(() => setLoadingHoras(false));
  }, [selectedService, selectedDate]);

  const getEstadoPendienteId = () => {
    const ep = estadosCita.find(e => e.nombre?.toLowerCase().includes("pendiente"));
    return ep ? ep.id : 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime) {
      setErrorMsg("Completa servicio, fecha y hora.");
      return;
    }
    const empleadoId = horasMap.get(selectedTime);
    if (!empleadoId) {
      setErrorMsg("No hay empleado disponible para esa hora. Intenta otra.");
      return;
    }
    setSubmitting(true);
    try {
      await crearCitaLanding({
        clienteId: cliente.id,
        servicioId: selectedService.id,
        empleadoId,
        estadoCitaId: getEstadoPendienteId(),
        fecha: selectedDate,
        hora: selectedTime,
      });
      setSuccessCita({
        servicio: selectedService.nombre,
        fecha: selectedDate,
        hora: formatTimeLabel(selectedTime),
        cliente: `${cliente.nombre} ${cliente.apellido}`
      });
      if (onCitaAgendada) onCitaAgendada();
      setSelectedService(null);
      setSelectedDate(null);
      setSelectedTime(null);
      setHorasMap(new Map());
    } catch (err) {
      setErrorMsg(err.message || "Error al agendar. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const horasDisponibles = Array.from(horasMap.keys()).sort();

  return (
    <>
      <section id="appointment-form" className="appointment-section">
        <div className="services-container">
          <div className="section-header">
            <h2 className="section-title"><span className="blue-gradient-text">Agenda tu Cita</span></h2>
            <div style={{ textAlign: "center", marginBottom: "0.5rem", fontSize: "0.85rem", color: "#166534", background: "#f0faf5", display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.2rem 1rem", borderRadius: "999px" }}>
              <PersonIcon sx={{ fontSize: "0.9rem" }} />
              <span>Agendando como <strong>{cliente.nombre} {cliente.apellido}</strong></span>
            </div>
            <p className="section-description">Selecciona servicio, fecha y horario disponible.</p>
          </div>

          <div className="appointment-container">
            <div className="appointment-form-container">
              <form className="appointment-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Servicio *</label>
                  <select value={selectedService?.id || ""} onChange={(e) => {
                    const s = servicios.find(srv => String(srv.id) === e.target.value);
                    setSelectedService(s || null);
                    setErrorMsg("");
                  }} required>
                    <option value="">Selecciona un servicio</option>
                    {servicios.map(s => (
                      <option key={s.id} value={s.id}>{s.nombre} — {fmtCOP(s.precio)}</option>
                    ))}
                  </select>
                </div>

                {selectedService && (
                  <>
                    <div className="calendar-section">
                      <h3>Selecciona una fecha *</h3>
                      <div className="calendar-grid">
                        {nextDays.map((day, i) => (
                          <button key={i} type="button" className={`calendar-day ${selectedDate === day.date ? "selected" : ""}`} onClick={() => { setSelectedDate(day.date); setErrorMsg(""); }}>
                            <span className="day-week">{day.formatted.split(" ")[0]}</span>
                            <span className="day-date">{day.formatted.split(" ")[1]}</span>
                            <span className="day-month">{day.formatted.split(" ")[2]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="time-section">
                      <h3>Horarios disponibles {loadingHoras && <span style={{ fontSize: "0.72rem", fontWeight: 400, color: "#4e6e6e", marginLeft: "0.6rem" }}>Consultando disponibilidad...</span>}</h3>
                      {!selectedDate ? (
                        <p className="hint-text">Selecciona una fecha para ver los horarios disponibles.</p>
                      ) : loadingHoras ? (
                        <div className="skeleton-grid">{[...Array(8)].map((_, i) => <div key={i} className="skeleton-slot" />)}</div>
                      ) : horasDisponibles.length === 0 ? (
                        <div className="no-slots">No hay horarios disponibles este día. Prueba otra fecha.</div>
                      ) : (
                        <div className="time-grid">
                          {horasDisponibles.map(time => (
                            <button key={time} type="button" className={`time-slot ${selectedTime === time ? "selected" : ""}`} onClick={() => { setSelectedTime(time); setErrorMsg(""); }}>
                              {formatTimeLabel(time)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {errorMsg && <div className="result-box error">{errorMsg}</div>}

                <button type="submit" className="submit-appointment-btn" disabled={submitting || !selectedService || !selectedDate || !selectedTime || loadingHoras}>
                  {submitting ? "Agendando…" : <><CheckCircleIcon sx={{ fontSize: "1rem" }} /> Confirmar Cita</>}
                </button>
              </form>
            </div>

            <div className="appointment-info">
              <div className="info-card">
                <h3><ScheduleIcon sx={{ fontSize: "1rem", marginRight: "0.3rem", verticalAlign: "middle" }} /> Información de la Cita</h3>
                <div className="info-list">
                  {[
                    { icon: <ScheduleIcon sx={{ fontSize: "0.9rem" }} />, title: "Horarios de Atención", lines: ["Lun–Vie: 8:00 AM – 6:00 PM", "Sábados: 9:00 AM – 2:00 PM"] },
                    { icon: <LocationOnIcon sx={{ fontSize: "0.9rem" }} />, title: "Ubicación", lines: ["Cra 45 # 50-48 Local 102", "El Palo con la Playa, Medellín"] },
                    { icon: <PhoneIcon sx={{ fontSize: "0.9rem" }} />, title: "Contacto", lines: ["300 613 9449 (WhatsApp)", "(+57) 604 579 9276 (Fijo)"] },
                    { icon: <ConfirmationNumberIcon sx={{ fontSize: "0.9rem" }} />, title: "Confirmación", lines: ["Recibirás confirmación por WhatsApp en menos de 24 horas"] },
                  ].map(({ icon, title, lines }) => (
                    <div key={title} className="info-item">
                      <span className="info-icon">{icon}</span>
                      <div className="info-text"><strong>{title}</strong>{lines.map(l => <p key={l}>{l}</p>)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {successCita && <SuccessModal cita={successCita} onClose={() => setSuccessCita(null)} />}
    </>
  );
};

export default CitaForm;