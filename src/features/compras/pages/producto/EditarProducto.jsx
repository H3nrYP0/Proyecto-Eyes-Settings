import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductoById, updateProducto } from "../../../../lib/data/productosData";
import { getAllMarcas } from '../../../../lib/data/marcasData';
import { getAllCategorias } from '../../../../lib/data/categoriasData';
import "../../../../shared/styles/components/crud-forms.css";
import { formatToPesos, parseFromPesos } from '../../../../shared/utils/formatCOP';

// 👇 IMPORTACIÓN DEL COMPONENTE DE NOTIFICACIÓN
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";

export default function EditarProducto() {
  const navigate = useNavigate();
  const { id } = useParams();

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
      const data = {
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        precioVenta: producto.precioVenta || '',
        precioCompra: producto.precioCompra || '',
        stockActual: producto.stockActual || '',
        stockMinimo: producto.stockMinimo || '',
        categoria: producto.categoria || '',
        marca: producto.marca || '',
        estado: producto.estado || 'activo',
      };
      setFormData(data);
      setOriginalData({ ...data }); // 👈 Guardar copia original

      setPrecioVentaFormatted(formatToPesos(producto.precioVenta?.toString() || '0'));
      setPrecioCompraFormatted(formatToPesos(producto.precioCompra?.toString() || '0'));
    } else {
      navigate('/admin/compras/productos');
    }
  }, [id, navigate]);

  // 👇 Cerrar notificación
  const handleCloseNotification = () => {
    setNotification({ ...notification, isVisible: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const precioVentaNum = Number(formData.precioVenta);
    const precioCompraNum = Number(formData.precioCompra);

    // Validaciones
    if (precioCompraNum > precioVentaNum) {
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

    // 👇 VALIDACIÓN: No permitir guardar si no hay cambios
    if (originalData && JSON.stringify(formData) === JSON.stringify(originalData)) {
      setNotification({
        isVisible: true,
        message: 'No se han realizado cambios para guardar.',
        type: 'error'
      });
      return;
    }

    // Actualizar producto
    const productoActualizado = {
      ...formData,
      precioVenta: precioVentaNum,
      precioCompra: precioCompraNum,
      stockActual: Number(formData.stockActual),
      stockMinimo: Number(formData.stockMinimo),
    };

    updateProducto(Number(id), productoActualizado);

    // 👇 Notificación de éxito
    setNotification({
      isVisible: true,
      message: '¡Producto actualizado con éxito!',
      type: 'success'
    });

    // Redirigir después de 2 segundos
    setTimeout(() => {
      navigate('/admin/compras/productos');
    }, 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

    setFormData(prev => ({
      ...prev,
      [field]: cleanValue
    }));
  };

  if (!formData.nombre && formData.nombre !== '') {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <div className="crud-form-container">
        <div className="crud-form-header">
          <h1>Editando: {formData.nombre}</h1>
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

              <div className="crud-form-group">
                <label htmlFor="estado">Estado <span className="crud-required">*</span></label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="crud-input"
                  required
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="bajo-stock">Bajo Stock</option>
                </select>
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
              >
                Cancelar
              </button>
              <button type="submit" className="crud-btn crud-btn-primary">
                Actualizar Producto
              </button>
            </div>
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