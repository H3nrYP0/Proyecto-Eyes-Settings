// Componente para análisis de distribución por categorías
// Soporta dos tipos de visualización: gráfica de barras y gráfica de pastel
// Maneja automáticamente la agrupación de categorías menores para mejor visualización

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
  const [chartType, setChartType] = useState('pastel'); // 'pastel' o 'barras'
  const [showAll, setShowAll] = useState(false); // Controla si mostrar todas las categorías

  // Procesa los datos para agrupar categorías menores cuando hay muchas
  const processedData = useMemo(() => {
    // Si hay pocas categorías o el usuario quiere ver todas, mostrar todo
    if (data.length <= 8 || showAll) {
      return data;
    }

    // Ordena categorías por valor descendente y toma las top 7
    const sortedData = [...data].sort((a, b) => b.value - a.value);
    const topCategories = sortedData.slice(0, 7);
    const otherCategories = sortedData.slice(7);
    
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
          isOther: true // Flag para identificar el grupo "Otras"
        }
      ];
    }
    
    return topCategories;
  }, [data, showAll, theme]);

  // Configuración para gráfica de barras - Optimizada para muchas categorías
  const barOption = useMemo(() => ({
    grid: {
      left: processedData.length > 10 ? '100px' : '70px', // Margen adaptable
      right: '20px',
      top: '60px',
      bottom: processedData.length > 15 ? '100px' : '60px' // Más espacio para etiquetas largas
    },
    xAxis: {
      type: 'category',
      data: processedData.map(item => item.name),
      axisLine: { 
        show: true,
        lineStyle: { color: theme.palette.divider }
      },
      axisTick: { 
        show: true,
        lineStyle: { color: theme.palette.divider }
      },
      axisLabel: {
        color: theme.palette.text.secondary,
        fontSize: processedData.length > 15 ? 10 : 12, // Tamaño de fuente adaptable
        fontWeight: 500,
        margin: 10,
        interval: 0, // Mostrar todas las etiquetas
        rotate: processedData.length > 8 ? 45 : 0, // Rotar etiquetas si hay muchas
        formatter: (value) => {
          // Acortar nombres largos para evitar superposición
          if (value.length > 15 && processedData.length > 8) {
            return value.substring(0, 12) + '...';
          }
          return value;
        }
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
        show: true,
        lineStyle: { color: theme.palette.divider }
      },
      axisTick: { 
        show: true,
        lineStyle: { color: theme.palette.divider }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: theme.palette.divider,
          type: 'dashed'
        }
      },
      axisLabel: {
        color: theme.palette.text.secondary,
        fontSize: 11,
        formatter: '{value}%'
      },
      max: Math.max(...processedData.map(item => item.value)) + 10 // Margen superior
    },
    // Zoom de datos para muchas categorías - Permite navegación horizontal
    dataZoom: processedData.length > 10 ? [
      {
        type: 'inside', // Zoom con scroll
        xAxisIndex: 0,
        start: 0,
        end: Math.min(100, (8 / processedData.length) * 100)
      },
      {
        type: 'slider', // Barra de zoom
        xAxisIndex: 0,
        bottom: 20,
        start: 0,
        end: Math.min(100, (8 / processedData.length) * 100),
        height: 20,
        handleSize: 15
      }
    ] : [],
    series: [{
      data: processedData.map((item, index) => ({
        value: item.value,
        itemStyle: { 
          color: item.color,
          borderRadius: [4, 4, 0, 0] // Bordes redondeados superiores
        }
      })),
      type: 'bar',
      barWidth: processedData.length > 15 ? '30%' : processedData.length > 8 ? '40%' : '50%', // Ancho adaptable
      label: {
        show: processedData.length <= 15, // Mostrar etiquetas solo si hay pocas categorías
        position: 'top',
        formatter: '{c}%',
        color: theme.palette.text.primary,
        fontWeight: 'bold',
        fontSize: processedData.length > 10 ? 10 : 12
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          shadowBlur: 10,
          shadowColor: alpha(theme.palette.primary.main, 0.5)
        }
      }
    }],
    tooltip: {
      trigger: 'axis',
      backgroundColor: theme.palette.background.paper,
      borderColor: theme.palette.divider,
      textStyle: { color: theme.palette.text.primary },
      formatter: (params) => {
        const param = params[0];
        const item = processedData[param.dataIndex];
        
        // Tooltip especial para el grupo "Otras"
        if (item.isOther) {
          const otherCount = parseInt(item.name.match(/\((\d+)\)/)[1]);
          return `
            <div style="font-weight: bold; margin-bottom: 8px;">${item.name}</div>
            <div style="display: flex; justify-content: space-between; width: 200px;">
              <span>Porcentaje:</span>
              <span style="font-weight: bold;">${param.value}%</span>
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
        
        // Tooltip estándar para categorías individuales
        return `
          <div style="font-weight: bold; margin-bottom: 8px;">${param.name}</div>
          <div style="display: flex; justify-content: space-between; width: 200px;">
            <span>Porcentaje:</span>
            <span style="font-weight: bold;">${param.value}%</span>
          </div>
          <div style="display: flex; justify-content: space-between; width: 200px;">
            <span>Ventas:</span>
            <span style="font-weight: bold;">${formatCurrency(item.amount)}</span>
          </div>
        `;
      },
      extraCssText: `box-shadow: ${theme.shadows[4]}; border-radius: 8px;`
    }
  }), [processedData, theme]);

  // Configuración para gráfica de pastel - Optimizada para distribución porcentual
  const pieOption = useMemo(() => ({
    grid: {
      left: '0%',
      right: processedData.length > 8 ? '25%' : '0%', // Espacio para leyenda si hay muchas categorías
      top: '0%',
      bottom: '0%',
      containLabel: true
    },
    // Ocultar ejes para gráfica de pastel
    xAxis: { show: false },
    yAxis: { show: false },
    tooltip: {
      trigger: 'item',
      backgroundColor: theme.palette.background.paper,
      borderColor: theme.palette.divider,
      textStyle: { color: theme.palette.text.primary },
      formatter: (params) => {
        const item = params.data;
        
        if (item.isOther) {
          const otherCount = parseInt(item.name.match(/\((\d+)\)/)[1]);
          return `
            <div style="font-weight: bold; margin-bottom: 8px;">${item.name}</div>
            <div style="display: flex; justify-content: space-between; width: 200px;">
              <span>Porcentaje:</span>
              <span style="font-weight: bold;">${params.percent}%</span>
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
          <div style="font-weight: bold; margin-bottom: 8px;">${params.name}</div>
          <div style="display: flex; justify-content: space-between; width: 200px;">
            <span>Porcentaje:</span>
            <span style="font-weight: bold;">${params.percent}%</span>
          </div>
          <div style="display: flex; justify-content: space-between; width: 200px;">
            <span>Ventas:</span>
            <span style="font-weight: bold;">${formatCurrency(item.amount)}</span>
          </div>
        `;
      },
      extraCssText: `box-shadow: ${theme.shadows[4]}; border-radius: 8px;`
    },
    legend: {
      orient: processedData.length > 8 ? 'vertical' : 'horizontal', // Leyenda vertical si hay muchas categorías
      right: processedData.length > 8 ? 10 : 'auto',
      left: processedData.length > 8 ? 'auto' : 'center',
      top: processedData.length > 8 ? 'center' : 'bottom',
      bottom: processedData.length > 8 ? 'auto' : 10,
      textStyle: {
        color: theme.palette.text.primary,
        fontSize: processedData.length > 15 ? 10 : 12
      },
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 8,
      formatter: (name) => {
        // Acortar nombres largos en la leyenda
        const displayName = name.length > 20 ? name.substring(0, 17) + '...' : name;
        return displayName;
      },
      type: processedData.length > 15 ? 'scroll' : 'plain' // Leyenda scrollable para muchas categorías
    },
    series: [{
      name: 'Categorías',
      type: 'pie',
      radius: processedData.length > 8 ? ['30%', '60%'] : ['40%', '70%'], // Anillo para muchas categorías
      center: processedData.length > 8 ? ['40%', '50%'] : ['50%', '50%'], // Centrado considerando leyenda
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 4,
        borderColor: theme.palette.background.paper,
        borderWidth: 2 // Borde blanco para separar segmentos
      },
      label: {
        show: processedData.length <= 12, // Etiquetas solo para pocas categorías
        formatter: '{b}: {d}%',
        fontSize: processedData.length > 8 ? 10 : 12,
        fontWeight: 'bold',
        color: theme.palette.text.primary,
        lineHeight: 16
      },
      emphasis: {
        label: {
          show: true,
          fontSize: processedData.length > 8 ? 12 : 14,
          fontWeight: 'bold'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      labelLine: {
        show: processedData.length <= 12, // Líneas guía solo para pocas categorías
        length: processedData.length > 8 ? 10 : 20,
        length2: processedData.length > 8 ? 10 : 15
      },
      data: processedData.map(item => ({
        name: item.name,
        value: item.value,
        amount: item.amount,
        itemStyle: { color: item.color }
      }))
    }]
  }), [processedData, theme]);

  // Genera título dinámico basado en el período
  const getTitle = () => {
    const periodText = getPeriodText(timeFilter, yearFilter);
    return `Análisis de Categorías `;
  };

  const hasManyCategories = data.length > 8;

    return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header del componente con controles */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" fontWeight={600}>
              {getTitle()}
            </Typography>
            {/* Badge que muestra el número total de categorías */}
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
              >
                Barras
              </Button>
              <Button
                variant={chartType === 'pastel' ? 'contained' : 'outlined'}
                onClick={() => setChartType('pastel')}
                startIcon={<PieChart />}
              >
                Pastel
              </Button>
            </ButtonGroup>
          </Box>
        </Box>

        {/* Información sobre agrupación cuando está activa */}
        {hasManyCategories && !showAll && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Mostrando top 7 categorías + otras {data.length - 7} categorías agrupadas
            </Typography>
          </Box>
        )}
        
        {/* Contenedor de la gráfica */}
        <Box sx={{ flex: 1, minHeight: 400 }}>
          <SafeECharts 
            key={chartType} // Key fuerza recreación al cambiar tipo de gráfica
            option={chartType === 'barras' ? barOption : pieOption} 
            style={{ height: '100%', width: '100%' }} 
            opts={{ renderer: 'svg' }}
          />
        </Box>

        {/* Footer informativo cuando hay agrupación */}
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