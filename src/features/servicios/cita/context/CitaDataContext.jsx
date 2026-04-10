// src/features/servicios/cita/context/CitaDataContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { clientesService } from '../../../ventas/cliente/services/clientesService';
import { ServicioData } from '../../servicio/services/serviciosService';
import { getAllEmpleados } from '../../empleado/services/empleadosService';
import { getAllEstadosCita } from '../services/estadosCitaServices';
import { getAllHorarios } from '../../horario/services/horariosService'; // ← importar

const CitaDataContext = createContext();

export function CitaDataProvider({ children }) {
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [estadosCita, setEstadosCita] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      clientesService.getAllClientes(),
      ServicioData.getAllServicios(),
      getAllEmpleados(),
      getAllEstadosCita(),
      getAllHorarios(), // ← cargar todos los horarios
    ]).then(([clientesData, serviciosData, empleadosData, estadosData, horariosData]) => {
      setClientes(Array.isArray(clientesData) ? clientesData : []);
      setServicios(Array.isArray(serviciosData) ? serviciosData : []);
      setEmpleados(
        (Array.isArray(empleadosData) ? empleadosData : []).map(e => ({
          ...e,
          estado: e.estado === true ? 'activo' : 'inactivo'
        }))
      );
      setEstadosCita(Array.isArray(estadosData) ? estadosData : []);
      setHorarios(Array.isArray(horariosData) ? horariosData : []);
    }).catch(err => console.error("Error cargando datos maestros:", err))
    .finally(() => setLoading(false));
  }, []);

  // Filtrar empleados: solo los activos Y que tengan al menos un horario activo
  const empleadosConHorario = empleados.filter(emp => {
    if (!(emp.estado === true || emp.estado === 'activo')) return false;
    return horarios.some(h => h.empleado_id === emp.id && h.activo === true);
  });

  return (
    <CitaDataContext.Provider value={{
      clientes,
      servicios,
      empleados: empleadosConHorario, // ← lista filtrada
      estadosCita,
      loading
    }}>
      {children}
    </CitaDataContext.Provider>
  );
}

export const useCitaData = () => useContext(CitaDataContext);