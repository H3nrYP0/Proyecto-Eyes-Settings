import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField } from '@mui/material';
import { getMarcaById, updateMarca } from "../../../../lib/data/marcasData";
import "../../../../shared/styles/components/crud-forms.css";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification"
export default function EditarMarca() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'activa'
  });

  const [errors, setErrors] = useState({});

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
    
    // Validaciones
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
    
    // Actualizar en la base de datos
    updateMarca(Number(id), formData);
    navigate('/admin/compras/marcas');
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

            {/* Descripción */}
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

            {/* Estado - Mantener en edición */}
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
              >
                <option value="activa">Activa</option>
                <option value="inactiva">Inactiva</option>
              </TextField>
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
              Actualizar Marca
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}