import { useState } from "react";
import { buscarClientePorDocumento, crearClienteLanding } from "./citasLandingService";

const TIPOS_DOC = ["CC", "TI", "CE", "PA", "NIT"];

const IdentityModal = ({ onIdentified, onClose }) => {
  const [step, setStep] = useState("choose");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [doc, setDoc] = useState("");
  const [reg, setReg] = useState({
    nombre: "", apellido: "", tipo_documento: "CC",
    numero_documento: "", fecha_nacimiento: "", telefono: "", correo: "",
  });

  const handleReg = (e) => setReg((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleBuscar = async () => {
    if (!doc.trim()) { setError("Ingresa tu número de documento."); return; }
    setLoading(true); setError("");
    try {
      const cliente = await buscarClientePorDocumento(doc.trim());
      if (cliente) { onIdentified(cliente); }
      else { setError("No encontramos tu documento. ¿Eres nuevo cliente?"); }
    } catch { setError("Error de red. Intenta de nuevo."); }
    finally { setLoading(false); }
  };

  const handleRegistrar = async () => {
    const { nombre, apellido, numero_documento, fecha_nacimiento } = reg;
    if (!nombre.trim() || !apellido.trim() || !numero_documento.trim() || !fecha_nacimiento) {
      setError("Nombre, apellido, documento y fecha de nacimiento son obligatorios.");
      return;
    }
    setLoading(true); setError("");
    try {
      const result = await crearClienteLanding(reg);
      onIdentified(result.cliente || result);
    } catch (err) { setError(err.message || "Error al registrarse."); }
    finally { setLoading(false); }
  };

  return (
    <div className="identity-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="identity-modal-box">
        <button className="identity-close" onClick={onClose} aria-label="Cerrar">✕</button>
        <div className="identity-eye">👁️</div>
        <h2 className="identity-title">Identifícate para continuar</h2>
        <p className="identity-sub">Solo toma unos segundos</p>

        {step === "choose" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <button className="identity-big-btn" onClick={() => { setStep("existing"); setError(""); }}>
              <span>🪪</span>
              <div><div className="title">Ya soy cliente</div><div className="sub">Tengo historial en Visual Outlet</div></div>
            </button>
            <button className="identity-big-btn" style={{ background: "#f3f8f8", color: "#0d2e2e", borderColor: "#d4e6e6" }} onClick={() => { setStep("new"); setError(""); }}>
              <span>✨</span>
              <div><div className="title">Soy nuevo cliente</div><div className="sub">Primera vez en la óptica</div></div>
            </button>
            <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#8aaeae", marginTop: "0.25rem" }}>
              Tus datos están protegidos y solo se usan para agendar tu cita.
            </p>
          </div>
        )}

        {step === "existing" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <button className="identity-back" onClick={() => { setStep("choose"); setError(""); }}>← Volver</button>
            <label className="identity-label">Número de documento</label>
            <input className="identity-input" placeholder="Ej: 1234567890" value={doc} onChange={(e) => setDoc(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleBuscar()} autoFocus />
            {error && <div className="identity-error">{error}</div>}
            <button className="identity-submit" onClick={handleBuscar} disabled={loading}>{loading ? "Buscando…" : "Continuar →"}</button>
          </div>
        )}

        {step === "new" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            <button className="identity-back" onClick={() => { setStep("choose"); setError(""); }}>← Volver</button>
            <div className="identity-row2">
              <div className="identity-col"><label className="identity-label">Nombre *</label><input className="identity-input" name="nombre" value={reg.nombre} onChange={handleReg} placeholder="Tu nombre" /></div>
              <div className="identity-col"><label className="identity-label">Apellido *</label><input className="identity-input" name="apellido" value={reg.apellido} onChange={handleReg} placeholder="Tu apellido" /></div>
            </div>
            <div className="identity-row2">
              <div className="identity-col"><label className="identity-label">Tipo doc.</label><select className="identity-input" name="tipo_documento" value={reg.tipo_documento} onChange={handleReg}>{TIPOS_DOC.map(t => <option key={t}>{t}</option>)}</select></div>
              <div className="identity-col"><label className="identity-label">Número doc. *</label><input className="identity-input" name="numero_documento" value={reg.numero_documento} onChange={handleReg} placeholder="1234567890" /></div>
            </div>
            <div className="identity-col"><label className="identity-label">Fecha de nacimiento *</label><input className="identity-input" type="date" name="fecha_nacimiento" value={reg.fecha_nacimiento} onChange={handleReg} max={new Date().toISOString().split("T")[0]} /></div>
            <div className="identity-row2">
              <div className="identity-col"><label className="identity-label">Teléfono / WhatsApp</label><input className="identity-input" name="telefono" value={reg.telefono} onChange={handleReg} placeholder="3006139449" /></div>
              <div className="identity-col"><label className="identity-label">Correo</label><input className="identity-input" type="email" name="correo" value={reg.correo} onChange={handleReg} placeholder="tu@correo.com" /></div>
            </div>
            {error && <div className="identity-error">{error}</div>}
            <button className="identity-submit" onClick={handleRegistrar} disabled={loading}>{loading ? "Registrando…" : "Registrarme y continuar →"}</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdentityModal;