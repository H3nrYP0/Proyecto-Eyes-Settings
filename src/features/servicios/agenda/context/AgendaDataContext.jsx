import { createContext, useContext, useState, useEffect } from 'react';
import { getEmpleadosAgenda, getEstadosCitaAgenda } from '../services/agendaService';

const AgendaDataContext = createContext();

export function AgendaDataProvider({ children }) {
  const [empleados, setEmpleados] = useState([]);
  const [estadosCita, setEstadosCita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [empleadosData, estadosData] = await Promise.all([
          getEmpleadosAgenda(),
          getEstadosCitaAgenda(),
        ]);
        setEmpleados(Array.isArray(empleadosData) ? empleadosData : []);
        setEstadosCita(Array.isArray(estadosData) ? estadosData : []);
      } catch (err) {
        setError('Error al cargar datos de la agenda');
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  return (
    <AgendaDataContext.Provider value={{ empleados, estadosCita, loading, error }}>
      {children}
    </AgendaDataContext.Provider>
  );
}

export const useAgendaData = () => {
  const context = useContext(AgendaDataContext);
  if (!context) {
    throw new Error('useAgendaData debe usarse dentro de AgendaDataProvider');
  }
  return context;
};