import { useState } from 'react';
import { Box, Avatar, IconButton, CircularProgress, Snackbar, Alert } from '@mui/material';
import { PhotoCamera as CameraIcon } from '@mui/icons-material';

const PRIMARY_COLOR = "#1a4a4a";
const PRIMARY_DARK = "#0d2e2e";
const GRAY_500 = "#4e6e6e";

export default function UploadAvatar({ user, fotoPerfil, onUpload, puedeEditar = false }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Error al cargar la imagen');
      setLoading(false);
    }
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
      >
        {!fotoPerfil && (user?.nombre?.charAt(0)?.toUpperCase() || 'U')}
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
            '&:hover': { 
              bgcolor: GRAY_500
            },
            width: 32,
            height: 32
          }}
          size="small"
        >
          <input type="file" hidden accept="image/*" onChange={handleImageUpload} disabled={loading} />
          {loading ? <CircularProgress size={16} color="inherit" /> : <CameraIcon fontSize="small" />}
        </IconButton>
      )}
      
      <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
      </Snackbar>
    </Box>
  );
}