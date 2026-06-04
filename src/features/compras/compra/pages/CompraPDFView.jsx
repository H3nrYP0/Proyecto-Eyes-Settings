import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompraById } from "../services/comprasService";
import { formatCurrency, formatDate } from "../utils/comprasUtils";
import Loading from "@shared/components/ui/Loading";

export default function CompraPDFView() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const contentRef = useRef(null);
  const [compra,  setCompra]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompraById(Number(id))
      .then((data) => {
        if (!data) navigate("/admin/compras");
        else setCompra(data);
      })
      .catch(() => navigate("/admin/compras"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <Loading text="Cargando compra..." />;
  if (!compra)  return null;

  const subtotal = (compra.productos || []).reduce(
    (acc, p) => acc + Number(p.total || 0), 0
  );
  const iva   = compra.iva   ?? Math.round(subtotal * 0.19);
  const total = compra.total ?? subtotal + iva;

  const handleDescargar = async () => {
    const { default: html2canvas } = await import("html2canvas");
    const { default: jsPDF }       = await import("jspdf");

    const canvas = await html2canvas(contentRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData  = canvas.toDataURL("image/png");
    const pdf      = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Compra-${compra.numeroCompra || id}.pdf`);
  };

  /* ── estilos reutilizables ── */
  const th = {
    border: "1px solid #000",
    padding: "7px 10px",
    fontWeight: 700,
    fontSize: "0.78rem",
    backgroundColor: "#000",
    color: "#fff",
    whiteSpace: "nowrap",
  };
  const td = (align = "left", bold = false) => ({
    border: "1px solid #000",
    padding: "6px 10px",
    fontSize: "0.78rem",
    textAlign: align,
    fontWeight: bold ? 700 : 400,
    color: "#000",
  });

  return (
    <div style={{ backgroundColor: "#e5e7eb", minHeight: "100vh", padding: "32px 16px" }}>

      <div style={{ maxWidth: 780, margin: "0 auto 16px auto", display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button
          style={{ padding: "8px 18px", borderRadius: "6px", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", border: "1px solid #d1d5db", backgroundColor: "#f3f4f6", color: "#374151" }}
          onClick={() => navigate(`/admin/compras/detalle/${id}`)}
        >
          ← Volver
        </button>
        <button
          style={{ padding: "8px 18px", borderRadius: "6px", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer", border: "none", backgroundColor: "#2563eb", color: "#fff" }}
          onClick={handleDescargar}
        >
          ⬇ Descargar PDF
        </button>
      </div>

      <div
        ref={contentRef}
        style={{
          maxWidth: 780,
          margin: "0 auto",
          backgroundColor: "#fff",
          padding: "48px 52px",
          fontFamily: "'Courier New', Courier, monospace",
          color: "#000",
          fontSize: "0.85rem",
          border: "1px solid #000",
        }}
      >
        <div style={{ borderBottom: "2px solid #000", paddingBottom: 16, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: 900, letterSpacing: 2, textTransform: "uppercase" }}>
                VISUAL OUTLET
              </p>
              <p style={{ margin: "4px 0 2px", fontSize: "0.75rem" }}>NIT: 901.234.567-8</p>
              <p style={{ margin: 0, fontSize: "0.75rem" }}>
                Cra. 45 #50-48, Ed. El Doral Of. 102, Medellín
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: "1rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: 1 }}>
                SOPORTE DE COMPRA
              </p>
              <p style={{ margin: "4px 0 2px", fontSize: "0.75rem" }}>
                N°: {compra.numeroCompra || `C-${id}`}
              </p>
              <p style={{ margin: 0, fontSize: "0.75rem" }}>
                Fecha: {formatDate(compra.fecha)}
              </p>
            </div>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
          <tbody>
            <tr>
              <td style={{ ...td(), width: "20%", fontWeight: 700, backgroundColor: "#f0f0f0", border: "1px solid #000" }}>
                PROVEEDOR
              </td>
              <td style={{ ...td(), width: "40%", border: "1px solid #000" }}>
                {compra.proveedor_nombre || compra.proveedorNombre || "—"}
              </td>
              <td style={{ ...td(), width: "15%", fontWeight: 700, backgroundColor: "#f0f0f0", border: "1px solid #000" }}>
                ESTADO
              </td>
              <td style={{ ...td(), width: "25%", border: "1px solid #000" }}>
                {compra.estado_compra === true ? "Completada" : "Anulada"}
              </td>
            </tr>
            {compra.observaciones && (
              <tr>
                <td style={{ ...td(), fontWeight: 700, backgroundColor: "#f0f0f0", border: "1px solid #000" }}>
                  OBSERVACIONES
                </td>
                <td colSpan={3} style={{ ...td(), border: "1px solid #000" }}>
                  {compra.observaciones}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 0 }}>
          <thead>
            <tr>
              <th style={{ ...th, textAlign: "left",  width: "40%" }}>PRODUCTO</th>
              <th style={{ ...th, textAlign: "center",width: "12%" }}>CANT.</th>
              <th style={{ ...th, textAlign: "right", width: "18%" }}>P. COMPRA</th>
              <th style={{ ...th, textAlign: "right", width: "18%" }}>P. VENTA</th>
              <th style={{ ...th, textAlign: "right", width: "12%" }}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {(compra.productos || []).map((p, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                <td style={td("left")}>{p.nombre}</td>
                <td style={td("center")}>{p.cantidad}</td>
                <td style={td("right")}>{formatCurrency(p.precioCompra ?? p.precioUnitario ?? 0)}</td>
                <td style={td("right")}>{formatCurrency(p.precioVenta ?? 0)}</td>
                <td style={td("right", true)}>{formatCurrency(p.total || 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 32 }}>
          <tbody>
            <tr>
              <td style={{ border: "none", padding: 0, width: "60%" }} />
              <td style={{ ...td("right"), border: "1px solid #000", borderTop: "none", fontWeight: 700, backgroundColor: "#f0f0f0", width: "28%" }}>
                SUBTOTAL
              </td>
              <td style={{ ...td("right"), border: "1px solid #000", borderTop: "none", width: "12%" }}>
                {formatCurrency(subtotal)}
              </td>
            </tr>
            <tr>
              <td style={{ border: "none", padding: 0 }} />
              <td style={{ ...td("right"), border: "1px solid #000", borderTop: "none", fontWeight: 700, backgroundColor: "#f0f0f0" }}>
                IVA (19%)
              </td>
              <td style={{ ...td("right"), border: "1px solid #000", borderTop: "none" }}>
                {formatCurrency(iva)}
              </td>
            </tr>
            <tr>
              <td style={{ border: "none", padding: 0 }} />
              <td style={{ ...td("right"), border: "2px solid #000", borderTop: "2px solid #000", fontWeight: 900, backgroundColor: "#000", color: "#fff" }}>
                TOTAL
              </td>
              <td style={{ ...td("right", true), border: "2px solid #000", borderTop: "2px solid #000", backgroundColor: "#000", color: "#fff" }}>
                {formatCurrency(total)}
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ borderTop: "1px solid #000", paddingTop: 12, textAlign: "center", fontSize: "0.7rem", color: "#555" }}>
          Este documento no constituye una factura de venta. &nbsp;|&nbsp; Generado el {new Date().toLocaleDateString("es-ES")}
        </div>
      </div>
    </div>
  );
}
