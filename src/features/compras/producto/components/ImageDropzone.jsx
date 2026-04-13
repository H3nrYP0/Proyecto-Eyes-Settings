// src/features/compras/pages/producto/components/ImageDropzone.jsx
import { Box, Grid, Paper, IconButton, Typography, CircularProgress, Alert } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDropzone } from 'react-dropzone';
import { useState } from "react";

export default function ImageDropzone({ onDrop, previews, onRemove, disabled, uploadingImages }) {
  const [errorMessage, setErrorMessage] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles, fileRejections) => {
      setErrorMessage("");
      if (fileRejections.length > 0) {
        const firstError = fileRejections[0].errors[0];
        setErrorMessage(firstError.message);
        return;
      }
      if (acceptedFiles.length > 0) {
        onDrop(acceptedFiles);
      }
    },
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: 2 * 1024 * 1024,
    maxFiles: 5,
    disabled
  });

  return (
    <Box>
      <Paper
        variant="outlined"
        {...getRootProps()}
        sx={{
          p: 2,
          textAlign: 'center',
          cursor: disabled ? 'default' : 'pointer',
          border: isDragActive ? '2px dashed #1976d2' : '1px dashed #ccc',
          bgcolor: isDragActive ? 'rgba(25, 118, 210, 0.04)' : 'transparent'
        }}
      >
        <input {...getInputProps()} />
        <AddPhotoAlternateIcon color="action" sx={{ fontSize: 48, mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {isDragActive
            ? 'Suelta las imágenes aquí'
            : 'Arrastra y suelta imágenes aquí, o haz clic para seleccionar'}
        </Typography>
        <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 0.5 }}>
          JPG, PNG, WebP | Máx: 2MB | Máx: 5 imágenes
        </Typography>
      </Paper>

      {errorMessage && (
        <Alert severity="error" sx={{ mt: 1 }} onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      )}

      {uploadingImages && (
        <Box sx={{ textAlign: 'center', mt: 2, py: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Subiendo imágenes a Cloudinary...
          </Typography>
        </Box>
      )}

      {previews.length > 0 && (
        <Grid container spacing={1.5} sx={{ mt: 1 }}>
          {previews.map((preview, index) => (
            <Grid item xs={2.4} key={index}>
              <Paper
                variant="outlined"
                sx={{ position: 'relative', overflow: 'hidden', p: 1, aspectRatio: '1/1' }}
              >
                <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                </Box>
                {!disabled && (
                  <IconButton
                    size="small"
                    onClick={() => onRemove(index)}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      bgcolor: 'rgba(211, 47, 47, 0.9)',
                      color: 'white',
                      '&:hover': { bgcolor: '#b71c1c' }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}