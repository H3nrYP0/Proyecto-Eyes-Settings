import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPedido } from '../../../../lib/data/pedidosData';
import "../../../../shared/styles/components/crud-forms.css";

export default function CrearPedido() {
  const navigate = useNavigate();
  
  const [productos, setProductos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarProductos, setMostrarProductos] = useState(false);
  const [mostrarServicios, setMostrarServicios] = useState(false);

  useEffect(() => {
    try {
      const productosEjemplo = [
        { id: 1, nombre: 'Lentes de sol', descripcion: 'Protección UV', precio: 120000, tipo: 'producto' },
        { id: 2, nombre: 'Armazón metálico', descripcion: 'Color plateado', precio: 85000, tipo: 'producto' },
        { id: 3, nombre: 'Lentes progresivos', descripcion: 'Alta definición', precio: 250000, tipo: 'producto' },
        { id: 4, nombre: 'Estuche para lentes', descripcion: 'Cuero sintético', precio: 35000, tipo: 'producto' },
      ];
      
      const serviciosEjemplo = [
        { id: 5, nombre: 'Consulta oftalmológica', descripcion: 'Examen completo', precio: 50000, tipo: 'servicio' },
        { id: 6, nombre: 'Adaptación de lentes de contacto', descripcion: 'Incluye enseñanza', precio: 75000, tipo: 'servicio' },
        { id: 7, nombre: 'Reparación de armazón', descripcion: 'Soldadura y ajuste', precio: 30000, tipo: 'servicio' },
        { id: 8, nombre: 'Limpieza de lentes', descripcion: 'Limpieza profesional', precio: 15000, tipo: 'servicio' },
      ];
      
      setProductos(productosEjemplo);
      setServicios(serviciosEjemplo);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setLoading(false);
    }
  }, []);

  const [formData, setFormData] = useState({
    cliente: '',
    fechaPedido: new Date().toISOString().split('T')[0],
    fechaEntrega: '',
    estado: 'En proceso'
  });

  const [itemsSeleccionados, setItemsSeleccionados] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.cliente.trim()) {
      alert('Por favor ingrese el nombre del cliente');
      return;
    }
    
    if (itemsSeleccionados.length === 0) {
      alert('Por favor agregue al menos un producto/servicio');
      return;
    }
    
    if (!formData.fechaPedido || !formData.fechaEntrega) {
      alert('Por favor complete ambas fechas');
      return;
    }
    
    const total = itemsSeleccionados.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const tieneProductos = itemsSeleccionados.some(item => item.tipo === 'producto');
    const tieneServicios = itemsSeleccionados.some(item => item.tipo === 'servicio');
    
    let descripcionTipo = '';
    if (tieneProductos && tieneServicios) {
      descripcionTipo = 'Productos y Servicios';
    } else if (tieneProductos) {
      descripcionTipo = 'Productos';
    } else {
      descripcionTipo = 'Servicios';
    }
    
    createPedido({
      ...formData,
      tipo: descripcionTipo,
      total: total,
      abono: 0,
      saldoPendiente: total,
      items: itemsSeleccionados.map(item => ({
        id: item.id,
        nombre: item.nombre,
        descripcion: item.descripcion,
        precio: item.precio,
        cantidad: item.cantidad,
        tipo: item.tipo
      }))
    });
    
    navigate('/admin/ventas/pedidos');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const agregarItem = (item) => {
    const itemExistente = itemsSeleccionados.find(i => i.id === item.id);
    
    if (itemExistente) {
      setItemsSeleccionados(itemsSeleccionados.map(i => 
        i.id === item.id 
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

  const removerItem = (index) => {
    const nuevosItems = [...itemsSeleccionados];
    nuevosItems.splice(index, 1);
    setItemsSeleccionados(nuevosItems);
  };

  const actualizarCantidad = (index, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      removerItem(index);
      return;
    }
    
    const nuevosItems = [...itemsSeleccionados];
    nuevosItems[index].cantidad = nuevaCantidad;
    setItemsSeleccionados(nuevosItems);
  };

  const calcularTotal = () => {
    return itemsSeleccionados.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  };

  if (loading) {
    return (
      <div className="crud-form-container" style={{ maxWidth: '850px' }}>
        <div className="crud-form-header" style={{ padding: '16px 20px' }}>
          <h1 style={{ fontSize: '1.4rem', margin: '0' }}>Crear Nuevo Pedido</h1>
        </div>
        <div className="crud-form-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Cargando productos y servicios...
          </div>
        </div>
      </div>
    );
  }

  const tieneProductos = itemsSeleccionados.some(item => item.tipo === 'producto');
  const tieneServicios = itemsSeleccionados.some(item => item.tipo === 'servicio');

  return (
    <div className="crud-form-container" style={{ maxWidth: '850px' }}>
      {/* HEADER COMPACTO - SIN DESCRIPCIÓN */}
      <div className="crud-form-header" style={{ padding: '16px 20px', minHeight: 'auto' }}>
        <h1 style={{ fontSize: '1.4rem', margin: '0' }}>Crear Nuevo Pedido</h1>
      </div>
      
      <div className="crud-form-content">
        <form onSubmit={handleSubmit}>
          {/* FORMULARIO BÁSICO - COMPACTO */}
          <div className="crud-form-section" style={{ padding: '16px', marginBottom: '12px', gap: '12px' }}>
            <div className="crud-form-group">
              <label htmlFor="cliente" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Cliente *</label>
              <input
                type="text"
                id="cliente"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                className="crud-input"
                placeholder="Nombre del cliente"
                required
                style={{ padding: '10px 12px', fontSize: '0.9rem' }}
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="fechaPedido" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Fecha Pedido *</label>
              <input
                type="date"
                id="fechaPedido"
                name="fechaPedido"
                value={formData.fechaPedido}
                onChange={handleChange}
                className="crud-input"
                required
                style={{ padding: '10px 12px', fontSize: '0.9rem' }}
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="fechaEntrega" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Fecha Entrega *</label>
              <input
                type="date"
                id="fechaEntrega"
                name="fechaEntrega"
                value={formData.fechaEntrega}
                onChange={handleChange}
                className="crud-input"
                required
                style={{ padding: '10px 12px', fontSize: '0.9rem' }}
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="estado" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Estado *</label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="crud-input"
                required
                style={{ padding: '10px 12px', fontSize: '0.9rem', height: 'auto' }}
              >
                <option value="En proceso">En proceso</option>
                <option value="Pendiente pago">Pendiente pago</option>
                <option value="Pagado">Pagado</option>
                <option value="Entregado">Entregado</option>
              </select>
            </div>
          </div>

          {/* SECCIÓN DE ITEMS COMPACTA */}
          <div style={{ 
            background: 'var(--gray-50)',
            borderRadius: '6px',
            border: '1px solid var(--gray-200)',
            padding: '14px',
            marginBottom: '16px'
          }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--gray-700)', margin: '0' }}>
                Seleccionar Items
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>
                {productos.length}p • {servicios.length}s
              </div>
            </div>

            {/* ACORDEÓN DE PRODUCTOS */}
            <div style={{ marginBottom: '10px' }}>
              <button
                type="button"
                onClick={() => setMostrarProductos(!mostrarProductos)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'white',
                  border: '1px solid var(--gray-300)',
                  borderRadius: '5px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: 'var(--gray-800)'
                }}
              >
                <span>Productos ({productos.length})</span>
                <span>{mostrarProductos ? '▲' : '▼'}</span>
              </button>
              
              {mostrarProductos && (
                <div style={{ 
                  marginTop: '6px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                  gap: '6px',
                  maxHeight: '180px',
                  overflowY: 'auto',
                  padding: '6px',
                  background: 'white',
                  borderRadius: '4px',
                  border: '1px solid var(--gray-200)'
                }}>
                  {productos.map((item) => (
                    <div key={`producto-${item.id}`} 
                         onClick={() => agregarItem(item)}
                         style={{ 
                           padding: '6px',
                           border: '1px solid var(--gray-200)',
                           borderRadius: '4px',
                           cursor: 'pointer',
                           fontSize: '0.8rem',
                           transition: 'all 0.2s'
                         }}
                         onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                         onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--gray-200)'}>
                      <div style={{ fontWeight: '600', color: 'var(--gray-800)', marginBottom: '2px' }}>
                        {item.nombre}
                      </div>
                      <div style={{ color: 'var(--gray-600)', fontSize: '0.75rem', marginBottom: '2px' }}>
                        {item.descripcion}
                      </div>
                      <div style={{ fontWeight: '600', color: 'var(--primary-color)', fontSize: '0.85rem' }}>
                        ${item.precio.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ACORDEÓN DE SERVICIOS */}
            <div>
              <button
                type="button"
                onClick={() => setMostrarServicios(!mostrarServicios)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'white',
                  border: '1px solid var(--gray-300)',
                  borderRadius: '5px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: 'var(--gray-800)'
                }}
              >
                <span>Servicios ({servicios.length})</span>
                <span>{mostrarServicios ? '▲' : '▼'}</span>
              </button>
              
              {mostrarServicios && (
                <div style={{ 
                  marginTop: '6px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                  gap: '6px',
                  maxHeight: '180px',
                  overflowY: 'auto',
                  padding: '6px',
                  background: 'white',
                  borderRadius: '4px',
                  border: '1px solid var(--gray-200)'
                }}>
                  {servicios.map((item) => (
                    <div key={`servicio-${item.id}`} 
                         onClick={() => agregarItem(item)}
                         style={{ 
                           padding: '6px',
                           border: '1px solid var(--gray-200)',
                           borderRadius: '4px',
                           cursor: 'pointer',
                           fontSize: '0.8rem',
                           transition: 'all 0.2s'
                         }}
                         onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                         onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--gray-200)'}>
                      <div style={{ fontWeight: '600', color: 'var(--gray-800)', marginBottom: '2px' }}>
                        {item.nombre}
                      </div>
                      <div style={{ color: 'var(--gray-600)', fontSize: '0.75rem', marginBottom: '2px' }}>
                        {item.descripcion}
                      </div>
                      <div style={{ fontWeight: '600', color: 'var(--primary-color)', fontSize: '0.85rem' }}>
                        ${item.precio.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RESUMEN COMPACTO DE ITEMS */}
          {itemsSeleccionados.length > 0 && (
            <div style={{ 
              background: 'var(--gray-50)',
              borderRadius: '6px',
              border: '1px solid var(--gray-200)',
              padding: '14px',
              marginBottom: '16px'
            }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--gray-700)', margin: '0' }}>
                  Items ({itemsSeleccionados.length})
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>
                  {tieneProductos && tieneServicios ? 'P y S' : 
                   tieneProductos ? 'Productos' : 'Servicios'}
                </div>
              </div>
              
              <div style={{ 
                background: 'white',
                borderRadius: '5px',
                border: '1px solid var(--gray-200)',
                maxHeight: '180px',
                overflowY: 'auto'
              }}>
                {itemsSeleccionados.map((item, index) => (
                  <div key={index} 
                       style={{ 
                         padding: '8px 10px',
                         borderBottom: index < itemsSeleccionados.length - 1 ? '1px solid var(--gray-100)' : 'none',
                         fontSize: '0.85rem'
                       }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ fontWeight: '600', color: 'var(--gray-800)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{item.nombre}</span>
                        <span style={{ 
                          fontSize: '0.65rem',
                          padding: '1px 4px',
                          borderRadius: '2px',
                          background: item.tipo === 'producto' ? '#dbeafe' : '#dcfce7',
                          color: item.tipo === 'producto' ? '#1d4ed8' : '#166534'
                        }}>
                          {item.tipo === 'producto' ? 'P' : 'S'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removerItem(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc2626',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          padding: '2px',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>
                        ${item.precio.toLocaleString()} × {item.cantidad} = <strong>${(item.precio * item.cantidad).toLocaleString()}</strong>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <button
                          type="button"
                          onClick={() => actualizarCantidad(index, item.cantidad - 1)}
                          style={{
                            width: '18px',
                            height: '18px',
                            background: 'var(--gray-200)',
                            border: 'none',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            fontSize: '0.7rem',
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
                            width: '35px',
                            textAlign: 'center',
                            padding: '1px 2px',
                            border: '1px solid var(--gray-300)',
                            borderRadius: '2px',
                            fontSize: '0.75rem'
                          }}
                          min="1"
                        />
                        <button
                          type="button"
                          onClick={() => actualizarCantidad(index, item.cantidad + 1)}
                          style={{
                            width: '18px',
                            height: '18px',
                            background: 'var(--gray-200)',
                            border: 'none',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            fontSize: '0.7rem',
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
                ))}
                
                {/* TOTAL PEQUEÑO */}
                <div style={{ 
                  padding: '10px',
                  background: 'var(--gray-100)',
                  borderTop: '1px solid var(--gray-300)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.9rem'
                }}>
                  <div style={{ fontWeight: '600', color: 'var(--gray-700)' }}>
                    TOTAL
                  </div>
                  <div style={{ fontWeight: '700', color: 'var(--primary-color)' }}>
                    ${calcularTotal().toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RESÚMENES FINALES EXTRA COMPACTOS */}
          <div className="crud-form-section" style={{ 
            padding: '12px', 
            marginBottom: '16px', 
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px'
          }}>
            <div className="crud-form-group">
              <label style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Tipo</label>
              <div className="crud-input-view" style={{ 
                fontSize: '0.85rem', 
                padding: '8px 10px',
                minHeight: 'auto'
              }}>
                {tieneProductos && tieneServicios ? 'Productos y Servicios' : 
                 tieneProductos ? 'Productos' : 
                 tieneServicios ? 'Servicios' : 'Sin items'}
              </div>
            </div>

            <div className="crud-form-group">
              <label style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Total</label>
              <div className="crud-input-view" style={{ 
                color: 'var(--primary-color)',
                fontWeight: '600',
                fontSize: '0.9rem',
                padding: '8px 10px',
                minHeight: 'auto'
              }}>
                ${calcularTotal().toLocaleString()}
              </div>
            </div>
          </div>

          <div className="crud-form-actions" style={{ 
            paddingTop: '12px', 
            marginTop: '0',
            borderTop: '1px solid var(--gray-200)'
          }}>
            <button 
              type="button" 
              className="crud-btn crud-btn-secondary"
              onClick={() => navigate('/admin/ventas/pedidos')}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="crud-btn crud-btn-primary"
              disabled={itemsSeleccionados.length === 0}
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Crear Pedido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}