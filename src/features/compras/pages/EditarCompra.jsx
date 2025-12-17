import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  TextField, 
  Select, 
  MenuItem, 
  InputLabel,
  FormControl,
  FormHelperText
} from '@mui/material';
import { getCompraById, updateCompra } from "../../../lib/data/comprasData";
import { getAllProductos } from "../../../lib/data/productosData";
import "../../../shared/styles/components/crud-forms.css";

export default function EditarCompra() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);
  const [productoActual, setProductoActual] = useState({
    id: '',
    nombre: "",
    cantidad: 1,
    precioUnitario: 0
  });

  useEffect(() => {
    const productosList = getAllProductos().filter(p => p.estado === 'activo');
    setProductos(productosList);

    const compra = getCompraById(Number(id));
    if (compra) {
      setFormData(compra);
    } else {
      navigate('/admin/compras');
    }
    setLoading(false);
  }, [id, navigate]);

  const calcularTotales = (productos) => {
    const subtotal = productos.reduce((sum, prod) => sum + prod.total, 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;
    return { subtotal, iva, total };
  };

  const handleProductoChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      const producto = productos.find(p => p.id == selectedId);
      if (producto) {
        setProductoActual({
          id: producto.id,
          nombre: producto.nombre,
          cantidad: 1,
          precioUnitario: producto.precioCompra
        });
        setErrors(prev => ({ ...prev, producto: '' }));
        return;
      }
    }
    setProductoActual({
      id: '',
      nombre: "",
      cantidad: 1,
      precioUnitario: 0
    });
  };

  const agregarProducto = () => {
    if (!productoActual.id || productoActual.cantidad <= 0) {
      setErrors(prev => ({ ...prev, producto: 'Selecciona un producto y una cantidad válida' }));
      return;
    }

    const nuevoProducto = {
      id: Date.now(),
      nombre: productoActual.nombre,
      cantidad: parseInt(productoActual.cantidad),
      precioUnitario: parseInt(productoActual.precioUnitario),
      total: parseInt(productoActual.cantidad) * parseInt(productoActual.precioUnitario)
    };

    setFormData(prev => ({
      ...prev,
      productos: [...prev.productos, nuevoProducto]
    }));

    setProductoActual({ id: '', nombre: "", cantidad: 1, precioUnitario: 0 });
    setErrors(prev => ({ ...prev, producto: '' }));
  };

  const eliminarProducto = (productoId) => {
    setFormData(prev => ({
      ...prev,
      productos: prev.productos.filter(p => p.id !== productoId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.productos.length === 0) {
      setErrors({ productos: 'La compra debe tener al menos un producto' });
      return;
    }

    const { subtotal, iva, total } = calcularTotales(formData.productos);
    const compraActualizada = {
      ...formData,
      subtotal,
      iva,
      total
    };

    updateCompra(Number(id), compraActualizada);
    navigate('/admin/compras');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleCantidadChange = (e) => {
    setProductoActual({
      ...productoActual,
      cantidad: e.target.value
    });
    if (errors.producto) {
      setErrors({ ...errors, producto: '' });
    }
  };

  if (loading || !formData) {
    return (
      <div className="crud-form-container">
        <div className="crud-form-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Cargando...
          </div>
        </div>
      </div>
    );
  }

  const { subtotal, iva, total } = calcularTotales(formData.productos);

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Editar Compra</h1>
        <p>Actualizando: {formData.numeroCompra}</p>
      </div>
      
      <div className="crud-form-content">
        <form onSubmit={handleSubmit}>
          {/* Información básica */}
          <div className="crud-form-section">
            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Proveedor"
                name="proveedorNombre"
                value={formData.proveedorNombre}
                onChange={handleChange}
                required
                variant="outlined"
                error={!!errors.proveedorNombre}
                helperText={errors.proveedorNombre}
                InputLabelProps={{ style: { fontWeight: 'normal' } }}
              />
            </div>

            <div className="crud-form-group">
              <TextField
                fullWidth
                label="Fecha"
                name="fecha"
                type="date"
                value={formData.fecha}
                onChange={handleChange}
                required
                variant="outlined"
                InputLabelProps={{ 
                  shrink: true,
                  style: { fontWeight: 'normal' } 
                }}
              />
            </div>
          </div>

          {/* Agregar productos */}
          <div className="crud-form-section">
            <h3 style={{ 
              gridColumn: '1 / -1', 
              margin: '0 0 24px 0',
              color: 'var(--gray-800)',
              fontSize: '1.2rem',
              fontWeight: '600',
              paddingBottom: '12px',
              borderBottom: '2px solid var(--primary-color)'
            }}>
              Productos de la Compra
            </h3>
            
            <div className="crud-form-group">
              <FormControl fullWidth error={!!errors.producto}>
                <InputLabel style={{ fontWeight: 'normal' }}>
                  Seleccionar Producto
                </InputLabel>
                <Select
                  value={productoActual.id}
                  onChange={handleProductoChange}
                  label="Seleccionar Producto"
                  required
                >
                  <MenuItem value="">Selecciona un producto</MenuItem>
                  {productos.map(producto => (
                    <MenuItem key={producto.id} value={producto.id}>
                      {producto.nombre}
                    </MenuItem>
                  ))}
                </Select>
                {errors.producto && (
                  <FormHelperText error>{errors.producto}</FormHelperText>
                )}
              </FormControl>
            </div>

            <div className="crud-form-row">
              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Cantidad"
                  type="number"
                  value={productoActual.cantidad}
                  onChange={handleCantidadChange}
                  InputLabelProps={{ style: { fontWeight: 'normal' } }}
                  inputProps={{ min: "1" }}
                />
              </div>

              <div className="crud-form-group">
                <TextField
                  fullWidth
                  label="Precio Unitario"
                  type="number"
                  value={productoActual.precioUnitario}
                  InputLabelProps={{ style: { fontWeight: 'normal' } }}
                  inputProps={{ readOnly: true, style: { backgroundColor: '#f5f5f5' } }}
                  helperText="Precio de compra asignado automáticamente"
                />
              </div>
            </div>

            <div className="crud-form-group">
              <button 
                type="button" 
                onClick={agregarProducto} 
                className="crud-btn crud-btn-secondary"
                style={{ width: '100%', height: '56px' }}
              >
                ➕ Agregar Producto
              </button>
              {errors.productos && (
                <FormHelperText error style={{ marginTop: '8px' }}>{errors.productos}</FormHelperText>
              )}
            </div>

            {/* Lista de productos existentes */}
            {formData.productos.length > 0 && (
              <div className="crud-products-section" style={{ gridColumn: '1 / -1' }}>
                <h4 style={{ marginBottom: '16px', color: 'var(--gray-800)' }}>Productos en la Compra</h4>
                <table className="crud-products-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio Unitario</th>
                      <th>Total</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.productos.map(producto => (
                      <tr key={producto.id}>
                        <td>{producto.nombre}</td>
                        <td>{producto.cantidad}</td>
                        <td>{formatCurrency(producto.precioUnitario)}</td>
                        <td>{formatCurrency(producto.total)}</td>
                        <td>
                          <button 
                            type="button"
                            onClick={() => eliminarProducto(producto.id)}
                            className="crud-btn crud-btn-delete"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Totales */}
          <div className="crud-form-section">
            <h3 style={{ 
              gridColumn: '1 / -1', 
              margin: '0 0 24px 0',
              color: 'var(--gray-800)',
              fontSize: '1.2rem',
              fontWeight: '600',
              paddingBottom: '12px',
              borderBottom: '2px solid var(--primary-color)'
            }}>
              Totales
            </h3>
            <div className="crud-totals" style={{ gridColumn: '1 / -1' }}>
              <div className="crud-total-item">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="crud-total-item">
                <span>IVA (19%):</span>
                <span>{formatCurrency(iva)}</span>
              </div>
              <div className="crud-total-item crud-total-final">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <div className="crud-form-actions">
            <button 
              type="button" 
              className="crud-btn crud-btn-secondary"
              onClick={() => navigate('/admin/compras')}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="crud-btn crud-btn-primary"
            >
              Actualizar Compra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}