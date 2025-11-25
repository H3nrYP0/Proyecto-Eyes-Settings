import { useLocation, useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import "../../../../shared/styles/components/Products.css";

export default function DetalleProducto() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener los datos del producto desde el state de navegación
  const { productData } = location.state || {};

  // Si no hay datos, mostrar mensaje de error
  if (!productData) {
    return (
      <CrudLayout
        title="👁️ Detalle del Producto"
        description="Producto no encontrado"
        showAddButton={false}
      >
        <div className="formulario-container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>❌ Producto no encontrado</h3>
            <p>No se pudo cargar la información del producto.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate("/compras/productos")}
            >
              ← Volver a Productos
            </button>
          </div>
        </div>
      </CrudLayout>
    );
  }

  // Usar los datos reales del producto seleccionado
  const producto = productData;

  // Función para formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP' 
    }).format(price);
  };

  // Función para volver a productos
  const handleVolver = () => {
    navigate(-1);
  };

  return (
    <CrudLayout
      title="👁️ Detalle del Producto"
      description={`Información de: ${producto.name}`}
      showAddButton={false}
    >
      <div className="formulario-container">
        <div className="formulario-header">
          <h3>📦 {producto.name}</h3>
          <p>Detalles completos del producto seleccionado</p>
        </div>

        {/* FORMULARIO CON LOS DATOS REALES DEL PRODUCTO */}
        <form onSubmit={(e) => e.preventDefault()}>
          {/* SECCIÓN: NOMBRE Y CATEGORÍA */}
          <div className="formulario-row">
            <div className="formulario-group">
              <label className="formulario-label">Nombre del Producto</label>
              <input
                type="text"
                className="formulario-control"
                value={producto.name}
                disabled
              />
            </div>

            <div className="formulario-group">
              <label className="formulario-label">Categoría</label>
              <input
                type="text"
                className="formulario-control"
                value="Óptica" // Valor por defecto
                disabled
              />
            </div>
          </div>

          {/* SECCIÓN: PRECIOS */}
          <div className="formulario-row">
            <div className="formulario-group">
              <label className="formulario-label">Precio de Venta</label>
              <input
                type="text"
                className="formulario-control"
                value={formatPrice(producto.salePrice)}
                disabled
              />
            </div>

            <div className="formulario-group">
              <label className="formulario-label">Precio de Compra</label>
              <input
                type="text"
                className="formulario-control"
                value="No disponible" // No existe en datos actuales
                disabled
              />
            </div>
          </div>

          {/* SECCIÓN: STOCK */}
          <div className="formulario-row">
            <div className="formulario-group">
              <label className="formulario-label">Stock Actual</label>
              <input
                type="text"
                className={`formulario-control ${producto.currentStock <= 10 ? 'stock-low' : ''}`}
                value={`${producto.currentStock} unidades`}
                disabled
              />
            </div>

            <div className="formulario-group">
              <label className="formulario-label">Stock Mínimo</label>
              <input
                type="text"
                className="formulario-control"
                value="10 unidades" // Valor por defecto
                disabled
              />
            </div>
          </div>

          {/* SECCIÓN: MARCA Y ESTADO */}
          <div className="formulario-row">
            <div className="formulario-group">
              <label className="formulario-label">Marca</label>
              <input
                type="text"
                className="formulario-control"
                value="Óptica Premium" // Valor por defecto
                disabled
              />
            </div>

            <div className="formulario-group">
              <label className="formulario-label">Estado</label>
              <input
                type="text"
                className="formulario-control"
                value={producto.status === 'active' ? 'Activo' : 
                       producto.status === 'inactive' ? 'Inactivo' : 
                       producto.status === 'low-stock' ? 'Bajo Stock' : 'Desconocido'}
                disabled
              />
            </div>
          </div>

          {/* BOTÓN PARA VOLVER */}
          <div className="formulario-actions">
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleVolver}
            >
              ← Volver a Productos
            </button>
          </div>
        </form>
      </div>
    </CrudLayout>
  );
}