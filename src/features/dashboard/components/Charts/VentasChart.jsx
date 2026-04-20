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

// Importaciones de utilidades
import SafeECharts from './SafeECharts';
import { formatCurrency, formatYAxis } from '../../utils/formatters';

// Colores personalizados para botones y bordes
const BRAND_COLOR = "#1a2540";
const BRAND_HOVER = "#2d3a6b";
const TEXT_SECONDARY = "#64748b";
const BORDER_COLOR = "#cbd5e1";

// Colores neutrales
const FONDO_NEUTRAL = "#f8fafc";
const TEXTO_NEUTRAL = "#1f2937";
const LINEAS_NEUTRALES = "#e5e7eb";

// ============================================================
// PALETA ALEGRE PARA VENTAS (Azul Eléctrico / Cyan)
// ============================================================
// Colores vibrantes que transmiten confianza, dinamismo y crecimiento
// Inspirados en el azul del cielo y el mar caribeño
const VENTAS_PRINCIPAL = "#2563eb";      // Azul eléctrico - Principal
const VENTAS_SECUNDARIO = "#60a5fa";     // Azul claro vibrante - Secundario  
const VENTAS_HOVER = "#1d4ed8";          // Azul intenso - Hover
const VENTAS_GRADIENTE = "#bfdbfe";      // Azul muy claro - Gradiente

// ============================================================
// PALETA ALEGRE PARA COMPRAS (Coral / Naranja Vibrante)
// ============================================================
// Colores cálidos y energéticos que contrastan perfectamente con el azul
// Transmiten acción, oportunidad y dinamismo
const COMPRAS_PRINCIPAL = "#f97316";      // Naranja vibrante - Principal
const COMPRAS_SECUNDARIO = "#fdba74";     // Naranja claro - Secundario
const COMPRAS_HOVER = "#ea580c";          // Naranja intenso - Hover
const COMPRAS_GRADIENTE = "#fed7aa";      // Naranja muy claro - Gradiente

// ============================================================
// RELACIÓN CROMÁTICA:
// Ventas (Azul - 220°) + Compras (Naranja - 25°)
// = Colores complementarios en el círculo cromático
// Contraste energético y alegre, fácil de diferenciar
// ============================================================

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
  
  // Determina si es Ventas o Compras
  const isVentas = title.includes('Ventas');
  
  // Colores según el tipo de gráfica
  const principalColor = isVentas ? VENTAS_PRINCIPAL : COMPRAS_PRINCIPAL;
  const secundarioColor = isVentas ? VENTAS_SECUNDARIO : COMPRAS_SECUNDARIO;
  const hoverColor = isVentas ? VENTAS_HOVER : COMPRAS_HOVER;
  const gradientColor = isVentas ? VENTAS_GRADIENTE : COMPRAS_GRADIENTE;
  
  // Determina el intervalo de etiquetas del eje X basado en el período 
  const getXAxisInterval = () => {
    switch (timeFilter) {
      case 'dia': return isMobile ? 2 : 0;
      case 'mes': return isMobile ? 5 : isTablet ? 4 : 2;
      case 'año': return 0;
      default: return 0;
    }
  };

  // Configuración común para ambos tipos de gráficas
  const getSeriesConfig = () => {
    if (chartType === 'barras') {
      return [{
        name: title,
        type: 'bar',
        data: data?.data || [],
        barWidth: isMobile ? '40%' : (timeFilter === 'dia' ? '50%' : '30%'),
        itemStyle: {
          color: principalColor,
          borderRadius: isMobile ? [2, 2, 0, 0] : [4, 4, 0, 0]
        },
        label: {
          show: !isMobile,
          position: 'top',
          color: TEXTO_NEUTRAL,
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
            shadowColor: alpha(principalColor, 0.4)
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
          color: principalColor
        },
        itemStyle: { color: principalColor },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: alpha(principalColor, 0.25) },
              { offset: 1, color: alpha(gradientColor, 0.08) }
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
      left: isMobile ? '50px' : '70px',
      right: isMobile ? '10px' : '20px',
      top: isMobile ? '40px' : '60px',
      bottom: isMobile ? '50px' : '60px',
      backgroundColor: FONDO_NEUTRAL
    },
    xAxis: {
      type: 'category',
      data: data?.labels || [],
      axisLine: {
        lineStyle: { 
          color: LINEAS_NEUTRALES,
          width: isMobile ? 1 : 2
        }
      },
      axisTick: {
        lineStyle: { 
          color: LINEAS_NEUTRALES,
          width: isMobile ? 1 : 1
        }
      },
      axisLabel: {
        color: TEXT_SECONDARY,
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
          color: LINEAS_NEUTRALES,
          width: isMobile ? 1 : 2
        }
      },
      axisTick: {
        lineStyle: { 
          color: LINEAS_NEUTRALES,
          width: isMobile ? 1 : 1
        }
      },
      splitLine: {
        lineStyle: {
          color: alpha(LINEAS_NEUTRALES, 0.5),
          type: 'dashed',
          width: 0.5
        }
      },
      axisLabel: {
        color: TEXT_SECONDARY,
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
      borderColor: LINEAS_NEUTRALES,
      textStyle: { 
        color: TEXTO_NEUTRAL,
        fontSize: isMobile ? 11 : 12
      },
      extraCssText: `box-shadow: ${theme.shadows[isMobile ? 2 : 4]}; border-radius: ${isMobile ? '6px' : '8px'}; padding: ${isMobile ? '6px' : '8px'};`
    }
  };

  return (
    <Card sx={{ 
      height: '100%',
      boxShadow: isMobile ? 1 : 2,
      backgroundColor: FONDO_NEUTRAL
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
              sx={{ fontSize: isMobile ? '1rem' : '1.25rem', color: TEXTO_NEUTRAL }}
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
                  px: isMobile ? 1 : 1.5,
                  ...(chartType === 'barras' && {
                    backgroundColor: BRAND_COLOR,
                    '&:hover': { backgroundColor: BRAND_HOVER }
                  }),
                  ...(chartType !== 'barras' && {
                    borderColor: BORDER_COLOR,
                    color: BRAND_COLOR,
                    '&:hover': { borderColor: BRAND_COLOR, backgroundColor: `${BRAND_COLOR}10` }
                  })
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
                  px: isMobile ? 1 : 1.5,
                  ...(chartType === 'lineas' && {
                    backgroundColor: BRAND_COLOR,
                    '&:hover': { backgroundColor: BRAND_HOVER }
                  }),
                  ...(chartType !== 'lineas' && {
                    borderColor: BORDER_COLOR,
                    color: BRAND_COLOR,
                    '&:hover': { borderColor: BRAND_COLOR, backgroundColor: `${BRAND_COLOR}10` }
                  })
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