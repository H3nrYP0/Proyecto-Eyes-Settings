// Componente para mostrar ranking de productos más vendidos - Top 5 fijo
// Destaca visualmente los top 3 productos con indicadores especiales

import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  Chip
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

// Utilidades para textos dinámicos
import { getPeriodText } from '../../utils/formatters';

const ProductosMasVendidos = ({ productos, timeFilter, yearFilter }) => {
  const theme = useTheme();
  
  // Mostrar solo top 5 productos
  const displayedProducts = productos.slice(0, 5);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        {/* Header con título y badge del período */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={600}>
                Productos Más Vendidos
            </Typography>
            
        </Box>
        
        {/* Lista de productos top 5 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {displayedProducts.map((producto, index) => (
            <Paper
              key={producto.id || index}
              variant="outlined"
              sx={{
                p: 2,
                // Borde izquierdo colorido para los top 3 productos
                borderLeft: index < 3 ? `4px solid ${theme.palette.warning.main}` : '4px solid transparent',
                // Fondo destacado para los top 3
                bgcolor: index < 3 ? alpha(theme.palette.warning.light, 0.1) : 'background.paper',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: theme.shadows[2],
                  transform: 'translateY(-1px)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Índice del producto en el ranking */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    // Colores diferentes para top 3 vs resto
                    bgcolor: index < 3 ? theme.palette.warning.main : theme.palette.grey[200],
                    color: index < 3 ? 'white' : theme.palette.text.secondary,
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    flexShrink: 0
                  }}
                >
                  {index + 1}
                </Box>
                {/* Información del producto */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography 
                    variant="body2" 
                    fontWeight="medium" 
                    gutterBottom
                    sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {producto.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {producto.quantity} unidades
                  </Typography>
                </Box>
                {/* Porcentaje de participación */}
                <Chip
                  label={`${producto.percentage}%`}
                  size="small"
                  color={index < 3 ? "warning" : "default"}
                  variant={index < 3 ? "filled" : "outlined"}
                  sx={{ fontWeight: 500, flexShrink: 0 }}
                />
              </Box>
            </Paper>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductosMasVendidos;