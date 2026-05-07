import { useState, useEffect, useCallback, useRef } from 'react';
import { validateAdminUserForm } from '../utils/userValidators';

export const useUserForm = (initialData = null, mode = 'create') => {
  const [formData, setFormData] = useState({
    nombre:                "",
    correo:                "",
    rol_id:                "",
    estado:                true,
    contrasenia:           "",
    confirmar_contrasenia: "",
  });

  const [errors,       setErrors]       = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched,      setTouched]      = useState({});

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initialData) return;
    const incoming = JSON.stringify(initialData);
    if (initializedRef.current === incoming) return;
    initializedRef.current = incoming;

    setFormData({
      nombre:                initialData.nombre  ?? "",
      correo:                initialData.correo  ?? "",
      rol_id:                initialData.rol_id  ?? "",
      estado:                initialData.estado  ?? true,
      contrasenia:           "",
      confirmar_contrasenia: "",
    });
  }, [initialData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }, [errors]);

  const validate = useCallback(() => {
    const newErrors = validateAdminUserForm(formData, mode);
    setErrors(newErrors);
    const allTouched = {};
    Object.keys(formData).forEach((key) => { allTouched[key] = true; });
    setTouched(allTouched);
    return Object.keys(newErrors).length === 0;
  }, [formData, mode]);

  const resetForm = useCallback(() => {
    initializedRef.current = false;
    setFormData({
      nombre: "", correo: "", rol_id: "", estado: true,
      contrasenia: "", confirmar_contrasenia: "",
    });
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, []);

  const setFieldError = useCallback((field, error) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    validate,
    resetForm,
    setFieldError,
    setFormData,
  };
};