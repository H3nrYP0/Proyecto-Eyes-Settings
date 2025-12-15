import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCategoria } from '../../../../lib/data/categoriasData';
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import "../../../../shared/styles/components/crud-forms.css";

export default function CrearCategoria() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'activa'
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre de la categoría es requerido';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Crear la categoría con estado por defecto "activa"
    const nuevaCategoria = createCategoria({
      ...formData,
      estado: 'activa'
    });
    console.log('Categoría creada:', nuevaCategoria);
    navigate('/admin/compras/categorias');
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
        <h1>Crear Nueva Categoría</h1>
      </div>
      
      <div className="crud-form-content">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section">          
            {/* Nombre */}
            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Nombre de la Categoría"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Lentes de Sol, Monturas, etc."
                required
                variant="outlined"
                error={!!errors.nombre}
                helperText={errors.nombre}
                InputLabelProps={{
                  style: { fontWeight: 'normal' }
                }}
              />
            </div>

            {/* Descripción */}
            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                multiline
                placeholder="Descripción de la categoría..."
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
              onClick={() => navigate('/admin/compras/categorias')}
            >
              Cancelar
            </button>
            <button type="submit" className="crud-btn crud-btn-primary">
              Crear Categoría
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}