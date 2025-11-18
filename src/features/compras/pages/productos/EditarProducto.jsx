import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import "../../../../shared/styles/components/Products.css";

export default function EditarProducto() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener los datos del producto desde el state de navegación
  const { productData } = location.state || {};

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    salePrice: 0,
    purchasePrice: 0,
    currentStock: 0,
    minStock: 10,
    category: "Óptica",
    brand: "Óptica Premium",
    status: "active"
  });

  // Estado para el modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Cargar datos del producto cuando el componente se monta
  useEffect(() => {
    if (productData) {
      setFormData({
        id: productData.id || "",
        name: productData.name || "",
        salePrice: productData.salePrice || 0,
        purchasePrice: productData.purchasePrice || 0,
        currentStock: productData.currentStock || 0,
        minStock: productData.minStock || 10,
        category: productData.category || "Óptica",
        brand: productData.brand || "Óptica Premium",
        status: productData.status || "active"
      });
    }
  }, [productData]);

  // Si no hay datos, mostrar mensaje de error
  if (!productData) {
    return (
      <CrudLayout
        title="✏️ Editar Producto"
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

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Aquí iría la lógica para actualizar el producto
    console.log("Producto actualizado:", formData);
    
    // Mostrar confirmación
    if (window.confirm(`¿Estás seguro de que quieres guardar los cambios en "${formData.name}"?`)) {
      // MOSTRAR MODAL DE ÉXITO
      setShowSuccessModal(true);
      
      // CERRAR AUTOMÁTICAMENTE DESPUÉS DE 2 SEGUNDOS Y REDIRIGIR
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate(-1); // REDIRIGIR A LA LISTA DE PRODUCTOS
      }, 2000);
    }
  };

  // Función para formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP' 
    }).format(price);
  };

  // Función para volver sin guardar
  const handleVolver = () => {
    if (window.confirm("¿Estás seguro de que quieres volver sin guardar los cambios?")) {
      navigate(-1);
    }
  };

  // Función para resetear formulario a valores originales
  const handleReset = () => {
    if (window.confirm("¿Restaurar los valores originales del producto?")) {
      setFormData({
        id: productData.id || "",
        name: productData.name || "",
        salePrice: productData.salePrice || 0,
        purchasePrice: productData.purchasePrice || 0,
        currentStock: productData.currentStock || 0,
        minStock: productData.minStock || 10,
        category: productData.category || "Óptica",
        brand: productData.brand || "Óptica Premium",
        status: productData.status || "active"
      });
    }
  };

  return (
    <CrudLayout
      title="✏️ Editar Producto"
      description={`Editando: ${productData.name}`}
      showAddButton={false}
    >
      <div className="formulario-container">
        <div className="formulario-header">
          <h3>📦 Editando: {productData.name}</h3>
          <p>Modifica la información del producto según sea necesario</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ID del producto (oculto) */}
          <input type="hidden" name="id" value={formData.id} />

          {/* SECCIÓN: NOMBRE Y CATEGORÍA */}
          <div className="formulario-row">
            <div className="formulario-group">
              <label className="formulario-label">Nombre del Producto *</label>
              <input
                type="text"
                name="name"
                className="formulario-control"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="formulario-group">
              <label className="formulario-label">Categoría</label>
              <select
                name="category"
                className="formulario-control formulario-select"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="Óptica">Óptica</option>
                <option value="Lentes de Sol">Lentes de Sol</option>
                <option value="Lentes de Contacto">Lentes de Contacto</option>
                <option value="Accesorios">Accesorios</option>
                <option value="Monturas">Monturas</option>
              </select>
            </div>
          </div>

          {/* SECCIÓN: PRECIOS */}
          <div className="formulario-row">
            <div className="formulario-group">
              <label className="formulario-label">Precio de Venta (COP) *</label>
              <input
                type="number"
                name="salePrice"
                className="formulario-control"
                value={formData.salePrice}
                onChange={handleInputChange}
                min="0"
                step="100"
                required
              />
              <small className="form-text">
                Valor: {formatPrice(formData.salePrice)}
              </small>
            </div>

            <div className="formulario-group">
              <label className="formulario-label">Precio de Compra (COP)</label>
              <input
                type="number"
                name="purchasePrice"
                className="formulario-control"
                value={formData.purchasePrice}
                onChange={handleInputChange}
                min="0"
                step="100"
              />
              <small className="form-text">
                Valor: {formatPrice(formData.purchasePrice)}
              </small>
            </div>
          </div>

          {/* SECCIÓN: STOCK */}
          <div className="formulario-row">
            <div className="formulario-group">
              <label className="formulario-label">Stock Actual *</label>
              <input
                type="number"
                name="currentStock"
                className="formulario-control"
                value={formData.currentStock}
                onChange={handleInputChange}
                min="0"
                required
              />
              {formData.currentStock <= formData.minStock && (
                <small className="form-text" style={{color: 'red'}}>
                  ⚠️ Stock por debajo del mínimo ({formData.minStock})
                </small>
              )}
            </div>

            <div className="formulario-group">
              <label className="formulario-label">Stock Mínimo</label>
              <input
                type="number"
                name="minStock"
                className="formulario-control"
                value={formData.minStock}
                onChange={handleInputChange}
                min="0"
              />
            </div>
          </div>

          {/* SECCIÓN: MARCA Y ESTADO */}
          <div className="formulario-row">
            <div className="formulario-group">
              <label className="formulario-label">Marca</label>
              <input
                type="text"
                name="brand"
                className="formulario-control"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="Ej: Ray-Ban, Oakley, etc."
              />
            </div>

            <div className="formulario-group">
              <label className="formulario-label">Estado</label>
              <select
                name="status"
                className="formulario-control formulario-select"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">🟢 Activo</option>
                <option value="inactive">🔴 Inactivo</option>
                <option value="low-stock">🟡 Bajo Stock</option>
              </select>
            </div>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="formulario-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleVolver}
            >
              ← Cancelar
            </button>
            
            <button 
              type="button" 
              className="btn btn-warning"
              onClick={handleReset}
            >
              🔄 Restaurar Original
            </button>
            
            <button 
              type="submit" 
              className="btn btn-success"
            >
              💾 Guardar Cambios
            </button>
          </div>
        </form>

        {/* MODAL DE ÉXITO - Mismo diseño que Agregar Producto */}
        {showSuccessModal && (
          <div className="modal-overlay">
            <div className="success-modal-content">
              <div className="success-icon">✅</div>
              <h3>Producto Actualizado!</h3>
              <p>El producto <strong>"{formData.name}"</strong> se ha actualizado exitosamente</p>
              <p className="redirect-message">Redirigiendo a productos...</p>
            </div>
          </div>
        )}
      </div>
    </CrudLayout>
  );
}