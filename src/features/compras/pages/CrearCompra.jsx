import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Box,
  Grid,

} from '@mui/material';
import { createCompra } from '../../../lib/data/comprasData';
import { getAllProductos } from '../../../lib/data/productosData';
import "../../../shared/styles/components/crud-forms.css";
import CrudNotification from "../../../shared/styles/components/notifications/CrudNotification";
import { getProveedoresActivos } from "../../../lib/data/proveedoresData"

export default function CrearCompra() {
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);
  const [proveedoresActivos, setProveedoresActivos] = useState([]);
  const [formData, setFormData] = useState({
    proveedorNombre: '',
    fecha: new Date().toISOString().split('T')[0],
    productos: []
  });
  const [productoActual, setProductoActual] = useState({
    id: '',
    nombre: "",
    cantidad: 1,
    precioUnitario: 0
  });

  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    const productosList = getAllProductos().filter(p => p.estado === 'activo');
    setProductos(productosList);
    const proveedoresList = getProveedoresActivos();
    setProveedoresActivos(proveedoresList);
    setLoading(false);
  }, []);

  const handleCloseNotification = () => {
    setNotification({ ...notification, isVisible: false });
  };

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

    if (!formData.proveedorNombre.trim()) {
      setErrors({ proveedorNombre: 'El nombre del proveedor es requerido' });
      return;
    }

    if (formData.productos.length === 0) {
      setErrors({ productos: 'La compra debe tener al menos un producto' });
      return;
    }

    const { subtotal, iva, total } = calcularTotales(formData.productos);

    try {
      const nuevaCompra = createCompra({
        ...formData,
        subtotal,
        iva,
        total,
        estado: "Completada"
      });

      setNotification({
        isVisible: true,
        message: '¡Compra creada con éxito!',
        type: 'success'
      });

      setTimeout(() => {
        navigate('/admin/compras');
      }, 2000);

    } catch (error) {
      setNotification({
        isVisible: true,
        message: 'Error al crear la compra. Intente nuevamente.',
        type: 'error'
      });
    }
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

  if (loading) {
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
    <>
      <div className="crud-form-container">
        <div className="crud-form-header">
          <h1>Crear Nueva Compra</h1>
        </div>

        <div className="crud-form-content">
          <form onSubmit={handleSubmit}>
            {/* Información básica */}
            <div className="crud-form-section">

              <div className="crud-form-group">
                <FormControl fullWidth error={!!errors.proveedorNombre} required>
                  <InputLabel style={{ fontWeight: 'normal' }}>
                    Proveedor
                  </InputLabel>
                  <Select
                    name="proveedorNombre"
                    value={formData.proveedorNombre}
                    onChange={handleChange}
                    label="Proveedor"
                  >
                    <MenuItem value="">
                      <em>Seleccione un proveedor</em>
                    </MenuItem>
                    {proveedoresActivos.map((proveedor) => (
                      <MenuItem
                        key={proveedor.id}
                        value={proveedor.razon_social_o_Nombre}  // ✅ Usa el nombre como valor
                      >
                        {proveedor.razon_social_o_Nombre}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.proveedorNombre && (
                    <FormHelperText error>{errors.proveedorNombre}</FormHelperText>
                  )}
                </FormControl>
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

              {/* Fila 1: Producto, Cantidad, Precio Unitario */}
              <div className="crud-form-group full">
                   {formData.productos.length === 0 && (
    <button
      type="button"
      onClick={() => navigate('/admin/compras')}
       className="crud-btn crud-btn-secondary"
      style={{
         width: '200px',
         height: '50px',
         fontSize: '14px',
         marginRight: '90px',
         marginLeft: 'auto', 
      }}
    >
      Volver atrás
    </button>
  )}

              </div>
              {/*aca inica los tres campos y el boton que debo de poner en la misma linea   */}
                  {/* Botón "Volver atrás" temporal: solo visible si no hay productos */}

              <div className="crud-row-4">
                  
                <FormControl fullWidth error={!!errors.producto}>
                  <InputLabel style={{ fontWeight: 'normal' }}>
                    Seleccionar Producto
                  </InputLabel>
                  <Select
                    value={productoActual.id}
                    onChange={handleProductoChange}
                    label="Seleccionar Producto"

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
                

                <TextField
                  fullWidth
                  label="Cantidad"
                  type="number"
                  value={productoActual.cantidad}
                  onChange={handleCantidadChange}
                  inputProps={{ min: "1" }}
                />

                <TextField
                  fullWidth
                  label="Precio Unitario"
                  type="number"
                  value={productoActual.precioUnitario}
                  inputProps={{ readOnly: true }}
                />

                <button
                  type="button"
                  onClick={agregarProducto}
                  className="crud-btn crud-btn-primary"
                >
                  Agregar
                </button>

              </div>
              {/* aca se cierra los 3 campos y el botón que necesito en la misma linea  */}
              
            </div>

  {/* Volver atrás - SOLO si no hay productos */}
 
            {/* Lista de productos y Totales - En una fila */}
            {formData.productos.length > 0 && (
              <div className="crud-form-section" style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr', // 2/3 para productos, 1/3 para totales
                gap: '24px',
                marginTop: '24px'
              }}>

                {/* Columna 1: Productos */}
                <div>
                  <h4 style={{
                    color: 'var(--gray-800)',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    margin: '0 0 16px 0'
                  }}>
                    Productos en la Compra
                  </h4>
                  <div className="crud-products-section">
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
                </div>

                {/* Columna 2: Totales */}
                <div style={{
                  backgroundColor: 'var(--gray-50)',
                  border: '1px solid var(--gray-200)',
                  borderRadius: '8px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <h3 style={{
                    margin: '0 0 16px 0',
                    color: 'var(--gray-800)',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    borderBottom: '1px solid var(--gray-300)',
                    paddingBottom: '12px'
                  }}>
                    Resumen de la Compra
                  </h3>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>IVA (19%):</span>
                    <span>{formatCurrency(iva)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    <span>Total:</span>
                    <span>{formatCurrency(total)}</span>
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
                      Crear Compra
                    </button>
                  </div>
                </div>
              </div>
            )}


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