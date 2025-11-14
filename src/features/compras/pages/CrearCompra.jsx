// src/features/compras/pages/CrearCompra.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompras } from '../context/ComprasContext';
import { useProveedores } from '../context/ProveedoresContext';
import CrudLayout from "../../../shared/components/layouts/CrudLayout";

export default function CrearCompra() {
  const navigate = useNavigate();
  const { actions: comprasActions } = useCompras();
  const { state: proveedoresState } = useProveedores();
  
  const [formData, setFormData] = useState({
    proveedorId: "",
    fecha: new Date().toISOString().split('T')[0],
    productos: [],
    observaciones: ""
  });

  const [productoActual, setProductoActual] = useState({
    nombre: "",
    cantidad: 1,
    precioUnitario: 0
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.proveedorId) {
      alert("Selecciona un proveedor");
      return;
    }

    if (formData.productos.length === 0) {
      alert("Agrega al menos un producto");
      return;
    }

    const proveedor = proveedoresState.proveedores.find(p => p.id === parseInt(formData.proveedorId));
    const { subtotal, iva, total } = calcularTotales(formData.productos);

    const nuevaCompra = {
      ...formData,
      proveedorId: parseInt(formData.proveedorId),
      proveedorNombre: proveedor.razonSocial,
      numeroCompra: `C-${Date.now().toString().slice(-4)}`,
      subtotal,
      iva,
      total,
      estado: "Completada"
    };

    comprasActions.addCompra(nuevaCompra);
    navigate('/admin/compras');
  };

  const { subtotal, iva, total } = calcularTotales(formData.productos);

  return (
    <CrudLayout
      title="💰 Crear Compra"
      description="Registra una nueva compra de productos"
    >
      <div className="crud-center">
        <form onSubmit={handleSubmit} className="crud-form">
          {/* Información básica */}
          <div className="form-section">
            <h3>Información de la Compra</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Proveedor *</label>
                <select 
                  name="proveedorId" 
                  value={formData.proveedorId} 
                  onChange={(e) => setFormData({...formData, proveedorId: e.target.value})}
                  required
                >
                  <option value="">Seleccionar proveedor</option>
                  {proveedoresState.proveedores.filter(p => p.estado === "Activo").map(proveedor => (
                    <option key={proveedor.id} value={proveedor.id}>
                      {proveedor.razonSocial}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Fecha *</label>
                <input 
                  type="date" 
                  name="fecha"
                  value={formData.fecha}
                  onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Observaciones</label>
              <textarea 
                name="observaciones"
                value={formData.observaciones}
                onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                rows="3"
                placeholder="Observaciones adicionales..."
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
                />
              </div>
              
              <div className="form-group">
                <label>Cantidad</label>
                <input 
                  type="number" 
                  value={productoActual.cantidad}
                  onChange={(e) => setProductoActual({...productoActual, cantidad: e.target.value})}
                  min="1"
                />
              </div>
              
              <div className="form-group">
                <label>Precio Unitario</label>
                <input 
                  type="number" 
                  value={productoActual.precioUnitario}
                  onChange={(e) => setProductoActual({...productoActual, precioUnitario: e.target.value})}
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label>Acción</label>
                <button type="button" onClick={agregarProducto} className="btn-secondary">
                  ➕ Agregar
                </button>
              </div>
            </div>

            {/* Lista de productos agregados */}
            {formData.productos.length > 0 && (
              <div className="productos-lista">
                <h4>Productos Agregados</h4>
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
                        <td>{producto.nombre}</td>
                        <td>{producto.cantidad}</td>
                        <td>${producto.precioUnitario.toLocaleString()}</td>
                        <td>${producto.total.toLocaleString()}</td>
                        <td>
                          <button 
                            type="button"
                            onClick={() => eliminarProducto(producto.id)}
                            className="btn-danger"
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
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="total-item">
                <span>IVA (19%):</span>
                <span>${iva.toLocaleString()}</span>
              </div>
              <div className="total-item total-final">
                <span>Total:</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/admin/compras')}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Crear Compra
            </button>
          </div>
        </form>
      </div>
    </CrudLayout>
  );
}