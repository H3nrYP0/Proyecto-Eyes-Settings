import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProducto } from '../../../../lib/data/productosData';
import { getAllMarcas } from '../../../../lib/data/marcasData';
import { getAllCategorias } from '../../../../lib/data/categoriasData';
import "../../../../shared/styles/components/crud-forms.css";
import { formatToPesos, parseFromPesos } from '../../../../shared/utils/formatCOP';

// 👇 IMPORTA EL COMPONENTE DE NOTIFICACIÓN AQUÍ
import CrudNotification from '../../../../shared/styles/components/notifications/CrudNotification';

export default function CrearProducto() {
  const navigate = useNavigate();

  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [precioVentaFormatted, setPrecioVentaFormatted] = useState('');
  const [precioCompraFormatted, setPrecioCompraFormatted] = useState('');

  // 👇 ESTADO PARA LA NOTIFICACIÓN (ÉXITO O ERROR)
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success' // o 'error'
  });

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precioVenta: '',
    precioCompra: '',
    stockActual: '',
    stockMinimo: '',
    categoria: '',
    marca: '',
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

  // 👇 FUNCIÓN PARA CERRAR LA NOTIFICACIÓN
  const handleCloseNotification = () => {
    setNotification({ ...notification, isVisible: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const precioVentaNum = Number(formData.precioVenta);
    const precioCompraNum = Number(formData.precioCompra);

    // Validaciones
    if (precioCompraNum > precioVentaNum) {
      // 👇 MOSTRAR NOTIFICACIÓN DE ERROR EN VEZ DE ALERT
      setNotification({
        isVisible: true,
        message: 'El precio de compra no puede ser mayor que el precio de venta.',
        type: 'error'
      });
      return;
    }

    if (precioVentaNum <= 0 || precioCompraNum <= 0) {
      setNotification({
        isVisible: true,
        message: 'Los precios deben ser mayores que 0.',
        type: 'error'
      });
      return;
    }

    try {
      // Crear el producto
      const nuevoProducto = createProducto({
        ...formData,
        precioVenta: precioVentaNum,
        precioCompra: precioCompraNum,
        stockActual: Number(formData.stockActual),
        stockMinimo: Number(formData.stockMinimo),
        imagenes: []
      });

      console.log('Producto creado:', nuevoProducto);

      // 👇 MOSTRAR NOTIFICACIÓN DE ÉXITO
      setNotification({
        isVisible: true,
        message: '¡Producto creado con éxito!',
        type: 'success'
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/admin/compras/productos');
      }, 2000);

    } catch (error) {
      // 👇 MANEJO DE ERROR GENÉRICO
      setNotification({
        isVisible: true,
        message: 'Error al guardar el producto. Intente nuevamente.',
        type: 'error'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePrecioChange = (e, field) => {
    const rawValue = e.target.value;
    const cleanValue = parseFromPesos(rawValue);
    const formattedValue = formatToPesos(rawValue);

    if (field === 'precioVenta') {
      setPrecioVentaFormatted(formattedValue);
    } else if (field === 'precioCompra') {
      setPrecioCompraFormatted(formattedValue);
    }

    setFormData({
      ...formData,
      [field]: cleanValue
    });
  };

  return (
    <>
      {/* 👇 TU FORMULARIO EXISTENTE (SIN CAMBIOS) */}
      <div className="crud-form-container">
        <div className="crud-form-header">
          <h1>Crear Nuevo Producto</h1>
        </div>

        <div className="crud-form-content" style={{ padding: '0px' }}>
          <form onSubmit={handleSubmit}>
            <div className="crud-form-section">
              {/* ... todos tus campos ... (sin cambios) */}
              
              <div className="crud-form-group">
                <label htmlFor="nombre">Nombre <span className="crud-required">*</span></label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="crud-input"
                  required
                />
              </div>
              
              <div className="crud-form-group">
                <label htmlFor="categoria">Categoría <span className="crud-required">*</span></label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className="crud-input"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.nombre}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="crud-form-group">
                <label htmlFor="marca">Marca <span className="crud-required">*</span></label>
                <select
                  id="marca"
                  name="marca"
                  value={formData.marca}
                  onChange={handleInputChange}
                  className="crud-input"
                  required
                >
                  <option value="">Seleccionar marca</option>
                  {marcas.map((marca) => (
                    <option key={marca.id} value={marca.nombre}>
                      {marca.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="crud-form-group">
                <label htmlFor="precioVenta">Precio Venta <span className="crud-required">*</span></label>
                <input
                  type="text"
                  id="precioVenta"
                  name="precioVenta"
                  value={precioVentaFormatted}
                  onChange={(e) => handlePrecioChange(e, 'precioVenta')}
                  className="crud-input"
                  placeholder="0"
                  required
                />
              </div>

              <div className="crud-form-group">
                <label htmlFor="precioCompra">Precio Compra <span className="crud-required">*</span></label>
                <input
                  type="text"
                  id="precioCompra"
                  name="precioCompra"
                  value={precioCompraFormatted}
                  onChange={(e) => handlePrecioChange(e, 'precioCompra')}
                  className="crud-input"
                  placeholder="0"
                  required
                />
              </div>

              <div className="crud-form-group">
                <label htmlFor="stockActual">Stock Actual <span className="crud-required">*</span></label>
                <input
                  type="number"
                  id="stockActual"
                  name="stockActual"
                  value={formData.stockActual}
                  onChange={handleInputChange}
                  className="crud-input"
                  min="0"
                  required
                />
              </div>

              <div className="crud-form-group">
                <label htmlFor="stockMinimo">Stock Mínimo <span className="crud-required">*</span></label>
                <input
                  type="number"
                  id="stockMinimo"
                  name="stockMinimo"
                  value={formData.stockMinimo}
                  onChange={handleInputChange}
                  className="crud-input"
                  min="0"
                  required
                />
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

            <div className="crud-form-actions">
              <button
                type="button"
                className="crud-btn crud-btn-secondary"
                onClick={() => navigate('/admin/compras/productos')}
              >
                Cancelar
              </button>
              <button type="submit" className="crud-btn crud-btn-primary">
                Crear Producto
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 👇 RENDERIZA LA NOTIFICACIÓN AQUÍ, FUERA DEL FORMULARIO */}
      <CrudNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={handleCloseNotification}
      />
    </>
  );
}