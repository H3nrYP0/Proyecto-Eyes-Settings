// features/servicios/campanaSalud/hooks/useCampanaSaludForm.js

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createCampanaSalud,
  updateCampanaSalud,
  getCampanaSaludById,
  getAllCampanasSalud
} from '../services/campanasSaludService';
import { getAllEmpleados } from '../../empleado/services/empleadosService';
import { getHorariosByEmpleado } from '../../horario/services/horariosService';
import { getEstadosCita } from '../services/estadosCitaCampanaService';
import { ESTADO_CITA, ESTADOS_BLOQUEADOS } from '../utils/constants';

const INITIAL_FORM_DATA = {
  empleado_id: '',
  empresa: '',
  contacto: '',
  fecha: '',
  hora: '',
  direccion: '',
  observaciones: '',
  estado_cita_id: ESTADO_CITA.PENDIENTE
};

export const useCampanaSaludForm = (id, mode = 'create') => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [originalData, setOriginalData] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [estadosCita, setEstadosCita] = useState([]);
  const [horariosEmpleado, setHorariosEmpleado] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Notificación CRUD
  const [notification, setNotification] = useState({
    open: false,
    type: 'success',
    message: ''
  });

  const isEdit = mode === 'edit';
  const isView = mode === 'view';

  // ─── Helpers de hora ────────────────────────────────────────────────────────

  const formatearHora24 = (hora) => {
    if (!hora) return '';
    if (/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(hora)) return hora;
    try {
      if (hora.includes(':')) {
        const partes = hora.split(':');
        if (partes.length >= 2) {
          return `${partes[0].padStart(2, '0')}:${partes[1].padStart(2, '0').substring(0, 2)}`;
        }
      }
    } catch (e) {
      console.error('Error formateando hora:', e);
    }
    return hora;
  };

  // Convierte "HH:MM" o "HH:MM:SS" a "h:MM AM/PM"
  const horaA12 = (hora24) => {
    if (!hora24 || hora24 === '-') return hora24;
    const [hStr, mStr] = hora24.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr ? mStr.substring(0, 2) : '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  // Genera slots de 30 min entre hora_inicio y hora_final
  const generarSlots = (horaInicio, horaFinal) => {
    const slots = [];
    const [hI, mI] = horaInicio.split(':').map(Number);
    const [hF, mF] = horaFinal.split(':').map(Number);
    let minutos = hI * 60 + mI;
    const minFinal = hF * 60 + mF;
    while (minutos < minFinal) {
      const h = Math.floor(minutos / 60);
      const m = minutos % 60;
      const valor = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      slots.push({ value: valor, label: horaA12(valor) });
      minutos += 30;
    }
    return slots;
  };

  // ─── Carga de catálogos ──────────────────────────────────────────────────────

  const loadEmpleados = useCallback(async () => {
    try {
      const data = await getAllEmpleados();
      setEmpleados(data.filter(emp => emp.estado === true));
    } catch (err) {
      console.error('Error loading empleados:', err);
      setError('Error al cargar la lista de empleados');
    }
  }, []);

  const loadEstadosCita = useCallback(async () => {
    try {
      const data = await getEstadosCita();
      setEstadosCita(data);
    } catch (err) {
      console.error('Error loading estados cita:', err);
      // Fallback silencioso; el select mostrará lo que haya
    }
  }, []);

  const loadCampana = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getCampanaSaludById(id);
      const loaded = {
        empleado_id: data.empleado_id || '',
        empresa: data.empresa || '',
        contacto: data.contacto || '',
        fecha: data.fecha ? data.fecha.split('T')[0] : '',
        hora: data.hora ? formatearHora24(data.hora) : '',
        direccion: data.direccion || '',
        observaciones: data.observaciones || '',
        estado_cita_id: data.estado_cita_id || ESTADO_CITA.PENDIENTE
      };
      setFormData(loaded);
      setOriginalData(loaded);
    } catch (err) {
      console.error('Error loading campana:', err);
      setError(err.response?.data?.error || 'Error al cargar la campaña');
    }
  }, [id]);

  // ─── Horarios del empleado seleccionado ──────────────────────────────────────

  const loadHorariosEmpleado = useCallback(async (empleadoId) => {
    if (!empleadoId) {
      setHorariosEmpleado([]);
      setHorasDisponibles([]);
      return;
    }
    try {
      const data = await getHorariosByEmpleado(empleadoId);
      const activos = (data || []).filter(h => h.activo !== false);
      setHorariosEmpleado(activos);
    } catch (err) {
      console.error('Error loading horarios empleado:', err);
      setHorariosEmpleado([]);
    }
  }, []);

  // Recalcular horas disponibles cuando cambia empleado o fecha
  useEffect(() => {
    if (!formData.empleado_id || !formData.fecha) {
      setHorasDisponibles([]);
      return;
    }
    // dia: 0=Domingo,...,6=Sábado (JS). La BD usa 0-6.
    // Usamos fecha local para evitar desfases de TZ
    const [y, m, d] = formData.fecha.split('-').map(Number);
    const diaSemana = new Date(y, m - 1, d).getDay(); // 0=Dom
    const horariosDelDia = horariosEmpleado.filter(h => h.dia === diaSemana);

    if (horariosDelDia.length === 0) {
      setHorasDisponibles([]);
      return;
    }

    let slots = [];
    horariosDelDia.forEach(h => {
      slots = slots.concat(generarSlots(h.hora_inicio, h.hora_final));
    });
    // Eliminar duplicados
    const vistos = new Set();
    slots = slots.filter(s => {
      if (vistos.has(s.value)) return false;
      vistos.add(s.value);
      return true;
    });
    slots.sort((a, b) => a.value.localeCompare(b.value));
    setHorasDisponibles(slots);

    // Si la hora actual no está en los slots, limpiarla
    if (formData.hora && !slots.find(s => s.value === formData.hora)) {
      setFormData(prev => ({ ...prev, hora: '' }));
    }
  }, [formData.empleado_id, formData.fecha, horariosEmpleado]);

  // Cuando cambia el empleado, recargar horarios
  useEffect(() => {
    if (formData.empleado_id) {
      loadHorariosEmpleado(formData.empleado_id);
    }
  }, [formData.empleado_id, loadHorariosEmpleado]);

  // ─── Init ────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([
        loadEmpleados(),
        loadEstadosCita(),
        (isEdit || isView) ? loadCampana() : Promise.resolve()
      ]);
      setLoading(false);
    };
    init();
  }, [loadEmpleados, loadEstadosCita, loadCampana, isEdit, isView]);

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const showNotification = (type, message) => {
    setNotification({ open: true, type, message });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  // ─── Validación ──────────────────────────────────────────────────────────────

  const validate = () => {
    if (!formData.empleado_id) return 'Debe seleccionar un empleado responsable';
    if (!formData.empresa?.trim()) return 'El nombre de la empresa es requerido';
    if (!formData.fecha) return 'La fecha es requerida';
    if (!formData.hora) return 'La hora es requerida';
    return null;
  };

  // Validar duplicado empresa+fecha en frontend antes de ir al backend
  const validarDuplicado = async () => {
    try {
      const todas = await getAllCampanasSalud();
      const empresaNorm = formData.empresa.trim().toLowerCase();
      const fecha = formData.fecha;
      const duplicado = todas.find(c => {
        const mismaEmpresa = c.empresa.trim().toLowerCase() === empresaNorm;
        const mismaFecha = (c.fecha || '').split('T')[0] === fecha;
        const esOtro = isEdit ? c.id !== parseInt(id, 10) : true;
        return mismaEmpresa && mismaFecha && esOtro;
      });
      return duplicado || null;
    } catch {
      return null; // Si falla la consulta, dejar pasar (el backend también puede validar)
    }
  };

  // ─── Delta para PUT ──────────────────────────────────────────────────────────

  const getChangedFields = () => {
    if (!originalData || !isEdit) return formData;
    const changed = {};
    if (formData.empleado_id !== originalData.empleado_id)
      changed.empleado_id = parseInt(formData.empleado_id, 10);
    if (formData.empresa !== originalData.empresa)
      changed.empresa = formData.empresa.trim();
    if (formData.contacto !== originalData.contacto)
      changed.contacto = formData.contacto?.trim() || null;
    if (formData.fecha !== originalData.fecha)
      changed.fecha = formData.fecha;
    if (formData.hora !== originalData.hora)
      changed.hora = formatearHora24(formData.hora);
    if (formData.direccion !== originalData.direccion)
      changed.direccion = formData.direccion?.trim() || null;
    if (formData.observaciones !== originalData.observaciones)
      changed.observaciones = formData.observaciones?.trim() || null;
    if (formData.estado_cita_id !== originalData.estado_cita_id)
      changed.estado_cita_id = parseInt(formData.estado_cita_id, 10);
    return changed;
  };

  // ─── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      showNotification('error', validationError);
      setError(validationError);
      return;
    }

    // Validar duplicado empresa + fecha
    const duplicado = await validarDuplicado();
    if (duplicado) {
      const msg = `Ya existe una campaña para "${duplicado.empresa}" en la fecha ${formData.fecha}. No se pueden registrar dos campañas para la misma empresa en el mismo día.`;
      showNotification('error', msg);
      setError(msg);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isEdit) {
        const changedFields = getChangedFields();
        if (Object.keys(changedFields).length === 0) {
          showNotification('info', 'No hay cambios para guardar');
          setSaving(false);
          return;
        }
        await updateCampanaSalud(parseInt(id, 10), changedFields);
        showNotification('success', 'Campaña actualizada correctamente');
      } else {
        const horaFormateada = formatearHora24(formData.hora);
        const dataToSubmit = {
          empleado_id: parseInt(formData.empleado_id, 10),
          empresa: formData.empresa.trim(),
          fecha: formData.fecha,
          hora: horaFormateada,
          estado_cita_id: ESTADO_CITA.PENDIENTE
        };
        if (formData.contacto?.trim()) dataToSubmit.contacto = formData.contacto.trim();
        if (formData.direccion?.trim()) dataToSubmit.direccion = formData.direccion.trim();
        if (formData.observaciones?.trim()) dataToSubmit.observaciones = formData.observaciones.trim();
        await createCampanaSalud(dataToSubmit);
        showNotification('success', 'Campaña de salud creada correctamente');
      }

      // Pequeña pausa para que el usuario vea la notificación antes de navegar
      setTimeout(() => {
        navigate('/admin/servicios/campanas-salud');
      }, 1200);
    } catch (err) {
      console.error('Error saving campana:', err);
      const msg = err.response?.data?.error || 'Error al guardar la campaña';
      setError(msg);
      showNotification('error', msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/servicios/campanas-salud');
  };

  const handleEdit = () => {
    navigate(`/admin/servicios/campanas-salud/editar/${id}`);
  };

  return {
    formData,
    empleados,
    estadosCita,
    horasDisponibles,
    loading,
    saving,
    error,
    isEdit,
    isView,
    notification,
    handleChange,
    handleSubmit,
    handleCancel,
    handleEdit,
    hideNotification
  };
};