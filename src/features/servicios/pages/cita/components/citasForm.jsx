import { useState, useEffect } from "react";
import { FormHelperText, MenuItem, TextField, Grid } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import esLocale from 'date-fns/locale/es';

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
  estadosCita = []
}) {
  const isView = mode === "view";

  const [formData, setFormData] = useState({
    cliente_id: "",
    servicio_id: "",
    empleado_id: "",
    estado_cita_id: "",
    metodo_pago: "",
    fecha: null,
    hora: null,
    duracion: 30
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        cliente_id: initialData.cliente_id || "",
        servicio_id: initialData.servicio_id || "",
        empleado_id: initialData.empleado_id || "",
        estado_cita_id: initialData.estado_cita_id || "",
        metodo_pago: initialData.metodo_pago || "",
        fecha: initialData.fecha ? new Date(initialData.fecha) : null,
        hora: initialData.hora ? (() => {
          const [hours, minutes] = initialData.hora.split(':');
          const date = new Date();
          date.setHours(hours, minutes, 0);
          return date;
        })() : null,
        duracion: initialData.duracion || 30
      });
    }
  }, [initialData]);

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
    setFormData((prev) => ({ ...prev, fecha: date }));
    if (errors.fecha) {
      setErrors((prev) => ({ ...prev, fecha: "" }));
    }
  };

  const handleTimeChange = (time) => {
    setFormData((prev) => ({ ...prev, hora: time }));
    if (errors.hora) {
      setErrors((prev) => ({ ...prev, hora: "" }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};

    // Validaciones
    if (!formData.cliente_id) {
      newErrors.cliente_id = "Seleccione un cliente";
    }

    if (!formData.servicio_id) {
      newErrors.servicio_id = "Seleccione un servicio";
    }

    if (!formData.empleado_id) {
      newErrors.empleado_id = "Seleccione un empleado";
    }

    if (!formData.estado_cita_id) {
      newErrors.estado_cita_id = "Seleccione un estado";
    }

    if (!formData.fecha) {
      newErrors.fecha = "Seleccione una fecha";
    } else {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (formData.fecha < hoy) {
        newErrors.fecha = "La fecha no puede ser anterior a hoy";
      }
    }

    if (!formData.hora) {
      newErrors.hora = "Seleccione una hora";
    }

    if (!formData.duracion) {
      newErrors.duracion = "Ingrese la duración";
    } else if (formData.duracion < 15 || formData.duracion > 180) {
      newErrors.duracion = "La duración debe estar entre 15 y 180 minutos";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    // Preparar datos para enviar - SOLO método de pago es manual, el resto viene de la API
    const datosEnvio = {
      cliente_id: formData.cliente_id,
      servicio_id: formData.servicio_id,
      empleado_id: formData.empleado_id,
      estado_cita_id: formData.estado_cita_id,
      metodo_pago: formData.metodo_pago, // Único campo manual
      fecha: formData.fecha ? formData.fecha.toISOString().split('T')[0] : null,
      hora: formData.hora ? 
        `${formData.hora.getHours().toString().padStart(2, '0')}:${formData.hora.getMinutes().toString().padStart(2, '0')}` 
        : null,
      duracion: formData.duracion
    };

    onSubmit?.(datosEnvio);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={esLocale}>
      <BaseFormLayout title={title}>
        <BaseFormSection title="Información de la Cita">
          <Grid container spacing={3}>
            {/* Cliente - de API */}
            <Grid item xs={12} md={6}>
              <BaseFormField>
                <TextField
                  select
                  fullWidth
                  label="Cliente*"
                  name="cliente_id"
                  value={formData.cliente_id}
                  onChange={handleChange}
                  disabled={isView}
                  size="small"
                  required
                  error={!!errors.cliente_id}
                >
                  <MenuItem value="">Seleccionar cliente</MenuItem>
                  {clientes.map((cliente) => (
                    <MenuItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre} {cliente.apellido || ''}
                    </MenuItem>
                  ))}
                </TextField>
                <FormHelperText error>
                  {errors.cliente_id || " "}
                </FormHelperText>
              </BaseFormField>
            </Grid>

            {/* Servicio - de API */}
            <Grid item xs={12} md={6}>
              <BaseFormField>
                <TextField
                  select
                  fullWidth
                  label="Servicio*"
                  name="servicio_id"
                  value={formData.servicio_id}
                  onChange={handleChange}
                  disabled={isView}
                  size="small"
                  required
                  error={!!errors.servicio_id}
                >
                  <MenuItem value="">Seleccionar servicio</MenuItem>
                  {servicios.map((servicio) => (
                    <MenuItem key={servicio.id} value={servicio.id}>
                      {servicio.nombre}
                    </MenuItem>
                  ))}
                </TextField>
                <FormHelperText error>
                  {errors.servicio_id || " "}
                </FormHelperText>
              </BaseFormField>
            </Grid>

            {/* Empleado - de API */}
            <Grid item xs={12} md={6}>
              <BaseFormField>
                <TextField
                  select
                  fullWidth
                  label="Empleado*"
                  name="empleado_id"
                  value={formData.empleado_id}
                  onChange={handleChange}
                  disabled={isView}
                  size="small"
                  required
                  error={!!errors.empleado_id}
                >
                  <MenuItem value="">Seleccionar empleado</MenuItem>
                  {empleados
                    .filter(emp => emp.estado === "activo" || emp.estado === true)
                    .map((empleado) => (
                      <MenuItem key={empleado.id} value={empleado.id}>
                        {empleado.nombre}
                      </MenuItem>
                    ))}
                </TextField>
                <FormHelperText error>
                  {errors.empleado_id || " "}
                </FormHelperText>
              </BaseFormField>
            </Grid>

            {/* Estado Cita - de API */}
            <Grid item xs={12} md={6}>
              <BaseFormField>
                <TextField
                  select
                  fullWidth
                  label="Estado de la Cita*"
                  name="estado_cita_id"
                  value={formData.estado_cita_id}
                  onChange={handleChange}
                  disabled={isView}
                  size="small"
                  required
                  error={!!errors.estado_cita_id}
                >
                  <MenuItem value="">Seleccionar estado</MenuItem>
                  {estadosCita.map((estado) => (
                    <MenuItem key={estado.id} value={estado.id}>
                      {estado.nombre}
                    </MenuItem>
                  ))}
                </TextField>
                <FormHelperText error>
                  {errors.estado_cita_id || " "}
                </FormHelperText>
              </BaseFormField>
            </Grid>

            {/* Método de Pago - ÚNICO MANUAL */}
            <Grid item xs={12} md={6}>
              <BaseFormField>
                <TextField
                  select
                  fullWidth
                  label="Método de Pago*"
                  name="metodo_pago"
                  value={formData.metodo_pago}
                  onChange={handleChange}
                  disabled={isView}
                  size="small"
                  required
                  error={!!errors.metodo_pago}
                >
                  <MenuItem value="">Seleccionar método</MenuItem>
                  <MenuItem value="Efectivo">Efectivo</MenuItem>
                  <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                  <MenuItem value="Transferencia">Transferencia</MenuItem>
                </TextField>
                <FormHelperText error>
                  {errors.metodo_pago || " "}
                </FormHelperText>
              </BaseFormField>
            </Grid>

            {/* Duración - de API (viene en initialData) */}
            <Grid item xs={12} md={6}>
              <BaseFormField>
                <BaseInputField
                  label="Duración (minutos)*"
                  name="duracion"
                  type="number"
                  value={formData.duracion}
                  onChange={handleChange}
                  disabled={isView}
                  required
                  asterisk
                  InputProps={{ inputProps: { min: 15, max: 180, step: 5 } }}
                />
                <FormHelperText error>
                  {errors.duracion || " "}
                </FormHelperText>
              </BaseFormField>
            </Grid>

            {/* Fecha - de API */}
            <Grid item xs={12} md={6}>
              <BaseFormField>
                <DatePicker
                  label="Fecha*"
                  value={formData.fecha}
                  onChange={handleDateChange}
                  disabled={isView}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: !!errors.fecha,
                      required: true
                    }
                  }}
                />
                <FormHelperText error>
                  {errors.fecha || " "}
                </FormHelperText>
              </BaseFormField>
            </Grid>

            {/* Hora - de API */}
            <Grid item xs={12} md={6}>
              <BaseFormField>
                <TimePicker
                  label="Hora*"
                  value={formData.hora}
                  onChange={handleTimeChange}
                  disabled={isView}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: !!errors.hora,
                      required: true
                    }
                  }}
                />
                <FormHelperText error>
                  {errors.hora || " "}
                </FormHelperText>
              </BaseFormField>
            </Grid>
          </Grid>
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