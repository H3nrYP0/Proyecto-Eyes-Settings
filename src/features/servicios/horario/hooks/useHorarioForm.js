import { useState, useEffect, useCallback } from "react";

export function useHorarioForm({ mode = "create", initialData = null } = {}) {
  const [formData, setFormData] = useState({
    empleado_id: "",
    dia: "",
    hora_inicio: "",
    hora_final: "",
    activo: true,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData({
        empleado_id: initialData.empleado_id || "",
        dia: initialData.dia ?? "",
        hora_inicio: initialData.hora_inicio?.substring(0, 5) || "",
        hora_final: initialData.hora_final?.substring(0, 5) || "",
        activo: initialData.activo !== undefined ? initialData.activo : true,
      });
    }
  }, [initialData]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }, [errors]);

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

  // Solo valida y retorna los datos (no hace la petición HTTP)
  const handleSubmit = useCallback(async () => {
    if (!validate()) return null;

    setSubmitting(true);
    const payload = {
      empleado_id: Number(formData.empleado_id),
      dia: Number(formData.dia),
      hora_inicio: formData.hora_inicio,
      hora_final: formData.hora_final,
      activo: formData.activo,
    };
    setSubmitting(false);
    return payload;
  }, [formData, validate]);

  const resetForm = useCallback(() => {
    setFormData({
      empleado_id: "",
      dia: "",
      hora_inicio: "",
      hora_final: "",
      activo: true,
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