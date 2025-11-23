import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import { getCompraById, updateCompra } from "../../../lib/data/comprasData";

export default function EditarCompra() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState(null);
  const [productoActual, setProductoActual] = useState({
    nombre: "",
    cantidad: 1,
    precioUnitario: 0
  });

  useEffect(() => {
    const compra = getCompraById(Number(id));
    if (compra) {
      setFormData(compra);
    } else {
      navigate('/admin/compras');
    }
  }, [id, navigate]);

  const calcularTotales = (productos) => {
    const subtotal = productos.reduce((sum, prod) => sum + prod.total, 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;
    return { subtotal, iva, total };
  };

  const agregarProducto = () => {
    if (!productoActual.nombre || productoActual.cantidad <= 0 || productoActual.precioUnitario <= 0) {
      alert("Por favor completa todos los campos del producto");
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

    setProductoActual({
      nombre: "",
      cantidad: 1,
      precioUnitario: 0
    });
  };

  const eliminarProducto = (productoId) => {
    setFormData(prev => ({
      ...prev,
      productos: prev.productos.filter(p => p.id !== productoId)
    }));
  };

  const actualizarProducto = (productoId, campo, valor) => {
    setFormData(prev => ({
      ...prev,
      productos: prev.productos.map(p => 
        p.id === productoId 
          ? { 
              ...p, 
              [campo]: valor,
              total: campo === 'cantidad' ? valor * p.precioUnitario :
                     campo === 'precioUnitario' ? p.cantidad * valor : p.total
            } 
          : p
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.productos.length === 0) {
      alert("La compra debe tener al menos un producto");
      return;
    }

    const { subtotal, iva, total } = calcularTotales(formData.productos);
    const compraActualizada = {
      ...formData,
      subtotal,
      iva,
      total
    };

    // Actualizar en la base de datos
    updateCompra(Number(id), compraActualizada);
    navigate('/admin/compras');
  };

  if (!formData) {
    return <div>Cargando...</div>;
  }

  const { subtotal, iva, total } = calcularTotales(formData.productos);

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <CrudLayout
      title="✏️ Editar Compra"
      description={`Modifica la compra ${formData.numeroCompra}`}
    >
      <div className="crud-center">
        <form onSubmit={handleSubmit} className="crud-form">
          {/* Información básica */}
          <div className="form-section">
            <h3>Información de la Compra</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Proveedor</label>
                <input
                  type="text"
                  value={formData.proveedorNombre}
                  onChange={(e) => setFormData({...formData, proveedorNombre: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Fecha *</label>
                <input 
                  type="date" 
                  value={formData.fecha}
                  onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                  className="form-input"
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Observaciones</label>
              <textarea 
                value={formData.observaciones || ''}
                onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                rows="3"
                placeholder="Observaciones adicionales..."
                className="form-input"
              />
            </div>
          </div>

          {/* Agregar productos */}
          <div className="form-section">
            <h3>Productos de la Compra</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre del Producto</label>
                <input 
                  type="text" 
                  value={productoActual.nombre}
                  onChange={(e) => setProductoActual({...productoActual, nombre: e.target.value})}
                  placeholder="Nombre del producto"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Cantidad</label>
                <input 
                  type="number" 
                  value={productoActual.cantidad}
                  onChange={(e) => setProductoActual({...productoActual, cantidad: e.target.value})}
                  min="1"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Precio Unitario</label>
                <input 
                  type="number" 
                  value={productoActual.precioUnitario}
                  onChange={(e) => setProductoActual({...productoActual, precioUnitario: e.target.value})}
                  min="0"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Acción</label>
                <button type="button" onClick={agregarProducto} className="btn-secondary">
                  ➕ Agregar
                </button>
              </div>
            </div>

            {/* Lista de productos existentes */}
            {formData.productos.length > 0 && (
              <div className="productos-lista">
                <h4>Productos en la Compra</h4>
                <table className="crud-table">
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
                        <td>
                          <input
                            type="text"
                            value={producto.nombre}
                            onChange={(e) => actualizarProducto(producto.id, 'nombre', e.target.value)}
                            className="inline-input"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={producto.cantidad}
                            onChange={(e) => actualizarProducto(producto.id, 'cantidad', parseInt(e.target.value))}
                            min="1"
                            className="inline-input"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={producto.precioUnitario}
                            onChange={(e) => actualizarProducto(producto.id, 'precioUnitario', parseInt(e.target.value))}
                            min="0"
                            className="inline-input"
                          />
                        </td>
                        <td>{formatCurrency(producto.total)}</td>
                        <td>
                          <button 
                            type="button"
                            onClick={() => eliminarProducto(producto.id)}
                            className="btn-delete"
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
          <div className="form-section totales">
            <h3>Totales</h3>
            <div className="totales-grid">
              <div className="total-item">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="total-item">
                <span>IVA (19%):</span>
                <span>{formatCurrency(iva)}</span>
              </div>
              <div className="total-item total-final">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/admin/compras')}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={formData.estado === "Anulada"}
            >
              Actualizar Compra
            </button>
          </div>
        </form>
      </div>
    </CrudLayout>
  );
}