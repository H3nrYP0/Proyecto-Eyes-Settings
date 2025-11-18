import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import "../../../../shared/styles/components/Products.css";

export default function AgregarProducto() {
  const navigate = useNavigate();
  
  // ESTADO PARA LOS DATOS DEL FORMULARIO
  const [formData, setFormData] = useState({
    nombre: "",
    precioVenta: "",
    precioCompra: "",
    stockActual: "",
    stockMinimo: "",
    categoria: "",
    marca: "",
    descripcion: "",
    estado: "active"
  });

  // ESTADO PARA LOS ERRORES DE VALIDACIÓN
  const [errors, setErrors] = useState({});
  
  // ESTADO PARA CONTROLAR EL MODAL DE ÉXITO
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // FUNCIÓN PARA MANEJAR CAMBIOS EN LOS CAMPOS DEL FORMULARIO
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // LIMPIAR ERROR DEL CAMPO CUANDO EL USUARIO EMPIECE A ESCRIBIR
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // FUNCIÓN PARA VALIDAR EL FORMULARIO
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre del producto es requerido";
    }

    if (!formData.precioVenta || parseFloat(formData.precioVenta) <= 0) {
      newErrors.precioVenta = "El precio de venta debe ser mayor a 0";
    }

    if (!formData.stockActual || parseInt(formData.stockActual) < 0) {
      newErrors.stockActual = "El stock actual no puede ser negativo";
    }

    if (!formData.categoria.trim()) {
      newErrors.categoria = "La categoría es requerida";
    }

    if (!formData.marca.trim()) {
      newErrors.marca = "La marca es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // FUNCIÓN PARA ENVIAR EL FORMULARIO
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // CONFIRMAR ANTES DE GUARDAR
      if (window.confirm("¿Estás seguro de que quieres guardar este producto?")) {
        console.log("Producto guardado:", formData);
        
        // MOSTRAR MODAL DE ÉXITO EN LUGAR DEL ALERT
        setShowSuccessModal(true);
        
        // CERRAR AUTOMÁTICAMENTE DESPUÉS DE 2 SEGUNDOS Y REDIRIGIR
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate(-1); // REDIRIGIR A LA LISTA DE PRODUCTOS
        }, 2000);
      }
    }
  };

  // FUNCIÓN PARA CANCELAR Y VOLVER A LA LISTA DE PRODUCTOS
  const handleCancel = () => {
    // CONFIRMAR ANTES DE CANCELAR
    if (window.confirm("¿Estás seguro de que quieres cancelar? Los datos no guardados se perderán.")) {
      navigate(-1); // VOLVER A LA LISTA DE PRODUCTOS
    }
  };

  return (
    <CrudLayout
      title="➕ Agregar Producto"
      description="Completa la información para agregar un nuevo producto al inventario."
      showAddButton={false}
    >
      <div className="formulario-container">
        <div className="formulario-header">
          <h3>📦 Información del Producto</h3>
          <p>Ingresa los datos básicos del nuevo producto</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* SECCIÓN: NOMBRE Y CATEGORÍA */}
          <div className="formulario-row">
            <div className="formulario-group">
              <label className="formulario-label" htmlFor="nombre">
                Nombre del Producto *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className={`formulario-control ${errors.nombre ? 'error' : ''}`}
                placeholder="Ej: Lente Solar Ray-Ban Aviator"
                value={formData.nombre}
                onChange={handleChange}
              />
              {errors.nombre && <div className="formulario-error">{errors.nombre}</div>}
            </div>

            <div className="formulario-group">
              <label className="formulario-label" htmlFor="categoria">
                Categoría *
              </label>
              <select
                id="categoria"
                name="categoria"
                className={`formulario-control formulario-select ${errors.categoria ? 'error' : ''}`}
                value={formData.categoria}
                onChange={handleChange}
              >
                <option value="">Selecciona una categoría</option>
                <option value="Lentes de Sol">Lentes de Sol</option>
                <option value="Monturas">Monturas</option>
                <option value="Lentes de Contacto">Lentes de Contacto</option>
                <option value="Accesorios">Accesorios</option>
                <option value="Lentes Oftálmicos">Lentes Oftálmicos</option>
              </select>
              {errors.categoria && <div className="formulario-error">{errors.categoria}</div>}
            </div>
          </div>

          {/* SECCIÓN: PRECIOS */}
          <div className="formulario-row">
            <div className="formulario-group">
              <label className="formulario-label" htmlFor="precioVenta">
                Precio de Venta *
              </label>
              <input
                type="number"
                id="precioVenta"
                name="precioVenta"
                className={`formulario-control ${errors.precioVenta ? 'error' : ''}`}
                placeholder="0.00"
                min="0"
                step="0.01"
                value={formData.precioVenta}
                onChange={handleChange}
              />
              {errors.precioVenta && <div className="formulario-error">{errors.precioVenta}</div>}
            </div>

            <div className="formulario-group">
              <label className="formulario-label" htmlFor="precioCompra">
                Precio de Compra
              </label>
              <input
                type="number"
                id="precioCompra"
                name="precioCompra"
                className="formulario-control"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={formData.precioCompra}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* SECCIÓN: STOCK */}
          <div className="formulario-row">
            <div className="formulario-group">
              <label className="formulario-label" htmlFor="stockActual">
                Stock Actual *
              </label>
              <input
                type="number"
                id="stockActual"
                name="stockActual"
                className={`formulario-control ${errors.stockActual ? 'error' : ''}`}
                placeholder="0"
                min="0"
                value={formData.stockActual}
                onChange={handleChange}
              />
              {errors.stockActual && <div className="formulario-error">{errors.stockActual}</div>}
            </div>

            <div className="formulario-group">
              <label className="formulario-label" htmlFor="stockMinimo">
                Stock Mínimo
              </label>
              <input
                type="number"
                id="stockMinimo"
                name="stockMinimo"
                className="formulario-control"
                placeholder="0"
                min="0"
                value={formData.stockMinimo}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* SECCIÓN: MARCA Y ESTADO */}
          <div className="formulario-row">
            <div className="formulario-group">
              <label className="formulario-label" htmlFor="marca">
                Marca *
              </label>
              <select
                id="marca"
                name="marca"
                className={`formulario-control formulario-select ${errors.marca ? 'error' : ''}`}
                value={formData.marca}
                onChange={handleChange}
              >
                <option value="">Selecciona una marca</option>
                <option value="Ray-Ban">Ray-Ban</option>
                <option value="Oakley">Oakley</option>
                <option value="Essilor">Essilor</option>
                <option value="Johnson & Johnson">Johnson & Johnson</option>
                <option value="Generic">Generic</option>
                <option value="Otra">Otra</option>
              </select>
              {errors.marca && <div className="formulario-error">{errors.marca}</div>}
            </div>

            <div className="formulario-group">
              <label className="formulario-label" htmlFor="estado">
                Estado
              </label>
              <select
                id="estado"
                name="estado"
                className="formulario-control formulario-select"
                value={formData.estado}
                onChange={handleChange}
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>

          {/* SECCIÓN: DESCRIPCIÓN */}
          <div className="formulario-group">
            <label className="formulario-label" htmlFor="descripcion">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              className="formulario-control formulario-textarea"
              placeholder="Describe las características del producto..."
              rows="4"
              value={formData.descripcion}
              onChange={handleChange}
            />
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="formulario-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              Guardar Producto
            </button>
          </div>
        </form>
      </div>

      {/* MODAL DE ÉXITO QUE SE CIERRA AUTOMÁTICAMENTE */}
      {showSuccessModal && (
        <div className="modal-overlay success-modal">
          <div className="modal-content success-modal-content">
            <div className="success-icon">✅</div>
            <h3>¡Producto Guardado!</h3>
            <p>El producto se ha guardado exitosamente</p>
            <p className="redirect-message">Redirigiendo a productos...</p>
          </div>
        </div>
      )}
    </CrudLayout>
  );
}