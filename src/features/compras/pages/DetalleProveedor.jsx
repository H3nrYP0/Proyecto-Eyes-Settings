import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProveedorById } from '../../../lib/data/proveedoresData';
import "../../../shared/styles/components/crud-forms.css";

export default function DetalleProveedor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proveedor, setProveedor] = useState(null);

  useEffect(() => {
    const proveedorData = getProveedorById(Number(id));
    setProveedor(proveedorData);
  }, [id]);

  if (!proveedor) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle de Proveedor: {proveedor.razonSocial}</h1>
      </div>
      
      <div className="crud-form-content">
        <div className="crud-form-section">
          {/* Tipo */}
          <div className="crud-form-group">
            <div className="crud-input-view">
              {proveedor.tipo}
            </div>
          </div>

          {/* Razón Social */}
          <div className="crud-form-group">
            <div className="crud-input-view">
              {proveedor.razonSocial}
            </div>
          </div>

          {/* NIT/Identificación */}
          <div className="crud-form-group">
            <div className="crud-input-view">
              {proveedor.nit || proveedor.identificacion}
            </div>
          </div>

          {/* Contacto */}
          <div className="crud-form-group">
            <div className="crud-input-view">
              {proveedor.contacto}
            </div>
          </div>

          {/* Teléfono */}
          <div className="crud-form-group">
            <div className="crud-input-view">
              {proveedor.telefono}
            </div>
          </div>

          {/* Correo */}
          <div className="crud-form-group">
            <div className="crud-input-view">
              <a href={`mailto:${proveedor.correo}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {proveedor.correo}
              </a>
            </div>
          </div>

          {/* Ciudad */}
          <div className="crud-form-group">
            <div className="crud-input-view">
              {proveedor.ciudad}
            </div>
          </div>

          {/* Estado */}
          <div className="crud-form-group">
            <div className="crud-input-view">
              <span className={`crud-badge ${proveedor.estado === "Activo" ? "crud-badge-success" : "crud-badge-error"}`}>
                {proveedor.estado}
              </span>
            </div>
          </div>

          {/* Dirección - Ocupa toda la fila */}
          <div className="crud-form-group" style={{ gridColumn: '1 / -1' }}>
            <div className="crud-input-view">
              {proveedor.direccion || 'No especificada'}
            </div>
          </div>
        </div>

        <div className="crud-form-actions">
          <button 
            onClick={() => navigate('/admin/compras/proveedores')}
            className="crud-btn crud-btn-secondary"
          >
            Volver
          </button>
          <button 
            onClick={() => navigate(`/admin/compras/proveedores/editar/${proveedor.id}`)}
            className="crud-btn crud-btn-primary"
          >
            Editar proveedor
          </button>
        </div>
      </div>
    </div>
  );
}