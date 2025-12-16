// src/pages/admin/compras/CompraPDFView.jsx
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCompraById } from '../../../lib/data/comprasData';
import "../../../shared/styles/components/crud-forms.css";

export default function CompraPDFView() {
  const { id } = useParams();
  const compraId = parseInt(id, 10);

  // Buscar la compra
  const compra = getCompraById(compraId);

  // Si no existe, redirigir (opcional)
  if (!compra) {
    window.close(); // o redirigir, pero en PDF no es crítico
    return null;
  }

  // ✅ Auto-imprimir al cargar
  useEffect(() => {
    // Pequeño retraso para asegurar que el DOM esté listo
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div style={{
      padding: '30px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Roboto, Arial, sans-serif',
      backgroundColor: 'white',
      color: 'black'
    }}>
      
      {/* Encabezado */}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h2 style={{ margin: '0', color: 'var(--primary-color)', fontSize: '1.4rem' }}>
         VISUAL OUTLET
        </h2>
        <p style={{ margin: '4px 0', fontSize: '0.95rem' }}>NIT: 901.234.567-8</p>
        <p style={{ margin: '4px 0', fontSize: '0.95rem' }}> Carrera 45 50-48 Edificio El Doral Oficina 102, Medellín, Antioquia</p>
        <p style={{ margin: '10px 0', fontWeight: 'bold', fontSize: '1.1rem' }}>
          SOPORTE DE COMPRA
        </p>
        <p style={{ margin: '4px 0' }}>
          {compra.numeroCompra} • Fecha: {formatDate(compra.fecha)}
        </p>
      </div>

      {/* Información del proveedor */}
      <div style={{ marginBottom: '20px', fontSize: '0.95rem' }}>
        <p><strong>Proveedor:</strong> {compra.proveedorNombre}</p>
        <p><strong>Estado:</strong> 
          <span style={{ 
            color: compra.estado === 'Completada' ? '#16a34a' : '#dc2626',
            marginLeft: '6px'
          }}>
            {compra.estado}
          </span>
        </p>
      </div>

      {/* Tabla de productos */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5' }}>Producto</th>
            <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5' }}>Cantidad</th>
            <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5' }}>Precio Unit.</th>
            <th style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {compra.productos.map((p, i) => (
            <tr key={i}>
              <td style={{ border: '1px solid #000', padding: '8px' }}>{p.nombre}</td>
              <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{p.cantidad}</td>
              <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                {formatCurrency(p.precioUnitario)}
              </td>
              <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right' }}>
                {formatCurrency(p.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totales */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '40px', fontSize: '1rem' }}>
        <div>
          <p>Subtotal: {formatCurrency(compra.subtotal)}</p>
          <p>IVA (19%): {formatCurrency(compra.iva)}</p>
          <p style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary-color)' }}>
            TOTAL: {formatCurrency(compra.total)}
          </p>
        </div>
      </div>

      {/* Observaciones (si existen) */}
      {compra.observaciones && (
        <div style={{ marginTop: '20px', fontSize: '0.95rem' }}>
          <p><strong>Observaciones:</strong> {compra.observaciones}</p>
        </div>
      )}

      {/* Pie */}
      <div style={{
        marginTop: '40px',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: '#666'
      }}>
        Este documento no es una factura.
      </div>
    </div>
  );
}