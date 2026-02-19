import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductoById, updateProducto } from "../../../../lib/data/productosData";
import { TextField, MenuItem } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import "../../../../shared/styles/components/crud-forms.css";
import CrudNotification from '../../../../shared/styles/components/notifications/CrudNotification';

// Importar desde la base de datos temporal
import { MarcaData } from '../../../../lib/data/marcasData';
import { getAllCategorias } from '../../../../lib/data/categoriasData';

export default function EditarProducto() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    descripcion: '',
    precioVenta: '',
    precioCompra: '',
    stockActual: '',
    stockMinimo: '',
    categoria: '',
    marca: '',
    estado: 'activo',
  });

  const [imagenes, setImagenes] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ isVisible: false, message: '', type: 'success' });

  const marcas = getAllMarcas().filter(m => m.estado === 'activa');
  const categorias = getAllCategorias().filter(c => c.estado === 'activa');

  useEffect(() => {
    if (!id) {
      navigate('../productos');
      return;
    }
    const producto = getProductoById(Number(id));
    if (producto) {
      setFormData({
        nombre: producto.nombre || '',
        codigo: producto.codigo || '',
        descripcion: producto.descripcion || '',
        precioVenta: producto.precioVenta?.toString() || '',
        precioCompra: producto.precioCompra?.toString() || '',
        stockActual: producto.stockActual?.toString() || '',
        stockMinimo: producto.stockMinimo?.toString() || '',
        categoria: producto.categoria || '',
        marca: producto.marca || '',
        estado: producto.estado || 'activo',
      });
      if (producto.imagenes && Array.isArray(producto.imagenes)) {
        setImagePreviews(producto.imagenes.map(img => img.url).filter(url => url));
      }
    } else {
      navigate('../productos');
    }
  }, [id, navigate]);

  useEffect(() => {
    if (notification.isVisible) {
      const timer = setTimeout(() => {
        setNotification({ isVisible: false, message: '', type: 'success' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification.isVisible]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

  

    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es requerida';
    }

    if (!formData.marca) {
      newErrors.marca = 'La marca es requerida';
    }

    if (!formData.precioVenta) {
      newErrors.precioVenta = 'El precio de venta es requerido';
    } else if (isNaN(formData.precioVenta) || Number(formData.precioVenta) <= 0) {
      newErrors.precioVenta = 'El precio de venta debe ser mayor a 0';
    }

    if (!formData.precioCompra) {
      newErrors.precioCompra = 'El precio de compra es requerido';
    } else if (isNaN(formData.precioCompra) || Number(formData.precioCompra) <= 0) {
      newErrors.precioCompra = 'El precio de compra debe ser mayor a 0';
    }

    if (formData.precioVenta && formData.precioCompra &&
      Number(formData.precioVenta) < Number(formData.precioCompra)) {
      newErrors.precioVenta = 'El precio de venta debe ser mayor al precio de compra';
    }

    if (formData.stockActual === '' || formData.stockActual === null) {
      newErrors.stockActual = 'El stock actual es requerido';
    } else if (isNaN(formData.stockActual) || Number(formData.stockActual) < 0) {
      newErrors.stockActual = 'El stock actual no puede ser negativo';
    }

    if (formData.stockMinimo === '' || formData.stockMinimo === null) {
      newErrors.stockMinimo = 'El stock mínimo es requerido';
    } else if (isNaN(formData.stockMinimo) || Number(formData.stockMinimo) < 0) {
      newErrors.stockMinimo = 'El stock mínimo no puede ser negativo';
    }

    if (formData.stockActual && formData.stockMinimo &&
      Number(formData.stockActual) < Number(formData.stockMinimo)) {
      newErrors.stockActual = 'El stock actual no puede ser menor al stock mínimo';
    }

    if (formData.descripcion && formData.descripcion.length > 500) {
      newErrors.descripcion = 'La descripción no debe exceder 500 caracteres';
    }

    if (imagenes.length + imagePreviews.length > 5) {
      newErrors.imagenes = 'Máximo 5 imágenes permitidas';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const nuevasImagenes = imagenes.map((_, index) => ({
        url: imagePreviews[imagePreviews.length - imagenes.length + index],
        orden: index + 1,
        principal: index === 0
      }));

      const imagenesExistentes = imagePreviews
        .slice(0, imagePreviews.length - imagenes.length)
        .map((url, index) => ({
          url,
          orden: index + 1,
          principal: index === 0
        }));

      const todasLasImagenes = [...imagenesExistentes, ...nuevasImagenes];

      const productoActualizado = {
        nombre: formData.nombre.trim(),
        codigo: formData.codigo.trim(),
        descripcion: formData.descripcion.trim(),
        precioVenta: parseFloat(formData.precioVenta),
        precioCompra: parseFloat(formData.precioCompra),
        stockActual: parseInt(formData.stockActual, 10),
        stockMinimo: parseInt(formData.stockMinimo, 10),
        categoria: formData.categoria,
        marca: formData.marca,
        estado: formData.estado,
        imagenes: todasLasImagenes,
        fechaActualizacion: new Date().toISOString(),
        actualizadoPor: 'admin'
      };

      updateProducto(Number(id), productoActualizado);

      setNotification({
        isVisible: true,
        message: 'Producto actualizado exitosamente',
        type: 'success'
      });

      setTimeout(() => {
        navigate('../productos', { replace: true });
      }, 1500);

    } catch (error) {
      console.error('Error al actualizar producto:', error);
      setNotification({
        isVisible: true,
        message: 'Error al actualizar el producto. Intente nuevamente.',
        type: 'error'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'precioVenta' || name === 'precioCompra') {
      processedValue = value.replace(/[^0-9.]/g, '');
      const parts = processedValue.split('.');
      if (parts.length > 2) {
        processedValue = parts[0] + '.' + parts.slice(1).join('');
      }
      if (parts[1] && parts[1].length > 2) {
        processedValue = parts[0] + '.' + parts[1].substring(0, 2);
      }
    }

    if (name === 'stockActual' || name === 'stockMinimo') {
      processedValue = value.replace(/[^0-9]/g, '');
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (imagenes.length + imagePreviews.length + files.length > 5) {
      setErrors(prev => ({ ...prev, imagenes: 'Máximo 5 imágenes permitidas' }));
      return;
    }

    files.forEach(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, imagenes: 'Solo se permiten imágenes JPG, PNG o WebP' }));
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, imagenes: 'Cada imagen debe ser menor a 2MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenes(prev => [...prev, file]);
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    if (errors.imagenes) {
      setErrors(prev => ({ ...prev, imagenes: '' }));
    }

    e.target.value = '';
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    if (index >= imagePreviews.length - imagenes.length) {
      const imageIndex = index - (imagePreviews.length - imagenes.length);
      setImagenes(prev => prev.filter((_, i) => i !== imageIndex));
    }
    if (errors.imagenes) {
      setErrors(prev => ({ ...prev, imagenes: '' }));
    }
  };

  const closeNotification = () => {
    setNotification({ isVisible: false, message: '', type: 'success' });
  };

  return (
    <>
      <CrudNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={closeNotification}
      />

      <div className="crud-form-container">
        <div className="crud-form-header">
          <h1>Editar Producto</h1>
        </div>

        <div className="crud-form-content">
          <form onSubmit={handleSubmit}>
            <div className="crud-form-section">

              {/* Nombre */}
              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Nombre del Producto"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  error={!!errors.nombre}
                  helperText={errors.nombre}
                  InputLabelProps={{ style: { fontWeight: 'normal' } }}
                />
              </div>

             
              {/* Categoría */}
              <div className="crud-form-group">
                <TextField
                  select
                  fullWidth
                  label="Categoría"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  error={!!errors.categoria}
                  helperText={errors.categoria}
                  InputLabelProps={{ style: { fontWeight: 'normal' } }}
                >
                  <MenuItem value="">Seleccionar categoría</MenuItem>
                  {categorias.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id.toString()}>
                      {cat.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              {/* Marca */}
              <div className="crud-form-group">
                <TextField
                  select
                  fullWidth
                  label="Marca"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  error={!!errors.marca}
                  helperText={errors.marca}
                  InputLabelProps={{ style: { fontWeight: 'normal' } }}
                >
                  <MenuItem value="">Seleccionar marca</MenuItem>
                  {marcas.map((marca) => (
                    <MenuItem key={marca.id} value={marca.id.toString()}>
                      {marca.nombre}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              {/* Precio Compra */}
              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Precio de Compra"
                  name="precioCompra"
                  type="text"
                  value={formData.precioCompra}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  error={!!errors.precioCompra}
                  helperText={errors.precioCompra}
                  InputLabelProps={{ style: { fontWeight: 'normal' } }}
                  inputProps={{ inputMode: 'decimal' }}
                />
              </div>

              {/* Precio Venta */}
              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Precio de Venta"
                  name="precioVenta"
                  type="text"
                  value={formData.precioVenta}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  error={!!errors.precioVenta}
                  helperText={errors.precioVenta}
                  InputLabelProps={{ style: { fontWeight: 'normal' } }}
                  inputProps={{ inputMode: 'decimal' }}
                />
              </div>

              {/* Stock Actual */}
              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Stock Actual"
                  name="stockActual"
                  type="text"
                  value={formData.stockActual}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  error={!!errors.stockActual}
                  helperText={errors.stockActual}
                  InputLabelProps={{ style: { fontWeight: 'normal' } }}
                  inputProps={{ inputMode: 'numeric' }}
                />
              </div>

              {/* Stock Mínimo */}
              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Stock Mínimo"
                  name="stockMinimo"
                  type="text"
                  value={formData.stockMinimo}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  error={!!errors.stockMinimo}
                  helperText={errors.stockMinimo}
                  InputLabelProps={{ style: { fontWeight: 'normal' } }}
                  inputProps={{ inputMode: 'numeric' }}
                />
              </div>

              {/* Estado */}
              <div className="crud-form-group">
                <TextField
                  select
                  fullWidth
                  label="Estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  variant="outlined"
                  InputLabelProps={{ style: { fontWeight: 'normal' } }}
                >
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="inactivo">Inactivo</MenuItem>
                  <MenuItem value="bajo-stock">Bajo Stock</MenuItem>
                </TextField>
              </div>

              {/* Descripción */}
              <div className="crud-form-group ">
                <TextField
                  fullWidth
                  label="Descripción"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  variant="outlined"
                  error={!!errors.descripcion}
                  helperText={errors.descripcion}
                  InputLabelProps={{ style: { fontWeight: 'normal' } }}
                />
              </div>

              {/* Imágenes */}
              <div className="crud-form-group full-width">
                <label htmlFor="image-upload" className="upload-image-label">
                  <div className="upload-image-content">
                    <AddPhotoAlternateIcon className="upload-image-icon" />
                    <div className="upload-image-text">
                      <div className="upload-image-title">Subir imágenes del producto</div>
                      <div className="upload-image-subtitle">Haz clic o arrastra imágenes aquí</div>
                      <div className="upload-image-info">
                        Formatos: JPG, PNG, WebP | Máx: 2MB c/u | Máx: 5 imágenes
                      </div>
                    </div>
                  </div>
                </label>

                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                />

                {errors.imagenes && (
                  <div className="crud-error">{errors.imagenes}</div>
                )}

                {imagePreviews.length > 0 && (
                  <div className="image-previews-container">
                    <div className="previews-header">
                      <span className="previews-title">
                        Imágenes ({imagePreviews.length}/5)
                      </span>
                    </div>
                    <div className="image-previews">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="image-preview-container">
                          <div className="image-preview-wrapper">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="image-preview"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="image-remove-btn"
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="crud-form-actions">
                  <button
                    type="button"
                    className="crud-btn crud-btn-secondary"
                    onClick={() => navigate('../productos')}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="crud-btn crud-btn-primary">
                    Actualizar Producto
                  </button>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
    </>
  );
}