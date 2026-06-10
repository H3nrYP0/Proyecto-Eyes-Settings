import { useEffect } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import BaseFormLayout      from "@shared/components/base/BaseFormLayout";
import BaseFormSection     from "@shared/components/base/BaseFormSection";
import BaseFormField       from "@shared/components/base/BaseFormField";
import BaseFormActions     from "@shared/components/base/BaseFormActions";
import CrudNotification    from "@shared/styles/components/notifications/CrudNotification";
import Modal               from "@shared/components/ui/Modal";
import { usePedidoForm }   from "../hooks/usePedidoForm";
import { formatLocalDateFromISO } from "../utils/pedidosUtils";

const viewFieldStyle = {
  backgroundColor: "#f3f4f6",
  color: "#6b7280",
  pointerEvents: "none",
  userSelect: "none",
};

const banner = (color, bg, border) => ({
  background: bg,
  border: `1px solid ${border}`,
  borderRadius: 8,
  padding: "10px 16px",
  marginBottom: 16,
  color,
  fontWeight: 600,
  fontSize: "0.9rem",
});

const btnBase = {
  padding: "8px 22px",
  borderRadius: 8,
  border: "none",
  fontWeight: 600,
  fontSize: "0.9rem",
  cursor: "pointer",
  transition: "background 0.15s",
};

const btnPrimary = {
  ...btnBase,
  background: "var(--primary-color, #1a2540)",
  color: "#fff",
};

const btnSecondary = {
  ...btnBase,
  background: "transparent",
  color: "var(--primary-color, #1a2540)",
  border: "1.5px solid var(--primary-color, #1a2540)",
};

const btnBlue = {
  ...btnBase,
  background: "#2563eb",
  color: "#fff",
};

export default function PedidoForm({
  mode = "create",
  title = "Pedido",
  initialData = null,
  onCancel,
  onSuccess,
  onEdit,
  onPdf,
}) {
  const {
    clientes,
    productos,
    catalogLoading,
    abonosInfo,
    formData,
    setFormData,
    itemsSeleccionados,
    notification,
    setNotification,
    saving,
    isView,
    isEdit,
    isCreate,
    clienteNombreVisible,
    mostrarTabla,
    stockWarning,
    pedidoAnulado,
    pedidoPagado,
    calcularTotal,
    formatCurrency,
    agregarItem,
    removerItem,
    actualizarCantidad,
    guardarPedido,
    ESTADOS_PEDIDO,
    METODOS_PAGO,
    METODOS_ENTREGA,
    modalConfirm,
    closeModalConfirm,
  } = usePedidoForm({ mode, initialData, onSuccess });

  useEffect(() => {
    if (notification.isVisible) {
      const t = setTimeout(
        () => setNotification({ ...notification, isVisible: false }),
        5000
      );
      return () => clearTimeout(t);
    }
  }, [notification, setNotification]);

  const estadoGuardado = initialData?.estado ?? "pendiente";
  const formBloqueado =
    isView || (isEdit && (estadoGuardado === "anulado" || estadoGuardado === "pagado"));
  const isDisabled = formBloqueado || saving;

  const fechaHoy = new Date().toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Bogota",
  });

  const fechaMostrada = isCreate
    ? fechaHoy
    : initialData?.fechaISO
    ? formatLocalDateFromISO(initialData.fechaISO)
    : "";

  return (
    <>
      <BaseFormLayout title={title}>
        {estadoGuardado === "anulado" && (
          <div style={banner("#991b1b", "#fee2e2", "#fecaca")}>
            Este pedido esta anulado y no puede ser modificado.
          </div>
        )}
        {estadoGuardado === "pagado" && !isView && (
          <div style={banner("#166534", "#dcfce7", "#bbf7d0")}>
            Este pedido esta pagado. Ya genero una venta y no puede ser modificado.
          </div>
        )}

        <BaseFormSection title="Informacion del Pedido">
          <BaseFormField>
            <TextField
              fullWidth
              label="Fecha del Pedido"
              value={fechaMostrada}
              InputProps={{ readOnly: true, style: viewFieldStyle }}
              InputLabelProps={{ shrink: true }}
              helperText={
                isCreate ? "Se registra automaticamente al guardar" : ""
              }
            />
          </BaseFormField>

          <BaseFormField>
            {isView ? (
              <TextField
                fullWidth
                label="Cliente"
                value={clienteNombreVisible}
                InputProps={{ readOnly: true, style: viewFieldStyle }}
                InputLabelProps={{ shrink: true }}
              />
            ) : (
              <FormControl fullWidth disabled={isDisabled || catalogLoading}>
                <InputLabel>Cliente</InputLabel>
                <Select
                  value={formData.cliente_id}
                  label="Cliente"
                  onChange={(e) =>
                    setFormData({ ...formData, cliente_id: e.target.value })
                  }
                >
                  {catalogLoading ? (
                    <MenuItem disabled>
                      <em>Cargando...</em>
                    </MenuItem>
                  ) : clientes.length === 0 ? (
                    <MenuItem disabled>
                      <em>No hay clientes activos</em>
                    </MenuItem>
                  ) : (
                    clientes.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.nombre}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            )}
          </BaseFormField>

          <BaseFormField>
            {isView ? (
              <TextField
                fullWidth
                label="Metodo de Pago"
                value={
                  formData.metodo_pago?.charAt(0).toUpperCase() +
                  formData.metodo_pago?.slice(1)
                }
                InputProps={{ readOnly: true, style: viewFieldStyle }}
                InputLabelProps={{ shrink: true }}
              />
            ) : (
              <FormControl fullWidth disabled={isDisabled}>
                <InputLabel>Metodo de Pago</InputLabel>
                <Select
                  value={formData.metodo_pago}
                  label="Metodo de Pago"
                  onChange={(e) =>
                    setFormData({ ...formData, metodo_pago: e.target.value })
                  }
                >
                  {METODOS_PAGO.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </BaseFormField>

          <BaseFormField>
            {isView ? (
              <TextField
                fullWidth
                label="Metodo de Entrega"
                value={
                  formData.metodo_entrega?.charAt(0).toUpperCase() +
                  formData.metodo_entrega?.slice(1)
                }
                InputProps={{ readOnly: true, style: viewFieldStyle }}
                InputLabelProps={{ shrink: true }}
              />
            ) : (
              <FormControl fullWidth disabled={isDisabled}>
                <InputLabel>Metodo de Entrega</InputLabel>
                <Select
                  value={formData.metodo_entrega}
                  label="Metodo de Entrega"
                  onChange={(e) =>
                    setFormData({ ...formData, metodo_entrega: e.target.value })
                  }
                >
                  {METODOS_ENTREGA.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </BaseFormField>

          {(formData.metodo_entrega === "domicilio" ||
            (isView && formData.direccion_entrega)) && (
            <BaseFormField>
              <TextField
                fullWidth
                label="Direccion de Entrega"
                value={formData.direccion_entrega}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  readOnly: isView,
                  style: isView ? viewFieldStyle : {},
                }}
                onChange={
                  !isDisabled
                    ? (e) =>
                        setFormData({
                          ...formData,
                          direccion_entrega: e.target.value,
                        })
                    : undefined
                }
                placeholder="Calle, barrio, ciudad..."
              />
            </BaseFormField>
          )}

          <BaseFormField>
            {isView ? (
              <TextField
                fullWidth
                label="Estado"
                value={
                  ESTADOS_PEDIDO.find((e) => e.value === formData.estado)
                    ?.label || formData.estado
                }
                InputProps={{ readOnly: true, style: viewFieldStyle }}
                InputLabelProps={{ shrink: true }}
              />
            ) : (
              <FormControl fullWidth disabled={formBloqueado}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formData.estado}
                  label="Estado"
                  onChange={(e) =>
                    setFormData({ ...formData, estado: e.target.value })
                  }
                >
                  {ESTADOS_PEDIDO.map((e) => (
                    <MenuItem key={e.value} value={e.value}>
                      {e.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </BaseFormField>

          {!formBloqueado && (
            <>
              <BaseFormField>
                <FormControl
                  fullWidth
                  disabled={catalogLoading || productos.length === 0}
                >
                  <InputLabel>Agregar Producto</InputLabel>
                  <Select
                    value=""
                    label="Agregar Producto"
                    onChange={(e) => {
                      const prod = productos.find(
                        (p) => p.id === e.target.value
                      );
                      if (prod) agregarItem(prod);
                    }}
                  >
                    {catalogLoading ? (
                      <MenuItem disabled>
                        <em>Cargando...</em>
                      </MenuItem>
                    ) : productos.length === 0 ? (
                      <MenuItem disabled>
                        <em>Sin stock disponible</em>
                      </MenuItem>
                    ) : (
                      productos.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.nombre} — {formatCurrency(p.precio)}
                          <span
                            style={{
                              color: "#9ca3af",
                              fontSize: "0.82em",
                              marginLeft: 6,
                            }}
                          >
                            (stock: {p.stock})
                          </span>
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </BaseFormField>

              {stockWarning && (
                <div
                  style={{
                    background: "#fef3c7",
                    border: "1px solid #f59e0b",
                    borderRadius: 8,
                    padding: "8px 14px",
                    marginTop: 4,
                    fontSize: "0.85rem",
                    color: "#92400e",
                  }}
                >
                  {stockWarning}
                </div>
              )}
            </>
          )}

          {isCreate && (
            <BaseFormField>
              <TextField
                fullWidth
                label="Abono inicial (opcional)"
                type="number"
                value={formData.abono_inicial}
                onChange={(e) =>
                  setFormData({ ...formData, abono_inicial: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 0 }}
                helperText={
                  formData.abono_inicial &&
                  parseFloat(formData.abono_inicial) >= calcularTotal() &&
                  calcularTotal() > 0
                    ? "El pedido quedara como Pagado al guardar"
                    : "Abono que entrega el cliente al registrar el pedido"
                }
              />
            </BaseFormField>
          )}
        </BaseFormSection>

        {mostrarTabla && (
          <BaseFormSection
            title={isView ? "Items del Pedido" : "Resumen del Pedido"}
          >
            <div
              style={{
                marginTop: 24,
                display: "grid",
                gridTemplateColumns: "1fr 220px",
                gap: 24,
                background: "#f9fafb",
                padding: 24,
                borderRadius: 16,
                border: "1px solid #e5e7eb",
              }}
            >
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: formBloqueado
                      ? "3fr 1fr 1.2fr 1.2fr"
                      : "3fr 1fr 1.2fr 1.2fr 36px",
                    fontWeight: 600,
                    paddingBottom: 10,
                    borderBottom: "2px solid #e5e7eb",
                    color: "#9ca3af",
                    fontSize: "0.82rem",
                    textAlign: "center",
                  }}
                >
                  <div style={{ textAlign: "left" }}>Producto</div>
                  <div>Cant.</div>
                  <div style={{ textAlign: "right" }}>Precio</div>
                  <div style={{ textAlign: "right" }}>Subtotal</div>
                  {!formBloqueado && <div />}
                </div>

                {itemsSeleccionados.map((item, index) => (
                  <div
                    key={`${item.producto_id ?? item.servicio_id}-${index}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: formBloqueado
                        ? "3fr 1fr 1.2fr 1.2fr"
                        : "3fr 1fr 1.2fr 1.2fr 36px",
                      padding: "10px 4px",
                      borderBottom: "1px solid #eee",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ textAlign: "left", fontWeight: 500 }}>
                      {item.nombre}
                      {!formBloqueado && item.stock !== null && (
                        <span
                          style={{
                            color: "#9ca3af",
                            fontSize: "0.72rem",
                            marginLeft: 6,
                          }}
                        >
                          (max. {item.stock})
                        </span>
                      )}
                    </div>
                    <div>
                      {!formBloqueado ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 3,
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              actualizarCantidad(index, item.cantidad - 1)
                            }
                            style={{
                              width: 20,
                              height: 20,
                              background: "#e5e7eb",
                              border: "none",
                              borderRadius: 4,
                              cursor: "pointer",
                              fontWeight: 700,
                              fontSize: "0.9rem",
                            }}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.cantidad}
                            onChange={(e) =>
                              actualizarCantidad(
                                index,
                                parseInt(e.target.value) || 1
                              )
                            }
                            style={{
                              width: 36,
                              textAlign: "center",
                              padding: "2px 4px",
                              border: "1px solid #d1d5db",
                              borderRadius: 4,
                              fontSize: "0.82rem",
                            }}
                            min="1"
                            max={item.stock ?? undefined}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              actualizarCantidad(index, item.cantidad + 1)
                            }
                            style={{
                              width: 20,
                              height: 20,
                              background: "#e5e7eb",
                              border: "none",
                              borderRadius: 4,
                              cursor: "pointer",
                              fontWeight: 700,
                              fontSize: "0.9rem",
                            }}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        item.cantidad
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {formatCurrency(item.precio)}
                    </div>
                    <div style={{ textAlign: "right", fontWeight: 600 }}>
                      {formatCurrency((item.precio ?? 0) * item.cantidad)}
                    </div>
                    {!formBloqueado && (
                      <button
                        type="button"
                        onClick={() => removerItem(index)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#ef4444",
                          fontSize: "1rem",
                        }}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: isView ? "#f3f4f6" : "#fff",
                  borderRadius: 12,
                  padding: 16,
                  border: "1px solid #e5e7eb",
                  height: "fit-content",
                  fontSize: 14,
                }}
              >
                <div style={{ marginBottom: 8 }}>
                  <span style={{ color: "#9ca3af" }}>Pago</span>
                  <strong
                    style={{ float: "right", textTransform: "capitalize" }}
                  >
                    {formData.metodo_pago || "—"}
                  </strong>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ color: "#9ca3af" }}>Entrega</span>
                  <strong
                    style={{ float: "right", textTransform: "capitalize" }}
                  >
                    {formData.metodo_entrega || "—"}
                  </strong>
                </div>
                <div
                  style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: "2px solid #e5e7eb",
                    fontSize: 15,
                  }}
                >
                  <span style={{ color: "#9ca3af" }}>Total</span>
                  <strong style={{ float: "right" }}>
                    {formatCurrency(calcularTotal())}
                  </strong>
                </div>

                {isCreate &&
                  formData.abono_inicial &&
                  parseFloat(formData.abono_inicial) > 0 && (
                    <div
                      style={{
                        marginTop: 8,
                        paddingTop: 8,
                        borderTop: "1px solid #e5e7eb",
                      }}
                    >
                      <span style={{ color: "#9ca3af" }}>Abono inicial</span>
                      <strong style={{ float: "right", color: "#10b981" }}>
                        {formatCurrency(parseFloat(formData.abono_inicial))}
                      </strong>
                      <br />
                      <span style={{ color: "#9ca3af" }}>Saldo</span>
                      <strong
                        style={{
                          float: "right",
                          color:
                            calcularTotal() -
                              parseFloat(formData.abono_inicial) <=
                            0
                              ? "#10b981"
                              : "#ef4444",
                        }}
                      >
                        {calcularTotal() - parseFloat(formData.abono_inicial) <=
                        0
                          ? "Pagado"
                          : formatCurrency(
                              calcularTotal() -
                                parseFloat(formData.abono_inicial)
                            )}
                      </strong>
                    </div>
                  )}

                {(isView || isEdit) && abonosInfo && (
                  <div
                    style={{
                      marginTop: 10,
                      borderTop: "2px solid #e5e7eb",
                      paddingTop: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <span style={{ color: "#9ca3af", fontSize: 13 }}>
                        Abonado
                      </span>
                      <strong style={{ color: "#10b981", fontSize: 13 }}>
                        {formatCurrency(abonosInfo.totalAbonado)}
                      </strong>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ color: "#9ca3af", fontSize: 13 }}>
                        Saldo
                      </span>
                      <strong
                        style={{
                          fontSize: 13,
                          color:
                            abonosInfo.saldoPendiente <= 0
                              ? "#10b981"
                              : "#ef4444",
                        }}
                      >
                        {abonosInfo.saldoPendiente <= 0
                          ? "Pagado"
                          : formatCurrency(abonosInfo.saldoPendiente)}
                      </strong>
                    </div>
                    {abonosInfo.abonos.length > 0 && (
                      <>
                        <div
                          style={{
                            fontSize: "0.7rem",
                            color: "#9ca3af",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            marginBottom: 6,
                          }}
                        >
                          Historial
                        </div>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 4,
                          }}
                        >
                          {abonosInfo.abonos.map((a, i) => (
                            <div
                              key={a.id}
                              style={{
                                background: "#f0fdf4",
                                border: "1px solid #bbf7d0",
                                borderRadius: 8,
                                padding: "6px 8px",
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "0.68rem",
                                  color: "#9ca3af",
                                }}
                              >
                                #{i + 1} ·{" "}
                                {a.fecha
                                  ? new Date(a.fecha).toLocaleDateString(
                                      "es-CO",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "2-digit",
                                      }
                                    )
                                  : "—"}
                              </span>
                              <span
                                style={{
                                  fontSize: "0.85rem",
                                  color: "#059669",
                                  fontWeight: 700,
                                }}
                              >
                                {formatCurrency(a.monto_abonado)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </BaseFormSection>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 36,
          }}
        >
          {isView ? (
            <>
              <button
                style={btnSecondary}
                onClick={onCancel}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(26,37,64,0.06)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Volver
              </button>

              {onPdf && formData.estado === "pagado" && (
                <button
                  style={btnBlue}
                  onClick={onPdf}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#1d4ed8";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#2563eb";
                  }}
                >
                  Generar PDF
                </button>
              )}

              {onEdit && estadoGuardado !== "anulado" && estadoGuardado !== "pagado" && (
                <button
                  style={btnPrimary}
                  onClick={onEdit}
                  onMouseOver={(e) => {
                    e.currentTarget.style.opacity = "0.88";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  Editar
                </button>
              )}
            </>
          ) : (
            <BaseFormActions
              onCancel={onCancel}
              onSave={guardarPedido}
              saveLabel={saving ? "Guardando..." : "Guardar"}
              showSave={!formBloqueado}
              saveDisabled={saving || formBloqueado}
            />
          )}
        </div>
      </BaseFormLayout>

      <Modal
        open={modalConfirm.open}
        type={formData.estado === "anulado" ? "warning" : "info"}
        title={modalConfirm.titulo}
        message={modalConfirm.mensaje}
        confirmText="Confirmar"
        cancelText="Cancelar"
        showCancel
        onConfirm={modalConfirm.onConfirm}
        onCancel={closeModalConfirm}
      />

      <CrudNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() =>
          setNotification({ ...notification, isVisible: false })
        }
      />
    </>
  );
}