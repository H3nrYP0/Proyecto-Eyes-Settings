import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  ButtonGroup,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  useMediaQuery
} from '@mui/material';
import { CalendarToday, TrendingUp } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Colores personalizados
const BRAND_COLOR = "#1a2540";
const BRAND_HOVER = "#2d3a6b";
const TEXT_SECONDARY = "#64748b";
const BORDER_COLOR = "#cbd5e1";

const DashboardHeader = ({
  timeFilter,
  yearFilter,
  monthFilter,
  onTimeFilterChange,
  onYearFilterChange,
  onMonthFilterChange,
  metrics,
  availableYears = []
}) => {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const months = isMobile
    ? ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const getButtonText = (text) => {
    if (isMobile) {
      return { dia: 'Hoy', mes: 'Mes', año: 'Año' }[text] || text;
    }
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <Box sx={{ mb: isMobile ? 2 : 3 }}>
      <Grid container spacing={isMobile ? 1.5 : 2} alignItems="center">

        {/* Título y filtros */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: isMobile ? 1 : 2 }}>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              fontWeight="bold"
              sx={{
                color: '#000000',
                fontSize: isMobile ? '1.25rem' : isTablet ? '1.75rem' : '2.125rem'
              }}
            >
              {isMobile ? 'Dashboard' : 'Resumen Operativo'}
            </Typography>
          </Box>

          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={isMobile ? 1 : 1.5}
            alignItems={isMobile ? 'stretch' : 'center'}
            sx={{ flexWrap: 'wrap' }}
          >
            <ButtonGroup variant="outlined" size={isMobile ? 'small' : 'medium'} fullWidth={isMobile}>
              {['dia', 'mes', 'año'].map((filter) => (
                <Button
                  key={filter}
                  onClick={() => onTimeFilterChange(filter)}
                  variant={timeFilter === filter ? 'contained' : 'outlined'}
                  startIcon={isMobile ? null : <CalendarToday />}
                  sx={{
                    textTransform: 'none',
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    flex: 1,
                    minWidth: isMobile ? '60px' : '80px',
                    ...(timeFilter === filter && {
                      backgroundColor: BRAND_COLOR,
                      '&:hover': { backgroundColor: BRAND_HOVER }
                    }),
                    ...(timeFilter !== filter && {
                      borderColor: BORDER_COLOR,
                      color: BRAND_COLOR,
                      '&:hover': { borderColor: BRAND_COLOR, backgroundColor: `${BRAND_COLOR}10` }
                    })
                  }}
                >
                  {getButtonText(filter)}
                </Button>
              ))}
            </ButtonGroup>

            {timeFilter === 'mes' && (
              <FormControl size={isMobile ? 'small' : 'medium'} sx={{ minWidth: isMobile ? '100%' : 120 }}>
                <InputLabel sx={{ color: TEXT_SECONDARY }}>Mes</InputLabel>
                <Select 
                  value={monthFilter} 
                  label="Mes" 
                  onChange={(e) => onMonthFilterChange(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: BORDER_COLOR },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: BRAND_COLOR },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: BRAND_COLOR }
                  }}
                >
                  {months.map((month, index) => (
                    <MenuItem key={index} value={index + 1}>{month}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {(timeFilter === 'año' || timeFilter === 'mes') && (
              <FormControl size={isMobile ? 'small' : 'medium'} sx={{ minWidth: isMobile ? '100%' : 120 }}>
                <InputLabel sx={{ color: TEXT_SECONDARY }}>Año</InputLabel>
                <Select 
                  value={yearFilter} 
                  label="Año" 
                  onChange={(e) => onYearFilterChange(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: BORDER_COLOR },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: BRAND_COLOR },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: BRAND_COLOR }
                  }}
                >
                  {availableYears.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
        </Grid>

        {/* Métricas */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', boxShadow: isMobile ? 1 : 2 }}>
            <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
              <Typography
                variant={isMobile ? 'caption' : 'subtitle2'}
                fontWeight={600}
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: isMobile ? '0.75rem' : '0.875rem', color: '#000000' }}
              >
                <TrendingUp fontSize={isMobile ? 'small' : 'medium'} sx={{ color: BRAND_COLOR }} />
                {isMobile ? 'Métricas' : 'Métricas operativas'}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                {[
                  { label: 'Clientes',   value: metrics.clientes },
                  { label: 'Productos',  value: metrics.productosVendidos },
                  { label: 'Citas',      value: metrics.citasEfectivas }
                ].map((item, index) => (
                  <Box key={index} sx={{ textAlign: 'center', flex: 1 }}>
                    <Typography
                      variant={isMobile ? 'body1' : 'h6'}
                      fontWeight="bold"
                      sx={{ fontSize: isMobile ? '0.875rem' : '1.125rem', color: BRAND_COLOR }}
                    >
                      {item.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem', color: TEXT_SECONDARY }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHeader;