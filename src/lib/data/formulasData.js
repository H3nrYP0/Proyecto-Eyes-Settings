// Base de datos temporal de fórmulas
let formulasDB = [
  {
    id: 1,
    clienteId: 1,
    fecha: "2024-01-15",
    ojoDerechoEsferico: "-2.50",
    ojoDerechoCilindrico: "-0.75",
    ojoDerechoEje: "180",
    ojoIzquierdoEsferico: "-2.25",
    ojoIzquierdoCilindrico: "-0.50",
    ojoIzquierdoEje: "175",
    tipoLente: "progresivo",
    observaciones: "Primera fórmula - Adaptación completa"
  },
  {
    id: 2,
    clienteId: 1,
    fecha: "2023-06-10",
    ojoDerechoEsferico: "-2.25",
    ojoDerechoCilindrico: "-0.50",
    ojoDerechoEje: "180",
    ojoIzquierdoEsferico: "-2.00",
    ojoIzquierdoCilindrico: "-0.25",
    ojoIzquierdoEje: "175",
    tipoLente: "monofocal",
    observaciones: "Control rutinario - Estable"
  },
  {
    id: 3,
    clienteId: 2,
    fecha: "2024-01-10",
    ojoDerechoEsferico: "-1.75",
    ojoDerechoCilindrico: "-0.25",
    ojoDerechoEje: "170",
    ojoIzquierdoEsferico: "-1.50",
    ojoIzquierdoCilindrico: "-0.25",
    ojoIzquierdoEje: "165",
    tipoLente: "monofocal",
    observaciones: "Consulta de control"
  }
];

// Obtener fórmulas por cliente
export function getFormulasByClienteId(clienteId) {
  return formulasDB
    .filter(f => f.clienteId === clienteId)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

// Obtener fórmula por ID
export function getFormulaById(id) {
  return formulasDB.find(f => f.id === id);
}

// Crear fórmula
export function createFormula(data) {
  const newId = formulasDB.length ? formulasDB.at(-1).id + 1 : 1;
  const nuevaFormula = { 
    id: newId, 
    ...data 
  };
  
  formulasDB.push(nuevaFormula);
  return nuevaFormula;
}

// Actualizar fórmula
export function updateFormula(id, updated) {
  const index = formulasDB.findIndex(f => f.id === id);
  if (index !== -1) {
    formulasDB[index] = { ...formulasDB[index], ...updated };
  }
  return formulasDB;
}

// Eliminar fórmula
export function deleteFormula(id) {
  formulasDB = formulasDB.filter(f => f.id !== id);
  return formulasDB;
}