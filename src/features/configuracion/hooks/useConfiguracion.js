import { useState, useEffect } from 'react';
import { updateUser } from '@seguridad/user/services/userServices';
import { useAuth } from '@auth/hooks/useAuth';
import { validarNombre, validarTelefono, validarFechaNacimiento } from '../utils/configuracionHelpers';

export const useConfiguracion = (user, onUserUpdate) => {
  const { hasPermisoCRUD, isAdmin, hasRol } = useAuth();
  
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    tipoDocumento: '',
    numeroDocumento: ''
  });
  
  const [originalData, setOriginalData] = useState({});
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [fotoPerfil, setFotoPerfil] = useState(null);

  const esCliente = hasRol('cliente');
  const esAdmin = isAdmin();
  const puedeEditar = isAdmin() || hasPermisoCRUD('configuracion')?.actualizar === true;

  useEffect(() => {
    if (user) {
      const userData = {
        nombre: user.nombre || '',
        email: user.correo || user.email || '',
        telefono: user.telefono || '',
        fechaNacimiento: (user.fecha_nacimiento || user.fechaNacimiento || '').split('T')[0] || '',
        tipoDocumento: user.tipo_documento || user.tipoDocumento || '',
        numeroDocumento: user.numero_documento || user.numeroDocumento || ''
      };
      setFormData(userData);
      setOriginalData(userData);
    }
    
    const foto = localStorage.getItem(`foto_perfil_${user?.id}`);
    if (foto) setFotoPerfil(foto);
  }, [user]);

  const validateField = (name, value) => {
    switch (name) {
      case 'nombre': return validarNombre(value);
      case 'telefono': return validarTelefono(value);
      case 'fechaNacimiento': return validarFechaNacimiento(value);
      default: return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const fieldError = validateField(name, value);
    setValidationErrors(prev => ({ ...prev, [name]: fieldError }));
    if (error) setError('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const hasValidChanges = () => {
    const hasChanges = (
      formData.nombre !== originalData.nombre ||
      formData.telefono !== originalData.telefono ||
      formData.fechaNacimiento !== originalData.fechaNacimiento
    );
    const hasNoErrors = !validationErrors.nombre && !validationErrors.telefono && !validationErrors.fechaNacimiento;
    return hasChanges && hasNoErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hasValidChanges()) {
      setEditMode(false);
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {};
      if (formData.nombre !== originalData.nombre && formData.nombre.trim()) payload.nombre = formData.nombre.trim();
      if (formData.telefono !== originalData.telefono) payload.telefono = formData.telefono || '';
      if (formData.fechaNacimiento !== originalData.fechaNacimiento && formData.fechaNacimiento) payload.fecha_nacimiento = formData.fechaNacimiento;
      
      if (Object.keys(payload).length === 0) {
        setEditMode(false);
        setLoading(false);
        return;
      }
      
      const updatedUser = await updateUser(user.id, payload);
      
      const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
      const currentStoredUser = JSON.parse(storage.getItem('user') || '{}');
      const mergedUser = { ...currentStoredUser, ...updatedUser, rol: currentStoredUser.rol || user.rol, permisos: currentStoredUser.permisos || user.permisos };
      
      storage.setItem('user', JSON.stringify(mergedUser));
      
      const newUserData = {
        nombre: mergedUser.nombre || '',
        email: mergedUser.correo || mergedUser.email || '',
        telefono: mergedUser.telefono || '',
        fechaNacimiento: (mergedUser.fecha_nacimiento || mergedUser.fechaNacimiento || '').split('T')[0] || '',
        tipoDocumento: mergedUser.tipo_documento || mergedUser.tipoDocumento || '',
        numeroDocumento: mergedUser.numero_documento || mergedUser.numeroDocumento || ''
      };
      setOriginalData(newUserData);
      setFormData(newUserData);
      
      if (onUserUpdate) onUserUpdate(mergedUser);
      
      setSuccess('Perfil actualizado exitosamente');
      setEditMode(false);
      setValidationErrors({});
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await updateUser(user.id, { contrasenia: passwordData.newPassword });
      setSuccess('Contraseña actualizada exitosamente');
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData(originalData);
    setEditMode(false);
    setError('');
    setValidationErrors({});
  };

  const handleFotoUpload = (fotoUrl) => {
    setFotoPerfil(fotoUrl);
    localStorage.setItem(`foto_perfil_${user?.id}`, fotoUrl);
  };

  return {
    formData,
    fotoPerfil,
    loading,
    error,
    success,
    editMode,
    showPasswordForm,
    validationErrors,
    passwordData,
    puedeEditar,
    esCliente,
    esAdmin,
    handleChange,
    handlePasswordChange,
    handleSubmit,
    handlePasswordSubmit,
    handleCancelEdit,
    setEditMode,
    setShowPasswordForm,
    handleFotoUpload,
    hasValidChanges
  };
};