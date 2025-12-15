import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMarca } from '../../../../lib/data/marcasData';
import "../../../../shared/styles/components/crud-forms.css";

import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification"

export default function CrearMarca() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'activa'
  });

  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const handleCloseNotification = () => {
    setNotification({ ...notification, isVisible: false });
  };

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

    try {
      const nuevaMarca = createMarca(formData);
      console.log('Marca creada:', nuevaMarca);

      setNotification({
        isVisible: true,
        message: '¡Marca creada con éxito!',
        type: 'success'
      });

      setTimeout(() => {
        navigate('/admin/compras/marcas');
      }, 2000);

    } catch (error) {
      setNotification({
        isVisible: true,
        message: 'Error al crear la marca. Intente nuevamente.',
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

  return (
    <>
      <div className="crud-form-container">
        <div className="crud-form-header">
          <h1>Crear Nueva Marca</h1>
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
                  placeholder="Ej: Ray-Ban, Oakley, etc."
                  required
                />
              </div>

              <div className="crud-form-group ">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="3"
                  className="crud-input crud-textarea"
                  placeholder="Descripción de la marca..."
                />
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
              <button type="submit" className="crud-btn crud-btn-primary">
                Crear Marca
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