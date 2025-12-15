import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductoById } from '../../../../lib/data/productosData';
import "../../../../shared/styles/components/crud-forms.css";

// Función para formatear números con puntos (igual que en CrearProducto)
const formatToPesos = (value) => {
  if (!value && value !== 0) return '';
  const digits = value.toString().replace(/\D/g, '');
  if (!digits) return value.toString();
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    const productoData = getProductoById(Number(id));
    setProducto(productoData);
  }, [id]);

  if (!producto) {
    return <div className="crud-form-container" style={{ padding: '32px' }}>Cargando...</div>;
  }

  // Mapeo de estado a texto legible
  const getEstadoText = (estado) => {
    switch(estado) {
      case 'activo': return 'Activo';
      case 'inactivo': return 'Inactivo';
      case 'bajo-stock': return 'Bajo Stock';
      default: return estado;
    }
  };

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle de Producto</h1>
      </div>
      
      <div className="crud-form-content" style={{  padding: '0px' }}>
        <form>
          <div className="crud-form-section"  >
            <div className="crud-form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={producto.nombre || ''}
                disabled
                className="crud-input"
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="categoria">Categoría</label>
              <input
                type="text"
                id="categoria"
                name="categoria"
                value={producto.categoria || ''}
                disabled
                className="crud-input"
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="marca">Marca</label>
              <input
                type="text"
                id="marca"
                name="marca"
                value={producto.marca || ''}
                disabled
                className="crud-input"
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="precioVenta">Precio Venta</label>
              <input
                type="text"
                id="precioVenta"
                name="precioVenta"
                value={formatToPesos(producto.precioVenta) || ''}
                disabled
                className="crud-input"
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="precioCompra">Precio Compra</label>
              <input
                type="text"
                id="precioCompra"
                name="precioCompra"
                value={formatToPesos(producto.precioCompra) || ''}
                disabled
                className="crud-input"
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="stockActual">Stock Actual</label>
              <input
                type="text"
                id="stockActual"
                name="stockActual"
                value={producto.stockActual || ''}
                disabled
                className="crud-input"
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="stockMinimo">Stock Mínimo</label>
              <input
                type="text"
                id="stockMinimo"
                name="stockMinimo"
                value={producto.stockMinimo || ''}
                disabled
                className="crud-input"
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="estado">Estado</label>
              <input
                type="text"
                id="estado"
                name="estado"
                value={getEstadoText(producto.estado) || ''}
                disabled
                className="crud-input"
              />
            </div>

            <div className="crud-form-group full-width">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={producto.descripcion || ''}
                disabled
                rows="2"
                className="crud-input crud-textarea"
              />
            </div>
          </div>

          <div className="crud-form-actions" >
            <button
              type="button"
              className="crud-btn crud-btn-secondary"
              onClick={() => navigate('/admin/compras/productos')}
            >
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}