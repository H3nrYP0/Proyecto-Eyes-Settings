import { useState, useEffect } from "react";
import { clientesService } from "../services/clientesService";
import { validateCliente } from "../utils/clientesUtils";

export function useClienteForm({ mode = "create", initialData = null, onSubmitSuccess, onError }) {
  const isView = mode === "view";
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    tipoDocumento: "cedula",
    documento: "",
    telefono: "",
    correo: "",
    fechaNacimiento: "",
    genero: "",
    ciudad: "",
    direccion: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        apellido: initialData.apellido || "",
        tipoDocumento: initialData.tipoDocumento || "cedula",
        documento: initialData.documento || "",
        telefono: initialData.telefono || "",
        correo: initialData.correo || "",
        fechaNacimiento: initialData.fechaNacimiento || "",
        genero: initialData.genero || "",
        ciudad: initialData.ciudad || "",
        direccion: initialData.direccion || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    const newErrors = validateCliente(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      let result;
      if (mode === "create") {
        result = await clientesService.createCliente(formData);
      } else {
        result = await clientesService.updateCliente(initialData.id, formData);
      }
      onSubmitSuccess?.(result);
      return { success: true, data: result };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error al guardar el cliente";
      onError?.(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    submitting,
    isView,
    isEdit,
    handleChange,
    handleSubmit,
    setFormData,
  };
}