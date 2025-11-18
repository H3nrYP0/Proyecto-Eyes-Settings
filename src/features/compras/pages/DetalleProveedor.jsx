// src/features/compras/pages/DetalleProveedor.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProveedores } from '../context/ProveedoresContext';
import CrudLayout from "../../../shared/components/layouts/CrudLayout";

export default function DetalleProveedor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useProveedores();
  const [proveedor, setProveedor] = useState(null);

  useEffect(() => {
    const proveedorEncontrado = state.proveedores.find(p => p.id === parseInt(id));
    if (proveedorEncontrado) {
      setProveedor(proveedorEncontrado);
    } else {
      navigate('/admin/compras/proveedores');
    }
  }, [id, state.proveedores, navigate]);

  if (!proveedor) {
    return <div>Cargando...</div>;
  }

  return (
    <CrudLayout
      title="👁️ Detalle de Proveedor"
      description={`Información completa de ${proveedor.razonSocial}`}
    >
      <div className="crud-center">
        <div className="detalle-proveedor">
          
          {/* Información Principal */}
          <div className="info-section">
            <h3>Información Principal</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>Razón Social:</strong>
                <span>{proveedor.razonSocial}</span>
              </div>
              <div className="info-item">
                <strong>Tipo:</strong>
                <span>{proveedor.tipo}</span>
              </div>
              <div className="info-item">
                <strong>NIT:</strong>
                <span>{proveedor.nit}</span>
              </div>
              <div className="info-item">
                <strong>Estado:</strong>
                <span className={`status-${proveedor.estado.toLowerCase()}`}>
                  {proveedor.estado === "Activo" ? "✅ Activo" : "❌ Inactivo"}
                </span>
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="info-section">
            <h3>Información de Contacto</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>Contacto:</strong>
                <span>{proveedor.contacto}</span>
              </div>
              <div className="info-item">
                <strong>Teléfono:</strong>
                <span>{proveedor.telefono}</span>
              </div>
              <div className="info-item">
                <strong>Correo:</strong>
                <span>{proveedor.correo}</span>
              </div>
              <div className="info-item">
                <strong>Ciudad:</strong>
                <span>{proveedor.ciudad}</span>
              </div>
            </div>
          </div>

          {/* Estadísticas (puedes expandir esto con datos reales) */}
          <div className="info-section">
            <h3>Estadísticas</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <strong>Compras Realizadas</strong>
                <span className="stat-number">15</span>
              </div>
              <div className="stat-card">
                <strong>Productos Suministrados</strong>
                <span className="stat-number">45</span>
              </div>
              <div className="stat-card">
                <strong>Última Compra</strong>
                <span className="stat-date">2024-01-15</span>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="form-actions">
            <button onClick={() => navigate('/admin/compras/proveedores')}>
              Volver a Proveedores
            </button>
            <button 
              onClick={() => navigate(`/admin/compras/proveedores/editar/${proveedor.id}`)}
              className="btn-primary"
            >
              ✏️ Editar Proveedor
            </button>
          </div>
        </div>
      </div>
    </CrudLayout>
  );
}