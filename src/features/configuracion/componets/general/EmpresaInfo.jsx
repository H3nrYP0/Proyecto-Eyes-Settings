import { useState } from "react";

const EmpresaInfo = ({ canEdit = false }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    ruc: "",
    direccion: "",
    telefono: "",
    email: "",
    sitioWeb: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canEdit) {
      alert("No tienes permisos para guardar la información de la empresa");
      return;
    }
    console.log("Datos guardados:", formData);
    alert("Información de la empresa guardada correctamente");
  };

  const handleCancel = () => {
    if (!canEdit) {
      alert("No tienes permisos para realizar esta acción");
      return;
    }
    setFormData({
      nombre: "",
      ruc: "",
      direccion: "",
      telefono: "",
      email: "",
      sitioWeb: ""
    });
    alert("Cambios cancelados");
  };

  return (
    <div className="configuracion-section">
      <h2>Información de la Empresa</h2>
      
      {!canEdit && (
        <div className="read-only-notice">
          <p>ⓘ Modo de solo lectura. Solo los administradores pueden modificar la información de la empresa.</p>
        </div>
      )}

      <div className="config-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre de la Óptica *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingresa el nombre de tu óptica"
              required
              disabled={!canEdit}
            />
          </div>

          <div className="form-group">
            <label>RUC/Cédula *</label>
            <input
              type="text"
              name="ruc"
              value={formData.ruc}
              onChange={handleChange}
              placeholder="Número de identificación tributaria"
              required
              disabled={!canEdit}
            />
          </div>

          <div className="form-group">
            <label>Dirección *</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Dirección completa"
              required
              disabled={!canEdit}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Teléfono *</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Número de contacto"
                required
                disabled={!canEdit}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                disabled={!canEdit}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Sitio Web</label>
            <input
              type="url"
              name="sitioWeb"
              value={formData.sitioWeb}
              onChange={handleChange}
              placeholder="https://www.ejemplo.com"
              disabled={!canEdit}
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={!canEdit}
            >
              {canEdit ? "Guardar Cambios" : "Solo Lectura"}
            </button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleCancel}
              disabled={!canEdit}
            >
              Cancelar
            </button>
          </div>

          {!canEdit && (
            <div className="permissions-info">
              <p>
                <strong>Información importante:</strong> Esta sección contiene datos legales y fiscales de la empresa. 
                Solo usuarios con rol de Administrador pueden modificarlos.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EmpresaInfo;