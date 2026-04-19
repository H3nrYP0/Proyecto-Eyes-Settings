// features/configuracion/components/general/UploadAvatar.jsx
import { useState } from 'react';
import { Box, Avatar, IconButton, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { PhotoCamera as CameraIcon } from '@mui/icons-material';

export default function UploadAvatar({ user, fotoPerfil, onUpload, puedeEditar = false }) {
  const theme = useTheme();
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
          bgcolor: theme.palette.primary.main,
          fontSize: 40,
          cursor: puedeEditar ? 'pointer' : 'default',
          '&:hover': puedeEditar ? {
            opacity: 0.8,
            backgroundColor: theme.palette.primary.dark
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
            bgcolor: theme.palette.primary.main,
            color: 'white',
            '&:hover': { 
              bgcolor: theme.palette.secondary.main 
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