import { createContext, useContext, useReducer } from 'react';

const initialState = {
  proveedores: [
    {
      id: 1,
      tipo: "Persona Jurídica",
      razonSocial: "Optical Supplies S.A.S.",
      nit: "900123456-7",
      contacto: "Carlos Rodríguez",
      telefono: "6013456789",
      correo: "ventas@opticalsupplies.com",
      ciudad: "Bogotá",
      estado: "Activo"
    },
    {
      id: 2,
      tipo: "Persona Natural",
      razonSocial: "Lentes Premium",
      nit: "123456789-0",
      contacto: "María García",
      telefono: "3009876543",
      correo: "info@lentespremium.com",
      ciudad: "Medellín",
      estado: "Activo"
    }
  ],
  loading: false,
  error: null
};

function proveedoresReducer(state, action) {
  switch (action.type) {
    case 'ADD_PROVEEDOR':
      return {
        ...state,
        proveedores: [...state.proveedores, { ...action.payload, id: Date.now() }]
      };
    case 'UPDATE_PROVEEDOR':
      return {
        ...state,
        proveedores: state.proveedores.map(prov => 
          prov.id === action.payload.id ? action.payload : prov
        )
      };
    case 'DELETE_PROVEEDOR':
      return {
        ...state,
        proveedores: state.proveedores.filter(prov => prov.id !== action.payload)
      };
    case 'TOGGLE_ESTADO':
      return {
        ...state,
        proveedores: state.proveedores.map(prov =>
          prov.id === action.payload 
            ? { ...prov, estado: prov.estado === "Activo" ? "Inactivo" : "Activo" }
            : prov
        )
      };
    default:
      return state;
  }
}

const ProveedoresContext = createContext();

export function ProveedoresProvider({ children }) {
  const [state, dispatch] = useReducer(proveedoresReducer, initialState);
  
  const actions = {
    addProveedor: (proveedor) => dispatch({ type: 'ADD_PROVEEDOR', payload: proveedor }),
    updateProveedor: (proveedor) => dispatch({ type: 'UPDATE_PROVEEDOR', payload: proveedor }),
    deleteProveedor: (id) => dispatch({ type: 'DELETE_PROVEEDOR', payload: id }),
    toggleEstado: (id) => dispatch({ type: 'TOGGLE_ESTADO', payload: id })
  };

  return (
    <ProveedoresContext.Provider value={{ state, actions }}>
      {children}
    </ProveedoresContext.Provider>
  );
}

export const useProveedores = () => {
  const context = useContext(ProveedoresContext);
  if (!context) {
    throw new Error('useProveedores debe usarse dentro de ProveedoresProvider');
  }
  return context;
};