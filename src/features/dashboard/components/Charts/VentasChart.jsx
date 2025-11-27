// Componente reutilizable para gráficas de Ventas y Compras
// Soporta dos tipos de visualización: barras y líneas
// Se adapta automáticamente al período de tiempo seleccionado

import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  ButtonGroup, 
  Button 
} from '@mui/material';
import { BarChart, ShowChart } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

// Importaciones de utilidades
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
  
  // Determina el intervalo de etiquetas del eje X basado en el período
  const getXAxisInterval = () => {
    switch (timeFilter) {
      case 'dia': return 0;     // Muestra todas las horas
      case 'mes': return 4;     // Muestra cada 5 días (para evitar saturación)
      case 'año': return 0;     // Muestra todos los meses
      default: return 0;
    }
  };

  // Configuración de opciones para ECharts - Define completamente la apariencia de la gráfica
  const option = {
    grid: {
      left: '70px',     // Margen izquierdo para etiquetas del eje Y
      right: '20px',    // Margen derecho
      top: '60px',      // Espacio superior para título interno
      bottom: '60px',   // Espacio inferior para etiquetas del eje X
      containLabel: false
    },
    xAxis: {
      type: 'category',
      data: data?.labels || [],
      axisLine: {
        show: true,
        lineStyle: {
          color: theme.palette.divider // Línea del eje con color del tema
        }
      },
      axisTick: {
        show: true,
        alignWithLabel: true,
        lineStyle: {
          color: theme.palette.divider
        }
      },
      axisLabel: {
        color: theme.palette.text.secondary,
        fontWeight: 500,
        fontSize: 11,
        interval: getXAxisInterval(), // Controla densidad de etiquetas
        rotate: 0,
        margin: 10
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: theme.palette.divider
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: theme.palette.divider
        }
      },
      splitLine: {
        lineStyle: {
          color: theme.palette.divider,
          type: 'dashed' // Líneas de división punteadas para mejor legibilidad
        }
      },
      axisLabel: {
        color: theme.palette.text.secondary,
        fontWeight: 500,
        fontSize: 11,
        formatter: formatYAxis, // Formatea números grandes (K, M)
        margin: 10
      }
    },
    // Configuración diferente para gráficas de barras vs líneas
    series: chartType === 'barras' ? [
      {
        name: title,
        type: 'bar',
        data: data?.data || [],
        barWidth: timeFilter === 'dia' ? '50%' : '30%', // Barras más anchas para menos datos
        itemStyle: {
          color: title.includes('Ventas') ? theme.palette.primary.main : theme.palette.secondary.main,
          borderRadius: [4, 4, 0, 0] // Bordes redondeados solo en la parte superior
        },
        label: {
          show: true,
          position: 'top',
          color: theme.palette.text.primary,
          fontWeight: 'bold',
          fontSize: 10,
          formatter: (params) => formatCurrency(params.value) // Etiquetas con formato currency
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            shadowBlur: 10,
            shadowColor: alpha(title.includes('Ventas') ? theme.palette.primary.main : theme.palette.secondary.main, 0.5)
          }
        }
      }
    ] : [
      {
        name: title,
        type: 'line',
        data: data?.lineData || [],
        smooth: true,        // Línea suavizada
        symbol: 'circle',    // Puntos circulares en los datos
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: title.includes('Ventas') ? theme.palette.primary.main : theme.palette.secondary.main
        },
        itemStyle: {
          color: title.includes('Ventas') ? theme.palette.primary.main : theme.palette.secondary.main
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: alpha(title.includes('Ventas') ? theme.palette.primary.main : theme.palette.secondary.main, 0.3)
            }, {
              offset: 1,
              color: alpha(title.includes('Ventas') ? theme.palette.primary.main : theme.palette.secondary.main, 0.1)
            }]
          }
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          }
        }
      }
    ],
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const param = params[0];
        return `
          <div style="font-weight: bold; margin-bottom: 8px;">${param.name}</div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${param.color};"></span>
            <span>${param.seriesName}:</span>
            <span style="font-weight: bold;">${formatCurrency(param.value)}</span>
          </div>
        `;
      },
      backgroundColor: theme.palette.background.paper,
      borderColor: theme.palette.divider,
      textStyle: {
        color: theme.palette.text.primary
      },
      extraCssText: `box-shadow: ${theme.shadows[4]}; border-radius: 8px;` // Sombra consistente con el tema
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3, height: '100%' }}>
        <Box sx={{ position: 'relative', height: 400 }}>
          {/* Header de la gráfica con controles de tipo */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
            <ButtonGroup size="small">
              <Button
                variant={chartType === 'barras' ? 'contained' : 'outlined'}
                onClick={() => onChartTypeChange('barras')}
                startIcon={<BarChart />}
              >
                Barras
              </Button>
              <Button
                variant={chartType === 'lineas' ? 'contained' : 'outlined'}
                onClick={() => onChartTypeChange('lineas')}
                startIcon={<ShowChart />}
              >
                Líneas
              </Button>
            </ButtonGroup>
          </Box>
          
          {/* Gráfica ECharts - Key fuerza recreación cuando cambia el tipo */}
          <SafeECharts 
            key={`${chartKey}-${chartType}`} 
            option={option} 
            style={{ height: '100%', width: '100%' }} 
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default VentasChart;