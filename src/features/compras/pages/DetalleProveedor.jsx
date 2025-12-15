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
          <div className="crud-detail-grid">
            <div className="crud-detail-item">
              <strong>Tipo:</strong> 
              <span className={`badge-${proveedor.tipo === "Persona Jurídica" ? 'juridica' : 'natural'}`}>
                {proveedor.tipo}
              </span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Razón Social:</strong> 
              <span>{proveedor.razonSocial}</span>
            </div>

            <div className="crud-detail-item">
              <strong>NIT:</strong> 
              <span>{proveedor.nit}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Contacto:</strong> 
              <span>{proveedor.contacto}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Teléfono:</strong> 
              <span>{proveedor.telefono}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Correo:</strong> 
              <a href={`mailto:${proveedor.correo}`} className="email-link">
                {proveedor.correo}
              </a>
            </div>

            <div className="crud-detail-item">
              <strong>Ciudad:</strong> 
              <span>{proveedor.ciudad}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Estado:</strong> 
              <span className={`crud-badge ${proveedor.estado === "Activo" ? "crud-badge-success" : "crud-badge-error"}`}>
                {proveedor.estado}
              </span>
            </div>

            {proveedor.direccion && (
              <div className="crud-detail-item" style={{gridColumn: '1 / -1'}}>
                <strong>Dirección:</strong> 
                <span>{proveedor.direccion}</span>
              </div>
            )}
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