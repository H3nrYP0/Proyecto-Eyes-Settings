import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProducto } from '../../../../lib/data/productosData';
import "../../../../shared/styles/components/crud-forms.css";

export default function CrearProducto() {
  const navigate = useNavigate();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Crear el producto
    const nuevoProducto = createProducto({
      ...formData,
      precioVenta: Number(formData.precioVenta),
      precioCompra: Number(formData.precioCompra),
      stockActual: Number(formData.stockActual),
      stockMinimo: Number(formData.stockMinimo),
      imagenes: []
    });

    console.log('Producto creado:', nuevoProducto);
    navigate('/admin/productos');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Crear Nuevo Producto</h1>
        <p>Registra un nuevo producto en el inventario</p>
      </div>
      
      <div className="crud-form-content">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section">
            <h3>Información Básica</h3>
            
            <div className="crud-form-group">
              <label htmlFor="nombre">Nombre <span className="crud-required">*</span></label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="crud-input"
                required
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="codigo">Código <span className="crud-required">*</span></label>
              <input
                type="text"
                id="codigo"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
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
                onChange={handleChange}
                className="crud-input"
                required
              >
                <option value="">Seleccionar categoría</option>
                <option value="Monturas">Monturas</option>
                <option value="Lentes de Sol">Lentes de Sol</option>
                <option value="Lentes de Contacto">Lentes de Contacto</option>
                <option value="Accesorios">Accesorios</option>
              </select>
            </div>

            <div className="crud-form-group">
              <label htmlFor="marca">Marca <span className="crud-required">*</span></label>
              <input
                type="text"
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                className="crud-input"
                required
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="precioVenta">Precio Venta <span className="crud-required">*</span></label>
              <input
                type="number"
                id="precioVenta"
                name="precioVenta"
                value={formData.precioVenta}
                onChange={handleChange}
                className="crud-input"
                min="0"
                required
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="precioCompra">Precio Compra <span className="crud-required">*</span></label>
              <input
                type="number"
                id="precioCompra"
                name="precioCompra"
                value={formData.precioCompra}
                onChange={handleChange}
                className="crud-input"
                min="0"
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
                onChange={handleChange}
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
                onChange={handleChange}
                className="crud-input"
                min="0"
                required
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                className="crud-input crud-textarea"
                placeholder="Descripción del producto..."
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="crud-input"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
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
  );
}