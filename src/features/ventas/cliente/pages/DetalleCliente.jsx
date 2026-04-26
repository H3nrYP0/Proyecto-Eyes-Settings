import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { clientesService } from "../services/clientesService";
import ClienteForm from "../components/ClienteForm";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";
import Modal from "../../../../shared/components/ui/Modal";

// ── Fuera del componente para evitar remount en cada keystroke ────────────────
function CampoFormula({ label, value, onChange }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <label style={{ fontSize: "0.72rem", color: "#9ca3af", fontWeight: 600 }}>{label}</label>
      <input
        value={value}
        onChange={onChange}
        placeholder="ej: -2.50"
        style={{
          border: "1px solid #d1d5db", borderRadius: 6,
          padding: "6px 8px", fontSize: "0.85rem", width: "100%",
          outline: "none",
        }}
      />
    </div>
  );
}

// ── Modal Historial de Fórmula ────────────────────────────────────────────────
function ModalHistorial({ open, clienteId, onClose }) {
  const [historial,     setHistorial]     = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [showForm,      setShowForm]      = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [authError,     setAuthError]     = useState(false);
  const [notification,  setNotification]  = useState({ isVisible: false, message: "", type: "success" });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const [nueva, setNueva] = useState({
    descripcion: "",
    od_esfera: "", od_cilindro: "", od_eje: "",
    oi_esfera: "", oi_cilindro: "", oi_eje: "",
  });

  const showNotif = (message, type = "success") =>
    setNotification({ isVisible: true, message, type });
  const hideNotif = () =>
    setNotification((prev) => ({ ...prev, isVisible: false }));

  const vaciarNueva = () => setNueva({
    descripcion: "",
    od_esfera: "", od_cilindro: "", od_eje: "",
    oi_esfera: "", oi_cilindro: "", oi_eje: "",
  });

  const handleField = (name) => (e) => setNueva((p) => ({ ...p, [name]: e.target.value }));

  const cargar = useCallback(async () => {
    if (!clienteId) return;
    setLoading(true);
    setAuthError(false);
    try {
      const data = await clientesService.getHistorialByCliente(clienteId);
      const ordenado = [...data].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setHistorial(ordenado);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 422) {
        setAuthError(true);
      } else {
        showNotif("Error al cargar el historial", "error");
      }
      setHistorial([]);
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  useEffect(() => {
    if (open) {
      setAuthError(false);
      cargar();
      setShowForm(false);
      vaciarNueva();
    }
  }, [open, cargar]);

  const handleGuardar = async () => {
    setSaving(true);
    try {
      const registro = await clientesService.createHistorial(clienteId, nueva);
      setHistorial((prev) => [registro, ...prev]);
      vaciarNueva();
      setShowForm(false);
      showNotif("Fórmula guardada correctamente", "success");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 422) {
        setAuthError(true);
      } else {
        showNotif(err?.response?.data?.error ?? "Error al guardar la fórmula", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  // Pide confirmación con Modal antes de eliminar
  const pedirConfirmEliminar = (id) => {
    setConfirmDelete({ open: true, id });
  };

  const handleEliminarConfirmado = async () => {
    const id = confirmDelete.id;
    setConfirmDelete({ open: false, id: null });
    try {
      await clientesService.deleteHistorial(id);
      setHistorial((prev) => prev.filter((h) => h.id !== id));
      showNotif("Fórmula eliminada correctamente", "success");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 422) {
        setAuthError(true);
      } else {
        showNotif("No se pudo eliminar la fórmula", "error");
      }
    }
  };

  if (!open) return null;

  return (
    <>
      {/* CrudNotification fuera del overlay para que sea visible */}
      <CrudNotification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={hideNotif}
      />

      {/* Modal de confirmación de eliminación */}
      <Modal
        open={confirmDelete.open}
        type="warning"
        title="¿Eliminar fórmula?"
        message="Esta acción eliminará la fórmula permanentemente."
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel
        onConfirm={handleEliminarConfirmado}
        onCancel={() => setConfirmDelete({ open: false, id: null })}
      />

      <div
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
          zIndex: 1300, display: "flex", alignItems: "center", justifyContent: "center",
        }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div style={{
          background: "#fff", borderRadius: 16, padding: 28,
          width: "min(680px, 95vw)", maxHeight: "85vh",
          overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>Historial de Fórmula Óptica</h2>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#6b7280", lineHeight: 1 }}>×</button>
          </div>

          {/* Error de sesión expirada */}
          {authError && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10,
              padding: "16px 20px", marginBottom: 16, color: "#991b1b",
            }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Sesión expirada</div>
              <div style={{ fontSize: "0.88rem" }}>
                Tu sesión ha expirado. Por favor <strong>cierra sesión e inicia sesión nuevamente</strong>.
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  sessionStorage.removeItem("token");
                  sessionStorage.removeItem("user");
                  window.location.href = "/login";
                }}
                style={{
                  marginTop: 10, background: "#dc2626", color: "#fff",
                  border: "none", borderRadius: 6, padding: "6px 14px",
                  cursor: "pointer", fontSize: "0.85rem",
                }}
              >
                Ir al login
              </button>
            </div>
          )}

          {!authError && (
            <>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="crud-btn crud-btn-primary"
                  style={{ marginBottom: 16 }}
                >
                  + Nueva Fórmula
                </button>
              )}

              {showForm && (
                <div style={{ background: "#f9fafb", borderRadius: 12, padding: 16, border: "1px solid #e5e7eb", marginBottom: 20 }}>
                  <div style={{ fontWeight: 600, marginBottom: 12 }}>Nueva Fórmula</div>

                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: "0.72rem", color: "#9ca3af", fontWeight: 600 }}>DESCRIPCIÓN</label>
                    <input
                      value={nueva.descripcion}
                      onChange={handleField("descripcion")}
                      placeholder="Ej: Control anual 2025"
                      style={{
                        width: "100%", border: "1px solid #d1d5db", borderRadius: 6,
                        padding: "8px 10px", fontSize: "0.9rem", marginTop: 4, outline: "none",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#6366f1", marginBottom: 8 }}>Ojo Derecho (OD)</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                      <CampoFormula label="Esfera"   value={nueva.od_esfera}   onChange={handleField("od_esfera")} />
                      <CampoFormula label="Cilindro" value={nueva.od_cilindro} onChange={handleField("od_cilindro")} />
                      <CampoFormula label="Eje"      value={nueva.od_eje}      onChange={handleField("od_eje")} />
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#10b981", marginBottom: 8 }}>Ojo Izquierdo (OI)</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                      <CampoFormula label="Esfera"   value={nueva.oi_esfera}   onChange={handleField("oi_esfera")} />
                      <CampoFormula label="Cilindro" value={nueva.oi_cilindro} onChange={handleField("oi_cilindro")} />
                      <CampoFormula label="Eje"      value={nueva.oi_eje}      onChange={handleField("oi_eje")} />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleGuardar} disabled={saving} className="crud-btn crud-btn-primary">
                      {saving ? "Guardando…" : "Guardar"}
                    </button>
                    <button onClick={() => { setShowForm(false); vaciarNueva(); }} className="crud-btn crud-btn-secondary">
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {loading ? (
                <div style={{ textAlign: "center", color: "#9ca3af", padding: 24 }}>Cargando…</div>
              ) : historial.length === 0 ? (
                <div style={{ textAlign: "center", color: "#9ca3af", padding: 24 }}>
                  No hay fórmulas registradas para este cliente.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {historial.map((h) => (
                    <div key={h.id} style={{ background: "#f9fafb", borderRadius: 10, border: "1px solid #e5e7eb", padding: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <div>
                          <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{h.descripcion || "Sin descripción"}</span>
                          <span style={{ marginLeft: 10, fontSize: "0.75rem", color: "#9ca3af" }}>
                            {h.fecha
                              ? new Date(h.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })
                              : "—"}
                          </span>
                        </div>
                        <button
                          onClick={() => pedirConfirmEliminar(h.id)}
                          style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "0.8rem" }}
                        >
                          Eliminar
                        </button>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div style={{ background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 8, padding: "10px 12px" }}>
                          <div style={{ fontSize: "0.7rem", color: "#6366f1", fontWeight: 700, marginBottom: 6 }}>OJO DERECHO</div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, fontSize: "0.82rem" }}>
                            <div><span style={{ color: "#9ca3af", fontSize: "0.7rem" }}>ESF </span><strong>{h.od_esfera || "—"}</strong></div>
                            <div><span style={{ color: "#9ca3af", fontSize: "0.7rem" }}>CIL </span><strong>{h.od_cilindro || "—"}</strong></div>
                            <div><span style={{ color: "#9ca3af", fontSize: "0.7rem" }}>EJE </span><strong>{h.od_eje || "—"}</strong></div>
                          </div>
                        </div>
                        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 12px" }}>
                          <div style={{ fontSize: "0.7rem", color: "#10b981", fontWeight: 700, marginBottom: 6 }}>OJO IZQUIERDO</div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, fontSize: "0.82rem" }}>
                            <div><span style={{ color: "#9ca3af", fontSize: "0.7rem" }}>ESF </span><strong>{h.oi_esfera || "—"}</strong></div>
                            <div><span style={{ color: "#9ca3af", fontSize: "0.7rem" }}>CIL </span><strong>{h.oi_cilindro || "—"}</strong></div>
                            <div><span style={{ color: "#9ca3af", fontSize: "0.7rem" }}>EJE </span><strong>{h.oi_eje || "—"}</strong></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── Página DetalleCliente ─────────────────────────────────────────────────────
export default function DetalleCliente() {
  const navigate                            = useNavigate();
  const { id }                              = useParams();
  const [cliente,        setCliente]        = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [modalHistorial, setModalHistorial] = useState(false);

  useEffect(() => {
    clientesService.getClienteById(Number(id))
      .then((data) => { setCliente(data); setLoading(false); })
      .catch(() => navigate("/admin/ventas/clientes"));
  }, [id, navigate]);

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Cargando cliente...</div>;
  if (!cliente) return null;

  return (
    <>
      <ClienteForm
        mode="view"
        title={`${cliente.nombre} ${cliente.apellido}`}
        initialData={cliente}
        onCancel={() => navigate("/admin/ventas/clientes")}
        extraActions={
          <button
            className="crud-btn crud-btn-secondary"
            onClick={() => setModalHistorial(true)}
          >
            Historial de Fórmula
          </button>
        }
      />

      <ModalHistorial
        open={modalHistorial}
        clienteId={Number(id)}
        onClose={() => setModalHistorial(false)}
      />
    </>
  );
}