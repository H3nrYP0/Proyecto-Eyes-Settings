// ============================
// Opciones de selects
// ============================
export const tipoDocumentoOptions = [
  { value: "cedula", label: "Cédula (CC)" },
  { value: "cedula_extranjeria", label: "Cédula extranjería (CE)" },
  { value: "pasaporte", label: "Pasaporte (PA)" },
];

export const generoOptions = [
  { value: "masculino", label: "Masculino" },
  { value: "femenino", label: "Femenino" },
  { value: "otro", label: "Otro" },
];

export const estadoOptions = [
  { value: "activo", label: "Activo" },
  { value: "inactivo", label: "Inactivo" },
];

// ============================
// Validaciones
// ============================
export const validateCliente = (formData) => {
  const newErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formData.nombre?.trim()) newErrors.nombre = "Nombre requerido";
  if (!formData.apellido?.trim()) newErrors.apellido = "Apellido requerido";
  if (!formData.tipoDocumento) newErrors.tipoDocumento = "Seleccione tipo documento";
  if (!formData.documento?.trim()) newErrors.documento = "Documento requerido";
  if (!formData.fechaNacimiento) newErrors.fechaNacimiento = "Fecha requerida";
  if (!formData.genero) newErrors.genero = "Seleccione género";
  if (!formData.ciudad?.trim()) newErrors.ciudad = "Ciudad requerida";
  
  if (formData.correo && !emailRegex.test(formData.correo)) {
    newErrors.correo = "Correo inválido";
  }

  return newErrors;
};

// ============================
// Formateo
// ============================
export const formatFecha = (fecha) => {
  if (!fecha) return "";
  return new Date(fecha).toISOString().split("T")[0];
};