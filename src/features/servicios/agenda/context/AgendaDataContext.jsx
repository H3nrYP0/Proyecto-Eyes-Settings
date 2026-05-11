// AgendaDataContext.jsx
// Reemplazado por React Query — este archivo ya no es necesario.
// Se mantiene solo para no romper imports existentes.
// Los datos de empleados y estados ahora se cachean con queryKey
// ['empleados-agenda'] y ['estados-cita'] en useAgenda.js

export function AgendaDataProvider({ children }) {
  return children;
}

export const useAgendaData = () => ({
  empleados: [],
  estadosCita: [],
  loading: false,
  error: null,
});