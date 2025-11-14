import { createContext, useContext, useReducer } from 'react';

const initialState = {
  compras: [
    {
      id: 1,
      numeroCompra: "C-001",
      proveedorId: 1,
      proveedorNombre: "Optical Supplies S.A.S.",
      fecha: "2024-01-15",
      productos: [
        { id: 1, nombre: "Lentes Oftálmicos", cantidad: 50, precioUnitario: 25000, total: 1250000 },
        { id: 2, nombre: "Monturas Acetato", cantidad: 30, precioUnitario: 35000, total: 1050000 }
      ],
      subtotal: 2300000,
      iva: 437000,
      total: 2737000,
      estado: "Completada",
      observaciones: "Pedido regular de lentes"
    },
    {
      id: 2,
      numeroCompra: "C-002",
      proveedorId: 2,
      proveedorNombre: "Lentes Premium",
      fecha: "2024-01-10",
      productos: [
        { id: 3, nombre: "Lentes de Contacto", cantidad: 100, precioUnitario: 15000, total: 1500000 }
      ],
      subtotal: 1500000,
      iva: 285000,
      total: 1785000,
      estado: "Completada",
      observaciones: "Monturas de acetato"
    }
  ],
  loading: false,
  error: null
};

function comprasReducer(state, action) {
  switch (action.type) {
    case 'ADD_COMPRA':
      return {
        ...state,
        compras: [...state.compras, { ...action.payload, id: Date.now() }]
      };
    case 'UPDATE_COMPRA':
      return {
        ...state,
        compras: state.compras.map(compra => 
          compra.id === action.payload.id ? action.payload : compra
        )
      };
    case 'DELETE_COMPRA':
      return {
        ...state,
        compras: state.compras.filter(compra => compra.id !== action.payload)
      };
    case 'ANULAR_COMPRA':
      return {
        ...state,
        compras: state.compras.map(compra =>
          compra.id === action.payload 
            ? { ...compra, estado: "Anulada" }
            : compra
        )
      };
    case 'ADD_PRODUCTO_COMPRA':
      return {
        ...state,
        compras: state.compras.map(compra =>
          compra.id === action.payload.compraId
            ? { 
                ...compra, 
                productos: [...compra.productos, action.payload.producto],
                subtotal: compra.subtotal + action.payload.producto.total,
                iva: (compra.subtotal + action.payload.producto.total) * 0.19,
                total: (compra.subtotal + action.payload.producto.total) * 1.19
              }
            : compra
        )
      };
    case 'DELETE_PRODUCTO_COMPRA':
      return {
        ...state,
        compras: state.compras.map(compra =>
          compra.id === action.payload.compraId
            ? {
                ...compra,
                productos: compra.productos.filter(p => p.id !== action.payload.productoId),
                subtotal: compra.subtotal - action.payload.productoTotal,
                iva: (compra.subtotal - action.payload.productoTotal) * 0.19,
                total: (compra.subtotal - action.payload.productoTotal) * 1.19
              }
            : compra
        )
      };
    default:
      return state;
  }
}

const ComprasContext = createContext();

export function ComprasProvider({ children }) {
  const [state, dispatch] = useReducer(comprasReducer, initialState);
  
  const actions = {
    addCompra: (compra) => dispatch({ type: 'ADD_COMPRA', payload: compra }),
    updateCompra: (compra) => dispatch({ type: 'UPDATE_COMPRA', payload: compra }),
    deleteCompra: (id) => dispatch({ type: 'DELETE_COMPRA', payload: id }),
    anularCompra: (id) => dispatch({ type: 'ANULAR_COMPRA', payload: id }),
    addProductoCompra: (compraId, producto) => dispatch({ 
      type: 'ADD_PRODUCTO_COMPRA', 
      payload: { compraId, producto } 
    }),
    deleteProductoCompra: (compraId, productoId, productoTotal) => dispatch({ 
      type: 'DELETE_PRODUCTO_COMPRA', 
      payload: { compraId, productoId, productoTotal } 
    })
  };

  return (
    <ComprasContext.Provider value={{ state, actions }}>
      {children}
    </ComprasContext.Provider>
  );
}

export const useCompras = () => {
  const context = useContext(ComprasContext);
  if (!context) {
    throw new Error('useCompras debe usarse dentro de ComprasProvider');
  }
  return context;
};