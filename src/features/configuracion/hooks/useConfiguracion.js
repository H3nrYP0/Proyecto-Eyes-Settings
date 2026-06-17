/**
 * Hook para manejar el estado del perfil unificado (usuario + cliente).
 * Incluye todos los campos de la sección "Dirección de entrega".
 * La petición PUT envía solo los campos modificados,
 * y mapea correctamente los nombres al backend.
 *
 * FIXES:
 * - esCliente ahora lee `rol_nombre` (campo real del to_dict() del backend)
 *   en lugar de `rol` (que siempre era undefined).
 * - passwordMutation.onSuccess ya NO hace logout; solo limpia el formulario
 *   y muestra notificación. El token sigue siendo válido — el backend solo
 *   actualiza el hash, no invalida sesiones.
 * - passwordMutation.onError ahora extrae el mensaje correctamente desde
 *   axios (error.response?.data?.error) y también cubre el caso de red.
 */

import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMiPerfil, updateMiPerfil, cambiarContrasenia } from '../services/perfilService';
import {
  validarNombre, validarApellido, validarTelefono, validarNumeroDocumento,
  validarFechaNacimiento, validarMunicipio, validarDepartamento, validarDireccion,
  validarBarrio, validarCodigoPostal, validarOcupacion, validarTelefonoEmergencia,
  validarCiudad, validarAptoTorre, validarNombreReceptor, validarTelefonoEntrega,
  validarIndicaciones,
  validarPassword, normalizeGender, denormalizeGender
} from '../utils/configuracionHelpers';

const EMPTY_FORM = {
  nombre: '', apellido: '', correo: '', telefono: '',
  tipo_documento: '', numero_documento: '', fecha_nacimiento: '',
  genero: '',
  // Dirección y ubicación (cliente)
  municipio: '', departamento: '', direccion: '', barrio: '',
  codigo_postal: '', ocupacion: '', telefono_emergencia: '',
  // Dirección de entrega (nuevos campos)
  ciudad: '',
  apto_torre: '',
  nombre_receptor: '',
  telefono_entrega: '',
  indicaciones: ''
};

export const useConfiguracion = (initialUser, onUserUpdate) => {
  const queryClient = useQueryClient();

  // ─── Inicialización inmediata con los datos del usuario ───
  const initialFormData = useMemo(() => {
    if (!initialUser) return EMPTY_FORM;
    return {
      nombre:               initialUser.nombre               || '',
      apellido:             initialUser.apellido             || '',
      correo:               initialUser.correo               || '',
      telefono:             initialUser.telefono             || '',
      tipo_documento:       initialUser.tipo_documento       || '',
      numero_documento:     initialUser.numero_documento     || '',
      fecha_nacimiento:     initialUser.fecha_nacimiento     || '',
      genero:               normalizeGender(initialUser.genero) || '',
      municipio:            initialUser.municipio            || '',
      departamento:         initialUser.departamento         || '',
      direccion:            initialUser.direccion            || '',
      barrio:               initialUser.barrio               || '',
      codigo_postal:        initialUser.codigo_postal        || '',
      ocupacion:            initialUser.ocupacion            || '',
      telefono_emergencia:  initialUser.telefono_emergencia  || '',
      ciudad:               initialUser.ciudad               || '',
      apto_torre:           initialUser.apto_torre           || '',
      nombre_receptor:      initialUser.nombre_receptor      || '',
      telefono_entrega:     initialUser.telefono_entrega     || '',
      indicaciones:         initialUser.indicaciones         || '',
    };
  }, [initialUser]);

  // ─── Estado local ──────────────────────────────────────────
  const [formData, setFormData]             = useState(initialFormData);
  const [originalData, setOriginalData]     = useState(initialFormData);
  const [fotoPerfil, setFotoPerfil]         = useState(initialUser?.foto_url || null);
  const [originalFoto, setOriginalFoto]     = useState(initialUser?.foto_url || null);
  const [editMode, setEditMode]             = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordData, setPasswordData]     = useState({
    contrasenia_actual: '', nueva_contrasenia: '', confirmar_contrasenia: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [notification, setNotification]     = useState({
    isVisible: false, message: '', type: 'success'
  });

  // ─── Determinación de rol (cliente) ──────────────────────
  // FIX: el backend devuelve `rol_nombre`, no `rol`.
  // Un usuario es cliente cuando NO tiene rol_nombre asignado
  // (cliente_id presente y rol_id nulo) o cuando su rol es explícitamente 'cliente'.
  const esCliente = useMemo(() => {
    if (!initialUser) return false;
    // Primero revisa rol_nombre (campo real del to_dict del backend)
    const rolNombre = (initialUser.rol_nombre || '').toLowerCase();
    if (rolNombre === 'cliente') return true;
    // Fallback: si no tiene rol asignado pero tiene cliente_id, es cliente
    if (!initialUser.rol_id && initialUser.cliente_id) return true;
    return false;
  }, [initialUser]);

  // ─── React Query: GET /mi-perfil ──────────────────────────
  const { data: perfilData, isLoading: loading } = useQuery({
    queryKey: ['miPerfil'],
    queryFn: getMiPerfil,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    onError: () => showNotification('Error al cargar perfil', 'error'),
  });

  // ─── Sincronizar cuando lleguen datos del servidor ────────
  useEffect(() => {
    if (!perfilData) return;
    const { usuario, cliente } = perfilData;

    const newFormData = {
      nombre:               usuario.nombre             || '',
      apellido:             usuario.apellido           || '',
      correo:               usuario.correo             || '',
      telefono:             usuario.telefono           || '',
      tipo_documento:       usuario.tipo_documento     || '',
      numero_documento:     usuario.numero_documento   || '',
      fecha_nacimiento:     usuario.fecha_nacimiento   || '',
      genero:               normalizeGender(cliente?.genero),
      municipio:            cliente?.municipio         || '',
      departamento:         cliente?.departamento      || '',
      direccion:            cliente?.direccion         || '',
      barrio:               cliente?.barrio            || '',
      codigo_postal:        cliente?.codigo_postal     || '',
      ocupacion:            cliente?.ocupacion         || '',
      telefono_emergencia:  cliente?.telefono_emergencia || '',
      ciudad:               cliente?.ciudad            || '',
      apto_torre:           cliente?.apto_torre        || '',
      nombre_receptor:      cliente?.nombre_receptor   || '',
      telefono_entrega:     cliente?.telefono_entrega  || '',
      indicaciones:         cliente?.indicaciones      || '',
    };

    setFormData(newFormData);
    setOriginalData({ ...newFormData });
    setFotoPerfil(usuario.foto_url || null);
    setOriginalFoto(usuario.foto_url || null);
  }, [perfilData]);

  // ─── React Query: PUT /mi-perfil ──────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ usuarioPayload, clientePayload }) =>
      updateMiPerfil(usuarioPayload, clientePayload),
    onSuccess: (response) => {
      if (onUserUpdate) onUserUpdate(response.usuario);
      queryClient.invalidateQueries({ queryKey: ['miPerfil'] });
      setOriginalData({ ...formData });
      setOriginalFoto(fotoPerfil);
      showNotification('Perfil actualizado correctamente');
      setEditMode(false);
      setValidationErrors({});
    },
    onError: (error) => {
      showNotification(
        error.response?.data?.error || 'Error al actualizar',
        'error'
      );
    },
  });

  // ─── React Query: POST /usuario/cambiar-contrasenia ──────
  // FIX: onSuccess ya NO cierra sesión ni hace nada fuera del formulario.
  // El token JWT sigue siendo válido tras el cambio de contraseña porque
  // el backend solo actualiza el hash, no invalida el token existente.
  const passwordMutation = useMutation({
    mutationFn: ({ contraseniaActual, nuevaContrasenia }) =>
      cambiarContrasenia(contraseniaActual, nuevaContrasenia),
    onSuccess: () => {
      showNotification('Contraseña actualizada correctamente');
      setShowPasswordForm(false);
      setPasswordData({
        contrasenia_actual: '', nueva_contrasenia: '', confirmar_contrasenia: ''
      });
      setPasswordErrors({});
    },
    onError: (error) => {
      // FIX: extraer el mensaje del error de axios correctamente.
      // El backend devuelve { error: "..." } en el body.
      const mensaje = error.response?.data?.error
        || error.message
        || 'Error al cambiar contraseña';

      // Distinguir error de contraseña actual incorrecta para mostrarlo
      // en el campo correspondiente en lugar de solo en la notificación.
      if (error.response?.status === 401) {
        setPasswordErrors({ contrasenia_actual: 'Contraseña actual incorrecta' });
        showNotification('La contraseña actual no es correcta', 'error');
      } else {
        showNotification(mensaje, 'error');
      }
    },
  });

  // ─── Helpers ──────────────────────────────────────────────
  const showNotification = (message, type = 'success') => {
    setNotification({ isVisible: true, message, type });
    setTimeout(
      () => setNotification(prev => ({ ...prev, isVisible: false })),
      4000
    );
  };

  const handleCloseNotification = () =>
    setNotification(prev => ({ ...prev, isVisible: false }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFotoUpload = (url) => setFotoPerfil(url);

  const hasAnyChange = () =>
    Object.keys(formData).some(key => formData[key] !== originalData[key]) ||
    fotoPerfil !== originalFoto;

  const handleCancelPassword = () => {
    setShowPasswordForm(false);
    setPasswordData({
      contrasenia_actual: '', nueva_contrasenia: '', confirmar_contrasenia: ''
    });
    setPasswordErrors({});
  };

  // ─── Submit perfil ────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const usuarioPayload = {};
    const clientePayload = {};

    // Campos de Usuario
    if (formData.nombre             !== originalData.nombre)             usuarioPayload.nombre             = formData.nombre;
    if (formData.apellido           !== originalData.apellido)           usuarioPayload.apellido           = formData.apellido;
    if (formData.telefono           !== originalData.telefono)           usuarioPayload.telefono           = formData.telefono;
    if (formData.tipo_documento     !== originalData.tipo_documento)     usuarioPayload.tipo_documento     = formData.tipo_documento;
    if (formData.numero_documento   !== originalData.numero_documento)   usuarioPayload.numero_documento   = formData.numero_documento;
    if (formData.fecha_nacimiento   !== originalData.fecha_nacimiento)   usuarioPayload.fecha_nacimiento   = formData.fecha_nacimiento;
    if (fotoPerfil                  !== originalFoto)                    usuarioPayload.foto_url           = fotoPerfil;

    // Campos de Cliente (incluyendo dirección de entrega)
    if (formData.genero             !== originalData.genero)             clientePayload.genero             = denormalizeGender(formData.genero);
    if (formData.municipio          !== originalData.municipio)          clientePayload.municipio          = formData.municipio;
    if (formData.departamento       !== originalData.departamento)       clientePayload.departamento       = formData.departamento;
    if (formData.direccion          !== originalData.direccion)          clientePayload.direccion          = formData.direccion;
    if (formData.barrio             !== originalData.barrio)             clientePayload.barrio             = formData.barrio;
    if (formData.codigo_postal      !== originalData.codigo_postal)      clientePayload.codigo_postal      = formData.codigo_postal;
    if (formData.ocupacion          !== originalData.ocupacion)          clientePayload.ocupacion          = formData.ocupacion;
    if (formData.telefono_emergencia !== originalData.telefono_emergencia) clientePayload.telefono_emergencia = formData.telefono_emergencia;

    // Campos de entrega
    if (formData.ciudad             !== originalData.ciudad)             clientePayload.ciudad             = formData.ciudad;
    if (formData.apto_torre         !== originalData.apto_torre)         clientePayload.apto_torre         = formData.apto_torre;
    if (formData.nombre_receptor    !== originalData.nombre_receptor)    clientePayload.nombre_receptor    = formData.nombre_receptor;
    if (formData.telefono_entrega   !== originalData.telefono_entrega)   clientePayload.telefono_entrega   = formData.telefono_entrega;
    if (formData.indicaciones       !== originalData.indicaciones)       clientePayload.indicaciones       = formData.indicaciones;

    if (
      Object.keys(usuarioPayload).length === 0 &&
      Object.keys(clientePayload).length === 0
    ) {
      showNotification('No hay cambios para guardar', 'info');
      return;
    }

    // Validar solo los campos modificados
    const errors = {};
    if (usuarioPayload.nombre            !== undefined) { const e = validarNombre(usuarioPayload.nombre);                       if (e) errors.nombre = e; }
    if (usuarioPayload.apellido          !== undefined) { const e = validarApellido(usuarioPayload.apellido);                   if (e) errors.apellido = e; }
    if (usuarioPayload.telefono          !== undefined) { const e = validarTelefono(usuarioPayload.telefono);                   if (e) errors.telefono = e; }
    if (usuarioPayload.numero_documento  !== undefined) { const e = validarNumeroDocumento(usuarioPayload.numero_documento);    if (e) errors.numero_documento = e; }
    if (usuarioPayload.fecha_nacimiento  !== undefined) { const e = validarFechaNacimiento(usuarioPayload.fecha_nacimiento);    if (e) errors.fecha_nacimiento = e; }
    if (clientePayload.municipio         !== undefined) { const e = validarMunicipio(clientePayload.municipio);                 if (e) errors.municipio = e; }
    if (clientePayload.departamento      !== undefined) { const e = validarDepartamento(clientePayload.departamento);           if (e) errors.departamento = e; }
    if (clientePayload.direccion         !== undefined) { const e = validarDireccion(clientePayload.direccion);                 if (e) errors.direccion = e; }
    if (clientePayload.barrio            !== undefined) { const e = validarBarrio(clientePayload.barrio);                       if (e) errors.barrio = e; }
    if (clientePayload.codigo_postal     !== undefined) { const e = validarCodigoPostal(clientePayload.codigo_postal);          if (e) errors.codigo_postal = e; }
    if (clientePayload.ocupacion         !== undefined) { const e = validarOcupacion(clientePayload.ocupacion);                 if (e) errors.ocupacion = e; }
    if (clientePayload.telefono_emergencia !== undefined) { const e = validarTelefonoEmergencia(clientePayload.telefono_emergencia); if (e) errors.telefono_emergencia = e; }
    if (clientePayload.ciudad            !== undefined) { const e = validarCiudad(clientePayload.ciudad);                       if (e) errors.ciudad = e; }
    if (clientePayload.apto_torre        !== undefined) { const e = validarAptoTorre(clientePayload.apto_torre);               if (e) errors.apto_torre = e; }
    if (clientePayload.nombre_receptor   !== undefined) { const e = validarNombreReceptor(clientePayload.nombre_receptor);     if (e) errors.nombre_receptor = e; }
    if (clientePayload.telefono_entrega  !== undefined) { const e = validarTelefonoEntrega(clientePayload.telefono_entrega);   if (e) errors.telefono_entrega = e; }
    if (clientePayload.indicaciones      !== undefined) { const e = validarIndicaciones(clientePayload.indicaciones);           if (e) errors.indicaciones = e; }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showNotification('Corrige los errores en los campos modificados', 'error');
      return;
    }

    updateMutation.mutate({ usuarioPayload, clientePayload });
  };

  // ─── Submit contraseña ────────────────────────────────────
  // FIX: validar campo a campo antes de enviar y limpiar errores previos.
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordErrors({});

    // Validar que la contraseña actual no esté vacía
    if (!passwordData.contrasenia_actual || passwordData.contrasenia_actual.trim() === '') {
      setPasswordErrors({ contrasenia_actual: 'Ingresa tu contraseña actual' });
      showNotification('Ingresa tu contraseña actual', 'error');
      return;
    }

    // 🔽 Pasamos nombre y correo del usuario desde formData
    const error = validarPassword(
      passwordData.nueva_contrasenia,
      passwordData.confirmar_contrasenia,
      formData.nombre,   // nombre del usuario
      formData.correo    // correo del usuario
    );

    if (error) {
      // Identificar si el error es de coincidencia o de formato
      if (error.includes('coinciden')) {
        setPasswordErrors({ confirmar_contrasenia: error });
      } else if (error.includes('común') || error.includes('nombre') || error.includes('correo')) {
        setPasswordErrors({ nueva_contrasenia: error });
      } else {
        setPasswordErrors({ nueva_contrasenia: error });
      }
      showNotification(error, 'error');
      return;
    }

    // Asegurarse de que nueva ≠ actual (evita petición innecesaria)
    if (passwordData.contrasenia_actual === passwordData.nueva_contrasenia) {
      setPasswordErrors({ nueva_contrasenia: 'La nueva contraseña debe ser diferente a la actual' });
      showNotification('La nueva contraseña debe ser diferente a la actual', 'error');
      return;
    }

    passwordMutation.mutate({
      contraseniaActual: passwordData.contrasenia_actual,
      nuevaContrasenia:  passwordData.nueva_contrasenia,
    });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setFormData({ ...originalData });
    setFotoPerfil(originalFoto);
    setValidationErrors({});
  };

  return {
    formData,
    fotoPerfil,
    loading,
    editMode,
    showPasswordForm,
    validationErrors,
    passwordData,
    passwordErrors,   // <-- NUEVO: errores por campo del formulario de contraseña
    esCliente,
    notification,
    isUpdating:         updateMutation.isPending,
    isUpdatingPassword: passwordMutation.isPending,
    handleCloseNotification,
    handleChange,
    handlePasswordChange,
    handleSubmit,
    handlePasswordSubmit,
    handleCancelEdit,
    handleCancelPassword,
    setEditMode,
    setShowPasswordForm,
    handleFotoUpload,
    hasAnyChange,
  };
};