import { Card, CardContent, Typography, Box } from "@mui/material";
import { Construction } from "@mui/icons-material";

const EnConstruccionUniversal = ({ 
  titulo = "Sección en Desarrollo",
  mensaje = "Estamos trabajando en esta funcionalidad."
}) => {
  return (
    <Card sx={{ 
      maxWidth: 600, 
      mx: 'auto', 
      mt: 4, 
      textAlign: 'center',
      p: 3,
      boxShadow: 3
    }}>
      <CardContent>
        <Construction sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" color="text.primary" gutterBottom>
          {titulo}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {mensaje}
        </Typography>
        <Box sx={{ mt: 3, color: 'text.disabled' }}>
          <Typography variant="caption">
            Pronto estará disponible
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EnConstruccionUniversal;