import { useState, useEffect } from "react";
import { FormHelperText } from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import esLocale from "date-fns/locale/es";

import BaseFormLayout from "../../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../../../shared/components/base/BaseInputField";

export default function CitaForm({
  mode = "create",
  title,
  initialData,
  onSubmit,
  onCancel,
  onEdit,
  clientes = [],
  servicios = [],
  empleados = [],
  estadosCita = [],
}) {
  const isView = mode === "view";

  // ============================
  // STATE
  // ============================
  const [formData, setFormData] = useState({
    cliente_id: "",
    servicio_id: "",
    empleado_id: "",
    estado_cita_id: "",
    metodo_pago: "",
    fecha: null,
    hora: null,
    duracion: 30,
  });

  const [errors, setErrors] = useState({});

  // ============================
  // LOAD INITIAL DATA
  // ============================
  useEffect(() => {
    if (!initialData) return;

    setFormData({
      cliente_id: initialData.cliente_id || "",
      servicio_id: initialData.servicio_id || "",
      empleado_id: initialData.empleado_id || "",
      estado_cita_id: initialData.estado_cita_id || "",
      metodo_pago: initialData.metodo_pago || "",
      fecha: initialData.fecha ? new Date(initialData.fecha) : null,
      hora: initialData.hora
        ? (() => {
            const [h, m] = initialData.hora.split(":");
            const d = new Date();
            d.setHours(h, m, 0);
            return d;
          })()
        : null,
      duracion: initialData.duracion || 30,
    });
  }, [initialData]);

  // ============================
  // DEFAULT ESTADO (CREATE)
  // ============================
  useEffect(() => {
    if (
      mode === "create" &&
      estadosCita.length > 0 &&
      !formData.estado_cita_id
    ) {
      const estadoPendiente =
        estadosCita.find(e =>
          e.nombre?.toLowerCase().includes("pendiente")
        ) || estadosCita[0];

      setFormData(prev => ({
        ...prev,
        estado_cita_id: estadoPendiente.id
      }));
    }
  }, [estadosCita, mode]);

  // ============================
  // HANDLE CHANGE
  // ============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDateChange = (date) => {
    setFormData((p) => ({ ...p, fecha: date }));
    if (errors.fecha) setErrors((p) => ({ ...p, fecha: "" }));
  };

  const handleTimeChange = (time) => {
    setFormData((p) => ({ ...p, hora: time }));
    if (errors.hora) setErrors((p) => ({ ...p, hora: "" }));
  };

  // ============================
  // VALIDACIÓN
  // ============================
  const handleSubmit = () => {
    const newErrors = {};

    if (!formData.cliente_id)
      newErrors.cliente_id = "Seleccione un cliente";

    if (!formData.servicio_id)
      newErrors.servicio_id = "Seleccione un servicio";

    if (!formData.empleado_id)
      newErrors.empleado_id = "Seleccione un empleado";

    if (!formData.estado_cita_id)
      newErrors.estado_cita_id = "Seleccione un estado";

    if (!formData.metodo_pago)
      newErrors.metodo_pago = "Seleccione un método de pago";

    if (!formData.fecha) {
      newErrors.fecha = "Seleccione una fecha";
    } else {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (formData.fecha < hoy)
        newErrors.fecha = "La fecha no puede ser anterior a hoy";
    }

    if (!formData.hora)
      newErrors.hora = "Seleccione una hora";

    if (!formData.duracion) {
      newErrors.duracion = "Ingrese la duración";
    } else if (formData.duracion < 15 || formData.duracion > 180) {
      newErrors.duracion = "Debe estar entre 15 y 180 minutos";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    // Adaptar formato backend
    const datosEnvio = {
      ...formData,
      fecha: formData.fecha
        ? formData.fecha.toISOString().split("T")[0]
        : null,
      hora: formData.hora
        ? `${formData.hora.getHours()
            .toString()
            .padStart(2, "0")}:${formData.hora
            .getMinutes()
            .toString()
            .padStart(2, "0")}`
        : null,
    };

    onSubmit?.(datosEnvio);
  };

  // ============================
  // OPTIONS
  // ============================
  const metodoPagoOptions = [
    { value: "", label: "-- Seleccione método --" },
    { value: "Efectivo", label: "Efectivo" },
    { value: "Tarjeta", label: "Tarjeta" },
    { value: "Transferencia", label: "Transferencia" },
  ];

  // ============================
  // UI
  // ============================
  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={esLocale}
    >
      <BaseFormLayout title={title}>
        <BaseFormSection title="Información de la Cita">

          <BaseFormField>
            <BaseInputField
              label="Cliente"
              name="cliente_id"
              select
              value={formData.cliente_id}
              onChange={handleChange}
              disabled={isView}
              options={[
                { value: "", label: "-- Seleccione --" },
                ...clientes.map((c) => ({
                  value: c.id,
                  label: `${c.nombre} ${c.apellido || ""}`,
                })),
              ]}
              required
              error={!!errors.cliente_id}
              helperText={errors.cliente_id}
            />
          </BaseFormField>

          <BaseFormField>
            <BaseInputField
              label="Servicio"
              name="servicio_id"
              select
              value={formData.servicio_id}
              onChange={handleChange}
              disabled={isView}
              options={[
                { value: "", label: "-- Seleccione --" },
                ...servicios.map((s) => ({
                  value: s.id,
                  label: s.nombre,
                })),
              ]}
              required
              error={!!errors.servicio_id}
              helperText={errors.servicio_id}
            />
          </BaseFormField>

          <BaseFormField>
            <BaseInputField
              label="Empleado"
              name="empleado_id"
              select
              value={formData.empleado_id}
              onChange={handleChange}
              disabled={isView}
              options={[
                { value: "", label: "-- Seleccione --" },
                ...empleados
                  .filter(e => e.estado === "activo" || e.estado === true)
                  .map((e) => ({
                    value: e.id,
                    label: e.nombre,
                  })),
              ]}
              required
              error={!!errors.empleado_id}
              helperText={errors.empleado_id}
            />
          </BaseFormField>

          <BaseFormField>
            <BaseInputField
              label="Estado"
              name="estado_cita_id"
              select
              value={formData.estado_cita_id}
              onChange={handleChange}
              disabled={isView}
              options={[
                { value: "", label: "-- Seleccione --" },
                ...estadosCita.map((e) => ({
                  value: e.id,
                  label: e.nombre,
                })),
              ]}
              required
              error={!!errors.estado_cita_id}
              helperText={errors.estado_cita_id}
            />
          </BaseFormField>

          <BaseFormField>
            <BaseInputField
              label="Método de Pago"
              name="metodo_pago"
              select
              value={formData.metodo_pago}
              onChange={handleChange}
              disabled={isView}
              options={metodoPagoOptions}
              required
              error={!!errors.metodo_pago}
              helperText={errors.metodo_pago}
            />
          </BaseFormField>

          <BaseFormField>
            <BaseInputField
              label="Duración (min)"
              name="duracion"
              type="number"
              value={formData.duracion}
              onChange={handleChange}
              disabled={isView}
              required
              error={!!errors.duracion}
              helperText={errors.duracion}
            />
          </BaseFormField>

          {/* FECHA */}
          <BaseFormField>
            <DatePicker
              label="Fecha"
              value={formData.fecha}
              onChange={handleDateChange}
              disabled={isView}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  error: !!errors.fecha,
                  required: true,
                },
              }}
            />
            <FormHelperText error>
              {errors.fecha || " "}
            </FormHelperText>
          </BaseFormField>

          {/* HORA */}
          <BaseFormField>
            <TimePicker
              label="Hora"
              value={formData.hora}
              onChange={handleTimeChange}
              disabled={isView}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  error: !!errors.hora,
                  required: true,
                },
              }}
            />
            <FormHelperText error>
              {errors.hora || " "}
            </FormHelperText>
          </BaseFormField>

        </BaseFormSection>

        <BaseFormActions
          onCancel={onCancel}
          onSave={handleSubmit}
          onEdit={onEdit}
          showSave={mode !== "view"}
          showEdit={mode === "view"}
        />
      </BaseFormLayout>
    </LocalizationProvider>
  );
}