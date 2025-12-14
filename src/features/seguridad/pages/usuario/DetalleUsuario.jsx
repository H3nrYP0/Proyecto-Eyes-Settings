import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUsuarioById } from '../../../../lib/data/usuariosData';
import "../../../../shared/styles/components/crud-forms.css";

export default function DetalleUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioData = getUsuarioById(Number(id));
    setUsuario(usuarioData);
  }, [id]);

  if (!usuario) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle de Usuario: {usuario.nombre}</h1>
        <p>Información completa del usuario</p>
      </div>
      
      <div className="crud-form-content">
        <div className="crud-form-section">     
          <div className="crud-detail-grid">
            <div className="crud-detail-item">
              <strong>Nombre:</strong> 
              <span>{usuario.nombre}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Email:</strong> 
              <span>{usuario.email}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Teléfono:</strong> 
              <span>{usuario.telefono || 'No especificado'}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Fecha de Nacimiento:</strong> 
              <span>{usuario.fechaNacimiento || 'No especificada'}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Tipo de Documento:</strong> 
              <span>
                {usuario.tipoDocumento === 'cedula' ? 'Cédula de Ciudadanía' :
                 usuario.tipoDocumento === 'cedula_extranjera' ? 'Cédula de Extranjería' :
                 usuario.tipoDocumento === 'pasaporte' ? 'Pasaporte' :
                 usuario.tipoDocumento === 'ppt' ? 'PPT (Permiso de Permanencia)' :
                 usuario.tipoDocumento || 'No especificado'}
              </span>
            </div>

            <div className="crud-detail-item">
              <strong>Número de Documento:</strong> 
              <span>{usuario.numeroDocumento || 'No especificado'}</span>
            </div>

            <div className="crud-detail-item">
              <strong>Rol:</strong> 
              <span className={`rol-badge ${usuario.rol.toLowerCase()}`}>
                {usuario.rol}
              </span>
            </div>

            <div className="crud-detail-item">
              <strong>Fecha de Registro:</strong> 
              <span>{usuario.fechaRegistro}</span>
            </div>
            
            <div className="crud-detail-item">
              <strong>Estado:</strong> 
              <span className={`crud-badge ${usuario.estado === "activo" ? "crud-badge-success" : "crud-badge-error"}`}>
                {usuario.estado === "activo" ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
        </div>

        <div className="crud-form-actions">
          <button 
            onClick={() => navigate('/admin/seguridad/usuarios')}
            className="crud-btn crud-btn-secondary"
          >
            Volver
          </button>
            <button
            onClick={() => navigate(`/admin/seguridad/usuarios/editar/${usuario.id}`)}
            className="crud-btn crud-btn-primary"
          >
            Editar Usuario
          </button>       
        </div>
      </div>
    </div>
  );
}