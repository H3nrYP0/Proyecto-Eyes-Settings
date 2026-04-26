// ============================
// Opciones de selects
// ============================
export const tipoDocumentoOptions = [
  { value: "cedula",             label: "Cédula (CC)" },
  { value: "cedula_extranjeria", label: "Cédula extranjería (CE)" },
  { value: "pasaporte",          label: "Pasaporte (PA)" },
];

export const generoOptions = [
  { value: "masculino", label: "Masculino" },
  { value: "femenino",  label: "Femenino" },
  { value: "otro",      label: "Otro" },
];

export const estadoOptions = [
  { value: "activo",   label: "Activo" },
  { value: "inactivo", label: "Inactivo" },
];

// Departamentos de Colombia con sus municipios
export const departamentosData = {
  "Amazonas":           ["Leticia","Puerto Nariño"],
  "Antioquia":          ["Medellín","Bello","Envigado","Itagüí","Rionegro","Turbo","Apartadó","Caucasia","Yarumal"],
  "Arauca":             ["Arauca","Saravena","Tame"],
  "Atlántico":          ["Barranquilla","Soledad","Malambo","Sabanalarga"],
  "Bolívar":            ["Cartagena","Magangué","El Carmen de Bolívar"],
  "Boyacá":             ["Tunja","Duitama","Sogamoso","Chiquinquirá"],
  "Caldas":             ["Manizales","Villamaría","La Dorada","Riosucio"],
  "Caquetá":            ["Florencia","San Vicente del Caguán"],
  "Casanare":           ["Yopal","Aguazul","Villanueva"],
  "Cauca":              ["Popayán","Santander de Quilichao","Puerto Tejada"],
  "Cesar":              ["Valledupar","Aguachica","Bosconia"],
  "Chocó":              ["Quibdó","Istmina","Tumaco"],
  "Córdoba":            ["Montería","Lorica","Cereté","Sahagún"],
  "Cundinamarca":       ["Bogotá","Soacha","Facatativá","Zipaquirá","Fusagasugá","Girardot","Chía","Mosquera"],
  "Guainía":            ["Inírida"],
  "Guaviare":           ["San José del Guaviare"],
  "Huila":              ["Neiva","Pitalito","Garzón","La Plata"],
  "La Guajira":         ["Riohacha","Maicao","Uribia"],
  "Magdalena":          ["Santa Marta","Ciénaga","Fundación"],
  "Meta":               ["Villavicencio","Acacías","Granada"],
  "Nariño":             ["Pasto","Tumaco","Ipiales","Túquerres"],
  "Norte de Santander": ["Cúcuta","Ocaña","Pamplona","Villa del Rosario"],
  "Putumayo":           ["Mocoa","Puerto Asís"],
  "Quindío":            ["Armenia","Calarcá","Montenegro"],
  "Risaralda":          ["Pereira","Dosquebradas","Santa Rosa de Cabal"],
  "San Andrés":         ["San Andrés","Providencia"],
  "Santander":          ["Bucaramanga","Floridablanca","Girón","Piedecuesta","Barrancabermeja"],
  "Sucre":              ["Sincelejo","Corozal","Sampués"],
  "Tolima":             ["Ibagué","Espinal","Honda","Melgar"],
  "Valle del Cauca":    ["Cali","Buenaventura","Palmira","Tuluá","Cartago","Buga"],
  "Vaupés":             ["Mitú"],
  "Vichada":            ["Puerto Carreño"],
};

export const departamentoOptions = Object.keys(departamentosData).map((d) => ({
  value: d,
  label: d,
}));

export const getMunicipioOptions = (departamento) => {
  if (!departamento || !departamentosData[departamento]) return [];
  return departamentosData[departamento].map((m) => ({ value: m, label: m }));
};

// ============================
// Helpers de validación
// ============================

// Detecta emojis (rangos Unicode de emojis comunes)
const EMOJI_REGEX = /[\u{1F000}-\u{1FFFF}|\u{2600}-\u{27FF}|\u{2300}-\u{23FF}|\u{FE00}-\u{FEFF}|\u{1F900}-\u{1F9FF}]/u;

export const tieneEmoji = (value) => EMOJI_REGEX.test(value);

// Fecha de hoy en formato YYYY-MM-DD (para comparar con input type=date)
export const hoyISO = () => new Date().toISOString().split("T")[0];

// ============================
// Validaciones
// ============================
export const validateCliente = (formData) => {
  const newErrors  = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formData.nombre?.trim())       newErrors.nombre          = "Nombre requerido";
  if (!formData.apellido?.trim())     newErrors.apellido        = "Apellido requerido";
  if (!formData.tipoDocumento)        newErrors.tipoDocumento   = "Seleccione tipo documento";
  if (!formData.documento?.trim())    newErrors.documento       = "Documento requerido";
  if (!formData.genero)               newErrors.genero          = "Seleccione género";
  if (!formData.departamento?.trim()) newErrors.departamento    = "Seleccione departamento";
  if (!formData.ciudad?.trim())       newErrors.ciudad          = "Seleccione municipio";

  // Fecha nacimiento
  if (!formData.fechaNacimiento) {
    newErrors.fechaNacimiento = "Fecha requerida";
  } else if (formData.fechaNacimiento > hoyISO()) {
    newErrors.fechaNacimiento = "La fecha no puede ser futura";
  }

  // Correo
  if (formData.correo) {
    if (tieneEmoji(formData.correo)) {
      newErrors.correo = "El correo no puede contener emojis";
    } else if (!emailRegex.test(formData.correo)) {
      newErrors.correo = "Correo inválido";
    }
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