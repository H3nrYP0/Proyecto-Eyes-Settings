/**
 * Componente que permite al usuario subir una foto de perfil.
 * La imagen se sube directamente a Cloudinary usando un upload preset unsigned.
 * Una vez obtenida la URL segura, la pasa al padre mediante onUpload.
 * Muestra validaciones de tipo y tamaño, y un indicador de carga.
 */

import { useState, useRef } from 'react';
import { Box, Avatar, IconButton, CircularProgress, Snackbar, Alert } from '@mui/material';
import { PhotoCamera as CameraIcon } from '@mui/icons-material';

const PRIMARY_COLOR = "#1a4a4a";
const PRIMARY_DARK = "#0d2e2e";
const GRAY_500 = "#4e6e6e";

// Configuración de Cloudinary (debe coincidir con tu cuenta)
const CLOUDINARY_UPLOAD_PRESET = 'optic_app_upload';
const CLOUDINARY_CLOUD_NAME = 'drhhthuqq'; // Reemplaza con tu cloud name
const CLOUDINARY_FOLDER = 'optica/perfiles';

export default function UploadAvatar({ user, fotoPerfil, onUpload, puedeEditar = false }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen no puede superar los 2MB');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', CLOUDINARY_FOLDER);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Error al subir imagen');
      
      const fotoUrl = data.secure_url;
      onUpload(fotoUrl);
      // Limpiar input para permitir volver a subir la misma imagen
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError('Error al cargar la imagen: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getInitial = () => {
    if (user?.nombre) return user.nombre.charAt(0).toUpperCase();
    if (user?.correo) return user.correo.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Avatar
        src={fotoPerfil || undefined}
        sx={{
          width: 100,
          height: 100,
          bgcolor: PRIMARY_COLOR,
          fontSize: 40,
          cursor: puedeEditar ? 'pointer' : 'default',
          '&:hover': puedeEditar ? {
            opacity: 0.8,
            backgroundColor: PRIMARY_DARK
          } : {}
        }}
        onClick={() => puedeEditar && fileInputRef.current?.click()}
      >
        {!fotoPerfil && getInitial()}
      </Avatar>
      
      {puedeEditar && (
        <IconButton
          component="label"
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            bgcolor: PRIMARY_COLOR,
            color: 'white',
            '&:hover': { bgcolor: GRAY_500 },
            width: 32,
            height: 32
          }}
          size="small"
        >
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
            disabled={loading}
          />
          {loading ? <CircularProgress size={16} color="inherit" /> : <CameraIcon fontSize="small" />}
        </IconButton>
      )}
      
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
      </Snackbar>
    </Box>
  );
}