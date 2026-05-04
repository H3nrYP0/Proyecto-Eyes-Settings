import { useState, useEffect, useCallback, useRef } from 'react';
import { validateUserForm } from '../utils/userValidators';

export const useUserForm = (initialData = null, mode = 'create') => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    tipoDocumento: "",
    numeroDocumento: "",
    password: "",
    confirmPassword: "",
    rol: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  // Usamos una ref para detectar si ya inicializamos con este dato
  // Evita el problema de que el mismo objeto del caché no dispare el effect
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initialData) return;

    // Si ya inicializamos y el contenido es el mismo, no re-setear
    const incoming = JSON.stringify(initialData);
    if (initializedRef.current === incoming) return;

    initializedRef.current = incoming;

    setFormData({
      nombre: initialData.nombre || "",
      email: initialData.email || "",
      telefono: initialData.telefono || "",
      fechaNacimiento: initialData.fechaNacimiento || "",
      tipoDocumento: initialData.tipoDocumento || "",
      numeroDocumento: initialData.numeroDocumento || "",
      password: "",
      confirmPassword: "",
      rol: initialData.rol || ""
    });
  }, [initialData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }, [errors]);

  const handleTelefonoChange = useCallback((e) => {
    const soloNumeros = e.target.value.replace(/\D/g, "");
    handleChange({ target: { name: "telefono", value: soloNumeros } });
  }, [handleChange]);

  const handleNumeroDocumentoChange = useCallback((e) => {
    const soloNumeros = e.target.value.replace(/\D/g, "");
    handleChange({ target: { name: "numeroDocumento", value: soloNumeros } });
  }, [handleChange]);

  const validate = useCallback(() => {
    const newErrors = validateUserForm(formData, mode);
    setErrors(newErrors);
    const allTouched = {};
    Object.keys(formData).forEach(key => { allTouched[key] = true; });
    setTouched(allTouched);
    return Object.keys(newErrors).length === 0;
  }, [formData, mode]);

  const resetForm = useCallback(() => {
    initializedRef.current = false;
    setFormData({
      nombre: "", email: "", telefono: "", fechaNacimiento: "",
      tipoDocumento: "", numeroDocumento: "", password: "", confirmPassword: "", rol: ""
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
    handleTelefonoChange,
    handleNumeroDocumentoChange,
    validate,
    resetForm,
    setFieldError,
    setFormData
  };
};