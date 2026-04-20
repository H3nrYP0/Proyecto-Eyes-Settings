import { useState, useEffect } from 'react';
import { 
  updateMiPerfilUsuario,
  cambiarMiContraseniaUsuario,
  getMiPerfilCliente,
  updateMiPerfilCliente,
  cambiarMiContraseniaCliente
} from '@seguridad/user/services/clienteServices';
import { useAuth } from '@auth/hooks/useAuth';
import { 
  validarNombre, 
  validarTelefono, 
  validarDireccion,
  validarFormulario 
} from '../utils/configuracionHelpers';

export const useConfiguracion = (user, onUserUpdate) => {
  const { hasRol } = useAuth();
  
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    direccion: ''
  });
  
  const [originalData, setOriginalData] = useState({});
  const [passwordData, setPasswordData] = useState({
    contrasenia_actual: '',
    nueva_contrasenia: '',
    confirmar_contrasenia: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [fotoPerfil, setFotoPerfil] = useState(null);

  const esCliente = hasRol('cliente');
  const puedeEditar = true;

  // Cargar datos según el tipo de usuario
  const loadUserData = async () => {
    setLoading(true);
    try {
      if (esCliente) {
        // Cliente: usa endpoint de cliente
        const userData = await getMiPerfilCliente();
        if (userData) {
          setFormData({
            nombre: userData.nombre || '',
            correo: userData.correo || '',
            telefono: userData.telefono || '',
            direccion: userData.direccion || ''
          });
          setOriginalData({
            nombre: userData.nombre || '',
            correo: userData.correo || '',
            telefono: userData.telefono || '',
            direccion: userData.direccion || ''
          });
        }
      } else {
        // ADMIN/EMPLEADO: usa los datos del prop `user`
        if (user) {
          const userData = {
            nombre: user.nombre || '',
            correo: user.correo || '',
            telefono: user.telefono || ''
          };
          
          setFormData({
            nombre: userData.nombre,
            correo: userData.correo,
            telefono: userData.telefono,
            direccion: ''
          });
          setOriginalData({
            nombre: userData.nombre,
            correo: userData.correo,
            telefono: userData.telefono,
            direccion: ''
          });
        } else {
          setError('No hay datos de usuario disponibles');
        }
      }
    } catch (err) {
      console.error('Error cargando perfil:', err);
      setError('Error al cargar los datos del perfil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [esCliente, user]);

  // VALIDAR UN CAMPO ESPECÍFICO
  const validarCampo = (name, value) => {
    switch (name) {
      case 'nombre':
        return validarNombre(value);
      case 'telefono':
        return validarTelefono(value);
      case 'direccion':
        return validarDireccion(value);
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validar en tiempo real
    const fieldError = validarCampo(name, value);
    setValidationErrors(prev => ({ ...prev, [name]: fieldError }));
    if (error) setError('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  // ✅ CORREGIDO: No llama a setValidationErrors
  const hasValidChanges = () => {
    if (esCliente) {
      const hasChanges = (
        formData.nombre !== originalData.nombre ||
        formData.telefono !== originalData.telefono ||
        formData.direccion !== originalData.direccion
      );
      return hasChanges;
    } else {
      const hasChanges = (
        formData.nombre !== originalData.nombre ||
        formData.telefono !== originalData.telefono
      );
      return hasChanges;
    }
  };

  // ✅ Verificar si hay errores de validación
  const hasValidationErrors = () => {
    return Object.values(validationErrors).some(error => error !== '');
  };

  // Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar antes de enviar
    const errors = validarFormulario(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Por favor corrige los errores antes de guardar');
      return;
    }
    
    if (!hasValidChanges()) {
      setEditMode(false);
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (esCliente) {
        const payload = {};
        if (formData.nombre !== originalData.nombre && formData.nombre.trim()) payload.nombre = formData.nombre.trim();
        if (formData.telefono !== originalData.telefono) payload.telefono = formData.telefono || '';
        if (formData.direccion !== originalData.direccion) payload.direccion = formData.direccion || '';
        
        await updateMiPerfilCliente(payload);
      } else {
        const payload = {};
        if (formData.nombre !== originalData.nombre && formData.nombre.trim()) payload.nombre = formData.nombre.trim();
        if (formData.telefono !== originalData.telefono) payload.telefono = formData.telefono || '';
        
        await updateMiPerfilUsuario(payload);
        
        // Actualizar el user en el padre si onUserUpdate existe
        if (onUserUpdate && user) {
          onUserUpdate({
            ...user,
            nombre: formData.nombre,
            telefono: formData.telefono
          });
        }
      }
      
      setSuccess('Perfil actualizado exitosamente');
      setOriginalData({ ...formData });
      setEditMode(false);
      setValidationErrors({});
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  // Cambiar contraseña
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.nueva_contrasenia !== passwordData.confirmar_contrasenia) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }
    
    if (passwordData.nueva_contrasenia.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    if (!passwordData.contrasenia_actual) {
      setError('Debes ingresar tu contraseña actual');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      if (esCliente) {
        await cambiarMiContraseniaCliente({
          contrasenia_actual: passwordData.contrasenia_actual,
          nueva_contrasenia: passwordData.nueva_contrasenia
        });
      } else {
        await cambiarMiContraseniaUsuario({
          contrasenia_actual: passwordData.contrasenia_actual,
          nueva_contrasenia: passwordData.nueva_contrasenia
        });
      }
      
      setSuccess('Contraseña actualizada exitosamente');
      setPasswordData({ contrasenia_actual: '', nueva_contrasenia: '', confirmar_contrasenia: '' });
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