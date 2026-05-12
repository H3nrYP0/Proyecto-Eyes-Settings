import { useState, useEffect, useCallback } from 'react';

export function useNovedadForm({ mode = 'create', initialData = null } = {}) {
  const [formData, setFormData] = useState({
    empleado_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    hora_inicio: '',
    hora_fin: '',
    tipo: '',
    motivo: '',
    activo: true,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        empleado_id: initialData.empleado_id || '',
        fecha_inicio: initialData.fecha_inicio || '',
        fecha_fin: initialData.fecha_fin || '',
        hora_inicio: initialData.hora_inicio || '',
        hora_fin: initialData.hora_fin || '',
        tipo: initialData.tipo || '',
        motivo: initialData.motivo || '',
        activo: initialData.activo !== undefined ? initialData.activo : true,
      });
    }
  }, [initialData]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }, [errors]);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.empleado_id) newErrors.empleado_id = 'Debe seleccionar un empleado';
    if (!formData.fecha_inicio) newErrors.fecha_inicio = 'Debe ingresar fecha inicio';
    if (!formData.fecha_fin) newErrors.fecha_fin = 'Debe ingresar fecha fin';
    if (formData.fecha_inicio && formData.fecha_fin && formData.fecha_inicio > formData.fecha_fin) {
      newErrors.fecha_fin = 'La fecha fin debe ser mayor o igual a la fecha inicio';
    }
    if (formData.hora_inicio && !formData.hora_fin) newErrors.hora_fin = 'Debe ingresar hora fin';
    if (formData.hora_fin && !formData.hora_inicio) newErrors.hora_inicio = 'Debe ingresar hora inicio';
    if (formData.hora_inicio && formData.hora_fin && formData.hora_fin <= formData.hora_inicio) {
      newErrors.hora_fin = 'La hora final debe ser mayor que la hora inicio';
    }
    if (!formData.tipo) newErrors.tipo = 'Debe seleccionar un tipo';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return null;
    setSubmitting(true);
    const payload = {
      empleado_id: Number(formData.empleado_id),
      fecha_inicio: formData.fecha_inicio,
      fecha_fin: formData.fecha_fin,
      hora_inicio: formData.hora_inicio || null,
      hora_fin: formData.hora_fin || null,
      tipo: formData.tipo,
      motivo: formData.motivo || null,
      activo: formData.activo,
    };
    setSubmitting(false);
    return payload;
  }, [formData, validate]);

  const resetForm = useCallback(() => {
    setFormData({
      empleado_id: '',
      fecha_inicio: '',
      fecha_fin: '',
      hora_inicio: '',
      hora_fin: '',
      tipo: '',
      motivo: '',
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