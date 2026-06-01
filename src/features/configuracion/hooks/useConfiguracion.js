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
} from '../utils/configuracionHelpers';
import { useAuth } from '@auth/hooks/useAuth';

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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const fieldError = validarCampo(name, value);
    setValidationErrors(prev => ({ ...prev, [name]: fieldError }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

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
    });
  };

  const handleCancelEdit = () => {
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

  return {
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
    handleCloseNotification,
    handleChange,
    handlePasswordChange,
    handleSubmit,
    handlePasswordSubmit,
    handleCancelEdit,
    setEditMode,
    setShowPasswordForm,
    handleFotoUpload,
    hasValidChanges,
    isUpdating: updateProfileMutation.isPending,
    isUpdatingPassword: passwordMutation.isPending
  };
};