import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import { getProveedorById, updateProveedor } from "../../../lib/data/proveedoresData";
import "../../../shared/styles/components/crud-forms.css";

export default function EditarProveedor() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const proveedor = getProveedorById(Number(id));
    if (proveedor) {
      setFormData(proveedor);
    } else {
      navigate('/admin/compras/proveedores');
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Actualizar en la base de datos
    updateProveedor(Number(id), formData);
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
      description={`Modifica la información del proveedor`}
    >
      <div className="crud-form-container">
        <div className="crud-form-header">
          <h1>Editando: {formData.razonSocial}</h1>
          <p>Modifica la información del proveedor</p>
        </div>
        
        <div className="crud-form-content">
          <form onSubmit={handleSubmit}>
            <div className="crud-form-section">
              <h3>Información del Proveedor</h3>
              
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
                  required
                />
              </div>

              <div className="crud-form-group">
                <label htmlFor="direccion">Dirección</label>
                <textarea
                  id="direccion"
                  name="direccion"
                  value={formData.direccion || ''}
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
                onClick={() => navigate('/admin/compras/proveedores')}
                className="crud-btn crud-btn-secondary"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="crud-btn crud-btn-primary"
              >
                Actualizar Proveedor
              </button>
            </div>
          </form>
        </div>
      </div>
    </CrudLayout>
  );
}