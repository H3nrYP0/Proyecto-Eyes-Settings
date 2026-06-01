/**
 * Hook para manejar el estado del perfil unificado (usuario + cliente).
 * Incluye normalización de género al cargar y al guardar, validaciones y gestión de foto.
 */

import { useState, useEffect } from 'react';
import { getMiPerfil, updateMiPerfil, cambiarContrasenia } from '../services/perfilService';
import { validarFormulario, validarPassword, normalizeGender, denormalizeGender } from '../utils/configuracionHelpers';

export const useConfiguracion = (initialUser, onUserUpdate) => {
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', correo: '', telefono: '',
    tipo_documento: '', numero_documento: '', fecha_nacimiento: '',
    genero: '', municipio: '', departamento: '', direccion: '',
    barrio: '', codigo_postal: '', ocupacion: '', telefono_emergencia: ''
  });
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordData, setPasswordData] = useState({ contrasenia_actual: '', nueva_contrasenia: '', confirmar_contrasenia: '' });
  const [notification, setNotification] = useState({ isVisible: false, message: '', type: 'success' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const puedeEditar = true;
  const esCliente = false; // Ajusta según rol

  useEffect(() => {
    const loadPerfil = async () => {
      try {
        setLoading(true);
        const { usuario, cliente } = await getMiPerfil();
        setFormData({
          nombre: usuario.nombre || '',
          apellido: usuario.apellido || '',
          correo: usuario.correo || '',
          telefono: usuario.telefono || '',
          tipo_documento: usuario.tipo_documento || '',
          numero_documento: usuario.numero_documento || '',
          fecha_nacimiento: usuario.fecha_nacimiento || '',
          genero: normalizeGender(cliente?.genero),    // ← normalizado
          municipio: cliente?.municipio || '',
          departamento: cliente?.departamento || '',
          direccion: cliente?.direccion || '',
          barrio: cliente?.barrio || '',
          codigo_postal: cliente?.codigo_postal || '',
          ocupacion: cliente?.ocupacion || '',
          telefono_emergencia: cliente?.telefono_emergencia || ''
        });
        setFotoPerfil(usuario.foto_url || null);
      } catch (error) {
        showNotification('Error al cargar perfil', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadPerfil();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ isVisible: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, isVisible: false })), 4000);
  };

  const handleCloseNotification = () => setNotification(prev => ({ ...prev, isVisible: false }));
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };
  const handleFotoUpload = (url) => setFotoPerfil(url);
  const hasValidChanges = () => Object.keys(validarFormulario(formData)).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validarFormulario(formData);
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      showNotification('Corrige los errores del formulario', 'error');
      return;
    }
    setIsUpdating(true);
    try {
      const usuarioPayload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        tipo_documento: formData.tipo_documento,
        numero_documento: formData.numero_documento,
        fecha_nacimiento: formData.fecha_nacimiento,
        foto_url: fotoPerfil
      };
      const clientePayload = {
        genero: denormalizeGender(formData.genero),   // ← denormalizado a minúsculas
        municipio: formData.municipio,
        departamento: formData.departamento,
        direccion: formData.direccion,
        barrio: formData.barrio,
        codigo_postal: formData.codigo_postal,
        ocupacion: formData.ocupacion,
        telefono_emergencia: formData.telefono_emergencia
      };
      const response = await updateMiPerfil(usuarioPayload, clientePayload);
      if (onUserUpdate) onUserUpdate(response.usuario);
      showNotification('Perfil actualizado correctamente');
      setEditMode(false);
      setValidationErrors({});
    } catch (error) {
      showNotification(error.response?.data?.error || 'Error al actualizar', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const error = validarPassword(passwordData.nueva_contrasenia, passwordData.confirmar_contrasenia);
    if (error) { showNotification(error, 'error'); return; }
    setIsUpdatingPassword(true);
    try {
      await cambiarContrasenia(passwordData.contrasenia_actual, passwordData.nueva_contrasenia);
      showNotification('Contraseña actualizada');
      setShowPasswordForm(false);
      setPasswordData({ contrasenia_actual: '', nueva_contrasenia: '', confirmar_contrasenia: '' });
    } catch (error) {
      showNotification(error.response?.data?.error || 'Error', 'error');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    const reload = async () => {
      try {
        const { usuario, cliente } = await getMiPerfil();
        setFormData({
          nombre: usuario.nombre || '',
          apellido: usuario.apellido || '',
          correo: usuario.correo || '',
          telefono: usuario.telefono || '',
          tipo_documento: usuario.tipo_documento || '',
          numero_documento: usuario.numero_documento || '',
          fecha_nacimiento: usuario.fecha_nacimiento || '',
          genero: normalizeGender(cliente?.genero),
          municipio: cliente?.municipio || '',
          departamento: cliente?.departamento || '',
          direccion: cliente?.direccion || '',
          barrio: cliente?.barrio || '',
          codigo_postal: cliente?.codigo_postal || '',
          ocupacion: cliente?.ocupacion || '',
          telefono_emergencia: cliente?.telefono_emergencia || ''
        });
        setFotoPerfil(usuario.foto_url || null);
        setValidationErrors({});
      } catch (error) {
        showNotification('Error al recargar', 'error');
      }
    };
    reload();
  };

  return {
    formData, fotoPerfil, loading, editMode, showPasswordForm, validationErrors, passwordData,
    puedeEditar, esCliente, notification, handleCloseNotification, handleChange, handlePasswordChange,
    handleSubmit, handlePasswordSubmit, handleCancelEdit, setEditMode, setShowPasswordForm,
    handleFotoUpload, hasValidChanges, isUpdating, isUpdatingPassword
  };
};