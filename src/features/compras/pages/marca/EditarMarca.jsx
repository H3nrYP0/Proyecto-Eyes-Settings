import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMarcaById, updateMarca } from "../../../../lib/data/marcasData";
import "../../../../shared/styles/components/crud-forms.css";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification"
export default function EditarMarca() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState(null);
  // 👇 NUEVO: Guardamos el estado original para comparar cambios
  const [originalData, setOriginalData] = useState(null);

  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const handleCloseNotification = () => {
    setNotification({ ...notification, isVisible: false });
  };

  useEffect(() => {
    const marca = getMarcaById(Number(id));
    if (marca) {
      setFormData(marca);
      // 👇 NUEVO: Guardamos una copia del estado original
      setOriginalData({ ...marca });
    } else {
      navigate('/admin/compras/marcas');
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      setNotification({
        isVisible: true,
        message: 'El nombre de la marca es obligatorio.',
        type: 'error'
      });
      return;
    }

    // 👇 NUEVA VALIDACIÓN: Verificar si hubo cambios
    if (originalData && JSON.stringify(formData) === JSON.stringify(originalData)) {
      setNotification({
        isVisible: true,
        message: 'No se han realizado cambios para guardar.',
        type: 'error'
      });
      return;
    }

    try {
      updateMarca(Number(id), formData);

      setNotification({
        isVisible: true,
        message: '¡Marca actualizada con éxito!',
        type: 'success'
      });

      setTimeout(() => {
        navigate('/admin/compras/marcas');
      }, 2000);

    } catch (error) {
      setNotification({
        isVisible: true,
        message: 'Error al actualizar la marca. Intente nuevamente.',
        type: 'error'
      });
    }
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
    <>
      <div className="crud-form-container">
        <div className="crud-form-header">
          <h1>Editando: {formData.nombre}</h1>
        </div>
        
        <div className="crud-form-content" style={{ padding: '0px' }}>
          <form onSubmit={handleSubmit}>
            <div className="crud-form-section">
              <div className="crud-form-group">
                <label htmlFor="nombre">Nombre <span className="crud-required">*</span></label>
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

              <div className="crud-form-group width"> 
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion || ''}
                  onChange={handleChange}
                  rows="3"
                  className="crud-input crud-textarea"
                  placeholder="Descripción de la marca..."
                />
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
                  <option value="activa">Activa</option>
                  <option value="inactiva">Inactiva</option>
                </select>
              </div>
            </div>

            <div className="crud-form-actions">
              <button 
                type="button" 
                className="crud-btn crud-btn-secondary"
                onClick={() => navigate('/admin/compras/marcas')}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="crud-btn crud-btn-primary"
              >
                Actualizar Marca
              </button>
            </div>
          </form>
        </div>
      </div>

      <CrudNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={handleCloseNotification}
      />
    </>
  );
}