// Componente para análisis de distribución por categorías
import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  ButtonGroup,
  Button,
  Chip
} from '@mui/material';
import { BarChart, PieChart } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

// Importaciones de utilidades y componentes
import SafeECharts from './SafeECharts';
import { formatCurrency, getPeriodText } from '../../utils/formatters';

const AnalisisCategorias = ({ data, timeFilter, yearFilter }) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState('pastel');
  const [showAll, setShowAll] = useState(false);

  // Función para formatear texto de botones
  const formatButtonText = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // Procesa los datos para mostrar top 5 + "Otras" por defecto
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

  // Función común para tooltip
  const getTooltipContent = (params, isBarChart = false) => {
    const item = isBarChart ? processedData[params.dataIndex] : params.data;
    const percent = isBarChart ? params.value : params.percent;
    const name = isBarChart ? params.name : params.name;
    
    if (item.isOther) {
      const otherCount = parseInt(item.name.match(/\((\d+)\)/)[1]);
      return `
        <div style="font-weight: bold; margin-bottom: 8px;">${item.name}</div>
        <div style="display: flex; justify-content: space-between; width: 200px;">
          <span>Porcentaje:</span>
          <span style="font-weight: bold;">${percent}%</span>
        </div>
        <div style="display: flex; justify-content: space-between; width: 200px;">
          <span>Ventas:</span>
          <span style="font-weight: bold;">${formatCurrency(item.amount)}</span>
        </div>
        <div style="margin-top: 4px; font-size: 11px; color: ${theme.palette.text.secondary};">
          Agrupa ${otherCount} categorías menores
        </div>
      `;
    }
    
    return `
      <div style="font-weight: bold; margin-bottom: 8px;">${name}</div>
      <div style="display: flex; justify-content: space-between; width: 200px;">
        <span>Porcentaje:</span>
        <span style="font-weight: bold;">${percent}%</span>
      </div>
      <div style="display: flex; justify-content: space-between; width: 200px;">
        <span>Ventas:</span>
        <span style="font-weight: bold;">${formatCurrency(item.amount)}</span>
      </div>
    `;
  };

  // Configuración común para tooltip
  const tooltipConfig = {
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.divider,
    textStyle: { color: theme.palette.text.primary },
    extraCssText: `box-shadow: ${theme.shadows[4]}; border-radius: 8px;`
  };

  // Configuración para gráfica de barras
  const barOption = useMemo(() => ({
    grid: {
      left: '70px',
      right: '20px',
      top: '50px',
      bottom: '50px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: processedData.map(item => item.name),
      axisLine: { 
        lineStyle: { color: theme.palette.divider }
      },
      axisTick: { 
        lineStyle: { color: theme.palette.divider }
      },
      axisLabel: {
        color: theme.palette.text.secondary,
        fontSize: 11,
        fontWeight: 500,
        margin: 8,
        interval: 0,
        rotate: processedData.length > 6 ? 45 : 0,
        formatter: (value) => value.length > 15 ? value.substring(0, 12) + '...' : value
      }
    },
    yAxis: {
      type: 'value',
      name: 'Porcentaje (%)',
      nameTextStyle: {
        color: theme.palette.text.secondary,
        fontSize: 11,
        padding: [0, 0, 0, -50]
      },
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
        fontSize: 11,
        formatter: '{value}%'
      }
    },
    series: [{
      data: processedData.map(item => ({
        value: item.value,
        itemStyle: { 
          color: item.color,
          borderRadius: [4, 4, 0, 0]
        }
      })),
      type: 'bar',
      barWidth: '50%',
      label: {
        show: true,
        position: 'top',
        formatter: '{c}%',
        color: theme.palette.text.primary,
        fontWeight: 'bold',
        fontSize: 11
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: alpha(theme.palette.primary.main, 0.5)
        }
      }
    }],
    tooltip: {
      trigger: 'axis',
      formatter: (params) => getTooltipContent(params[0], true),
      ...tooltipConfig
    }
  }), [processedData, theme]);

  // Configuración para gráfica de pastel
  const pieOption = useMemo(() => ({
    grid: {
      left: '0%',
      right: processedData.length > 6 ? '25%' : '0%',
      top: '0%',
      bottom: '0%',
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
      orient: processedData.length > 6 ? 'vertical' : 'horizontal',
      right: processedData.length > 6 ? 10 : 'auto',
      left: processedData.length > 6 ? 'auto' : 'center',
      top: processedData.length > 6 ? 'center' : 'bottom',
      bottom: processedData.length > 6 ? 'auto' : 10,
      textStyle: {
        color: theme.palette.text.primary,
        fontSize: 11
      },
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 8,
      formatter: (name) => name.length > 20 ? name.substring(0, 17) + '...' : name
    },
    series: [{
      name: 'Categorías',
      type: 'pie',
      radius: processedData.length > 6 ? ['30%', '60%'] : ['40%', '70%'],
      center: processedData.length > 6 ? ['40%', '50%'] : ['50%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 4,
        borderColor: theme.palette.background.paper,
        borderWidth: 2
      },
      label: {
        show: processedData.length <= 8,
        formatter: '{b}: {d}%',
        fontSize: 11,
        fontWeight: 'bold',
        color: theme.palette.text.primary,
        lineHeight: 16
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 12,
          fontWeight: 'bold'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      labelLine: {
        show: processedData.length <= 8,
        length: processedData.length > 6 ? 10 : 20,
        length2: processedData.length > 6 ? 10 : 15
      },
      data: processedData.map(item => ({
        name: item.name,
        value: item.value,
        amount: item.amount,
        itemStyle: { color: item.color }
      }))
    }]
  }), [processedData, theme]);

  const hasManyCategories = data && data.length > 5;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header del componente con controles */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" fontWeight={600}>
              Categorías más vendidas
            </Typography>
            {hasManyCategories && (
              <Chip 
                label={`${data.length} categorías`} 
                size="small" 
                color="info"
                variant="outlined"
              />
            )}
          </Box>
          
          {/* Controles de visualización */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Botón para mostrar/agrupar categorías */}
            {hasManyCategories && (
              <Button
                variant={showAll ? "contained" : "outlined"}
                size="small"
                onClick={() => setShowAll(!showAll)}
                sx={{ textTransform: 'none' }}
              >
                {showAll ? 'Agrupar' : 'Ver todas'}
              </Button>
            )}
            {/* Selector de tipo de gráfica */}
            <ButtonGroup size="small">
              <Button
                variant={chartType === 'barras' ? 'contained' : 'outlined'}
                onClick={() => setChartType('barras')}
                startIcon={<BarChart />}
                sx={{ textTransform: 'none' }}
              >
                {formatButtonText('barras')}
              </Button>
              <Button
                variant={chartType === 'pastel' ? 'contained' : 'outlined'}
                onClick={() => setChartType('pastel')}
                startIcon={<PieChart />}
                sx={{ textTransform: 'none' }}
              >
                {formatButtonText('pastel')}
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
        
        {/* Contenedor de la gráfica */}
        <Box sx={{ flex: 1, minHeight: 400 }}>
          <SafeECharts 
            key={chartType}
            option={chartType === 'barras' ? barOption : pieOption} 
            style={{ height: '100%', width: '100%' }} 
            opts={{ renderer: 'svg' }}
          />
        </Box>

        {/* Footer informativo */}
        {hasManyCategories && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {processedData.length} de {data.length} categorías mostradas
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalisisCategorias;