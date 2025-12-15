import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductoById, updateProducto } from "../../../../lib/data/productosData";
import { 
  TextField, 
  MenuItem
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import "../../../../shared/styles/components/crud-forms.css";
import { formatToPesos, parseFromPesos } from '../../../../shared/utils/formatCOP';

// 👇 IMPORTACIÓN DEL COMPONENTE DE NOTIFICACIÓN
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";

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
    estado: 'activo'
  });

  const [imagenes, setImagenes] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const categorias = [
    { value: '', label: 'Seleccionar categoría' },
    { value: 'Monturas', label: 'Monturas' },
    { value: 'Lentes de Sol', label: 'Lentes de Sol' },
    { value: 'Lentes de Contacto', label: 'Lentes de Contacto' },
    { value: 'Accesorios', label: 'Accesorios' },
    { value: 'Cristales', label: 'Cristales' },
    { value: 'Armazones', label: 'Armazones' },
    { value: 'Estuches', label: 'Estuches' },
    { value: 'Líquidos', label: 'Líquidos para lentes' }
  ];

  const marcas = [
    { value: '', label: 'Seleccionar marca' },
    { value: 'Ray-Ban', label: 'Ray-Ban' },
    { value: 'Oakley', label: 'Oakley' },
    { value: 'Prada', label: 'Prada' },
    { value: 'Gucci', label: 'Gucci' },
    { value: 'Versace', label: 'Versace' },
    { value: 'Dolce & Gabbana', label: 'Dolce & Gabbana' },
    { value: 'Tom Ford', label: 'Tom Ford' },
    { value: 'Maui Jim', label: 'Maui Jim' },
    { value: 'Carrera', label: 'Carrera' },
    { value: 'Police', label: 'Police' },
    { value: 'Vogue', label: 'Vogue' },
    { value: 'Arnette', label: 'Arnette' },
    { value: 'Emporio Armani', label: 'Emporio Armani' },
    { value: 'Michael Kors', label: 'Michael Kors' },
    { value: 'Bvlgari', label: 'Bvlgari' },
    { value: 'Dior', label: 'Dior' },
    { value: 'Fendi', label: 'Fendi' },
    { value: 'Hugo Boss', label: 'Hugo Boss' },
    { value: 'Lacoste', label: 'Lacoste' },
    { value: 'Nike', label: 'Nike' },
    { value: 'Adidas', label: 'Adidas' },
    { value: 'Puma', label: 'Puma' },
    { value: 'Reebok', label: 'Reebok' },
    { value: 'Under Armour', label: 'Under Armour' },
    { value: 'Otra', label: 'Otra' }
  ];

  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [precioVentaFormatted, setPrecioVentaFormatted] = useState('');
  const [precioCompraFormatted, setPrecioCompraFormatted] = useState('');

  // 👇 ELIMINAMOS setError y usamos notification
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // 👇 NUEVO: Guardamos el estado original para comparar cambios
  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precioVenta: '',
    precioCompra: '',
    stockActual: '',
    stockMinimo: '',
    categoria: '',
    marca: '',
    estado: 'activo',
  });

  // Cargar marcas y categorías
  useEffect(() => {
    const marcasList = getAllMarcas();
    const marcasActivas = marcasList.filter(marca => marca.estado === 'activa');
    setMarcas(marcasActivas);

    const categoriasList = getAllCategorias();
    const categoriasActivas = categoriasList.filter(categoria => categoria.estado === 'activa');
    setCategorias(categoriasActivas);
  }, []);

  // Cargar datos del producto
  useEffect(() => {
    if (!id) return;
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
        estado: producto.estado || 'activo'
      });
      
      if (producto.imagenes && Array.isArray(producto.imagenes)) {
        setImagePreviews(producto.imagenes.map(img => img.url).filter(url => url));
      }
    } else {
      navigate('/admin/compras/productos');
    }
    setLoadingData(false);
  }, [id, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (!formData.codigo.trim()) {
      newErrors.codigo = 'El código es requerido';
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
      const firstError = Object.keys(validationErrors)[0];
      document.getElementById(firstError)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    try {
      setLoading(true);
      
      // Calcular estado basado en stock
      const stockActualNum = parseInt(formData.stockActual);
      const stockMinimoNum = parseInt(formData.stockMinimo);
      let estadoFinal = formData.estado;
      
      if (stockActualNum <= stockMinimoNum && stockActualNum > 0) {
        estadoFinal = 'bajo-stock';
      } else if (stockActualNum === 0) {
        estadoFinal = 'inactivo';
      } else if (stockActualNum > stockMinimoNum) {
        estadoFinal = 'activo';
      }

      const imagenesProcesadas = await Promise.all(
        imagenes.map(async (imagen, index) => {
          return {
            url: imagePreviews[imagePreviews.length - imagenes.length + index],
            orden: index + 1,
            principal: index === 0
          };
        })
      );
      
      // Conservar imágenes existentes
      const todasLasImagenes = [
        ...imagePreviews.slice(0, imagePreviews.length - imagenes.length).map((url, index) => ({
          url,
          orden: index + 1,
          principal: index === 0
        })),
        ...imagenesProcesadas
      ];

      const productoActualizado = {
        nombre: formData.nombre.trim(),
        codigo: formData.codigo.trim(),
        descripcion: formData.descripcion.trim(),
        precioVenta: parseFloat(formData.precioVenta),
        precioCompra: parseFloat(formData.precioCompra),
        stockActual: stockActualNum,
        stockMinimo: stockMinimoNum,
        categoria: formData.categoria,
        marca: formData.marca,
        estado: estadoFinal,
        imagenes: todasLasImagenes,
        fechaActualizacion: new Date().toISOString(),
        actualizadoPor: 'admin'
      };

      updateProducto(Number(id), productoActualizado);
      
      navigate('/admin/compras/productos');
      
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      setErrors({ general: 'Error al actualizar el producto. Intente nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
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
    // Si es una imagen nueva, eliminarla también del array de imágenes
    if (index >= imagePreviews.length - imagenes.length) {
      const imageIndex = index - (imagePreviews.length - imagenes.length);
      setImagenes(prev => prev.filter((_, i) => i !== imageIndex));
    }
  };

  if (loadingData) {
    return (
      <CrudLayout>
        <div className="crud-form-container">Cargando...</div>
      </CrudLayout>
    );
  }

  return (
    <CrudLayout>
      <div className="crud-form-container">
        <div className="crud-form-header">
          <h1>Editar Producto</h1>
        </div>

        <div className="crud-form-content" style={{ padding: '0px' }}>
          <form onSubmit={handleSubmit}>
            <div className="crud-form-section">
              <div className="crud-form-row">
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
                    sx={{ margin: 0 }}
                  />
                </div>
                
                <div className="crud-form-group">
                  <TextField
                    fullWidth
                    label="Código SKU"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleChange}
                    required
                    variant="outlined"
                    error={!!errors.codigo}
                    helperText={errors.codigo}
                    InputLabelProps={{ style: { fontWeight: 'normal' } }}
                    sx={{ margin: 0 }}
                  />
                </div>
              </div>

              <div className="crud-form-row">
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
                    sx={{ margin: 0 }}
                  >
                    {categorias.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                
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
                    sx={{ margin: 0 }}
                  >
                    {marcas.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </div>

              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Descripción"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  multiline
                  variant="outlined"
                  error={!!errors.descripcion}
                  helperText={errors.descripcion}
                  InputLabelProps={{ style: { fontWeight: 'normal' } }}
                  sx={{ margin: 0 }}
                />
              </div>

              <div className="crud-form-row">
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
                    inputProps={{ 
                      inputMode: 'decimal',
                      pattern: '[0-9]*\.?[0-9]*'
                    }}
                    sx={{ margin: 0 }}
                  />
                </div>
                
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
                    inputProps={{ 
                      inputMode: 'decimal',
                      pattern: '[0-9]*\.?[0-9]*'
                    }}
                    sx={{ margin: 0 }}
                  />
                </div>
              </div>

              <div className="crud-form-row">
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
                    inputProps={{ 
                      inputMode: 'numeric',
                      pattern: '[0-9]*'
                    }}
                    sx={{ margin: 0 }}
                  />
                </div>
                
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
                    inputProps={{ 
                      inputMode: 'numeric',
                      pattern: '[0-9]*'
                    }}
                    sx={{ margin: 0 }}
                  />
                </div>
              </div>

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
                  sx={{ margin: 0 }}
                >
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="inactivo">Inactivo</MenuItem>
                  <MenuItem value="bajo-stock">Bajo Stock</MenuItem>
                </TextField>
              </div>

              <div className="crud-form-group" style={{ marginTop: '16px' }}>
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
                  <div className="error-text">
                    {errors.imagenes}
                  </div>
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
              </div>

              <div className="crud-form-group full-width">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows="2"
                  className="crud-input crud-textarea"
                  placeholder="Descripción del producto..."
                />
              </div>

            </div>

            {/* 👇 NO mostramos errores aquí porque usamos notificaciones */}
            <div className="crud-form-actions">
              <button 
                type="button" 
                className="crud-btn crud-btn-secondary"
                onClick={() => navigate('/admin/compras/productos')}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="crud-btn crud-btn-primary"
                disabled={loading}
              >
                {loading ? 'Actualizando...' : 'Actualizar Producto'}
              </button>
            </div>
            
            {errors.general && (
              <div className="general-error">
                {errors.general}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* 👇 NOTIFICACIÓN REUTILIZABLE */}
      <CrudNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={handleCloseNotification}
      />
    </>
  );
}