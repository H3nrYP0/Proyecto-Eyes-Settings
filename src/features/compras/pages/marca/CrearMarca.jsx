import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMarca } from '../../../../lib/data/marcasData';
import { TextField } from '@mui/material';
import "../../../../shared/styles/components/crud-forms.css";

export default function CrearMarca() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'activa'
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre de la marca es requerido';
    } else if (formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const nuevaMarca = createMarca({
      ...formData,
      estado: 'activa'
    });
    console.log('Marca creada:', nuevaMarca);
    navigate('/admin/compras/marcas');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
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
        <h1>Crear Nueva Marca</h1>
      </div>
      
      <div className="crud-form-content">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section">          
            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Nombre de la Marca"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Ray-Ban, Oakley, etc."
                required
                variant="outlined"
                error={!!errors.nombre}
                helperText={errors.nombre}
                InputLabelProps={{
                  style: { fontWeight: 'normal' }
                }}
              />
            </div>

            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                multiline
                placeholder="Descripción de la marca..."
                required
                variant="outlined"
                error={!!errors.descripcion}
                helperText={errors.descripcion}
                InputLabelProps={{
                  style: { fontWeight: 'normal' }
                }}
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
  );
}