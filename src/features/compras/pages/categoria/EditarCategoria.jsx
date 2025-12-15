import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField } from '@mui/material';
import { getCategoriaById, updateCategoria } from "../../../../lib/data/categoriasData";
import "../../../../shared/styles/components/crud-forms.css";

export default function EditarCategoria() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'activa'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const categoria = getCategoriaById(Number(id));
    if (categoria) {
      setFormData(categoria);
    } else {
      navigate('/admin/compras/categorias');
    }
  }, [id, navigate]);

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
    
    // Actualizar en la base de datos
    updateCategoria(Number(id), formData);
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

  if (!formData.nombre) {
    return <div>Cargando...</div>;
  }

  return (
  <div className="crud-form-container">
    <div className="crud-form-header">
      <h1>Editando: {formData.nombre}</h1>
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

          {/* Estado - Corrección: agregar SelectProps */}
          <div className="crud-form-group">
            <TextField
              select
              fullWidth
              label="Estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{
                style: { fontWeight: 'normal' }
              }}
              SelectProps={{
                native: true, // Para usar option nativo
              }}
            >
              <option value="activa">Activa</option>
              <option value="inactiva">Inactiva</option>
            </TextField>
          </div>

          {/* Campo vacío opcional para emparejar grid de 2 columnas */}
          <div className="crud-form-group empty-pair">
            <div style={{ height: '56px' }}></div>
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
            Actualizar Categoría
          </button>
        </div>
      </form>
    </div>
  </div>
);
}