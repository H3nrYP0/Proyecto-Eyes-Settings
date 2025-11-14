// src/features/compras/pages/DetalleCompra.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCompras } from '../context/ComprasContext';
import CrudLayout from "../../../shared/components/layouts/CrudLayout";

export default function DetalleCompra() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useCompras();
  const [compra, setCompra] = useState(null);

  useEffect(() => {
    const compraEncontrada = state.compras.find(c => c.id === parseInt(id));
    if (compraEncontrada) {
      setCompra(compraEncontrada);
    } else {
      navigate('/admin/compras');
    }
  }, [id, state.compras, navigate]);

  const generarPDF = () => {
    // Simulación de generación de PDF
    const contenidoPDF = `
      COMPROBANTE DE COMPRA
      =====================
      Número: ${compra.numeroCompra}
      Fecha: ${compra.fecha}
      Proveedor: ${compra.proveedorNombre}
      
      PRODUCTOS:
      ${compra.productos.map(p => 
        `${p.nombre} - ${p.cantidad} x $${p.precioUnitario} = $${p.total}`
      ).join('\n')}
      
      SUBTOTAL: $${compra.subtotal}
      IVA (19%): $${compra.iva}
      TOTAL: $${compra.total}
      
      Observaciones: ${compra.observaciones}
      Estado: ${compra.estado}
    `;
    
    alert("PDF generado:\n" + contenidoPDF);
    console.log("PDF:", contenidoPDF);
  };

  if (!compra) {
    return <div>Cargando...</div>;
  }

  return (
    <CrudLayout
      title="👁️ Detalle de Compra"
      description={`Información completa de la compra ${compra.numeroCompra}`}
    >
      <div className="crud-center">
        <div className="detalle-compra">
          {/* Información General */}
          <div className="info-section">
            <h3>Información General</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>Número de Compra:</strong>
                <span>{compra.numeroCompra}</span>
              </div>
              <div className="info-item">
                <strong>Proveedor:</strong>
                <span>{compra.proveedorNombre}</span>
              </div>
              <div className="info-item">
                <strong>Fecha:</strong>
                <span>{compra.fecha}</span>
              </div>
              <div className="info-item">
                <strong>Estado:</strong>
                <span className={`status-${compra.estado.toLowerCase()}`}>
                  {compra.estado === "Completada" ? "✅ Completada" : "❌ Anulada"}
                </span>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="info-section">
            <h3>Productos Comprados</h3>
            <table className="crud-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {compra.productos.map(producto => (
                  <tr key={producto.id}>
                    <td>{producto.nombre}</td>
                    <td>{producto.cantidad}</td>
                    <td>${producto.precioUnitario.toLocaleString()}</td>
                    <td>${producto.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="info-section">
            <h3>Resumen de Valores</h3>
            <div className="totales-grid">
              <div className="total-item">
                <strong>Subtotal:</strong>
                <span>${compra.subtotal.toLocaleString()}</span>
              </div>
              <div className="total-item">
                <strong>IVA (19%):</strong>
                <span>${compra.iva.toLocaleString()}</span>
              </div>
              <div className="total-item total-final">
                <strong>Total:</strong>
                <span>${compra.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          {compra.observaciones && (
            <div className="info-section">
              <h3>Observaciones</h3>
              <p>{compra.observaciones}</p>
            </div>
          )}

          {/* Acciones */}
          <div className="form-actions">
            <button onClick={() => navigate('/admin/compras')}>
              Volver a Compras
            </button>
            <button onClick={generarPDF} className="btn-secondary">
              📄 Generar PDF
            </button>
            <button 
              onClick={() => navigate(`/admin/compras/editar/${compra.id}`)}
              className="btn-primary"
              disabled={compra.estado === "Anulada"}
            >
              ✏️ Editar Compra
            </button>
          </div>
        </div>
      </div>
    </CrudLayout>
  );
}