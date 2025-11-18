// src/features/compras/pages/EditarProveedor.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProveedores } from '../context/ProveedoresContext';
import CrudLayout from "../../../shared/components/layouts/CrudLayout";

export default function EditarProveedor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state, actions } = useProveedores();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const proveedor = state.proveedores.find(prov => prov.id === parseInt(id));
    if (proveedor) {
      setFormData(proveedor);
    } else {
      navigate('/admin/compras/proveedores');
    }
  }, [id, state.proveedores, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    actions.updateProveedor(formData);
    navigate('/admin/compras/proveedores');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!formData) {
    return <div>Cargando...</div>;
  }

  return (
    <CrudLayout
      title="✏️ Editar Proveedor"
      description="Modifica la información del proveedor"
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
              Actualizar Proveedor
            </button>
          </div>
        </form>
      </div>
    </CrudLayout>
  );
}