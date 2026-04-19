import { useState, useEffect } from 'react';
import { 
  getMiPerfilUsuario,
  updateMiPerfilUsuario,
  cambiarMiContraseniaUsuario,
  getMiPerfilCliente,
  updateMiPerfilCliente,
  cambiarMiContraseniaCliente
} from '@seguridad/user/services/clienteServices';
import { useAuth } from '@auth/hooks/useAuth';

export const useConfiguracion = (user, onUserUpdate) => {
  const { hasRol, isAdmin } = useAuth();
  
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    // Campos solo para clientes
    apellido: '',
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

  // Detectar si es cliente (tiene rol 'cliente')
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
            apellido: userData.apellido || '',
            correo: userData.correo || '',
            telefono: userData.telefono || '',
            direccion: userData.direccion || ''
          });
          setOriginalData({
            nombre: userData.nombre || '',
            apellido: userData.apellido || '',
            correo: userData.correo || '',
            telefono: userData.telefono || '',
            direccion: userData.direccion || ''
          });
        }
      } else {
        // Admin/Empleado: usa endpoint de usuario
        const userData = await getMiPerfilUsuario();
        if (userData) {
          setFormData({
            nombre: userData.nombre || '',
            correo: userData.correo || '',
            telefono: userData.telefono || '',
            apellido: '',
            direccion: ''
          });
          setOriginalData({
            nombre: userData.nombre || '',
            correo: userData.correo || '',
            telefono: userData.telefono || '',
            apellido: '',
            direccion: ''
          });
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
  }, [esCliente]);

  // Validaciones
  const validateField = (name, value) => {
    switch (name) {
      case 'nombre':
        if (!value || value.trim() === '') return 'El nombre es requerido';
        if (value.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
        return '';
      case 'telefono':
        if (value && !/^\d{7,15}$/.test(value.replace(/[\s-]/g, ''))) {
          return 'Formato de teléfono inválido (solo números, 7-15 dígitos)';
        }
        return '';
      default:
        return '';
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
    if (esCliente) {
      const hasChanges = (
        formData.nombre !== originalData.nombre ||
        formData.apellido !== originalData.apellido ||
        formData.telefono !== originalData.telefono ||
        formData.direccion !== originalData.direccion
      );
      const hasNoErrors = !validationErrors.nombre && !validationErrors.telefono;
      return hasChanges && hasNoErrors;
    } else {
      const hasChanges = (
        formData.nombre !== originalData.nombre ||
        formData.telefono !== originalData.telefono
      );
      const hasNoErrors = !validationErrors.nombre && !validationErrors.telefono;
      return hasChanges && hasNoErrors;
    }
  };

  // Guardar cambios
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
      if (esCliente) {
        const payload = {};
        if (formData.nombre !== originalData.nombre && formData.nombre.trim()) payload.nombre = formData.nombre.trim();
        if (formData.apellido !== originalData.apellido && formData.apellido.trim()) payload.apellido = formData.apellido.trim();
        if (formData.telefono !== originalData.telefono) payload.telefono = formData.telefono || '';
        if (formData.direccion !== originalData.direccion) payload.direccion = formData.direccion || '';
        
        await updateMiPerfilCliente(payload);
      } else {
        const payload = {};
        if (formData.nombre !== originalData.nombre && formData.nombre.trim()) payload.nombre = formData.nombre.trim();
        if (formData.telefono !== originalData.telefono) payload.telefono = formData.telefono || '';
        
        await updateMiPerfilUsuario(payload);
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