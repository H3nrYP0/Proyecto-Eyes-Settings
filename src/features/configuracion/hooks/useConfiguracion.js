<<<<<<< HEAD
// features/configuracion/hooks/useConfiguracion.js
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getMiPerfil,
  cambiarMiContrasenia,
  updateMiPerfil
} from '@seguridad/user/services/userServices';
import { 
  validarNombre, 
  validarApellido,
  validarTelefono,
  validarCiudad,
  validarDepartamento,
  validarDireccionPrincipal,
  validarAptoTorre,
  validarBarrio,
  validarNombreReceptor,
  validarIndicaciones,
  validarFormulario 
=======
/**
 * Hook para manejar el estado del perfil unificado (usuario + cliente).
 * Usa React Query para caché, loading states y sincronización automática.
 * - Carga de datos desde /mi-perfil
 * - Normalización de género
 * - Validación SOLO sobre los campos que se van a enviar (actualización parcial)
 * - Envío de solo los campos modificados al backend
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMiPerfil, updateMiPerfil, cambiarContrasenia } from '../services/perfilService';
import {
  validarNombre, validarApellido, validarTelefono, validarNumeroDocumento,
  validarFechaNacimiento, validarMunicipio, validarDepartamento, validarDireccion,
  validarBarrio, validarCodigoPostal, validarOcupacion, validarTelefonoEmergencia,
  validarPassword, normalizeGender, denormalizeGender
>>>>>>> Develop
} from '../utils/configuracionHelpers';
import { useAuth } from '@auth/hooks/useAuth';

<<<<<<< HEAD
export const useConfiguracion = (user, onUserUpdate) => {
  const queryClient = useQueryClient();
  const { isCliente } = useAuth();
  
  // Estado local para el formulario (editable)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    ciudad: '',
    departamento: '',
    direccion_principal: '',
    apto_torre: '',
    barrio: '',
    nombre_receptor: '',
    telefono_entrega: '',
    indicaciones: ''
  });
  
  const [originalData, setOriginalData] = useState({});
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [fotoOriginal, setFotoOriginal] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordData, setPasswordData] = useState({
    contrasenia_actual: '',
    nueva_contrasenia: '',
    confirmar_contrasenia: ''
  });
  const [notification, setNotification] = useState({ isVisible: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') =>
    setNotification({ isVisible: true, message, type });
  const handleCloseNotification = () =>
    setNotification((prev) => ({ ...prev, isVisible: false }));

  // Cargar datos con useQuery
  const { data: userData, isLoading: loading } = useQuery({
    queryKey: ['miPerfil'],
    queryFn: getMiPerfil,
    initialData: user,
    onSuccess: (data) => {
      if (data) {
        setFormData({
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          correo: data.correo || '',
          telefono: data.telefono || '',
          ciudad: data.ciudad || '',
          departamento: data.departamento || '',
          direccion_principal: data.direccion_principal || '',
          apto_torre: data.apto_torre || '',
          barrio: data.barrio || '',
          nombre_receptor: data.nombre_receptor || '',
          telefono_entrega: data.telefono_entrega || '',
          indicaciones: data.indicaciones || ''
        });
        setOriginalData({
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          correo: data.correo || '',
          telefono: data.telefono || '',
          ciudad: data.ciudad || '',
          departamento: data.departamento || '',
          direccion_principal: data.direccion_principal || '',
          apto_torre: data.apto_torre || '',
          barrio: data.barrio || '',
          nombre_receptor: data.nombre_receptor || '',
          telefono_entrega: data.telefono_entrega || '',
          indicaciones: data.indicaciones || ''
        });
        setFotoPerfil(data.foto_perfil || null);
        setFotoOriginal(data.foto_perfil || null);
      }
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateMiPerfil,
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['miPerfil'] });
      setOriginalData({ ...formData });
      setFotoOriginal(fotoPerfil);
      setEditMode(false);
      setValidationErrors({});
      onUserUpdate?.(updatedUser);
      showNotification('Perfil actualizado exitosamente');
    },
    onError: (err) => {
      const msg = err.response?.data?.error || err.message || 'Error al actualizar perfil';
      showNotification(msg, 'error');
    }
  });

  const passwordMutation = useMutation({
    mutationFn: cambiarMiContrasenia,
    onSuccess: () => {
      setPasswordData({ contrasenia_actual: '', nueva_contrasenia: '', confirmar_contrasenia: '' });
      setShowPasswordForm(false);
      showNotification('Contraseña actualizada exitosamente');
    },
    onError: (err) => {
      const msg = err.message || 'Error al cambiar contraseña';
      showNotification(msg, 'error');
    }
  });

  const validarCampo = (name, value) => {
    switch (name) {
      case 'nombre': return validarNombre(value);
      case 'apellido': return validarApellido(value);
      case 'telefono': return validarTelefono(value);
      case 'ciudad': return validarCiudad(value);
      case 'departamento': return validarDepartamento(value);
      case 'direccion_principal': return validarDireccionPrincipal(value);
      case 'apto_torre': return validarAptoTorre(value);
      case 'barrio': return validarBarrio(value);
      case 'nombre_receptor': return validarNombreReceptor(value);
      case 'indicaciones': return validarIndicaciones(value);
      default: return '';
    }
=======
const EMPTY_FORM = {
  nombre: '', apellido: '', correo: '', telefono: '',
  tipo_documento: '', numero_documento: '', fecha_nacimiento: '',
  genero: '', municipio: '', departamento: '', direccion: '',
  barrio: '', codigo_postal: '', ocupacion: '', telefono_emergencia: ''
};

export const useConfiguracion = (initialUser, onUserUpdate) => {
  const queryClient = useQueryClient();

  // ─── Estado local de UI ───────────────────────────────────────────────────
  const [formData, setFormData]             = useState(EMPTY_FORM);
  const [originalData, setOriginalData]     = useState(EMPTY_FORM);
  const [fotoPerfil, setFotoPerfil]         = useState(null);
  const [originalFoto, setOriginalFoto]     = useState(null);
  const [editMode, setEditMode]             = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordData, setPasswordData]     = useState({
    contrasenia_actual: '', nueva_contrasenia: '', confirmar_contrasenia: ''
  });
  const [notification, setNotification]     = useState({
    isVisible: false, message: '', type: 'success'
  });

  const puedeEditar = true;
  const esCliente   = false;

  // ─── React Query: GET /mi-perfil ──────────────────────────────────────────
  const { data: perfilData, isLoading: loading } = useQuery({
    queryKey: ['miPerfil'],
    queryFn: getMiPerfil,
    staleTime: 5 * 60 * 1000, // 5 minutos en caché
    retry: 1,
    onError: () => showNotification('Error al cargar perfil', 'error'),
  });

  // Sincronizar formData cuando llegan los datos del servidor
  useEffect(() => {
    if (!perfilData) return;
    const { usuario, cliente } = perfilData;

    const newFormData = {
      nombre:               usuario.nombre             || '',
      apellido:             usuario.apellido            || '',
      correo:               usuario.correo              || '',
      telefono:             usuario.telefono            || '',
      tipo_documento:       usuario.tipo_documento      || '',
      numero_documento:     usuario.numero_documento    || '',
      fecha_nacimiento:     usuario.fecha_nacimiento    || '',
      genero:               normalizeGender(cliente?.genero),
      municipio:            cliente?.municipio          || '',
      departamento:         cliente?.departamento       || '',
      direccion:            cliente?.direccion          || '',
      barrio:               cliente?.barrio             || '',
      codigo_postal:        cliente?.codigo_postal      || '',
      ocupacion:            cliente?.ocupacion          || '',
      telefono_emergencia:  cliente?.telefono_emergencia || '',
    };

    setFormData(newFormData);
    setOriginalData({ ...newFormData });
    setFotoPerfil(usuario.foto_url   || null);
    setOriginalFoto(usuario.foto_url || null);
  }, [perfilData]);

  // ─── React Query: PUT /mi-perfil ──────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ usuarioPayload, clientePayload }) =>
      updateMiPerfil(usuarioPayload, clientePayload),
    onSuccess: (response) => {
      if (onUserUpdate) onUserUpdate(response.usuario);
      // Actualiza la caché con los datos frescos del servidor
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

  // ─── React Query: POST /usuario/cambiar-contrasenia ───────────────────────
  const passwordMutation = useMutation({
    mutationFn: ({ contraseniaActual, nuevaContrasenia }) =>
      cambiarContrasenia(contraseniaActual, nuevaContrasenia),
    onSuccess: () => {
      showNotification('Contraseña actualizada');
      setShowPasswordForm(false);
      setPasswordData({
        contrasenia_actual: '', nueva_contrasenia: '', confirmar_contrasenia: ''
      });
    },
    onError: (error) => {
      showNotification(error.response?.data?.error || 'Error', 'error');
    },
  });

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const showNotification = (message, type = 'success') => {
    setNotification({ isVisible: true, message, type });
    setTimeout(
      () => setNotification(prev => ({ ...prev, isVisible: false })),
      4000
    );
>>>>>>> Develop
  };

  const handleCloseNotification = () =>
    setNotification(prev => ({ ...prev, isVisible: false }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
<<<<<<< HEAD
    const fieldError = validarCampo(name, value);
    setValidationErrors(prev => ({ ...prev, [name]: fieldError }));
=======
    // Limpiar error del campo modificado
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
>>>>>>> Develop
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

<<<<<<< HEAD
  const hasValidChanges = () => {
    // Campos de texto
    const textChanged = Object.keys(formData).some(key => formData[key] !== originalData[key]);
    const fotoChanged = fotoPerfil !== fotoOriginal;
    return textChanged || fotoChanged;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validarFormulario(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showNotification('Por favor corrige los errores antes de guardar', 'error');
      return;
    }
    if (!hasValidChanges()) {
      setEditMode(false);
      return;
    }
    
    const payload = {};
    for (const key of Object.keys(formData)) {
      if (formData[key] !== originalData[key]) {
        payload[key] = formData[key]?.trim ? formData[key].trim() : formData[key];
      }
    }
    if (fotoPerfil !== fotoOriginal) {
      payload.foto_perfil = fotoPerfil; // puede ser base64 o URL
    }
    
    if (Object.keys(payload).length === 0) return;
    
    updateProfileMutation.mutate(payload);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.nueva_contrasenia !== passwordData.confirmar_contrasenia) {
      showNotification('Las contraseñas nuevas no coinciden', 'error');
      return;
    }
    if (passwordData.nueva_contrasenia.length < 6) {
      showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }
    if (!passwordData.contrasenia_actual) {
      showNotification('Debes ingresar tu contraseña actual', 'error');
      return;
    }
    passwordMutation.mutate({
      contrasenia_actual: passwordData.contrasenia_actual,
      nueva_contrasenia: passwordData.nueva_contrasenia
=======
  const handleFotoUpload = (url) => setFotoPerfil(url);

  /** Detecta si hay al menos un campo o foto cambiados respecto al original */
  const hasAnyChange = () =>
    Object.keys(formData).some(key => formData[key] !== originalData[key]) ||
    fotoPerfil !== originalFoto;

  // ─── Submit perfil ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Construir payloads SOLO con campos modificados
    const usuarioPayload = {};
    const clientePayload = {};

    if (formData.nombre             !== originalData.nombre)             usuarioPayload.nombre             = formData.nombre;
    if (formData.apellido           !== originalData.apellido)           usuarioPayload.apellido           = formData.apellido;
    if (formData.telefono           !== originalData.telefono)           usuarioPayload.telefono           = formData.telefono;
    if (formData.tipo_documento     !== originalData.tipo_documento)     usuarioPayload.tipo_documento     = formData.tipo_documento;
    if (formData.numero_documento   !== originalData.numero_documento)   usuarioPayload.numero_documento   = formData.numero_documento;
    if (formData.fecha_nacimiento   !== originalData.fecha_nacimiento)   usuarioPayload.fecha_nacimiento   = formData.fecha_nacimiento;
    if (fotoPerfil                  !== originalFoto)                    usuarioPayload.foto_url           = fotoPerfil;

    if (formData.genero             !== originalData.genero)             clientePayload.genero             = denormalizeGender(formData.genero);
    if (formData.municipio          !== originalData.municipio)          clientePayload.municipio          = formData.municipio;
    if (formData.departamento       !== originalData.departamento)       clientePayload.departamento       = formData.departamento;
    if (formData.direccion          !== originalData.direccion)          clientePayload.direccion          = formData.direccion;
    if (formData.barrio             !== originalData.barrio)             clientePayload.barrio             = formData.barrio;
    if (formData.codigo_postal      !== originalData.codigo_postal)      clientePayload.codigo_postal      = formData.codigo_postal;
    if (formData.ocupacion          !== originalData.ocupacion)          clientePayload.ocupacion          = formData.ocupacion;
    if (formData.telefono_emergencia !== originalData.telefono_emergencia) clientePayload.telefono_emergencia = formData.telefono_emergencia;

    if (
      Object.keys(usuarioPayload).length === 0 &&
      Object.keys(clientePayload).length === 0
    ) {
      showNotification('No hay cambios para guardar', 'info');
      return;
    }

    // 2. Validar SOLO los campos modificados
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

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showNotification('Corrige los errores en los campos modificados', 'error');
      return;
    }

    updateMutation.mutate({ usuarioPayload, clientePayload });
  };

  // ─── Submit contraseña ────────────────────────────────────────────────────
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const error = validarPassword(
      passwordData.nueva_contrasenia,
      passwordData.confirmar_contrasenia
    );
    if (error) { showNotification(error, 'error'); return; }

    passwordMutation.mutate({
      contraseniaActual: passwordData.contrasenia_actual,
      nuevaContrasenia:  passwordData.nueva_contrasenia,
>>>>>>> Develop
    });
  };

  const handleCancelEdit = () => {
<<<<<<< HEAD
    setFormData(originalData);
    setFotoPerfil(fotoOriginal);
    setEditMode(false);
    setValidationErrors({});
  };

  const handleFotoUpload = (fotoDataUrl) => {
    setFotoPerfil(fotoDataUrl);
  };

  const puedeEditar = true;
  const esCliente = isCliente();

=======
    setEditMode(false);
    setFormData({ ...originalData });
    setFotoPerfil(originalFoto);
    setValidationErrors({});
  };

>>>>>>> Develop
  return {
    // Datos y estado
    formData,
    fotoPerfil,
    loading,
    editMode,
    showPasswordForm,
    validationErrors,
    passwordData,
    puedeEditar,
    esCliente,
    notification,
<<<<<<< HEAD
=======
    isUpdating:         updateMutation.isPending,
    isUpdatingPassword: passwordMutation.isPending,
    // Handlers
>>>>>>> Develop
    handleCloseNotification,
    handleChange,
    handlePasswordChange,
    handleSubmit,
    handlePasswordSubmit,
    handleCancelEdit,
    setEditMode,
    setShowPasswordForm,
    handleFotoUpload,
<<<<<<< HEAD
    hasValidChanges,
    isUpdating: updateProfileMutation.isPending,
    isUpdatingPassword: passwordMutation.isPending
=======
    hasAnyChange,
>>>>>>> Develop
  };
};