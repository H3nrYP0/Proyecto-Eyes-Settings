import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEmpleado } from '../../../../lib/data/empleadosData';
import "../../../../shared/styles/components/crud-forms.css";

export default function CrearEmpleado() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    tipo_documento: 'cedula',
    numero_documento: '',
    telefono: '',
    email: '',
    cargo: '',
    fecha_ingreso: '',
    direccion: '',
    estado: 'activo'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Crear el empleado
    const nuevoEmpleado = createEmpleado(formData);
    console.log('Empleado creado:', nuevoEmpleado);
    navigate('/admin/servicios/empleados');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Registrar Nuevo Empleado</h1>
        <p>Agrega un nuevo miembro al personal de la óptica</p>
      </div>
      
      <div className="crud-form-content">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section">
            <h3>Información Personal</h3>
            
            <div className="crud-form-group">
              <label htmlFor="nombre">Nombre Completo <span className="crud-required">*</span></label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="crud-input"
                placeholder="Ej: Carlos Andrés Méndez"
                required
              />
            </div>

            <div className="crud-form-row">
              <div className="crud-form-group">
                <label htmlFor="tipo_documento">Tipo Documento <span className="crud-required">*</span></label>
                <select
                  id="tipo_documento"
                  name="tipo_documento"
                  value={formData.tipo_documento}
                  onChange={handleChange}
                  className="crud-input"
                  required
                >
                  <option value="cedula">Cédula</option>
                  <option value="pasaporte">Pasaporte</option>
                  <option value="cedula_extranjeria">Cédula Extranjería</option>
                </select>
              </div>

              <div className="crud-form-group">
                <label htmlFor="numero_documento">Número Documento <span className="crud-required">*</span></label>
                <input
                  type="text"
                  id="numero_documento"
                  name="numero_documento"
                  value={formData.numero_documento}
                  onChange={handleChange}
                  className="crud-input"
                  placeholder="123456789"
                  required
                />
              </div>
            </div>

            <div className="crud-form-row">
              <div className="crud-form-group">
                <label htmlFor="telefono">Teléfono <span className="crud-required">*</span></label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="crud-input"
                  placeholder="3001234567"
                  required
                />
              </div>

              <div className="crud-form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="crud-input"
                  placeholder="ejemplo@optica.com"
                />
              </div>
            </div>

            <div className="crud-form-group">
              <label htmlFor="direccion">Dirección</label>
              <textarea
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                rows="2"
                className="crud-input crud-textarea"
                placeholder="Dirección completa..."
              />
            </div>
          </div>

          <div className="crud-form-section">
            <h3>Información Laboral</h3>
            
            <div className="crud-form-row">
              <div className="crud-form-group">
                <label htmlFor="cargo">Cargo <span className="crud-required">*</span></label>
                <select
                  id="cargo"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  className="crud-input"
                  required
                >
                  <option value="">Seleccionar cargo</option>
                  <option value="Optómetra">Optómetra</option>
                  <option value="Asistente">Asistente</option>
                  <option value="Técnico">Técnico</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Recepcionista">Recepcionista</option>
                </select>
              </div>

              <div className="crud-form-group">
                <label htmlFor="fecha_ingreso">Fecha de Ingreso <span className="crud-required">*</span></label>
                <input
                  type="date"
                  id="fecha_ingreso"
                  name="fecha_ingreso"
                  value={formData.fecha_ingreso}
                  onChange={handleChange}
                  className="crud-input"
                  required
                />
              </div>
            </div>

            <div className="crud-form-group">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="crud-input"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="crud-form-actions">
            <button 
              type="button" 
              className="crud-btn crud-btn-secondary"
              onClick={() => navigate('/admin/servicios/empleados')}
            >
              Cancelar
            </button>
            <button type="submit" className="crud-btn crud-btn-primary">
              Registrar Empleado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}