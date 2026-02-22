import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompraById } from '../../../lib/data/comprasData';

export default function CompraPDFView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const compra = getCompraById(parseInt(id, 10));

  useEffect(() => {
    if (!compra) {
      navigate('/admin/compras');
    }
  }, [compra]);

  if (!compra) return null;

  const formatCurrency = (amount) => `$${Number(amount).toLocaleString()}`;
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('es-ES');

  const handleDescargar = async () => {
    const { default: html2canvas } = await import('html2canvas');
    const { default: jsPDF } = await import('jspdf');

    const canvas = await html2canvas(contentRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Compra-${compra.numeroCompra || id}.pdf`);
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '32px 16px' }}>

      {/* Botones de acción — fuera del área que se imprime */}
      <div style={{
        maxWidth: 800,
        margin: '0 auto 20px auto',
        display: 'flex',
        gap: 12,
        justifyContent: 'flex-end',
      }}>
        <button
          className="crud-btn crud-btn-secondary"
          onClick={() => navigate(`/admin/compras/detalle/${id}`)}
        >
          ← Volver
        </button>
        <button
          className="crud-btn crud-btn-primary"
          onClick={handleDescargar}
        >
          ⬇ Descargar PDF
        </button>
      </div>

      {/* Área del documento — esto es lo que se captura */}
      <div
        ref={contentRef}
        style={{
          maxWidth: 800,
          margin: '0 auto',
          backgroundColor: '#ffffff',
          padding: '48px 56px',
          borderRadius: 8,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          fontFamily: 'Roboto, Arial, sans-serif',
          color: '#111',
          fontSize: '0.95rem',
        }}
      >
        {/* Encabezado */}
        <div style={{ textAlign: 'center', marginBottom: 32, borderBottom: '2px solid #e5e7eb', paddingBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--primary-color)', letterSpacing: 1 }}>
            VISUAL OUTLET
          </h2>
          <p style={{ margin: '6px 0 2px', color: '#6b7280', fontSize: '0.88rem' }}>NIT: 901.234.567-8</p>
          <p style={{ margin: '2px 0', color: '#6b7280', fontSize: '0.88rem' }}>
            Carrera 45 50-48 Edificio El Doral Oficina 102, Medellín, Antioquia
          </p>
          <p style={{
            margin: '16px 0 4px',
            fontWeight: 700,
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>
            Soporte de Compra
          </p>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.88rem' }}>
            {compra.numeroCompra} &nbsp;•&nbsp; Fecha: {formatDate(compra.fecha)}
          </p>
        </div>

        {/* Info proveedor y estado */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginBottom: 28,
          backgroundColor: '#f9fafb',
          padding: '16px 20px',
          borderRadius: 6,
          border: '1px solid #e5e7eb',
        }}>
          <div>
            <p style={{ margin: '0 0 4px', color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Proveedor</p>
            <p style={{ margin: 0, fontWeight: 600 }}>{compra.proveedorNombre}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 4px', color: '#9ca3af', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Estado</p>
            <p style={{
              margin: 0,
              fontWeight: 600,
              color: compra.estado === 'Completada' ? '#16a34a' : '#dc2626',
            }}>
              {compra.estado}
            </p>
          </div>
        </div>

        {/* Tabla de productos */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 28 }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              {['Producto', 'Cantidad', 'Precio Unit.', 'Total'].map((h) => (
                <th key={h} style={{
                  border: '1px solid #d1d5db',
                  padding: '10px 12px',
                  textAlign: h === 'Producto' ? 'left' : 'right',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  color: '#374151',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compra.productos.map((p, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                <td style={{ border: '1px solid #e5e7eb', padding: '10px 12px' }}>{p.nombre}</td>
                <td style={{ border: '1px solid #e5e7eb', padding: '10px 12px', textAlign: 'right' }}>{p.cantidad}</td>
                <td style={{ border: '1px solid #e5e7eb', padding: '10px 12px', textAlign: 'right' }}>{formatCurrency(p.precioUnitario)}</td>
                <td style={{ border: '1px solid #e5e7eb', padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(p.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totales */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{
            width: 260,
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: '16px 20px',
            fontSize: '0.95rem',
          }}>
            {[
              { label: 'Subtotal', value: compra.subtotal },
              { label: 'IVA (19%)', value: compra.iva },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#6b7280' }}>
                <span>{label}</span>
                <span>{formatCurrency(value || 0)}</span>
              </div>
            ))}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '2px solid #e5e7eb',
              paddingTop: 10,
              marginTop: 4,
              fontWeight: 700,
              fontSize: '1.05rem',
              color: 'var(--primary-color)',
            }}>
              <span>TOTAL</span>
              <span>{formatCurrency(compra.total || 0)}</span>
            </div>
          </div>
        </div>

        {/* Observaciones */}
        {compra.observaciones && (
          <div style={{ marginTop: 28, padding: '14px 18px', backgroundColor: '#f9fafb', borderRadius: 6, border: '1px solid #e5e7eb' }}>
            <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#374151' }}>Observaciones</p>
            <p style={{ margin: 0, color: '#6b7280' }}>{compra.observaciones}</p>
          </div>
        )}

        {/* Pie de página */}
        <div style={{ marginTop: 48, textAlign: 'center', color: '#9ca3af', fontSize: '0.8rem', borderTop: '1px solid #e5e7eb', paddingTop: 16 }}>
          Este documento no es una factura. Generado el {new Date().toLocaleDateString('es-ES')}.
        </div>
      </div>
    </div>
  );
}