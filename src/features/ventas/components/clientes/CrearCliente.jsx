import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCliente } from '../../../../lib/data/clientesData';
import "../../../../shared/styles/components/crud-forms.css";

export default function CrearCliente() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipoDocumento: 'cedula',
    documento: '',
    telefono: '',
    correo: '',
    ciudad: '',
    direccion: '',
    fechaNacimiento: '',
    genero: 'masculino'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Crear el cliente
    const crearCliente = createCliente(formData);
    console.log('Cliente creado:', crearCliente);
    navigate('/admin/clientes');
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
        <h1>Registrar Nuevo Cliente</h1>
      </div>
      
      <div className="crud-form-content">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section">
            <div className="crud-form-row">
              <div className="crud-form-group">
                <label htmlFor="nombre">Nombre <span className="crud-required">*</span></label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="crud-input"
                  placeholder="Ej: Juan"
                  required
                />
              </div>

              <div className="crud-form-group">
                <label htmlFor="apellido">Apellido <span className="crud-required">*</span></label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className="crud-input"
                  placeholder="Ej: Pérez"
                  required
                />
              </div>
            </div>

            <div className="crud-form-row">
              <div className="crud-form-group">
                <label htmlFor="tipoDocumento">Tipo Documento <span className="crud-required">*</span></label>
                <select
                  id="tipoDocumento"
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
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
                <label htmlFor="documento">Número Documento <span className="crud-required">*</span></label>
                <input
                  type="text"
                  id="documento"
                  name="documento"
                  value={formData.documento}
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
                <label htmlFor="correo">Correo Electrónico</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className="crud-input"
                  placeholder="cliente@ejemplo.com"
                />
              </div>
            </div>

            <div className="crud-form-row">
              <div className="crud-form-group">
                <label htmlFor="fechaNacimiento">Fecha de Nacimiento <span className="crud-required">*</span></label>
                <input
                  type="date"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className="crud-input"
                  required
                />
              </div>

              <div className="crud-form-group">
                <label htmlFor="genero">Género <span className="crud-required">*</span></label>
                <select
                  id="genero"
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  className="crud-input"
                  required
                >
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="crud-form-row">
              <div className="crud-form-group">
                <label htmlFor="ciudad">Ciudad <span className="crud-required">*</span></label>
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  className="crud-input"
                  placeholder="Ej: Bogotá"
                  required
                />
              </div>

              <div className="crud-form-group">
                <label htmlFor="direccion">Dirección</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="crud-input"
                  placeholder="Dirección completa"
                />
              </div>
            </div>
          </div>

          <div className="crud-form-actions">
            <button 
              type="button" 
              className="crud-btn crud-btn-secondary"
              onClick={() => navigate('/admin/ventas/clientes')}
            >
              Cancelar
            </button>
            <button type="submit" className="crud-btn crud-btn-primary">
              Registrar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}