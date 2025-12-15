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
      </div>
      
      <div className="crud-form-content">
        <div className="crud-form-section">
          <div className="crud-form-group">
            <div className="crud-input-view">
              {usuario.nombre}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {usuario.fechaNacimiento || 'No especificada'}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {usuario.tipoDocumento === 'cedula' ? 'Cédula de Ciudadanía' :
               usuario.tipoDocumento === 'cedula_extranjera' ? 'Cédula de Extranjería' :
               usuario.tipoDocumento === 'pasaporte' ? 'Pasaporte' :
               usuario.tipoDocumento === 'ppt' ? 'PPT (Permiso de Permanencia)' :
               usuario.tipoDocumento || 'No especificado'}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {usuario.numeroDocumento || 'No especificado'}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {usuario.email}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {usuario.telefono || 'No especificado'}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {usuario.rol}
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              <span className={`crud-badge ${usuario.estado === "activo" ? "crud-badge-success" : "crud-badge-error"}`}>
                {usuario.estado === "activo" ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>

          <div className="crud-form-group">
            <div className="crud-input-view">
              {usuario.fechaRegistro}
            </div>
          </div>

          <div className="crud-form-group empty-field">
            <div></div>
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