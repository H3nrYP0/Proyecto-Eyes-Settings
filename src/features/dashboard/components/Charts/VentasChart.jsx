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
      case 'dia': return 0;
      case 'mes': return 4;
      case 'año': return 0;
      default: return 0;
    }
  };

  // Configuración común para ambos tipos de gráficas
  const getSeriesConfig = () => {
    const isVentas = title.includes('Ventas');
    const color = isVentas ? theme.palette.primary.main : theme.palette.secondary.main;
    
    if (chartType === 'barras') {
      return [{
        name: title,
        type: 'bar',
        data: data?.data || [],
        barWidth: timeFilter === 'dia' ? '50%' : '30%',
        itemStyle: {
          color,
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          color: theme.palette.text.primary,
          fontWeight: 'bold',
          fontSize: 10,
          formatter: (params) => formatCurrency(params.value)
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
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
        symbolSize: 6,
        lineStyle: {
          width: 3,
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

  // Opciones de configuración para ECharts
  const option = {
    grid: {
      left: '70px',
      right: '20px',
      top: '60px',
      bottom: '60px'
    },
    xAxis: {
      type: 'category',
      data: data?.labels || [],
      axisLine: {
        lineStyle: { color: theme.palette.divider }
      },
      axisTick: {
        lineStyle: { color: theme.palette.divider }
      },
      axisLabel: {
        color: theme.palette.text.secondary,
        fontWeight: 500,
        fontSize: 11,
        interval: getXAxisInterval(),
        margin: 10
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: { color: theme.palette.divider }
      },
      axisTick: {
        lineStyle: { color: theme.palette.divider }
      },
      splitLine: {
        lineStyle: {
          color: theme.palette.divider,
          type: 'dashed'
        }
      },
      axisLabel: {
        color: theme.palette.text.secondary,
        fontWeight: 500,
        fontSize: 11,
        formatter: formatYAxis,
        margin: 10
      }
    },
    series: getSeriesConfig(),
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
      textStyle: { color: theme.palette.text.primary },
      extraCssText: `box-shadow: ${theme.shadows[4]}; border-radius: 8px;`
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3, height: '100%' }}>
        <Box sx={{ height: 400 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
            <ButtonGroup size="small">
              <Button
                variant={chartType === 'barras' ? 'contained' : 'outlined'}
                onClick={() => onChartTypeChange('barras')}
                startIcon={<BarChart />}
                sx={{ textTransform: 'none' }}
              >
                Barras
              </Button>
              <Button
                variant={chartType === 'lineas' ? 'contained' : 'outlined'}
                onClick={() => onChartTypeChange('lineas')}
                startIcon={<ShowChart />}
                sx={{ textTransform: 'none' }}
              >
                Líneas
              </Button>
            </ButtonGroup>
          </Box>
          
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