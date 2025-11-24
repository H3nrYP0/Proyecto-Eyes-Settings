import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUsuario } from '../../../../lib/data/usuariosData';
import "../../../../shared/styles/components/crud-forms.css";

export default function CrearUsuario() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'vendedor',
    estado: 'activo'
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    const newErrors = {};
    
    if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Crear el usuario (sin la confirmación de contraseña)
    const { confirmPassword, ...usuarioData } = formData;
    const nuevoUsuario = createUsuario(usuarioData);
    console.log('Usuario creado:', nuevoUsuario);
    navigate('/admin/usuarios');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar errores al cambiar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Crear Nuevo Usuario</h1>
        <p>Registra un nuevo usuario en el sistema</p>
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
                placeholder="Ej: Juan Pérez"
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
                placeholder="ejemplo@visualoutlet.com"
                required
              />
            </div>

            <div className="crud-form-row">
              <div className="crud-form-group">
                <label htmlFor="password">Contraseña <span className="crud-required">*</span></label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`crud-input ${errors.password ? 'error' : ''}`}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="crud-form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña <span className="crud-required">*</span></label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`crud-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Repite la contraseña"
                  required
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
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
              className="crud-btn crud-btn-secondary"
              onClick={() => navigate('/admin/usuarios')}
            >
              Cancelar
            </button>
            <button type="submit" className="crud-btn crud-btn-primary">
              Crear Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}