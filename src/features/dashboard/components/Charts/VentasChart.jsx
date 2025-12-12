// Componente reutilizable para gráficas de Ventas y Compras
// Soporta dos tipos de visualización: barras y líneas
// Se adapta automáticamente al período de tiempo seleccionado

import React, { useMemo } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  ButtonGroup, 
  Button,
  useMediaQuery 
} from '@mui/material';
import { BarChart, ShowChart } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

// Importaciones de utilidades - MANTENIDAS
import SafeECharts from './SafeECharts';
import { formatCurrency, formatYAxis } from '../../utils/formatters';

const VentasChart = ({ 
  data, 
  timeFilter, 
  title, 
  chartType, 
  onChartTypeChange,
  chartKey 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  // Determina el intervalo de etiquetas del eje X basado en el período - MANTENIDO
  const getXAxisInterval = () => {
    switch (timeFilter) {
      case 'dia': return isMobile ? 2 : 0;
      case 'mes': return isMobile ? 5 : isTablet ? 4 : 2;
      case 'año': return 0;
      default: return 0;
    }
  };

  // Configuración común para ambos tipos de gráficas - MEJORADA RESPONSIVE
  const getSeriesConfig = () => {
    const isVentas = title.includes('Ventas');
    const color = isVentas ? theme.palette.primary.main : theme.palette.secondary.main;
    
    if (chartType === 'barras') {
      return [{
        name: title,
        type: 'bar',
        data: data?.data || [],
        barWidth: isMobile ? '40%' : (timeFilter === 'dia' ? '50%' : '30%'),
        itemStyle: {
          color,
          borderRadius: isMobile ? [2, 2, 0, 0] : [4, 4, 0, 0]
        },
        label: {
          show: !isMobile, // Ocultar labels en móvil
          position: 'top',
          color: theme.palette.text.primary,
          fontWeight: 'bold',
          fontSize: isMobile ? 9 : 10,
          formatter: (params) => {
            const value = params.value;
            if (isMobile && value > 10000) {
              return `${(value/1000).toFixed(0)}K`;
            }
            return formatCurrency(params.value);
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: isMobile ? 6 : 10,
            shadowColor: alpha(color, 0.5)
          }
        }
      }];
    } else {
      return [{
        name: title,
        type: 'line',
        data: data?.lineData || [],
        smooth: true,
        symbol: 'circle',
        symbolSize: isMobile ? 4 : 6,
        lineStyle: {
          width: isMobile ? 2 : 3,
          color
        },
        itemStyle: { color },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: alpha(color, 0.3) },
              { offset: 1, color: alpha(color, 0.1) }
            ]
          }
        },
        emphasis: {
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          }
        }
      }];
    }
  };

  // Opciones de configuración para ECharts - MEJORADA RESPONSIVE
  const option = {
    grid: {
      left: isMobile ? '50px' : '70px',
      right: isMobile ? '10px' : '20px',
      top: isMobile ? '40px' : '60px',
      bottom: isMobile ? '50px' : '60px'
    },
    xAxis: {
      type: 'category',
      data: data?.labels || [],
      axisLine: {
        lineStyle: { 
          color: theme.palette.divider,
          width: isMobile ? 1 : 2
        }
      },
      axisTick: {
        lineStyle: { 
          color: theme.palette.divider,
          width: isMobile ? 1 : 1
        }
      },
      axisLabel: {
        color: theme.palette.text.secondary,
        fontWeight: isMobile ? 400 : 500,
        fontSize: isMobile ? 9 : isTablet ? 10 : 11,
        interval: getXAxisInterval(),
        margin: isMobile ? 8 : 10,
        rotate: isMobile && timeFilter === 'mes' ? 45 : 0
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: { 
          color: theme.palette.divider,
          width: isMobile ? 1 : 2
        }
      },
      axisTick: {
        lineStyle: { 
          color: theme.palette.divider,
          width: isMobile ? 1 : 1
        }
      },
      splitLine: {
        lineStyle: {
          color: alpha(theme.palette.divider, 0.5),
          type: 'dashed',
          width: 0.5
        }
      },
      axisLabel: {
        color: theme.palette.text.secondary,
        fontWeight: isMobile ? 400 : 500,
        fontSize: isMobile ? 9 : isTablet ? 10 : 11,
        formatter: (value) => {
          if (isMobile && value > 10000) {
            return `${(value/1000).toFixed(0)}K`;
          }
          return formatYAxis(value);
        },
        margin: isMobile ? 6 : 10
      }
    },
    series: getSeriesConfig(),
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const param = params[0];
        return `
          <div style="font-weight: bold; margin-bottom: ${isMobile ? '6px' : '8px'}; font-size: ${isMobile ? '12px' : '14px'};">${param.name}</div>
          <div style="display: flex; align-items: center; gap: ${isMobile ? '4px' : '8px'};">
            <span style="display: inline-block; width: ${isMobile ? '6px' : '10px'}; height: ${isMobile ? '6px' : '10px'}; border-radius: 50%; background: ${param.color};"></span>
            <span style="font-size: ${isMobile ? '12px' : '13px'};">${param.seriesName}:</span>
            <span style="font-weight: bold; font-size: ${isMobile ? '12px' : '13px'};">${formatCurrency(param.value)}</span>
          </div>
        `;
      },
      backgroundColor: theme.palette.background.paper,
      borderColor: theme.palette.divider,
      textStyle: { 
        color: theme.palette.text.primary,
        fontSize: isMobile ? 11 : 12
      },
      extraCssText: `box-shadow: ${theme.shadows[isMobile ? 2 : 4]}; border-radius: ${isMobile ? '6px' : '8px'}; padding: ${isMobile ? '6px' : '8px'};`
    }
  };

  return (
    <Card sx={{ 
      height: '100%',
      boxShadow: isMobile ? 1 : 2
    }}>
      <CardContent sx={{ 
        p: isMobile ? 2 : 3, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ 
          height: isMobile ? 300 : 400,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: isMobile ? 1.5 : 2 
          }}>
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              fontWeight={600}
              sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}
            >
              {title}
            </Typography>
            <ButtonGroup size={isMobile ? "small" : "small"}>
              <Button
                variant={chartType === 'barras' ? 'contained' : 'outlined'}
                onClick={() => onChartTypeChange('barras')}
                startIcon={isMobile ? null : <BarChart />}
                sx={{ 
                  textTransform: 'none',
                  fontSize: isMobile ? '0.7rem' : '0.75rem',
                  px: isMobile ? 1 : 1.5
                }}
              >
                {isMobile ? 'Barras' : 'Barras'}
              </Button>
              <Button
                variant={chartType === 'lineas' ? 'contained' : 'outlined'}
                onClick={() => onChartTypeChange('lineas')}
                startIcon={isMobile ? null : <ShowChart />}
                sx={{ 
                  textTransform: 'none',
                  fontSize: isMobile ? '0.7rem' : '0.75rem',
                  px: isMobile ? 1 : 1.5
                }}
              >
                {isMobile ? 'Líneas' : 'Líneas'}
              </Button>
            </ButtonGroup>
          </Box>
          
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <SafeECharts 
              key={`${chartKey}-${chartType}-${isMobile ? 'm' : 'd'}`} 
              option={option} 
              style={{ height: '100%', width: '100%' }} 
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VentasChart;