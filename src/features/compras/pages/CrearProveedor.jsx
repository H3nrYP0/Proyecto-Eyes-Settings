// src/features/compras/pages/CrearProveedor.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProveedores } from '../context/ProveedoresContext';
import CrudLayout from "../../../shared/components/layouts/CrudLayout";

export default function CrearProveedor() {
  const navigate = useNavigate();
  const { actions } = useProveedores();
  const [formData, setFormData] = useState({
    tipo: "Persona Jurídica",
    razonSocial: "",
    nit: "",
    contacto: "",
    telefono: "",
    correo: "",
    ciudad: "",
    estado: "Activo"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    actions.addProveedor(formData);
    navigate('/admin/compras/proveedores');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <CrudLayout
      title="➕ Crear Proveedor"
      description="Completa la información del nuevo proveedor"
    >
      <div className="crud-center">
        <form onSubmit={handleSubmit} className="crud-form">
          <div className="form-row">
            <div className="form-group">
              <label>Tipo *</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange} required>
                <option value="Persona Jurídica">Persona Jurídica</option>
                <option value="Persona Natural">Persona Natural</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Razón Social *</label>
              <input 
                type="text" 
                name="razonSocial"
                value={formData.razonSocial}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>NIT *</label>
              <input 
                type="text" 
                name="nit"
                value={formData.nit}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Contacto *</label>
              <input 
                type="text" 
                name="contacto"
                value={formData.contacto}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Teléfono *</label>
              <input 
                type="tel" 
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Correo *</label>
              <input 
                type="email" 
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ciudad *</label>
              <input 
                type="text" 
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Estado</label>
              <select name="estado" value={formData.estado} onChange={handleChange}>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/admin/compras/proveedores')}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Crear Proveedor
            </button>
          </div>
        </form>
      </div>
    </CrudLayout>
  );
}