// ============================
// Valores por defecto del formulario
// ============================
export const DEFAULT_PROVEEDOR_FORM = {
  tipoProveedor: "Persona Jurídica",
  tipoDocumento: "NIT",
  documento: "",
  razonSocial: "",
  contactoNombre: "",
  telefono: "",
  correo: "",
  departamento: "",
  municipio: "",
  direccion: "",
  estado: "activo",
};

// ============================
// Normalizar proveedor para formulario
// ============================
export const normalizeProveedorForForm = (proveedor) => ({
  id: proveedor.id,
  tipoProveedor: proveedor.tipo_proveedor || proveedor.tipoProveedor || DEFAULT_PROVEEDOR_FORM.tipoProveedor,
  tipoDocumento: proveedor.tipo_documento || proveedor.tipoDocumento || DEFAULT_PROVEEDOR_FORM.tipoDocumento,
  documento: proveedor.documento || "",
  razonSocial: proveedor.razon_social_o_nombre || proveedor.razonSocial || "",
  contactoNombre: proveedor.contacto || proveedor.contactoNombre || "",
  telefono: proveedor.telefono || "",
  correo: proveedor.correo || "",
  departamento: proveedor.departamento || "",
  municipio: proveedor.municipio || "",
  direccion: proveedor.direccion || "",
  estado: proveedor.estado === true ? "activo" : "inactivo",
});

// ============================
// Opciones de selects
// ============================
export const tipoProveedorOptions = [
  { value: "Persona Jurídica", label: "Persona Jurídica" },
  { value: "Persona Natural", label: "Persona Natural" },
];

export const tipoDocumentoOptions = [
  { value: "NIT", label: "NIT" },
  { value: "CC", label: "Cédula" },
  { value: "CE", label: "Cédula Extranjería" },
];

export const estadoOptions = [
  { value: "activo", label: "Activo" },
  { value: "inactivo", label: "Inactivo" },
];

// ============================
// Validaciones
// ============================
export const validateProveedor = (formData) => {
  const newErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{7,15}$/;

  if (!formData.razonSocial?.trim()) newErrors.razonSocial = "Requerido";
  if (!formData.documento?.trim()) newErrors.documento = "Requerido";
  if (!formData.contactoNombre?.trim()) newErrors.contactoNombre = "Requerido";
  if (!formData.telefono?.trim()) newErrors.telefono = "Requerido";
  else if (!phoneRegex.test(formData.telefono)) newErrors.telefono = "Teléfono inválido (7-15 dígitos)";
  if (!formData.correo?.trim()) newErrors.correo = "Requerido";
  else if (!emailRegex.test(formData.correo)) newErrors.correo = "Correo inválido";
  if (!formData.departamento?.trim()) newErrors.departamento = "Requerido";
  if (!formData.municipio?.trim()) newErrors.municipio = "Requerido";
  if (!formData.direccion?.trim()) newErrors.direccion = "Requerido";

  return newErrors;
};