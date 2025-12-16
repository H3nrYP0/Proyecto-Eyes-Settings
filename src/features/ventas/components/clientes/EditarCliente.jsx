import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getClienteById, updateCliente } from '../../../../lib/data/clientesData';
import "../../../../shared/styles/components/crud-forms.css";

export default function EditarCliente() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cliente = getClienteById(Number(id));
    if (cliente) {
      setFormData(cliente);
    } else {
      navigate('/admin/ventas/clientes');
    }
    setLoading(false);
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.apellido || !formData.documento) {
      alert('Complete los campos requeridos');
      return;
    }
    
    updateCliente(Number(id), formData);
    navigate('/admin/ventas/clientes');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="crud-form-container minimal">
        <div className="crud-form-content">
          <div className="loading-minimal">
            Cargando...
          </div>
        </div>
      </div>
    );
  }

  if (!formData) return null;

  return (
    <div className="crud-form-container minimal">
      <div className="crud-form-header minimal">
        <h1>Editar Cliente: {formData.nombre} {formData.apellido}</h1>
      </div>
      
      <div className="crud-form-content compact">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section compact">
            {/* Fila 1 */}
            <div className="crud-form-group">
              <label>Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="crud-input"
                required
              />
            </div>

            <div className="crud-form-group">
              <label>Apellido *</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="crud-input"
                required
              />
            </div>

            {/* Fila 2 */}
            <div className="crud-form-group">
              <label>Tipo Documento *</label>
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                className="crud-input"
                required
              >
                <option value="cedula">Cédula</option>
                <option value="pasaporte">Pasaporte</option>
                <option value="cedula_extranjeria">Cédula Extranjería</option>
              </select>
            </div>

            <div className="crud-form-group">
              <label>Documento *</label>
              <input
                type="text"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                className="crud-input"
                required
              />
            </div>

            {/* Fila 3 */}
            <div className="crud-form-group">
              <label>Teléfono *</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="crud-input"
                required
              />
            </div>

            <div className="crud-form-group">
              <label>Correo</label>
              <input
                type="email"
                name="correo"
                value={formData.correo || ''}
                onChange={handleChange}
                className="crud-input"
              />
            </div>

            {/* Fila 4 */}
            <div className="crud-form-group">
              <label>Fecha Nac. *</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className="crud-input"
                required
              />
            </div>

            <div className="crud-form-group">
              <label>Género *</label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="crud-input"
                required
              >
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {/* Fila 5 */}
            <div className="crud-form-group">
              <label>Ciudad *</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className="crud-input"
                required
              />
            </div>

            <div className="crud-form-group">
              <label>Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion || ''}
                onChange={handleChange}
                className="crud-input"
              />
            </div>
          </div>

          <div className="crud-form-actions compact">
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
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}