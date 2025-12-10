import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRolById } from '../../../../lib/data/rolesData';
import "../../../../shared/styles/components/crud-forms.css";

export default function DetalleRol() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const rolData = getRolById(id);
    setRol(rolData);
  }, [id]);

  if (!rol) {
    return <div>Cargando...</div>;
  }

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
              <strong>Nombre del Rol:</strong> 
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
              <span>{rol.descripcion || "Sin descripción"}</span>
            </div>
          </div>
        </div>

        <div className="crud-form-section">
          <h3>Permisos Asignados ({rol.permisosCount || rol.permisos?.length || 0})</h3>
          
          {rol.permisos && rol.permisos.length > 0 ? (
            <div className="crud-permisos-grid">
              {rol.permisos.map((permiso, index) => (
                <div key={index} className="crud-permiso-card">
                  <div className="crud-permiso-icon">
                    <i className="fas fa-key"></i>
                  </div>
                  <div className="crud-permiso-info">
                    <span className="crud-permiso-codigo">{permiso}</span>
                    <span className="crud-permiso-desc">
                      {permisosDescriptivos[permiso] || 'Permiso del sistema'}
                    </span>
                  </div>
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
          <h3>Resumen del Rol</h3>
          
          <div className="crud-detail-grid">
            <div className="crud-detail-item">
              <strong>ID del Rol:</strong> 
              <span className="crud-code">{rol.id}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Total de Permisos:</strong> 
              <span className="crud-highlight">
                {rol.permisosCount || rol.permisos?.length || 0}
              </span>
            </div>

            <div className="crud-detail-item">
              <strong>Creado:</strong> 
              <span>En base de datos temporal</span>
            </div>

            <div className="crud-detail-item">
              <strong>Tipo de Acceso:</strong> 
              <span>
                {rol.nombre === "Administrador" ? "Acceso Completo" : 
                 rol.nombre === "Vendedor" ? "Acceso Comercial" :
                 rol.nombre === "Optometrista" ? "Acceso Médico" :
                 rol.nombre === "Recepcionista" ? "Acceso Administrativo" :
                 rol.nombre === "Técnico" ? "Acceso Técnico" : "Acceso Personalizado"}
              </span>
            </div>
          </div>
        </div>

        <div className="crud-form-section">
          <h3>Funciones Principales</h3>
          
          <div className="crud-funciones-list">
            {rol.nombre === "Administrador" && (
              <>
                <div className="crud-funcion-item">
                  <i className="fas fa-shield-alt"></i>
                  <span>Gestión total del sistema óptico</span>
                </div>
                <div className="crud-funcion-item">
                  <i className="fas fa-cogs"></i>
                  <span>Configuración de todos los módulos</span>
                </div>
                <div className="crud-funcion-item">
                  <i className="fas fa-users-cog"></i>
                  <span>Control de usuarios y permisos</span>
                </div>
              </>
            )}
            
            {rol.nombre === "Vendedor" && (
              <>
                <div className="crud-funcion-item">
                  <i className="fas fa-shopping-cart"></i>
                  <span>Procesamiento de ventas</span>
                </div>
                <div className="crud-funcion-item">
                  <i className="fas fa-users"></i>
                  <span>Gestión de clientes</span>
                </div>
                <div className="crud-funcion-item">
                  <i className="fas fa-calendar-check"></i>
                  <span>Control de agenda y citas</span>
                </div>
              </>
            )}
            
            {rol.nombre === "Optometrista" && (
              <>
                <div className="crud-funcion-item">
                  <i className="fas fa-eye"></i>
                  <span>Realizar exámenes visuales</span>
                </div>
                <div className="crud-funcion-item">
                  <i className="fas fa-stethoscope"></i>
                  <span>Gestionar servicios médicos</span>
                </div>
                <div className="crud-funcion-item">
                  <i className="fas fa-heartbeat"></i>
                  <span>Coordinación de campañas de salud</span>
                </div>
              </>
            )}
            
            {rol.nombre === "Recepcionista" && (
              <>
                <div className="crud-funcion-item">
                  <i className="fas fa-headset"></i>
                  <span>Atención al cliente</span>
                </div>
                <div className="crud-funcion-item">
                  <i className="fas fa-calendar-alt"></i>
                  <span>Gestión de agenda</span>
                </div>
                <div className="crud-funcion-item">
                  <i className="fas fa-box"></i>
                  <span>Seguimiento de pedidos</span>
                </div>
              </>
            )}
            
            {rol.nombre === "Técnico" && (
              <>
                <div className="crud-funcion-item">
                  <i className="fas fa-tools"></i>
                  <span>Ajuste de monturas</span>
                </div>
                <div className="crud-funcion-item">
                  <i className="fas fa-boxes"></i>
                  <span>Control de inventario</span>
                </div>
                <div className="crud-funcion-item">
                  <i className="fas fa-wrench"></i>
                  <span>Mantenimiento de equipos</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="crud-form-actions">
          <button 
            onClick={() => navigate('/admin/seguridad/roles')}
            className="crud-btn crud-btn-secondary"
          >
            <i className="fas fa-arrow-left"></i> Volver a Roles
          </button>
          <button 
            onClick={() => navigate(`/admin/seguridad/roles/editar/${rol.id}`)}
            className="crud-btn crud-btn-primary"
          >
            <i className="fas fa-edit"></i> Editar Rol
          </button>
        </div>
      </div>
    </div>
  );
}