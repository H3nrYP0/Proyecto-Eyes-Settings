import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCampanaSalud,
  updateCampanaSalud,
  getCampanaSaludById,
  getAllCampanasSalud,
} from '../services/campanasSaludService';
import { getEmpleadosAgenda } from '@servicios/agenda';
import { getHorariosByEmpleado } from '@servicios/horario';
import { getEstadosCita } from '../services/estadosCitaCampanaService';
import { ESTADO_CITA } from '../utils/constants';
import { formatearHora24, horaA12 } from '../utils/campanasSaludUtils';

const getBackendDay = (date) => {
  if (!date) return null;
  const jsDay = date.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
};

const INITIAL_FORM_DATA = {
  empleado_id: '',
  empresa: '',
  nit_empresa: '',
  contacto: '',
  fecha: '',
  hora: '',
  direccion: '',
  observaciones: '',
  estado_cita_id: ESTADO_CITA.PENDIENTE,
};

/**
 * Hook para el formulario de campaña de salud (crear, editar, ver).
 * Maneja estado local del formulario, validaciones, carga de horarios disponibles,
 * y las mutaciones con React Query.
 *
 * @param {number|null} id - ID de la campaña (si es edición o vista)
 * @param {string} mode - 'create', 'edit', 'view'
 */
export const useCampanaSaludForm = (id, mode = 'create') => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = mode === 'edit';
  const isView = mode === 'view';

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [originalData, setOriginalData] = useState(null);
  const [horariosEmpleado, setHorariosEmpleado] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [notification, setNotification] = useState({ open: false, type: 'success', message: '' });
  // Fix: guardar el mensaje de error como string, nunca como objeto Error
  const [errorMessage, setErrorMessage] = useState('');

  const showNotification = (type, message) => setNotification({ open: true, type, message });
  const hideNotification = () => setNotification((prev) => ({ ...prev, open: false }));

  // ---------- Consultas con React Query ----------
  const { data: empleados = [] } = useQuery({
    queryKey: ['empleados-agenda'],
    queryFn: getEmpleadosAgenda,
    staleTime: 10 * 60 * 1000,
  });

  const { data: estadosCita = [] } = useQuery({
    queryKey: ['estados-cita'],
    queryFn: getEstadosCita,
    staleTime: 10 * 60 * 1000,
  });

  const { data: campanaData, isLoading: loadingCampana } = useQuery({
    queryKey: ['campana-salud', id],
    queryFn: () => getCampanaSaludById(id),
    enabled: (isEdit || isView) && !!id,
    staleTime: 5 * 60 * 1000,
  });

  // Cargar datos iniciales al obtener la campaña
  useEffect(() => {
    if (campanaData && (isEdit || isView)) {
      const loaded = {
        empleado_id: campanaData.empleado_id || '',
        empresa: campanaData.empresa || '',
        nit_empresa: campanaData.nit_empresa || 'PENDIENTE',
        contacto: campanaData.contacto || '',
        // Fix timezone: la fecha viene como "YYYY-MM-DDTHH:mm:ss" o "YYYY-MM-DD",
        // tomamos solo los primeros 10 caracteres para evitar desfase de zona horaria
        fecha: campanaData.fecha ? campanaData.fecha.substring(0, 10) : '',
        hora: campanaData.hora ? formatearHora24(campanaData.hora) : '',
        direccion: campanaData.direccion || '',
        observaciones: campanaData.observaciones || '',
        estado_cita_id: campanaData.estado_cita_id || ESTADO_CITA.PENDIENTE,
      };
      setFormData(loaded);
      setOriginalData(loaded);
    }
  }, [campanaData, isEdit, isView]);

  // ---------- Carga de horarios del empleado ----------
  const loadHorariosEmpleado = useCallback(async (empleadoId) => {
    if (!empleadoId) {
      setHorariosEmpleado([]);
      return;
    }
    try {
      const data = await getHorariosByEmpleado(empleadoId);
      const activos = (data || []).filter((h) => h.activo !== false);
      setHorariosEmpleado(activos);
    } catch {
      setHorariosEmpleado([]);
    }
  }, []);

  useEffect(() => {
    if (formData.empleado_id) {
      loadHorariosEmpleado(formData.empleado_id);
    }
  }, [formData.empleado_id, loadHorariosEmpleado]);

  // Generar slots de 30 minutos
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

  // Calcular horas disponibles según empleado y fecha
  useEffect(() => {
    if (!formData.empleado_id || !formData.fecha) {
      setHorasDisponibles([]);
      return;
    }
    // Fix timezone: construir la fecha con año/mes/día explícitos para evitar
    // que el constructor de Date interprete la cadena como UTC y reste un día.
    const [y, m, d] = formData.fecha.split('-').map(Number);
    const fechaObj = new Date(y, m - 1, d);
    const diaSemana = getBackendDay(fechaObj);
    const horariosDelDia = horariosEmpleado.filter((h) => h.dia === diaSemana);

    if (horariosDelDia.length === 0) {
      setHorasDisponibles([]);
      return;
    }

    let slots = [];
    horariosDelDia.forEach((h) => {
      slots = slots.concat(generarSlots(h.hora_inicio, h.hora_final));
    });

    // Eliminar duplicados
    const vistos = new Set();
    slots = slots.filter((s) => {
      if (vistos.has(s.value)) return false;
      vistos.add(s.value);
      return true;
    });
    slots.sort((a, b) => a.value.localeCompare(b.value));
    setHorasDisponibles(slots);

    // Si la hora seleccionada ya no está disponible, limpiarla
    if (formData.hora && !slots.find((s) => s.value === formData.hora)) {
      setFormData((prev) => ({ ...prev, hora: '' }));
    }
  }, [formData.empleado_id, formData.fecha, horariosEmpleado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.empleado_id) return 'Debe seleccionar un empleado responsable';
    if (!formData.empresa?.trim()) return 'El nombre de la empresa es requerido';
    if (!formData.nit_empresa?.trim()) return 'El NIT de la empresa es requerido';
    if (formData.nit_empresa?.trim().length < 8) return 'El NIT debe tener al menos 8 dígitos';
    if (!formData.fecha) return 'La fecha es requerida';
    if (!formData.hora) return 'La hora es requerida';
    if (formData.contacto?.trim() && formData.contacto.trim().length !== 10) {
      return 'El teléfono de contacto debe tener exactamente 10 dígitos';
    }
    return null;
  };

  const validarDuplicado = async () => {
    try {
      const todas = await getAllCampanasSalud();
      const empresaNorm = formData.empresa.trim().toLowerCase();
      const fecha = formData.fecha;
      return (
        todas.find((c) => {
          const mismaEmpresa = c.empresa.trim().toLowerCase() === empresaNorm;
          const mismaFecha = (c.fecha || '').substring(0, 10) === fecha;
          const esOtro = isEdit ? c.id !== parseInt(id, 10) : true;
          return mismaEmpresa && mismaFecha && esOtro;
        }) || null
      );
    } catch {
      return null;
    }
  };

  const getChangedFields = () => {
    if (!originalData || !isEdit) return formData;
    const changed = {};
    if (formData.empleado_id !== originalData.empleado_id)
      changed.empleado_id = parseInt(formData.empleado_id, 10);
    if (formData.empresa !== originalData.empresa)
      changed.empresa = formData.empresa.trim();
    if (formData.nit_empresa !== originalData.nit_empresa)
      changed.nit_empresa = formData.nit_empresa?.trim() || originalData.nit_empresa || 'PENDIENTE';
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

  // ---------- Mutaciones ----------
  const createMutation = useMutation({
    mutationFn: createCampanaSalud,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campanas-salud'] });
      setErrorMessage('');
      showNotification('success', 'Campaña de salud creada correctamente');
      setTimeout(() => navigate('/admin/servicios/campanas-salud'), 1200);
    },
    onError: (err) => {
      // Fix: extraer siempre un string, nunca pasar el objeto Error directamente
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        'Error al crear la campaña';
      setErrorMessage(msg);
      showNotification('error', msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCampanaSalud(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campanas-salud'] });
      queryClient.invalidateQueries({ queryKey: ['campana-salud', id] });
      setErrorMessage('');
      showNotification('success', 'Campaña actualizada correctamente');
      setTimeout(() => navigate('/admin/servicios/campanas-salud'), 1200);
    },
    onError: (err) => {
      // Fix: extraer siempre un string
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        'Error al actualizar la campaña';
      setErrorMessage(msg);
      showNotification('error', msg);
    },
  });

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      showNotification('error', validationError);
      return;
    }

    const duplicado = await validarDuplicado();
    if (duplicado) {
      const msg = `Ya existe una campaña para "${duplicado.empresa}" en la fecha ${formData.fecha}. No se pueden registrar dos campañas para la misma empresa en el mismo día.`;
      showNotification('error', msg);
      return;
    }

    if (isEdit) {
      const changedFields = getChangedFields();
      if (Object.keys(changedFields).length === 0) {
        showNotification('info', 'No hay cambios para guardar');
        return;
      }
      updateMutation.mutate({ id: parseInt(id, 10), data: changedFields });
    } else {
      const horaFormateada = formatearHora24(formData.hora);
      const dataToSubmit = {
        empleado_id: parseInt(formData.empleado_id, 10),
        empresa: formData.empresa.trim(),
        nit_empresa: formData.nit_empresa.trim() || 'PENDIENTE',
        fecha: formData.fecha,
        hora: horaFormateada,
        estado_cita_id: ESTADO_CITA.PENDIENTE,
      };
      if (formData.contacto?.trim()) dataToSubmit.contacto = formData.contacto.trim();
      if (formData.direccion?.trim()) dataToSubmit.direccion = formData.direccion.trim();
      if (formData.observaciones?.trim()) dataToSubmit.observaciones = formData.observaciones.trim();
      createMutation.mutate(dataToSubmit);
    }
  };

  const handleCancel = () => navigate('/admin/servicios/campanas-salud');
  const handleEdit = () => navigate(`/admin/servicios/campanas-salud/editar/${id}`);

  const isLoading = (isEdit || isView) && loadingCampana;

  return {
    formData,
    empleados: empleados.filter((emp) => emp.estado === true),
    estadosCita,
    horasDisponibles,
    loading: isLoading,
    saving: createMutation.isPending || updateMutation.isPending,
    // Fix: error siempre es un string (nunca un objeto Error que React no puede renderizar)
    error: errorMessage,
    isEdit,
    isView,
    notification,
    handleChange,
    handleSubmit,
    handleCancel,
    handleEdit,
    hideNotification,
  };
};