import { useState } from "react";

const PoliticaPrivacidad = ({ canEdit = false }) => {
  const [politica, setPolitica] = useState({
    titulo: "Política de Privacidad",
    contenido: `# Política de Privacidad

## 1. Información que Recopilamos
Recopilamos información necesaria para la gestión de su óptica, incluyendo:
- Datos de clientes y pacientes
- Información de inventario y ventas
- Datos de empleados y proveedores

## 2. Uso de la Información
Utilizamos la información para:
- Gestionar citas y servicios de la óptica
- Procesar ventas y transacciones
- Mantener registros médicos de pacientes
- Mejorar nuestros servicios

## 3. Protección de Datos
Implementamos medidas de seguridad para proteger su información contra accesos no autorizados.`,
    version: "1.0",
    fechaActualizacion: new Date().toISOString().split('T')[0],
    contactoPrivacidad: "privacidad@optica.com"
  });

  const handleChange = (e) => {
    setPolitica({
      ...politica,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canEdit) {
      alert("No tienes permisos para modificar la política de privacidad");
      return;
    }
    console.log("Política de privacidad guardada:", politica);
    alert("Política de privacidad actualizada correctamente");
  };

  const handleExportPDF = () => {
    // Lógica para exportar a PDF
    alert("Exportando política de privacidad a PDF...");
    console.log("PDF exportado:", politica);
  };

  return (
    <div className="configuracion-section">
      <h2>Política de Privacidad</h2>
      
      {!canEdit && (
        <div className="read-only-notice">
          <p>ⓘ Modo de solo lectura. Solo los administradores pueden modificar la política de privacidad.</p>
        </div>
      )}

      <div className="config-form">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Versión</label>
              <input
                type="text"
                name="version"
                value={politica.version}
                onChange={handleChange}
                placeholder="Ej: 1.0"
                disabled={!canEdit}
              />
            </div>

            <div className="form-group">
              <label>Fecha de Actualización</label>
              <input
                type="date"
                name="fechaActualizacion"
                value={politica.fechaActualizacion}
                onChange={handleChange}
                disabled={!canEdit}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email de Contacto para Privacidad</label>
            <input
              type="email"
              name="contactoPrivacidad"
              value={politica.contactoPrivacidad}
              onChange={handleChange}
              placeholder="privacidad@empresa.com"
              disabled={!canEdit}
            />
          </div>

          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              name="titulo"
              value={politica.titulo}
              onChange={handleChange}
              placeholder="Título de la política de privacidad"
              disabled={!canEdit}
            />
          </div>

          <div className="form-group">
            <label>Contenido</label>
            <textarea
              name="contenido"
              value={politica.contenido}
              onChange={handleChange}
              rows="15"
              placeholder="Escribe aquí la política de privacidad..."
              className="legal-textarea"
              disabled={!canEdit}
            />
            <small className="help-text">
              Describe cómo manejas y proteges los datos de tus clientes
            </small>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={!canEdit}
            >
              {canEdit ? "Guardar Política" : "Solo Lectura"}
            </button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleExportPDF}
            >
              Exportar PDF
            </button>
          </div>

          {!canEdit && (
            <div className="permissions-info">
              <p>
                <strong>Documento legal:</strong> La política de privacidad es un documento 
                legal importante que debe ser gestionado únicamente por administradores autorizados.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PoliticaPrivacidad;