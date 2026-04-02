import { useState, useEffect } from "react";
import { ventasService } from "../services/ventasService";
import { ESTADOS_VENTA, METODOS_PAGO, METODOS_ENTREGA, formatCurrency } from "../utils/ventasUtils";

export function useVentaForm({ mode = "view", initialData = null, onSuccess, onError }) {
  const isView = mode === "view";
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    estado: "completada",
    metodo_pago: "",
    metodo_entrega: "",
    direccion_entrega: "",
    transferencia_comprobante: "",
    total: 0,
  });
  const [detalles, setDetalles] = useState([]);
  const [abonos, setAbonos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ isVisible: false, message: "", type: "success" });

  useEffect(() => {
    if (initialData) {
      setFormData({
        estado: initialData.estado || "completada",
        metodo_pago: initialData.metodo_pago || "",
        metodo_entrega: initialData.metodo_entrega || "",
        direccion_entrega: initialData.direccion_entrega || "",
        transferencia_comprobante: initialData.transferencia_comprobante || "",
        total: initialData.total || 0,
      });
      setDetalles(initialData.detalles || []);
      setAbonos(initialData.abonos || []);
      setLoading(false);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const guardarVenta = async () => {
    setSaving(true);
    try {
      const payload = {
        estado: formData.estado,
        metodo_pago: formData.metodo_pago,
        metodo_entrega: formData.metodo_entrega,
        direccion_entrega: formData.direccion_entrega,
        transferencia_comprobante: formData.transferencia_comprobante,
        total: formData.total,
      };
      await ventasService.updateVenta(initialData.id, payload);
      setNotification({ isVisible: true, message: "Venta actualizada correctamente.", type: "success" });
      if (onSuccess) onSuccess();
      setTimeout(() => setNotification(prev => ({ ...prev, isVisible: false })), 3000);
    } catch (error) {
      const msg = error?.response?.data?.error || "Error al actualizar la venta";
      setNotification({ isVisible: true, message: msg, type: "error" });
      if (onError) onError(msg);
    } finally {
      setSaving(false);
    }
  };

  const calcularTotalAbonado = () => {
    return abonos.reduce((sum, a) => sum + (a.monto_abonado || 0), 0);
  };

  const saldoPendiente = formData.total - calcularTotalAbonado();

  return {
    formData,
    setFormData,
    detalles,
    abonos,
    loading,
    saving,
    notification,
    setNotification,
    isView,
    isEdit,
    handleChange,
    guardarVenta,
    calcularTotalAbonado,
    saldoPendiente,
    formatCurrency,
    ESTADOS_VENTA,
    METODOS_PAGO,
    METODOS_ENTREGA,
  };
}