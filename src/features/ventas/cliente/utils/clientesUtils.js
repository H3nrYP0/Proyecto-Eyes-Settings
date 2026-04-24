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
  "Amazonas":          ["Leticia","Puerto Nariño"],
  "Antioquia":         ["Medellín","Bello","Envigado","Itagüí","Rionegro","Turbo","Apartadó","Caucasia","Yarumal"],
  "Arauca":            ["Arauca","Saravena","Tame"],
  "Atlántico":         ["Barranquilla","Soledad","Malambo","Sabanalarga"],
  "Bolívar":           ["Cartagena","Magangué","El Carmen de Bolívar"],
  "Boyacá":            ["Tunja","Duitama","Sogamoso","Chiquinquirá"],
  "Caldas":            ["Manizales","Villamaría","La Dorada","Riosucio"],
  "Caquetá":           ["Florencia","San Vicente del Caguán"],
  "Casanare":          ["Yopal","Aguazul","Villanueva"],
  "Cauca":             ["Popayán","Santander de Quilichao","Puerto Tejada"],
  "Cesar":             ["Valledupar","Aguachica","Bosconia"],
  "Chocó":             ["Quibdó","Istmina","Tumaco"],
  "Córdoba":           ["Montería","Lorica","Cereté","Sahagún"],
  "Cundinamarca":      ["Bogotá","Soacha","Facatativá","Zipaquirá","Fusagasugá","Girardot","Chía","Mosquera"],
  "Guainía":           ["Inírida"],
  "Guaviare":          ["San José del Guaviare"],
  "Huila":             ["Neiva","Pitalito","Garzón","La Plata"],
  "La Guajira":        ["Riohacha","Maicao","Uribia"],
  "Magdalena":         ["Santa Marta","Ciénaga","Fundación"],
  "Meta":              ["Villavicencio","Acacías","Granada"],
  "Nariño":            ["Pasto","Tumaco","Ipiales","Túquerres"],
  "Norte de Santander":["Cúcuta","Ocaña","Pamplona","Villa del Rosario"],
  "Putumayo":          ["Mocoa","Puerto Asís"],
  "Quindío":           ["Armenia","Calarcá","Montenegro"],
  "Risaralda":         ["Pereira","Dosquebradas","Santa Rosa de Cabal"],
  "San Andrés":        ["San Andrés","Providencia"],
  "Santander":         ["Bucaramanga","Floridablanca","Girón","Piedecuesta","Barrancabermeja"],
  "Sucre":             ["Sincelejo","Corozal","Sampués"],
  "Tolima":            ["Ibagué","Espinal","Honda","Melgar"],
  "Valle del Cauca":   ["Cali","Buenaventura","Palmira","Tuluá","Cartago","Buga"],
  "Vaupés":            ["Mitú"],
  "Vichada":           ["Puerto Carreño"],
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
// Validaciones
// ============================
export const validateCliente = (formData) => {
  const newErrors  = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formData.nombre?.trim())        newErrors.nombre          = "Nombre requerido";
  if (!formData.apellido?.trim())      newErrors.apellido        = "Apellido requerido";
  if (!formData.tipoDocumento)         newErrors.tipoDocumento   = "Seleccione tipo documento";
  if (!formData.documento?.trim())     newErrors.documento       = "Documento requerido";
  if (!formData.fechaNacimiento)       newErrors.fechaNacimiento = "Fecha requerida";
  if (!formData.genero)                newErrors.genero          = "Seleccione género";
  if (!formData.departamento?.trim())  newErrors.departamento    = "Seleccione departamento";
  if (!formData.ciudad?.trim())        newErrors.ciudad          = "Seleccione municipio";

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