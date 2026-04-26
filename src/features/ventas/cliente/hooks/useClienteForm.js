import { useState, useEffect } from "react";
import { clientesService } from "../services/clientesService";
import { validateCliente } from "../utils/clientesUtils";

export function useClienteForm({ mode = "create", initialData = null, onSubmitSuccess, onError }) {
  const isView = mode === "view";
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState({
    nombre:          "",
    apellido:        "",
    tipoDocumento:   "cedula",
    documento:       "",
    telefono:        "",
    correo:          "",
    fechaNacimiento: "",
    genero:          "",
    departamento:    "",
    ciudad:          "",
    barrio:          "",
    codigoPostal:    "",
    direccion:       "",
    estado:          "activo",
  });

  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre:          initialData.nombre          || "",
        apellido:        initialData.apellido        || "",
        tipoDocumento:   initialData.tipoDocumento   || "cedula",
        documento:       initialData.documento       || "",
        telefono:        initialData.telefono        || "",
        correo:          initialData.correo          || "",
        fechaNacimiento: initialData.fechaNacimiento
          ? initialData.fechaNacimiento.split("T")[0]
          : "",
        genero:          initialData.genero          || "",
        departamento:    initialData.departamento    || "",
        ciudad:          initialData.ciudad          || "",
        barrio:          initialData.barrio          || "",
        codigoPostal:    initialData.codigoPostal    || "",
        direccion:       initialData.direccion       || "",
        estado:          initialData.estado          || "activo",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "departamento") {
      setFormData((prev) => ({ ...prev, departamento: value, ciudad: "" }));
      if (errors.departamento) setErrors((prev) => ({ ...prev, departamento: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async () => {
    const newErrors = validateCliente(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return { success: false };
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
      const msg = error?.response?.data?.error || "Error al guardar el cliente";
      onError?.(msg);
      return { success: false, error: msg };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData, errors, submitting,
    isView, isEdit,
    handleChange, handleSubmit, setFormData,
  };
}