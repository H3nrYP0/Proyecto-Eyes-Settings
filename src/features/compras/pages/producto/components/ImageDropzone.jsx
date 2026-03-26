// src/features/compras/pages/producto/components/ImageDropzone.jsx
import { Box, Grid, Paper, IconButton, Typography, CircularProgress } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDropzone } from 'react-dropzone';
import "../styles/ImageDropzone.css";


export default function ImageDropzone({ onDrop, previews, onRemove, disabled, uploadingImages }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
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
        className={`dropzone-area ${isDragActive ? 'drag-active' : ''}`}
        sx={{ p: 1, textAlign: 'center', cursor: disabled ? 'default' : 'pointer' }}
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

      {uploadingImages && (
        <Box sx={{ textAlign: 'center', mt: 2, py: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Cargando imagenes...
          </Typography>
        </Box>
      )}

      {previews.length > 0 && (
        <Grid container spacing={1.5} sx={{ mt: 1 }}>
          {previews.map((preview, index) => (
            <Grid item xs={2.4} key={index}>
              <Paper
                variant="outlined"
                className="preview-item"
                sx={{ position: 'relative', overflow: 'hidden', p: 1 }}
              >
                <Box className="preview-image-container">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="preview-image"
                    loading="lazy"
                  />
                  {!disabled && (
                    <IconButton
                      size="small"
                      onClick={() => onRemove(index)}
                      className="remove-button"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}