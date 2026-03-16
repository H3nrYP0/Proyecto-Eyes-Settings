import { Box, Grid, Paper, IconButton, Typography } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDropzone } from "react-dropzone";
import "./ImageDropzone.css"; 

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
      >
        <input {...getInputProps()} />
        <Box textAlign="center" p={3}>
          <AddPhotoAlternateIcon color="action" />
          <Typography variant="body2" color="text.secondary">
            {isDragActive
              ? 'Suelta las imágenes aquí'
              : 'Arrastra y suelta imágenes aquí, o haz clic para seleccionar'}
          </Typography>
          <Typography variant="caption" color="text.secondary" component="div">
            JPG, PNG, WebP | Máx: 2MB | Máx: 5 imágenes
          </Typography>
        </Box>
      </Paper>

      {uploadingImages && (
        <Box className="uploading-indicator">
          <Typography variant="body2" color="text.secondary">
            Subiendo imágenes a Cloudinary...
          </Typography>
        </Box>
      )}

      {previews.length > 0 && (
        <Grid container spacing={2} className="preview-grid">
          {previews.map((preview, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Paper variant="outlined" className="preview-item">
                <Box className="preview-image-container">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="preview-image"
                  />
                  {!disabled && (
                    <IconButton
                      size="small"
                      onClick={() => onRemove(index)}
                      className="remove-button"
                    >
                      <DeleteIcon />
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