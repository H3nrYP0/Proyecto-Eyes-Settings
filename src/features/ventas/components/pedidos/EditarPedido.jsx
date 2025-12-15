import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPedidoById, updatePedido } from '../../../../lib/data/pedidosData';
import "../../../../shared/styles/components/crud-forms.css";

export default function EditarPedido() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Datos de ejemplo (reemplazar con tus datos reales)
  const [productos, setProductos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState(null);
  const [itemsSeleccionados, setItemsSeleccionados] = useState([]);

  useEffect(() => {
    // Cargar datos del pedido
    const pedido = getPedidoById(Number(id));
    if (pedido) {
      setFormData(pedido);
      
      // Si el pedido tiene items detallados, usarlos
      if (pedido.items && Array.isArray(pedido.items) && pedido.items.length > 0) {
        setItemsSeleccionados(pedido.items);
      } else {
        // Si no tiene items detallados, convertir la descripción antigua
        // Esto es un placeholder - puedes ajustarlo según tus necesidades
        if (pedido.productoServicio) {
          setItemsSeleccionados([{
            id: 1,
            nombre: pedido.productoServicio,
            descripcion: 'Producto/Servicio del pedido',
            precio: pedido.total,
            cantidad: 1,
            tipo: pedido.tipo || 'Venta'
          }]);
        }
      }
    } else {
      navigate('/admin/ventas/pedidos');
    }

    // Cargar datos de productos y servicios (ejemplo)
    try {
      // Datos de ejemplo de productos
      const productosEjemplo = [
        { id: 1, nombre: 'Lentes de sol', descripcion: 'Protección UV', precio: 120000, tipo: 'Venta' },
        { id: 2, nombre: 'Armazón metálico', descripcion: 'Color plateado', precio: 85000, tipo: 'Venta' },
        { id: 3, nombre: 'Lentes progresivos', descripcion: 'Alta definición', precio: 250000, tipo: 'Venta' },
        { id: 4, nombre: 'Estuche para lentes', descripcion: 'Cuero sintético', precio: 35000, tipo: 'Venta' },
      ];
      
      // Datos de ejemplo de servicios
      const serviciosEjemplo = [
        { id: 1, nombre: 'Consulta oftalmológica', descripcion: 'Examen completo', precio: 50000, tipo: 'Servicio' },
        { id: 2, nombre: 'Adaptación de lentes de contacto', descripcion: 'Incluye enseñanza', precio: 75000, tipo: 'Servicio' },
        { id: 3, nombre: 'Reparación de armazón', descripcion: 'Soldadura y ajuste', precio: 30000, tipo: 'Servicio' },
        { id: 4, nombre: 'Limpieza de lentes', descripcion: 'Limpieza profesional', precio: 15000, tipo: 'Servicio' },
      ];
      
      setProductos(productosEjemplo);
      setServicios(serviciosEjemplo);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setLoading(false);
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.cliente.trim()) {
      alert('Por favor ingrese el nombre del cliente');
      return;
    }
    
    if (itemsSeleccionados.length === 0) {
      alert('Por favor agregue al menos un producto/servicio');
      return;
    }
    
    if (!formData.fechaPedido) {
      alert('Por favor seleccione la fecha del pedido');
      return;
    }
    
    if (!formData.fechaEntrega) {
      alert('Por favor seleccione la fecha de entrega');
      return;
    }
    
    // Calcular total del pedido basado en los items
    const total = itemsSeleccionados.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    // Crear descripción de productos/servicios
    const descripcionItems = itemsSeleccionados.map(item => 
      `${item.cantidad}x ${item.nombre}`
    ).join(', ');
    
    const abono = Number(formData.abono) || 0;
    const saldoPendiente = total - abono;
    
    const pedidoActualizado = {
      ...formData,
      productoServicio: descripcionItems,
      total: total,
      saldoPendiente: saldoPendiente,
      items: itemsSeleccionados.map(item => ({
        id: item.id,
        nombre: item.nombre,
        descripcion: item.descripcion,
        precio: item.precio,
        cantidad: item.cantidad,
        tipo: item.tipo
      }))
    };
    
    updatePedido(Number(id), pedidoActualizado);
    navigate('/admin/ventas/pedidos');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Agregar un ítem al pedido
  const agregarItem = (item) => {
    const itemExistente = itemsSeleccionados.find(i => i.id === item.id && i.tipo === item.tipo);
    
    if (itemExistente) {
      setItemsSeleccionados(itemsSeleccionados.map(i => 
        i.id === item.id && i.tipo === item.tipo 
          ? { ...i, cantidad: i.cantidad + 1 }
          : i
      ));
    } else {
      setItemsSeleccionados([
        ...itemsSeleccionados,
        {
          ...item,
          cantidad: 1
        }
      ]);
    }
  };

  // Remover un ítem del pedido
  const removerItem = (index) => {
    const nuevosItems = [...itemsSeleccionados];
    nuevosItems.splice(index, 1);
    setItemsSeleccionados(nuevosItems);
  };

  // Actualizar cantidad de un ítem
  const actualizarCantidad = (index, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      removerItem(index);
      return;
    }
    
    const nuevosItems = [...itemsSeleccionados];
    nuevosItems[index].cantidad = nuevaCantidad;
    setItemsSeleccionados(nuevosItems);
  };

  // Calcular total del pedido
  const calcularTotal = () => {
    return itemsSeleccionados.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  };

  // Calcular saldo pendiente
  const calcularSaldoPendiente = () => {
    const total = calcularTotal();
    const abono = Number(formData?.abono) || 0;
    return total - abono;
  };

  // Filtrar items según tipo seleccionado
  const itemsDisponibles = formData?.tipo === 'Venta' ? productos : servicios;

  if (loading || !formData) {
    return (
      <div className="crud-form-container" style={{ maxWidth: '1000px' }}>
        <div className="crud-form-header">
          <h1>Editando Pedido</h1>
        </div>
        <div className="crud-form-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Cargando información del pedido...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="crud-form-container" style={{ maxWidth: '1000px' }}>
      <div className="crud-form-header">
        <h1>Editando Pedido: {formData.cliente}</h1>
        <p>Actualice la información del pedido</p>
      </div>
      
      <div className="crud-form-content">
        <form onSubmit={handleSubmit}>
          <div className="crud-form-section">
            {/* Cliente */}
            <div className="crud-form-group">
              <label htmlFor="cliente">
                Cliente <span className="crud-required">*</span>
              </label>
              <input
                type="text"
                id="cliente"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                className="crud-input"
                placeholder="Nombre del cliente"
                required
              />
            </div>

            {/* Tipo */}
            <div className="crud-form-group">
              <label htmlFor="tipo">
                Tipo <span className="crud-required">*</span>
              </label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="crud-input"
                required
              >
                <option value="">Seleccione...</option>
                <option value="Venta">Venta de Productos</option>
                <option value="Servicio">Servicio</option>
              </select>
            </div>

            {/* Fechas */}
            <div className="crud-form-group">
              <label htmlFor="fechaPedido">
                Fecha Pedido <span className="crud-required">*</span>
              </label>
              <input
                type="date"
                id="fechaPedido"
                name="fechaPedido"
                value={formData.fechaPedido}
                onChange={handleChange}
                className="crud-input"
                required
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="fechaEntrega">
                Fecha Entrega <span className="crud-required">*</span>
              </label>
              <input
                type="date"
                id="fechaEntrega"
                name="fechaEntrega"
                value={formData.fechaEntrega}
                onChange={handleChange}
                className="crud-input"
                required
              />
            </div>

            {/* Estado */}
            <div className="crud-form-group">
              <label htmlFor="estado">
                Estado <span className="crud-required">*</span>
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="crud-input"
                required
              >
                <option value="">Seleccione...</option>
                <option value="En proceso">En proceso</option>
                <option value="Pendiente pago">Pendiente pago</option>
                <option value="Pagado">Pagado</option>
                <option value="Entregado">Entregado</option>
              </select>
            </div>

            {/* Montos calculados automáticamente */}
            <div className="crud-form-group">
              <label>Total del Pedido</label>
              <div className="crud-input-view" style={{ 
                background: '#f0f9ff',
                color: '#1d4ed8',
                fontWeight: '600',
                fontSize: '1.1rem'
              }}>
                ${calcularTotal().toLocaleString()}
              </div>
            </div>

            <div className="crud-form-group">
              <label htmlFor="abono">Abono Inicial</label>
              <input
                type="number"
                id="abono"
                name="abono"
                value={formData.abono || ''}
                onChange={handleChange}
                className="crud-input"
                placeholder="0"
                min="0"
                max={calcularTotal()}
              />
            </div>

            <div className="crud-form-group">
              <label>Saldo Pendiente</label>
              <div className="crud-input-view" style={{ 
                background: calcularSaldoPendiente() > 0 ? '#fee2e2' : '#dcfce7',
                color: calcularSaldoPendiente() > 0 ? '#991b1b' : '#166534',
                fontWeight: '600'
              }}>
                ${calcularSaldoPendiente().toLocaleString()}
              </div>
            </div>
          </div>

          {/* Sección de selección de productos/servicios */}
          <div style={{ 
            background: 'var(--gray-50)',
            borderRadius: '8px',
            border: '1px solid var(--gray-200)',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ 
                fontSize: '1.2rem',
                color: 'var(--gray-700)',
                margin: '0'
              }}>
                {formData.tipo === 'Venta' ? 'Seleccionar Productos' : 'Seleccionar Servicios'}
              </h3>
              <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                {itemsDisponibles.length} disponibles
              </div>
            </div>

            {/* Grid de productos/servicios disponibles */}
            {itemsDisponibles.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: 'var(--gray-500)',
                background: 'white',
                borderRadius: '6px',
                border: '1px dashed var(--gray-300)'
              }}>
                <p style={{ margin: '0' }}>
                  No hay {formData.tipo === 'Venta' ? 'productos' : 'servicios'} disponibles
                </p>
              </div>
            ) : (
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '12px',
                marginBottom: '24px'
              }}>
                {itemsDisponibles.map((item) => (
                  <div key={`${formData.tipo}-${item.id}`} 
                       style={{ 
                         background: 'white',
                         border: '1px solid var(--gray-200)',
                         borderRadius: '6px',
                         padding: '12px',
                         cursor: 'pointer',
                         transition: 'all 0.2s',
                         ':hover': {
                           borderColor: 'var(--primary-color)',
                           boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                         }
                       }}
                       onClick={() => agregarItem({ 
                         ...item, 
                         tipo: formData.tipo 
                       })}>
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--gray-800)' }}>
                        {item.nombre}
                      </div>
                      <div style={{ 
                        fontSize: '0.8rem',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: formData.tipo === 'Venta' ? '#dbeafe' : '#dcfce7',
                        color: formData.tipo === 'Venta' ? '#1d4ed8' : '#166534'
                      }}>
                        {formData.tipo === 'Venta' ? 'PRODUCTO' : 'SERVICIO'}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginBottom: '4px' }}>
                      {item.descripcion || 'Sin descripción'}
                    </div>
                    <div style={{ 
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: 'var(--primary-color)'
                    }}>
                      ${item.precio.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Lista de items seleccionados */}
            {itemsSeleccionados.length > 0 && (
              <div>
                <h4 style={{ 
                  fontSize: '1rem',
                  color: 'var(--gray-700)',
                  margin: '0 0 12px 0'
                }}>
                  Items Seleccionados ({itemsSeleccionados.length})
                </h4>
                
                <div style={{ 
                  background: 'white',
                  borderRadius: '6px',
                  border: '1px solid var(--gray-200)',
                  overflow: 'hidden'
                }}>
                  {itemsSeleccionados.map((item, index) => (
                    <div key={index} 
                         style={{ 
                           display: 'flex',
                           alignItems: 'center',
                           padding: '12px 16px',
                           borderBottom: index < itemsSeleccionados.length - 1 ? '1px solid var(--gray-100)' : 'none',
                           background: index % 2 === 0 ? 'white' : 'var(--gray-50)'
                         }}>
                      <div style={{ flex: '1' }}>
                        <div style={{ 
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '4px'
                        }}>
                          <div style={{ 
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            color: 'var(--gray-800)'
                          }}>
                            {item.nombre}
                          </div>
                          <button
                            type="button"
                            onClick={() => removerItem(index)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#dc2626',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              padding: '2px 6px'
                            }}
                          >
                            ✕
                          </button>
                        </div>
                        
                        <div style={{ 
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                            <span style={{ marginRight: '12px' }}>
                              Precio: <strong>${item.precio.toLocaleString()}</strong>
                            </span>
                            <span>
                              Subtotal: <strong>${(item.precio * item.cantidad).toLocaleString()}</strong>
                            </span>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => actualizarCantidad(index, item.cantidad - 1)}
                              style={{
                                width: '24px',
                                height: '24px',
                                background: 'var(--gray-200)',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={item.cantidad}
                              onChange={(e) => actualizarCantidad(index, parseInt(e.target.value) || 1)}
                              style={{
                                width: '50px',
                                textAlign: 'center',
                                padding: '4px',
                                border: '1px solid var(--gray-300)',
                                borderRadius: '4px',
                                fontSize: '0.9rem'
                              }}
                              min="1"
                            />
                            <button
                              type="button"
                              onClick={() => actualizarCantidad(index, item.cantidad + 1)}
                              style={{
                                width: '24px',
                                height: '24px',
                                background: 'var(--gray-200)',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Total */}
                  <div style={{ 
                    padding: '16px',
                    background: 'var(--gray-50)',
                    borderTop: '2px solid var(--gray-300)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-700)' }}>
                      TOTAL DEL PEDIDO
                    </div>
                    <div style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                      ${calcularTotal().toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Observaciones */}
          <div style={{ 
            background: 'var(--gray-50)',
            borderRadius: '8px',
            border: '1px solid var(--gray-200)',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div className="crud-form-group" style={{ marginBottom: '0' }}>
              <label htmlFor="observaciones" style={{ 
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--gray-700)',
                marginBottom: '12px'
              }}>
                Observaciones
              </label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones || ''}
                onChange={handleChange}
                className="crud-textarea"
                placeholder="Observaciones adicionales del pedido..."
                rows="4"
              />
            </div>
          </div>

          <div className="crud-form-actions">
            <button 
              type="button" 
              className="crud-btn crud-btn-secondary"
              onClick={() => navigate('/admin/ventas/pedidos')}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="crud-btn crud-btn-primary"
              disabled={itemsSeleccionados.length === 0}
            >
              Actualizar Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}