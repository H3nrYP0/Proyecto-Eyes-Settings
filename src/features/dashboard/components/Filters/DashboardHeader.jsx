// Header principal del dashboard - Contiene filtros, título y métricas resumidas
// Responsable de: navegación temporal, selección de año y visualización de KPIs clave

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
  onTimeFilterChange, 
  onYearFilterChange, 
  metrics 
}) => {
  const theme = useTheme();

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
                color: 'transparent'
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
              >
                Día
              </Button>
              <Button 
                onClick={() => onTimeFilterChange('mes')}
                variant={timeFilter === 'mes' ? 'contained' : 'outlined'}
                startIcon={<CalendarToday />}
              >
                Mes
              </Button>
              <Button 
                onClick={() => onTimeFilterChange('año')}
                variant={timeFilter === 'año' ? 'contained' : 'outlined'}
                startIcon={<CalendarToday />}
              >
                Año
              </Button>
            </ButtonGroup>
            
            {/* Selector de año - Solo visible en vista anual */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Año</InputLabel>
              <Select
                value={yearFilter}
                label="Año"
                onChange={(e) => onYearFilterChange(e.target.value)}
                disabled={timeFilter !== 'año'} // Deshabilitado cuando no está en vista anual
              >
                <MenuItem value="2022">2022</MenuItem>
                <MenuItem value="2023">2023</MenuItem>
                <MenuItem value="2024">2024</MenuItem>
                <MenuItem value="2025">2025</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        {/* Sección derecha: Métricas resumidas del período */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp fontSize="small" />
                Métricas operativas
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {metrics.clientes}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Clientes
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold" color="secondary">
                    {metrics.productosVendidos}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Productos
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    {metrics.citasEfectivas}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
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