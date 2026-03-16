import { useState, useEffect } from "react";

import BaseFormLayout from "../../../../../shared/components/base/BaseFormLayout";
import BaseFormSection from "../../../../../shared/components/base/BaseFormSection";
import BaseFormField from "../../../../../shared/components/base/BaseFormField";
import BaseFormActions from "../../../../../shared/components/base/BaseFormActions";
import BaseInputField from "../../../../../shared/components/base/BaseInputField";

export default function CampanaSaludForm({
  mode = "create",
  title,
  initialData,
  empleadosDisponibles = [],
  onSubmit,
  onCancel,
  onEdit
}) {
  const isView = mode === "view";
  const isCreate = mode === "create";

  const [formData, setFormData] = useState({
    empleado_id: "",
    empresa: "",
    contacto: "",
    fecha: "",
    hora: "",
    direccion: "",
    observaciones: "",
    estado: true
  });

  const [errors, setErrors] = useState({});

  // Cargar datos iniciales si existen
  useEffect(() => {
    if (initialData) {
      setFormData({
        empleado_id: initialData.empleado_id || "",
        empresa: initialData.empresa || "",
        contacto: initialData.contacto || "",
        fecha: initialData.fecha ? initialData.fecha.split('T')[0] : "",
        hora: initialData.hora || "",
        direccion: initialData.direccion || "",
        observaciones: initialData.observaciones || "",
        estado: initialData.estado !== undefined ? initialData.estado : true
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando se modifica
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};

    // Validaciones según el modelo del backend
    if (!formData.empleado_id) {
      newErrors.empleado_id = "Debe seleccionar un empleado responsable";
    }

    if (!formData.empresa.trim()) {
      newErrors.empresa = "El nombre de la empresa es requerido";
    } else if (formData.empresa.length > 20) {
      newErrors.empresa = "Máximo 20 caracteres";
    }

    if (formData.contacto && formData.contacto.length > 15) {
      newErrors.contacto = "Máximo 15 caracteres";
    }

    if (!formData.fecha) {
      newErrors.fecha = "La fecha es requerida";
    } else {
      // Validar que la fecha no sea pasada
      const fechaSeleccionada = new Date(formData.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaSeleccionada < hoy) {
        newErrors.fecha = "La fecha no puede ser pasada";
      }
    }

    if (!formData.hora) {
      newErrors.hora = "La hora es requerida";
    }

    if (formData.direccion && formData.direccion.length > 30) {
      newErrors.direccion = "Máximo 30 caracteres";
    }

    if (formData.observaciones && formData.observaciones.length > 100) {
      newErrors.observaciones = "Máximo 100 caracteres";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Preparar datos para enviar al backend
    const dataToSubmit = {
      ...formData,
      empleado_id: Number(formData.empleado_id)
    };

    onSubmit?.(dataToSubmit);
  };

  return (
    <BaseFormLayout title={title}>
      {/* INFORMACIÓN DE LA CAMPAÑA */}
      <BaseFormSection>
        <BaseFormField>
          <BaseInputField
            label="Empresa"
            name="empresa"
            value={formData.empresa}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.empresa}
            helperText={errors.empresa}
          />
        </BaseFormField>
        <BaseFormField>
          <BaseInputField
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            disabled={isView}
            error={!!errors.direccion}
            helperText={errors.direccion }
          />
        </BaseFormField>
        <BaseFormField>
          <BaseInputField
            label="Contacto"
            name="contacto"
            value={formData.contacto}
            onChange={(e) => {
              const soloNumeros = e.target.value.replace(/\D/g, "");
              handleChange({
                target: { name: "contacto", value: soloNumeros }
              });
            }}
            disabled={isView}
            error={!!errors.contacto}
            helperText={errors.contacto }
          />
        </BaseFormField>
            <BaseFormField>
          <BaseInputField
            label="Empleado Responsable"
            name="empleado_id"
            value={formData.empleado_id}
            onChange={handleChange}
            select
            options={[
              { value: "", label: "-- Seleccione un empleado --" },
              ...empleadosDisponibles.map((emp) => ({
                value: emp.id,
                label: `${emp.nombre}${emp.cargo ? ` - ${emp.cargo}` : ''}`
              }))
            ]}
            disabled={isView}
            required
            error={!!errors.empleado_id}
            helperText={errors.empleado_id}
          />
        </BaseFormField>
        <BaseFormField>
          <BaseInputField
            label="Fecha"
            name="fecha"
            type="date"
            value={formData.fecha}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.fecha}
            helperText={errors.fecha}
          />
        </BaseFormField>

        <BaseFormField>
          <BaseInputField
            label="Hora"
            name="hora"
            type="time"
            value={formData.hora}
            onChange={handleChange}
            disabled={isView}
            required
            error={!!errors.hora}
            helperText={errors.hora}
          />
        </BaseFormField>

        
      </BaseFormSection>

      {/* RESPONSABLE Y ESTADO */}
      <BaseFormSection>
        

        {/* Solo mostrar campo de estado en modo edición y vista */}
        {!isCreate && (
          <BaseFormField>
            <BaseInputField
              label="Estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              select={!isView}
              options={!isView ? [
                { value: true, label: "Activo" },
                { value: false, label: "Inactivo" }
              ] : []}
              disabled={isView}
              error={!!errors.estado}
              helperText={errors.estado}
            />
          </BaseFormField>
        )}
      </BaseFormSection>

      {/* OBSERVACIONES */}
      <BaseFormSection>
        <BaseFormField>
          <BaseInputField
            label="Observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            multiline
            rows={3}
            disabled={isView}
            error={!!errors.observaciones}
            helperText={errors.observaciones || "Máximo 100 caracteres"}
          />
        </BaseFormField>
      </BaseFormSection>

      <BaseFormActions
        onCancel={onCancel}
        onSave={handleSubmit}
        onEdit={onEdit}
        showSave={!isView}
        showEdit={isView}
      />
    </BaseFormLayout>
  );
}