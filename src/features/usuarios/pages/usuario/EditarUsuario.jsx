import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUsuarioById, updateUsuario } from '../../../../lib/data/usuariosData';
import "../../../../shared/styles/components/crud-forms.css";

export default function EditarUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const usuario = getUsuarioById(Number(id));
    if (usuario) {
      setFormData(usuario);
    } else {
      navigate('/admin/usuarios');
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Actualizar en la base de datos
    updateUsuario(Number(id), formData);
    navigate('/admin/usuarios');
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
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Editando: {formData.nombre}</h1>
        <p>Modifica la información del usuario</p>
      </div>
      
      <div className="crud-form-content">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section">
            <h3>Información del Usuario</h3>
            
            <div className="crud-form-group">
              <label htmlFor="nombre">Nombre Completo <span className="crud-required">*</span></label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="crud-input"
                required
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="email">Email <span className="crud-required">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="crud-input"
                required
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="password">Nueva Contraseña (opcional)</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password || ''}
                onChange={handleChange}
                className="crud-input"
                placeholder="Dejar en blanco para no cambiar"
              />
              <small className="crud-input-help">
                Mínimo 6 caracteres. Solo completa si deseas cambiar la contraseña.
              </small>
            </div>

            <div className="crud-form-row">
              <div className="crud-form-group">
                <label htmlFor="rol">Rol <span className="crud-required">*</span></label>
                <select
                  id="rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  className="crud-input"
                  required
                >
                  <option value="vendedor">Vendedor</option>
                  <option value="administrador">Administrador</option>
                  <option value="optometra">Optómetra</option>
                  <option value="tecnico">Técnico</option>
                </select>
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
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>
          </div>

          <div className="crud-form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/admin/usuarios')}
              className="crud-btn crud-btn-secondary"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="crud-btn crud-btn-primary"
            >
              Actualizar Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}