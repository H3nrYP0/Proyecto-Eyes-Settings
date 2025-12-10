import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRolById } from '../../../../lib/data/rolesData';
import "../../../../shared/styles/components/crud-forms.css";

export default function DetalleRol() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const rolData = getRolById(Number(id));
    setRol(rolData);
  }, [id]);

  if (!rol) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle de Rol: {rol.nombre}</h1>
        <p>Información completa del rol</p>
      </div>
      
      <div className="crud-form-content">
        <div className="crud-form-section">
          <h3>Información Básica</h3>
          
          <div className="crud-detail-grid">
            <div className="crud-detail-item">
              <strong>Nombre:</strong> 
              <span>{rol.nombre}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Estado:</strong> 
              <span className={`crud-badge ${rol.estado === "activo" ? "crud-badge-success" : "crud-badge-error"}`}>
                {rol.estado === "activo" ? "Activo" : "Inactivo"}
              </span>
            </div>

            <div className="crud-detail-item" style={{gridColumn: '1 / -1'}}>
              <strong>Descripción:</strong> 
              <span>{rol.descripcion}</span>
            </div>
          </div>
        </div>

        <div className="crud-form-section">
          <h3>Permisos Asignados ({rol.permisosCount || rol.permisos?.length || 0})</h3>
          
          {rol.permisos && rol.permisos.length > 0 ? (
            <div className="crud-detail-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'}}>
              {rol.permisos.map((permiso, index) => (
                <div key={index} className="crud-detail-item">
                  <span className="crud-badge crud-badge-info">
                    {permiso}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="crud-no-data">
              <p>Este rol no tiene permisos asignados</p>
            </div>
          )}
        </div>

        <div className="crud-form-section">
          <h3>Resumen</h3>
          
          <div className="crud-detail-grid">
            <div className="crud-detail-item">
              <strong>ID:</strong> 
              <span>{rol.id}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Total Permisos:</strong> 
              <span>{rol.permisosCount || rol.permisos?.length || 0}</span>
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