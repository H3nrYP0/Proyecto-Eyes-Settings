// Componente para análisis de distribución por categorías
import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  ButtonGroup,
  Button,
  Chip,
  useMediaQuery
} from '@mui/material';
import { BarChart, PieChart } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

// Importaciones de utilidades y componentes - MANTENIDAS
import SafeECharts from './SafeECharts';
import { formatCurrency, getPeriodText } from '../../utils/formatters';

const AnalisisCategorias = ({ data, timeFilter, yearFilter }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const [chartType, setChartType] = useState('pastel');
  const [showAll, setShowAll] = useState(false);

  // Función para formatear texto de botones - MANTENIDA
  const formatButtonText = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Procesa los datos para mostrar top 5 + "Otras" por defecto - MANTENIDO COMPLETO
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Si el usuario quiere ver todas las categorías
    if (showAll) {
      return data.sort((a, b) => b.value - a.value);
    }

    // Por defecto: mostrar top 5 + "Otras"
    const sortedData = [...data].sort((a, b) => b.value - a.value);
    const topCategories = sortedData.slice(0, 5);
    const otherCategories = sortedData.slice(5);
    
    // Si hay categorías sobrantes, las agrupa en "Otras"
    if (otherCategories.length > 0) {
      const otherTotal = otherCategories.reduce((sum, item) => sum + item.value, 0);
      const otherAmount = otherCategories.reduce((sum, item) => sum + item.amount, 0);
      
      return [
        ...topCategories,
        {
          name: `Otras (${otherCategories.length})`,
          value: Math.round(otherTotal * 10) / 10,
          amount: otherAmount,
          color: theme.palette.grey[400],
          isOther: true
        }
      ];
    }
    
    return topCategories;
  }, [data, showAll, theme]);

  // Función común para tooltip - MEJORADA RESPONSIVE
  const getTooltipContent = (params, isBarChart = false) => {
    const item = isBarChart ? processedData[params.dataIndex] : params.data;
    const percent = isBarChart ? params.value : params.percent;
    const name = isBarChart ? params.name : params.name;
    
    if (item.isOther) {
      const otherCount = parseInt(item.name.match(/\((\d+)\)/)[1]);
      return `
        <div style="font-weight: bold; margin-bottom: ${isMobile ? '6px' : '8px'}; font-size: ${isMobile ? '12px' : '14px'};">${item.name}</div>
        <div style="display: flex; justify-content: space-between; width: ${isMobile ? '180px' : '200px'}; font-size: ${isMobile ? '12px' : '13px'};">
          <span>Porcentaje:</span>
          <span style="font-weight: bold;">${percent}%</span>
        </div>
        <div style="display: flex; justify-content: space-between; width: ${isMobile ? '180px' : '200px'}; font-size: ${isMobile ? '12px' : '13px'};">
          <span>Ventas:</span>
          <span style="font-weight: bold;">${formatCurrency(item.amount)}</span>
        </div>
        <div style="margin-top: 4px; font-size: ${isMobile ? '10px' : '11px'}; color: ${theme.palette.text.secondary};">
          Agrupa ${otherCount} categorías menores
        </div>
      `;
    }
    
    return `
      <div style="font-weight: bold; margin-bottom: ${isMobile ? '6px' : '8px'}; font-size: ${isMobile ? '12px' : '14px'};">${name}</div>
      <div style="display: flex; justify-content: space-between; width: ${isMobile ? '180px' : '200px'}; font-size: ${isMobile ? '12px' : '13px'};">
        <span>Porcentaje:</span>
        <span style="font-weight: bold;">${percent}%</span>
      </div>
      <div style="display: flex; justify-content: space-between; width: ${isMobile ? '180px' : '200px'}; font-size: ${isMobile ? '12px' : '13px'};">
        <span>Ventas:</span>
        <span style="font-weight: bold;">${formatCurrency(item.amount)}</span>
      </div>
    `;
  };

  // Configuración común para tooltip - MEJORADA RESPONSIVE
  const tooltipConfig = {
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.divider,
    textStyle: { 
      color: theme.palette.text.primary,
      fontSize: isMobile ? 11 : 12
    },
    extraCssText: `box-shadow: ${theme.shadows[isMobile ? 2 : 4]}; border-radius: ${isMobile ? '6px' : '8px'}; padding: ${isMobile ? '6px' : '8px'};`
  };

  // Configuración para gráfica de barras - MEJORADA RESPONSIVE
  const barOption = useMemo(() => ({
    grid: {
      left: isMobile ? '50px' : '70px',
      right: isMobile ? '10px' : '20px',
      top: isMobile ? '40px' : '50px',
      bottom: isMobile ? '50px' : '50px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: processedData.map(item => item.name),
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
        fontSize: isMobile ? 9 : isTablet ? 10 : 11,
        fontWeight: isMobile ? 400 : 500,
        margin: isMobile ? 6 : 8,
        interval: 0,
        rotate: processedData.length > 4 ? (isMobile ? 45 : processedData.length > 6 ? 45 : 0) : 0,
        formatter: (value) => {
          const maxLength = isMobile ? 10 : isTablet ? 12 : 15;
          return value.length > maxLength ? value.substring(0, maxLength - 3) + '...' : value;
        }
      }
    },
    yAxis: {
      type: 'value',
      name: 'Porcentaje (%)',
      nameTextStyle: {
        color: theme.palette.text.secondary,
        fontSize: isMobile ? 9 : isTablet ? 10 : 11,
        padding: [0, 0, 0, isMobile ? -40 : -50]
      },
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
        fontSize: isMobile ? 9 : isTablet ? 10 : 11,
        formatter: '{value}%'
      }
    },
    series: [{
      data: processedData.map(item => ({
        value: item.value,
        itemStyle: { 
          color: item.color,
          borderRadius: isMobile ? [2, 2, 0, 0] : [4, 4, 0, 0]
        }
      })),
      type: 'bar',
      barWidth: isMobile ? '45%' : '50%',
      label: {
        show: !isMobile, // Ocultar en móvil
        position: 'top',
        formatter: '{c}%',
        color: theme.palette.text.primary,
        fontWeight: 'bold',
        fontSize: isMobile ? 9 : 10
      },
      emphasis: {
        itemStyle: {
          shadowBlur: isMobile ? 6 : 10,
          shadowColor: alpha(theme.palette.primary.main, 0.5)
        }
      }
    }],
    tooltip: {
      trigger: 'axis',
      formatter: (params) => getTooltipContent(params[0], true),
      ...tooltipConfig
    }
  }), [processedData, theme, isMobile, isTablet]);

  // Configuración para gráfica de pastel - MEJORADA RESPONSIVE
  const pieOption = useMemo(() => ({
    grid: {
      left: '0%',
      right: (processedData.length > 4 && !isMobile) ? (isMobile ? '0%' : '25%') : '0%',
      top: '0%',
      bottom: isMobile ? '15%' : '0%',
      containLabel: true
    },
    xAxis: { show: false },
    yAxis: { show: false },
    tooltip: {
      trigger: 'item',
      formatter: (params) => getTooltipContent(params),
      ...tooltipConfig
    },
    legend: {
      orient: isMobile ? 'horizontal' : (processedData.length > 6 ? 'vertical' : 'horizontal'),
      right: (processedData.length > 6 && !isMobile) ? 10 : 'auto',
      left: (processedData.length > 6 && !isMobile) ? 'auto' : 'center',
      top: (processedData.length > 6 && !isMobile) ? 'center' : 'auto',
      bottom: isMobile ? 0 : (processedData.length > 6 ? 'auto' : 10),
      textStyle: {
        color: theme.palette.text.primary,
        fontSize: isMobile ? 9 : isTablet ? 10 : 11
      },
      itemWidth: isMobile ? 10 : 12,
      itemHeight: isMobile ? 10 : 12,
      itemGap: isMobile ? 6 : 8,
      formatter: (name) => {
        const maxLength = isMobile ? 12 : isTablet ? 15 : 20;
        return name.length > maxLength ? name.substring(0, maxLength - 3) + '...' : name;
      }
    },
    series: [{
      name: 'Categorías',
      type: 'pie',
      radius: isMobile ? ['35%', '55%'] : (processedData.length > 6 ? ['30%', '60%'] : ['40%', '70%']),
      center: isMobile ? ['50%', '45%'] : (processedData.length > 6 ? ['40%', '50%'] : ['50%', '50%']),
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: isMobile ? 2 : 4,
        borderColor: theme.palette.background.paper,
        borderWidth: isMobile ? 1 : 2
      },
      label: {
        show: processedData.length <= (isMobile ? 4 : 8),
        formatter: isMobile ? '{d}%' : '{b}: {d}%',
        fontSize: isMobile ? 9 : isTablet ? 10 : 11,
        fontWeight: 'bold',
        color: theme.palette.text.primary,
        lineHeight: isMobile ? 14 : 16
      },
      emphasis: {
        label: {
          show: true,
          fontSize: isMobile ? 10 : 12,
          fontWeight: 'bold'
        },
        itemStyle: {
          shadowBlur: isMobile ? 6 : 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      labelLine: {
        show: processedData.length <= (isMobile ? 4 : 8),
        length: isMobile ? 10 : (processedData.length > 6 ? 10 : 20),
        length2: isMobile ? 5 : (processedData.length > 6 ? 10 : 15)
      },
      data: processedData.map(item => ({
        name: item.name,
        value: item.value,
        amount: item.amount,
        itemStyle: { color: item.color }
      }))
    }]
  }), [processedData, theme, isMobile, isTablet]);

  const hasManyCategories = data && data.length > 5;

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
        {/* Header del componente con controles - MEJORADO RESPONSIVE */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'center', 
          mb: isMobile ? 1.5 : 2,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 1 : 0
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mb: isMobile ? 1 : 0
          }}>
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              fontWeight={600}
              sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}
            >
              Categorías más vendidas
            </Typography>
            {hasManyCategories && (
              <Chip 
                label={`${data.length} ${isMobile ? '' : 'categorías'}`} 
                size="small" 
                color="info"
                variant="outlined"
                sx={{ 
                  height: isMobile ? 20 : 24,
                  '& .MuiChip-label': {
                    fontSize: isMobile ? '0.7rem' : '0.75rem',
                    px: isMobile ? 1 : 1.5
                  }
                }}
              />
            )}
          </Box>
          
          {/* Controles de visualización - MEJORADO RESPONSIVE */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            flexWrap: 'wrap'
          }}>
            {/* Botón para mostrar/agrupar categorías */}
            {hasManyCategories && (
              <Button
                variant={showAll ? "contained" : "outlined"}
                size={isMobile ? "small" : "small"}
                onClick={() => setShowAll(!showAll)}
                sx={{ 
                  textTransform: 'none',
                  fontSize: isMobile ? '0.7rem' : '0.75rem',
                  px: isMobile ? 1 : 1.5,
                  minWidth: isMobile ? '80px' : '100px'
                }}
              >
                {showAll ? 'Agrupar' : 'Ver todas'}
              </Button>
            )}
            {/* Selector de tipo de gráfica */}
            <ButtonGroup size={isMobile ? "small" : "small"}>
              <Button
                variant={chartType === 'barras' ? 'contained' : 'outlined'}
                onClick={() => setChartType('barras')}
                startIcon={isMobile ? null : <BarChart />}
                sx={{ 
                  textTransform: 'none',
                  fontSize: isMobile ? '0.7rem' : '0.75rem',
                  px: isMobile ? 1 : 1.5,
                  minWidth: isMobile ? '60px' : '80px'
                }}
              >
                {formatButtonText('barras')}
              </Button>
              <Button
                variant={chartType === 'pastel' ? 'contained' : 'outlined'}
                onClick={() => setChartType('pastel')}
                startIcon={isMobile ? null : <PieChart />}
                sx={{ 
                  textTransform: 'none',
                  fontSize: isMobile ? '0.7rem' : '0.75rem',
                  px: isMobile ? 1 : 1.5,
                  minWidth: isMobile ? '60px' : '80px'
                }}
              >
                {formatButtonText('pastel')}
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
        
        {/* Contenedor de la gráfica - MEJORADO RESPONSIVE */}
        <Box sx={{ 
          flex: 1, 
          minHeight: isMobile ? 320 : 400 
        }}>
          <SafeECharts 
            key={`${chartType}-${isMobile ? 'm' : 'd'}`}
            option={chartType === 'barras' ? barOption : pieOption} 
            style={{ height: '100%', width: '100%' }} 
            opts={{ renderer: 'svg' }}
          />
        </Box>

        {/* Footer informativo - MEJORADO RESPONSIVE */}
        {hasManyCategories && (
          <Box sx={{ 
            mt: isMobile ? 1.5 : 2, 
            textAlign: 'center'
          }}>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }}
            >
              {processedData.length} de {data.length} categorías mostradas
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalisisCategorias;