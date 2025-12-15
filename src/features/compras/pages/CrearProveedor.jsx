import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProveedor } from '../../../lib/data/proveedoresData';
import "../../../shared/styles/components/crud-forms.css";

export default function CrearProveedor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tipo: "Persona Jurídica",
    razonSocial: '',
    nit: '',
    contacto: '',
    telefono: '',
    correo: '',
    ciudad: '',
    direccion: '',
    estado: 'Activo'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Crear el proveedor
    const nuevoProveedor = createProveedor(formData);
    console.log('Proveedor creado:', nuevoProveedor);
    navigate('/admin/compras/proveedores');
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
        <h1>Crear Nuevo Proveedor</h1>
      </div>
      
      <div className="crud-form-content">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section">
            <div className="crud-form-group">
              <label htmlFor="tipo">Tipo de Persona <span className="crud-required">*</span></label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="crud-input"
                required
              >
                <option value="Persona Jurídica">Persona Jurídica</option>
                <option value="Persona Natural">Persona Natural</option>
              </select>
            </div>

            <div className="crud-form-group">
              <label htmlFor="razonSocial">Razón Social <span className="crud-required">*</span></label>
              <input
                type="text"
                id="razonSocial"
                name="razonSocial"
                value={formData.razonSocial}
                onChange={handleChange}
                className="crud-input"
                placeholder="Nombre o razón social del proveedor"
                required
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="nit">NIT <span className="crud-required">*</span></label>
              <input
                type="text"
                id="nit"
                name="nit"
                value={formData.nit}
                onChange={handleChange}
                className="crud-input"
                placeholder="Número de identificación tributaria"
                required
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="contacto">Persona de Contacto <span className="crud-required">*</span></label>
              <input
                type="text"
                id="contacto"
                name="contacto"
                value={formData.contacto}
                onChange={handleChange}
                className="crud-input"
                placeholder="Nombre del contacto principal"
                required
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="telefono">Teléfono <span className="crud-required">*</span></label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="crud-input"
                placeholder="Número de contacto"
                required
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="correo">Correo Electrónico <span className="crud-required">*</span></label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className="crud-input"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="ciudad">Ciudad <span className="crud-required">*</span></label>
              <input
                type="text"
                id="ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className="crud-input"
                placeholder="Ciudad donde se encuentra"
                required
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="direccion">Dirección</label>
              <textarea
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                rows="3"
                className="crud-input crud-textarea"
                placeholder="Dirección completa del proveedor"
              />
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
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="crud-form-actions">
            <button 
              type="button" 
              className="crud-btn crud-btn-secondary"
              onClick={() => navigate('/admin/compras/proveedores')}
            >
              Cancelar
            </button>
            <button type="submit" className="crud-btn crud-btn-primary">
              Crear Proveedor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}