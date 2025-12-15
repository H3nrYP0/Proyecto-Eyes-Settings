import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getClienteById, updateCliente } from '../../../../lib/data/clientesData';
import "../../../../shared/styles/components/crud-forms.css";

export default function EditarCliente() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const cliente = getClienteById(Number(id));
    if (cliente) {
      setFormData(cliente);
    } else {
      // Cambiar a la ruta correcta basada en cómo accedes aquí
      navigate('/admin/ventas/clientes');
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre || !formData.apellido || !formData.documento) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }
    
    // Actualizar en la base de datos
    updateCliente(Number(id), formData);
    
    // Usar navigate con -1 para volver a la página anterior
    // O usar la ruta específica
    navigate('/admin/ventas/clientes');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!formData) {
    return (
      <div className="crud-form-container">
        <div className="crud-form-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Cargando información del cliente...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Editando: {formData.nombre} {formData.apellido}</h1>
      </div>
      
      <div className="crud-form-content">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section">
            {/* Primera fila: Nombre y Apellido */}
            <div className="crud-form-group">
              <label htmlFor="nombre">
                Nombre <span className="crud-required">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="crud-input"
                required
                placeholder="Ingrese el nombre"
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="apellido">
                Apellido <span className="crud-required">*</span>
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="crud-input"
                required
                placeholder="Ingrese el apellido"
              />
            </div>

            {/* Segunda fila: Tipo de documento y Número */}
            <div className="crud-form-group">
              <label htmlFor="tipoDocumento">
                Tipo Documento <span className="crud-required">*</span>
              </label>
              <select
                id="tipoDocumento"
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                className="crud-input"
                required
              >
                <option value="">Seleccione...</option>
                <option value="cedula">Cédula</option>
                <option value="pasaporte">Pasaporte</option>
                <option value="cedula_extranjeria">Cédula Extranjería</option>
              </select>
            </div>

            <div className="crud-form-group">
              <label htmlFor="documento">
                Número Documento <span className="crud-required">*</span>
              </label>
              <input
                type="text"
                id="documento"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                className="crud-input"
                required
                placeholder="Número de documento"
              />
            </div>

            {/* Tercera fila: Teléfono y Correo */}
            <div className="crud-form-group">
              <label htmlFor="telefono">
                Teléfono <span className="crud-required">*</span>
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="crud-input"
                required
                placeholder="Número de teléfono"
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="correo">Correo Electrónico</label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo || ''}
                onChange={handleChange}
                className="crud-input"
                placeholder="cliente@ejemplo.com"
              />
            </div>

            {/* Cuarta fila: Fecha de nacimiento y Género */}
            <div className="crud-form-group">
              <label htmlFor="fechaNacimiento">
                Fecha de Nacimiento <span className="crud-required">*</span>
              </label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className="crud-input"
                required
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="genero">
                Género <span className="crud-required">*</span>
              </label>
              <select
                id="genero"
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="crud-input"
                required
              >
                <option value="">Seleccione...</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {/* Quinta fila: Ciudad y Dirección */}
            <div className="crud-form-group">
              <label htmlFor="ciudad">
                Ciudad <span className="crud-required">*</span>
              </label>
              <input
                type="text"
                id="ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className="crud-input"
                required
                placeholder="Ciudad de residencia"
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="direccion">Dirección</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion || ''}
                onChange={handleChange}
                className="crud-input"
                placeholder="Dirección completa (opcional)"
              />
            </div>
          </div>

          <div className="crud-form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/admin/ventas/clientes')}
              className="crud-btn crud-btn-secondary"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="crud-btn crud-btn-primary"
            >
              Actualizar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}