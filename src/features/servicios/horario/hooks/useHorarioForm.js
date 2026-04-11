import { useState, useEffect, useCallback } from "react";
import { createHorario, updateHorario } from "../services/horariosService";

export function useHorarioForm({ mode = "create", initialData = null, onSubmitSuccess, onError } = {}) {
  const [formData, setFormData] = useState({
    empleado_id: "",
    dia: "",
    hora_inicio: "",
    hora_final: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ============================
  // Cargar datos iniciales
  // ============================
  useEffect(() => {
    if (initialData) {
      setFormData({
        empleado_id: initialData.empleado_id || "",
        dia: initialData.dia ?? "",
        hora_inicio: initialData.hora_inicio?.substring(0, 5) || "",
        hora_final: initialData.hora_final?.substring(0, 5) || "",
      });
    }
  }, [initialData]);

  // ============================
  // Handle change
  // ============================
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }, [errors]);

  // ============================
  // Validaciones
  // ============================
  const validate = useCallback(() => {
    const newErrors = {};

    if (!formData.empleado_id) {
      newErrors.empleado_id = "Debe seleccionar un empleado";
    }

    if (formData.dia === "") {
      newErrors.dia = "Debe seleccionar un día";
    }

    if (!formData.hora_inicio) {
      newErrors.hora_inicio = "Debe ingresar hora de inicio";
    }

    if (!formData.hora_final) {
      newErrors.hora_final = "Debe ingresar hora final";
    }

    if (
      formData.hora_inicio &&
      formData.hora_final &&
      formData.hora_final <= formData.hora_inicio
    ) {
      newErrors.hora_final = "La hora final debe ser mayor que la hora de inicio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // ============================
  // Submit
  // ============================
  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        empleado_id: Number(formData.empleado_id),
        dia: Number(formData.dia),
      };

      let result;
      if (mode === "create") {
        result = await createHorario(payload);
      } else {
        result = await updateHorario(initialData?.id, payload);
      }

      if (result.success) {
        onSubmitSuccess?.(result.data);
        return { success: true, data: result.data };
      } else {
        onError?.(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error al guardar el horario";
      onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  }, [formData, mode, initialData, validate, onSubmitSuccess, onError]);

  // ============================
  // Reset form
  // ============================
  const resetForm = useCallback(() => {
    setFormData({
      empleado_id: "",
      dia: "",
      hora_inicio: "",
      hora_final: "",
    });
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    submitting,
    handleChange,
    handleSubmit,
    resetForm,
    setFormData,
  };
}