import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  ButtonGroup,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { CalendarToday, TrendingUp } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Utilidades para formateo y textos
import { getPeriodLabel, getPeriodText } from '../../utils/formatters';

const DashboardHeader = ({ 
  timeFilter, 
  yearFilter, 
  monthFilter,
  onTimeFilterChange, 
  onYearFilterChange,
  onMonthFilterChange,
  metrics 
}) => {
  const theme = useTheme();

  // Nombres de meses en español
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Función para formatear texto de botones
  const formatButtonText = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={3} alignItems="center">
        
        {/* Sección izquierda: Título y controles de filtro */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight="bold"
              sx={{ 
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' }
              }}
            >
              Resumen Operativo
            </Typography>
          </Box>
          
          {/* Controles de filtro de tiempo */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <ButtonGroup variant="outlined" size="medium">
              <Button 
                onClick={() => onTimeFilterChange('dia')}
                variant={timeFilter === 'dia' ? 'contained' : 'outlined'}
                startIcon={<CalendarToday />}
                sx={{ textTransform: 'none' }}
              >
                {formatButtonText('hoy')}
              </Button>
              <Button 
                onClick={() => onTimeFilterChange('mes')}
                variant={timeFilter === 'mes' ? 'contained' : 'outlined'}
                startIcon={<CalendarToday />}
                sx={{ textTransform: 'none' }}
              >
                {formatButtonText('mes')}
              </Button>
              <Button 
                onClick={() => onTimeFilterChange('año')}
                variant={timeFilter === 'año' ? 'contained' : 'outlined'}
                startIcon={<CalendarToday />}
                sx={{ textTransform: 'none' }}
              >
                {formatButtonText('año')}
              </Button>
            </ButtonGroup>
            
            {/* Selector de mes - Solo visible en vista mensual */}
            {timeFilter === 'mes' && (
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Mes</InputLabel>
                <Select
                  value={monthFilter}
                  label="Mes"
                  onChange={(e) => onMonthFilterChange(e.target.value)}
                >
                  {months.map((month, index) => (
                    <MenuItem key={index} value={index + 1}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            
            {/* Selector de año - Solo visible en vista anual y mensual */}
            {(timeFilter === 'año' || timeFilter === 'mes') && (
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Año</InputLabel>
                <Select
                  value={yearFilter}
                  label="Año"
                  onChange={(e) => onYearFilterChange(e.target.value)}
                >
                  <MenuItem value="2022">2022</MenuItem>
                  <MenuItem value="2023">2023</MenuItem>
                  <MenuItem value="2024">2024</MenuItem>
                  <MenuItem value="2025">2025</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </Grid>

        {/* Sección derecha: Métricas resumidas del período */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ 
              p: 1.5,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography 
                variant="subtitle2" 
                fontWeight={600} 
                gutterBottom 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  mb: 0.5
                }}
              >
                <TrendingUp fontSize="small" />
                Métricas operativas
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                flex: 1,
                gap: 4
              }}>
                <Box sx={{ 
                  textAlign: 'center',
                  flex: 1,
                  px: 1
                }}>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {metrics.clientes}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                  >
                    Clientes
                  </Typography>
                </Box>
                <Box sx={{ 
                  textAlign: 'center',
                  flex: 1,
                  px: 1 // Padding horizontal interno
                }}>
                  <Typography variant="h6" fontWeight="bold" color="secondary">
                    {metrics.productosVendidos}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Productos
                  </Typography>
                </Box>
                <Box sx={{ 
                  textAlign: 'center',
                  flex: 1,
                  px: 1 // Padding horizontal interno
                }}>
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    {metrics.citasEfectivas}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Citas
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHeader;