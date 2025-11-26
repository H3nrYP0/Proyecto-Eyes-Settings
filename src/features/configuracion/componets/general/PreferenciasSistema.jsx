import { useState } from "react";

const PreferenciasSistema = ({ canEdit = false }) => {
  const [preferencias, setPreferencias] = useState({
    moneda: "USD",
    zonaHoraria: "America/Bogota",
    notificacionesEmail: true,
    notificacionesSMS: false,
    recordatoriosCitas: true,
    backupAutomatico: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferencias({
      ...preferencias,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canEdit) {
      alert("No tienes permisos para guardar las preferencias del sistema");
      return;
    }
    console.log("Preferencias guardadas:", preferencias);
    alert("Preferencias del sistema guardadas correctamente");
  };

  const handleReset = () => {
    if (!canEdit) {
      alert("No tienes permisos para restablecer las preferencias");
      return;
    }
    setPreferencias({
      moneda: "USD",
      zonaHoraria: "America/Bogota",
      notificacionesEmail: true,
      notificacionesSMS: false,
      recordatoriosCitas: true,
      backupAutomatico: true
    });
    alert("Preferencias restablecidas a valores por defecto");
  };

  return (
    <div className="configuracion-section">
      <h2>Preferencias del Sistema</h2>
      
      {!canEdit && (
        <div className="read-only-notice">
          <p>ⓘ Modo de solo lectura. Solo los administradores pueden modificar las preferencias del sistema.</p>
        </div>
      )}

      <div className="config-form">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Moneda Principal *</label>
              <select
                name="moneda"
                value={preferencias.moneda}
                onChange={handleChange}
                disabled={!canEdit}
              >
                <option value="USD">Dólares Americanos (USD)</option>
                <option value="EUR">Euros (EUR)</option>
                <option value="COP">Pesos Colombianos (COP)</option>
                <option value="MXN">Pesos Mexicanos (MXN)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Zona Horaria *</label>
              <select
                name="zonaHoraria"
                value={preferencias.zonaHoraria}
                onChange={handleChange}
                disabled={!canEdit}
              >
                <option value="America/Bogota">Bogotá, Lima, Quito (UTC-5)</option>
                <option value="America/Mexico_City">Ciudad de México (UTC-6)</option>
                <option value="America/New_York">Nueva York (UTC-5)</option>
                <option value="America/Los_Angeles">Los Ángeles (UTC-8)</option>
              </select>
            </div>
          </div>

          <div className="preferencias-checkboxes">
            <h3>Notificaciones</h3>
            
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="notificacionesEmail"
                  checked={preferencias.notificacionesEmail}
                  onChange={handleChange}
                  disabled={!canEdit}
                />
                <span className="checkmark"></span>
                Notificaciones por email
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="notificacionesSMS"
                  checked={preferencias.notificacionesSMS}
                  onChange={handleChange}
                  disabled={!canEdit}
                />
                <span className="checkmark"></span>
                Notificaciones por SMS
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="recordatoriosCitas"
                  checked={preferencias.recordatoriosCitas}
                  onChange={handleChange}
                  disabled={!canEdit}
                />
                <span className="checkmark"></span>
                Recordatorios de citas automáticos
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="backupAutomatico"
                  checked={preferencias.backupAutomatico}
                  onChange={handleChange}
                  disabled={!canEdit}
                />
                <span className="checkmark"></span>
                Backup automático diario
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={!canEdit}
            >
              {canEdit ? "Guardar Preferencias" : "Solo Lectura"}
            </button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleReset}
              disabled={!canEdit}
            >
              Restablecer Valores
            </button>
          </div>

          {!canEdit && (
            <div className="permissions-info">
              <p>
                <strong>Configuración del sistema:</strong> Estas preferencias afectan el comportamiento 
                global de la aplicación. Modificarlas requiere permisos de administrador.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PreferenciasSistema;