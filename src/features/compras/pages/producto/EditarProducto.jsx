import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import { getProductoById, updateProducto } from "../../../../lib/data/productosData";
import "../../../../shared/styles/components/crud-forms.css";

export default function EditarProducto() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const producto = getProductoById(Number(id));
    if (producto) {
      setFormData(producto);
    } else {
      navigate('/admin/compras/productos');
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar stock mínimo
    if (formData.stockActual < 0 || formData.stockMinimo < 0) {
      alert("El stock no puede ser negativo");
      return;
    }

    if (formData.precioVenta < 0 || formData.precioCompra < 0) {
      alert("Los precios no pueden ser negativos");
      return;
    }

    // Actualizar estado basado en stock
    const estadoActualizado = formData.stockActual <= formData.stockMinimo ? "bajo-stock" : "activo";

    const productoActualizado = {
      ...formData,
      estado: estadoActualizado
    };

    // Actualizar en la base de datos
    updateProducto(Number(id), productoActualizado);
    navigate('/admin/compras/productos');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('precio') || name.includes('stock') ? Number(value) : value
    }));
  };

  if (!formData) {
    return <div>Cargando...</div>;
  }

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  const getEstadoBadge = (estado) => {
    switch(estado) {
      case 'activo': return 'crud-badge-success';
      case 'inactivo': return 'crud-badge-error';
      case 'bajo-stock': return 'crud-badge-warning';
      default: return 'crud-badge-success';
    }
  };

  const getEstadoText = (estado) => {
    switch(estado) {
      case 'activo': return 'Activo';
      case 'inactivo': return 'Inactivo';
      case 'bajo-stock': return 'Bajo Stock';
      default: return estado;
    }
  };

  return (
    <CrudLayout
      title="✏️ Editar Producto"
      description={`Modifica la información del producto`}
    >
      <div className="crud-form-container">
        <div className="crud-form-header">
          <h1>Editando: {formData.nombre}</h1>
          <p>Modifica la información del producto</p>
        </div>
        
        <div className="crud-form-content">
          <form onSubmit={handleSubmit}>
            {/* Información básica */}
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
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion || ''}
                  onChange={handleChange}
                  rows="3"
                  className="crud-input crud-textarea"
                  placeholder="Descripción del producto..."
                />
              </div>

              <div className="crud-form-group">
                {/* Columna vacía para mantener 2 columnas */}
              </div>
            </div>

            {/* Precios y Stock */}
            <div className="crud-form-section">
              <h3>Precios y Stock</h3>
              
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
                  step="100"
                  required
                />
                <small style={{color: 'var(--gray-500)', fontSize: '0.8rem'}}>
                  {formatCurrency(formData.precioVenta)}
                </small>
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
                  step="100"
                  required
                />
                <small style={{color: 'var(--gray-500)', fontSize: '0.8rem'}}>
                  {formatCurrency(formData.precioCompra)}
                </small>
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
                {formData.stockActual <= formData.stockMinimo && (
                  <small style={{color: '#dc2626', fontSize: '0.8rem', fontWeight: '600'}}>
                    ⚠️ Stock por debajo del mínimo
                  </small>
                )}
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
            </div>

            {/* Estado y Resumen */}
            <div className="crud-form-section">
              <h3>Estado del Producto</h3>
              
              <div className="crud-form-group">
                <label>Estado Actual</label>
                <div style={{padding: '12px', background: 'var(--gray-50)', borderRadius: '6px'}}>
                  <span className={`crud-badge ${getEstadoBadge(formData.estado)}`}>
                    {getEstadoText(formData.estado)}
                  </span>
                  <div style={{marginTop: '8px', fontSize: '0.8rem', color: 'var(--gray-600)'}}>
                    {formData.estado === 'bajo-stock' && (
                      <span>El stock actual está por debajo del stock mínimo</span>
                    )}
                    {formData.estado === 'activo' && (
                      <span>El producto está activo y disponible</span>
                    )}
                    {formData.estado === 'inactivo' && (
                      <span>El producto está inactivo y no disponible</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="crud-form-group">
                <label>Margen de Ganancia</label>
                <div style={{padding: '12px', background: 'var(--gray-50)', borderRadius: '6px'}}>
                  <div style={{fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary-color)'}}>
                    {formatCurrency(formData.precioVenta - formData.precioCompra)}
                  </div>
                  <div style={{marginTop: '4px', fontSize: '0.8rem', color: 'var(--gray-600)'}}>
                    {((formData.precioVenta - formData.precioCompra) / formData.precioCompra * 100).toFixed(1)}% de margen
                  </div>
                </div>
              </div>

              <div className="crud-form-group">
                <label>Información de Stock</label>
                <div style={{padding: '12px', background: 'var(--gray-50)', borderRadius: '6px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                    <span style={{fontSize: '0.9rem'}}>Stock actual:</span>
                    <span style={{fontWeight: '600'}}>{formData.stockActual}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span style={{fontSize: '0.9rem'}}>Stock mínimo:</span>
                    <span style={{fontWeight: '600'}}>{formData.stockMinimo}</span>
                  </div>
                  {formData.stockActual <= formData.stockMinimo && (
                    <div style={{marginTop: '8px', padding: '4px', background: '#fef3c7', borderRadius: '4px', textAlign: 'center'}}>
                      <small style={{color: '#b45309', fontWeight: '600'}}>
                        ⚠️ Necesita reposición
                      </small>
                    </div>
                  )}
                </div>
              </div>

              <div className="crud-form-group">
                <label>Estado Manual</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="crud-input"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="bajo-stock">Bajo Stock</option>
                </select>
                <small style={{color: 'var(--gray-500)', fontSize: '0.8rem'}}>
                  Nota: El estado puede cambiar automáticamente según el stock
                </small>
              </div>
            </div>

            <div className="crud-form-actions">
              <button 
                type="button" 
                onClick={() => navigate('/admin/compras/productos')}
                className="crud-btn crud-btn-secondary"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="crud-btn crud-btn-primary"
              >
                Actualizar Producto
              </button>
            </div>
          </form>
        </div>
      </div>
    </CrudLayout>
  );
}