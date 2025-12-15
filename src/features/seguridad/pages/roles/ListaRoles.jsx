import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRolById } from '../../../../lib/data/rolesData';
import "../../../../shared/styles/components/crud-forms.css";

export default function DetalleRol() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rol, setRol] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rolData = getRolById(Number(id));
    if (rolData) {
      // Adaptar datos si es necesario
      const rolAdaptado = {
        ...rolData,
        estado: rolData.estado || 'activo'
      };
      setRol(rolAdaptado);
    }
    setLoading(false);
  }, [id]);

  // Mapeo descriptivo de los permisos
  const permisosDescriptivos = {
    'dashboard': 'Ver dashboard principal',
    'categorias': 'Gestionar categorías de productos',
    'compras': 'Gestionar compras y proveedores',
    'empleados': 'Gestionar empleados',
    'ventas': 'Gestionar ventas',
    'roles': 'Gestionar roles y permisos',
    'productos': 'Gestionar inventario de productos',
    'servicios': 'Gestionar servicios ópticos',
    'clientes': 'Gestionar clientes',
    'campanas_salud': 'Gestionar campañas de salud',
    'usuarios': 'Gestionar usuarios del sistema',
    'proveedores': 'Gestionar proveedores',
    'agenda': 'Gestionar agenda y citas',
    'pedidos': 'Gestionar pedidos'
  };

  if (loading) {
    return (
      <div className="crud-form-container">
        <div className="crud-form-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Cargando...
          </div>
        </div>
      </div>
    );
  }

  if (!rol) {
    return (
      <div className="crud-form-container">
        <div className="crud-form-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Rol no encontrado
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle de Rol</h1>
        <p>{rol.nombre}</p>
      </div>
      
      <div className="crud-form-content">
        <div className="crud-form-section">
          <div className="crud-detail-grid">
            <div className="crud-detail-item">
              <strong>Nombre:</strong> 
              <span>{rol.nombre || 'No especificado'}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Estado:</strong> 
              <span className={`crud-badge ${rol.estado === "activo" ? "crud-badge-success" : "crud-badge-error"}`}>
                {rol.estado === "activo" ? "Activo" : "Inactivo"}
              </span>
            </div>

            <div className="crud-detail-item" style={{gridColumn: '1 / -1'}}>
              <strong>Descripción:</strong> 
              <div style={{ 
                marginTop: '8px',
                padding: '12px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                border: '1px solid #e0e0e0'
              }}>
                {rol.descripcion || 'No hay descripción disponible'}
              </div>
            </div>

            <div className="crud-detail-item" style={{gridColumn: '1 / -1'}}>
              <strong>Permisos Asignados:</strong> 
              <div style={{ 
                marginTop: '8px',
                padding: '16px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                border: '1px solid #e0e0e0'
              }}>
                {rol.permisos && rol.permisos.length > 0 ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {rol.permisos.map((permiso, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        border: '1px solid #e0e0e0'
                      }}>
                        <span style={{
                          color: '#10b981',
                          fontSize: '1rem',
                          fontWeight: 'bold'
                        }}>✓</span>
                        <span style={{
                          color: '#374151',
                          fontSize: '0.9rem'
                        }}>
                          {permisosDescriptivos[permiso] || `Permiso: ${permiso}`}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    color: '#6b7280',
                    padding: '16px',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    border: '1px dashed #d1d5db'
                  }}>
                    Este rol no tiene permisos asignados
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="crud-form-actions">
          <button 
            onClick={() => navigate('/admin/seguridad/roles')}
            className="crud-btn crud-btn-secondary"
          >
            Volver
          </button>
          <button 
            onClick={() => navigate(`/admin/seguridad/roles/editar/${rol.id}`)}
            className="crud-btn crud-btn-primary"
          >
            Editar Rol
          </button>
        </div>
      </div>
    </div>
  );
}