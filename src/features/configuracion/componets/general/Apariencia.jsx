import { useState } from "react";

const Apariencia = ({ canEdit = false }) => {
  const [apariencia, setApariencia] = useState({
    tema: "claro",
    densidad: "comoda",
    tamanoFuente: "medio",
    colorPrimario: "#3B82F6"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApariencia({
      ...apariencia,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canEdit) {
      alert("No tienes permisos para guardar cambios en la apariencia");
      return;
    }
    console.log("Configuración de apariencia:", apariencia);
    alert("Configuración de apariencia guardada");
  };

  const handleReset = () => {
    if (!canEdit) {
      alert("No tienes permisos para restablecer la configuración");
      return;
    }
    setApariencia({
      tema: "claro",
      densidad: "comoda",
      tamanoFuente: "medio",
      colorPrimario: "#3B82F6"
    });
    alert("Configuración restablecida");
  };

  return (
    <div className="configuracion-section">
      <h2>Apariencia y Tema</h2>
      
      {!canEdit && (
        <div className="read-only-notice">
          <p>ⓘ Estás en modo de solo lectura. Solo los administradores pueden modificar la apariencia.</p>
        </div>
      )}

      <div className="config-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tema de la Aplicación</label>
            <div className="theme-options">
              <label className="theme-option">
                <input
                  type="radio"
                  name="tema"
                  value="claro"
                  checked={apariencia.tema === "claro"}
                  onChange={handleChange}
                  disabled={!canEdit}
                />
                <div className="theme-preview claro">
                  <div className="theme-demo"></div>
                </div>
                <span>Tema Claro</span>
              </label>

              <label className="theme-option">
                <input
                  type="radio"
                  name="tema"
                  value="oscuro"
                  checked={apariencia.tema === "oscuro"}
                  onChange={handleChange}
                  disabled={!canEdit}
                />
                <div className="theme-preview oscuro">
                  <div className="theme-demo"></div>
                </div>
                <span>Tema Oscuro</span>
              </label>

              <label className="theme-option">
                <input
                  type="radio"
                  name="tema"
                  value="auto"
                  checked={apariencia.tema === "auto"}
                  onChange={handleChange}
                  disabled={!canEdit}
                />
                <div className="theme-preview auto">
                  <div className="theme-demo"></div>
                </div>
                <span>Automático</span>
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Densidad de la Interfaz</label>
              <select
                name="densidad"
                value={apariencia.densidad}
                onChange={handleChange}
                disabled={!canEdit}
              >
                <option value="compacta">Compacta</option>
                <option value="comoda">Cómoda</option>
                <option value="espaciosa">Espaciosa</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tamaño de Fuente</label>
              <select
                name="tamanoFuente"
                value={apariencia.tamanoFuente}
                onChange={handleChange}
                disabled={!canEdit}
              >
                <option value="pequeno">Pequeño</option>
                <option value="medio">Medio</option>
                <option value="grande">Grande</option>
                <option value="muy-grande">Muy Grande</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Color Primario</label>
            <div className="color-picker-container">
              <input
                type="color"
                name="colorPrimario"
                value={apariencia.colorPrimario}
                onChange={handleChange}
                className="color-picker"
                disabled={!canEdit}
              />
              <span className="color-value">{apariencia.colorPrimario}</span>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={!canEdit}
            >
              {canEdit ? "Aplicar Cambios" : "Solo Lectura"}
            </button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleReset}
              disabled={!canEdit}
            >
              Restablecer
            </button>
          </div>

          {!canEdit && (
            <div className="permissions-info">
              <p>
                <strong>Permisos requeridos:</strong> Rol de Administrador o Super Administrador
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Apariencia;