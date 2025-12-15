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

  // Mapeo descriptivo de los permisos
  const permisosDescriptivos = {
    'dashboard': 'Gestionar Dashboard',
    'categorias': 'Gestionar Categorías',
    'compras': 'Gestionar Compras',
    'empleados': 'Gestionar Empleados',
    'ventas': 'Gestionar Ventas',
    'roles': 'Gestionar Roles',
    'productos': 'Gestionar Productos',
    'servicios': 'Gestionar Servicios',
    'clientes': 'Gestionar Clientes',
    'campanas_salud': 'Gestionar Campañas de Salud',
    'usuarios': 'Gestionar Usuarios',
    'proveedores': 'Gestionar Proveedores',
    'agenda': 'Gestionar Agenda',
    'pedidos': 'Gestionar Pedidos'
  };

  return (
    <div className="crud-form-container detalle-rol-full-height">
      <div className="crud-form-header">
        <h1>Detalle de Rol: {rol.nombre}</h1>
      </div>
      
      <div className="crud-form-content detalle-rol-content">
        <div className="detalle-rol-layout">
          {/* Sección de Información General */}
          <div className="detalle-info-section">
            <h3>Información General</h3>
            
            <div className="info-grid">
              <div className="info-item">
                <label>Nombre:</label>
                <div className="info-value">{rol.nombre}</div>
              </div>
              
              <div className="info-item">
                <label>Estado:</label>
                <div className="info-value">
                  <span className={`estado-badge ${rol.estado === "activo" ? "activo" : "inactivo"}`}>
                    {rol.estado === "activo" ? "ACTIVO" : "INACTIVO"}
                  </span>
                </div>
              </div>

              <div className="info-item full-width">
                <label>Descripción:</label>
                <div className="info-value descripcion">
                  {rol.descripcion}
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Permisos */}
          <div className="detalle-permisos-section">
            <h3>Permisos Asignados</h3>
            
            {rol.permisos && rol.permisos.length > 0 ? (
              <div className="permisos-grid-full">
                {rol.permisos.map((permiso, index) => (
                  <div key={index} className="permiso-item-full">
                    <span className="permiso-check">✓</span>
                    <span className="permiso-text">
                      {permisosDescriptivos[permiso] || `Gestionar ${permiso}`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-permisos">
                <p>Este rol no tiene permisos asignados</p>
              </div>
            )}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="detalle-actions">
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