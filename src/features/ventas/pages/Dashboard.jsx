// src/features/ventas/pages/Dashboard.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  ButtonGroup,
  Paper,
  Chip,
  useTheme,
  alpha,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  People,
  Inventory2,
  CalendarToday,
  Category,
  BarChart,
  PieChart,
  ShowChart
} from '@mui/icons-material';
import ReactECharts from 'echarts-for-react';

// Función auxiliar para formatear currency
const formatCurrency = (value) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
};

// Componente wrapper seguro para ECharts
const SafeECharts = React.forwardRef(({ option, style, ...props }, ref) => {
  const echartsRef = useRef(null);

  useEffect(() => {
    return () => {
      if (echartsRef.current && echartsRef.current.getEchartsInstance) {
        try {
          const instance = echartsRef.current.getEchartsInstance();
          if (instance && !instance.isDisposed()) {
            instance.dispose();
          }
        } catch (error) {
          console.warn('Error cleaning up ECharts instance:', error);
        }
      }
    };
  }, []);

  return (
    <ReactECharts
      ref={(node) => {
        echartsRef.current = node;
        if (ref) {
          if (typeof ref === 'function') {
            ref(node);
          } else {
            ref.current = node;
          }
        }
      }}
      option={option}
      style={style}
      opts={{ renderer: 'svg' }}
      {...props}
    />
  );
});

// Hook personalizado para los datos del dashboard
const useDashboardData = (timeFilter, yearFilter = '2024') => {
  return useMemo(() => {
    // Generar horas del día (7am - 6pm)
    const generateHours = () => {
      const hours = [];
      for (let i = 7; i <= 18; i++) {
        hours.push(`${i}:00`);
      }
      return hours;
    };

    // Generar días del mes
    const generateDays = () => {
      const days = [];
      for (let i = 1; i <= 30; i++) {
        days.push(`${i}/09`);
      }
      return days;
    };

    // Generar meses del año
    const generateMonths = () => {
      return ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    };

    // Datos diferentes por año
    const getYearData = (year) => {
      const baseData = {
        '2022': {
          ventas: [800000, 1500000, 2200000, 2800000, 3500000, 4200000, 5000000, 4500000, 3800000, 3200000, 2800000, 3300000],
          compras: [2500000, 4800000, 7200000, 9500000, 8800000, 8200000, 7800000, 7400000, 7000000, 6600000, 6200000, 5800000]
        },
        '2023': {
          ventas: [900000, 1800000, 2700000, 3600000, 4500000, 5400000, 6300000, 5800000, 5000000, 4200000, 3500000, 4000000],
          compras: [2800000, 5500000, 8200000, 10800000, 9900000, 9200000, 8600000, 8200000, 7800000, 7300000, 6800000, 6400000]
        },
        '2024': {
          ventas: [1000000, 2000000, 3000000, 4000000, 5000000, 6000000, 7000000, 6500000, 5500000, 4500000, 3500000, 4000000],
          compras: [3000000, 6000000, 9000000, 12000000, 11000000, 10000000, 9500000, 9000000, 8500000, 8000000, 7500000, 7000000]
        },
        '2025': {
          ventas: [1200000, 2400000, 3600000, 4800000, 6000000, 7200000, 8400000, 7800000, 6600000, 5400000, 4200000, 4800000],
          compras: [3600000, 7200000, 10800000, 14400000, 13200000, 12000000, 11400000, 10800000, 10200000, 9600000, 9000000, 8400000]
        }
      };
      return baseData[year] || baseData['2024'];
    };

    const yearData = getYearData(yearFilter);

    // Datos completos de productos (10 elementos)
    const productosCompletos = {
      dia: [
        { name: "Lentes de Contacto Acuwe", percentage: 35, quantity: 42, top3: true },
        { name: "Montura Ray-Ban Aviator", percentage: 22, quantity: 28, top3: true },
        { name: "Gafas de Sol Oakley", percentage: 18, quantity: 22, top3: true },
        { name: "Lentes Progresivos Essilor", percentage: 12, quantity: 15 },
        { name: "Estuches Premium", percentage: 8, quantity: 10 },
        { name: "Lentes Transition", percentage: 7, quantity: 8 },
        { name: "Montura Gucci", percentage: 6, quantity: 7 },
        { name: "Gafas de Sol Prada", percentage: 5, quantity: 6 },
        { name: "Lentes Anti-reflejo", percentage: 4, quantity: 5 },
        { name: "Accesorios Limpieza", percentage: 3, quantity: 4 }
      ],
      mes: [
        { name: "Lentes de Contacto Acuwe", percentage: 27, quantity: 125, top3: true },
        { name: "Montura Ray-Ban Aviator", percentage: 18, quantity: 85, top3: true },
        { name: "Gafas de Sol Oakley", percentage: 15, quantity: 72, top3: true },
        { name: "Lentes Progresivos Essilor", percentage: 12, quantity: 58 },
        { name: "Estuches Premium", percentage: 8, quantity: 38 },
        { name: "Lentes Transition", percentage: 7, quantity: 32 },
        { name: "Montura Gucci", percentage: 6, quantity: 28 },
        { name: "Gafas de Sol Prada", percentage: 5, quantity: 24 },
        { name: "Lentes Anti-reflejo", percentage: 4, quantity: 19 },
        { name: "Accesorios Limpieza", percentage: 3, quantity: 14 }
      ],
      año: [
        { name: "Lentes de Contacto Acuwe", percentage: 25, quantity: 480, top3: true },
        { name: "Montura Ray-Ban Aviator", percentage: 20, quantity: 384, top3: true },
        { name: "Gafas de Sol Oakley", percentage: 15, quantity: 288, top3: true },
        { name: "Lentes Progresivos Essilor", percentage: 12, quantity: 230 },
        { name: "Estuches Premium", percentage: 8, quantity: 154 },
        { name: "Lentes Transition", percentage: 7, quantity: 134 },
        { name: "Montura Gucci", percentage: 6, quantity: 115 },
        { name: "Gafas de Sol Prada", percentage: 5, quantity: 96 },
        { name: "Lentes Anti-reflejo", percentage: 4, quantity: 77 },
        { name: "Accesorios Limpieza", percentage: 3, quantity: 58 }
      ]
    };

    const dataMap = {
      dia: {
        ventas: {
          labels: generateHours(),
          data: [150, 280, 420, 380, 320, 450, 520, 480, 550, 520, 480, 420].map(val => val * 1000),
          lineData: [140, 270, 410, 370, 310, 440, 510, 470, 540, 510, 470, 410].map(val => val * 1000)
        },
        compras: {
          labels: generateHours(),
          data: [2000, 3500, 5000, 4500, 4000, 5500, 6000, 5800, 6200, 5900, 5400, 4800].map(val => val * 1000),
          lineData: [1900, 3400, 4900, 4400, 3900, 5400, 5900, 5700, 6100, 5800, 5300, 4700].map(val => val * 1000)
        },
        categorias: [
          { name: "Lentes", value: 35, amount: 1250, color: '#3b82f6' },
          { name: "Monturas", value: 25, amount: 890, color: '#10b981' },
          { name: "Sol", value: 20, amount: 540, color: '#f59e0b' },
          { name: "Contacto", value: 15, amount: 380, color: '#ef4444' },
          { name: "Accesorios", value: 5, amount: 120, color: '#8b5cf6' }
        ],
        productos: productosCompletos.dia,
        metricas: {
          clientes: 12,
          productosVendidos: 97,
          citasEfectivas: 8
        }
      },
      mes: {
        ventas: {
          labels: generateDays(),
          data: Array.from({length: 30}, (_, i) => {
            const base = 100000;
            const variation = Math.sin(i / 5) * 200000;
            const random = Math.random() * 100000;
            return Math.floor(base + variation + random);
          }),
          lineData: Array.from({length: 30}, (_, i) => {
            const base = 80000;
            const variation = Math.sin(i / 5) * 180000;
            const random = Math.random() * 80000;
            return Math.floor(base + variation + random);
          })
        },
        compras: {
          labels: generateDays(),
          data: Array.from({length: 30}, (_, i) => {
            const base = 2000000;
            const variation = Math.sin(i / 5) * 1000000;
            const random = Math.random() * 500000;
            return Math.floor(base + variation + random);
          }),
          lineData: Array.from({length: 30}, (_, i) => {
            const base = 1800000;
            const variation = Math.sin(i / 5) * 900000;
            const random = Math.random() * 400000;
            return Math.floor(base + variation + random);
          })
        },
        categorias: [
          { name: "Lentes", value: 40, amount: 14800, color: '#3b82f6' },
          { name: "Monturas", value: 30, amount: 11200, color: '#10b981' },
          { name: "Sol", value: 15, amount: 5600, color: '#f59e0b' },
          { name: "Contacto", value: 10, amount: 3750, color: '#ef4444' },
          { name: "Accesorios", value: 5, amount: 1250, color: '#8b5cf6' }
        ],
        productos: productosCompletos.mes,
        metricas: {
          clientes: 47,
          productosVendidos: 378,
          citasEfectivas: 25
        }
      },
      año: {
        ventas: {
          labels: generateMonths(),
          data: yearData.ventas,
          lineData: yearData.ventas.map(val => val * 0.9)
        },
        compras: {
          labels: generateMonths(),
          data: yearData.compras,
          lineData: yearData.compras.map(val => val * 0.9)
        },
        categorias: [
          { name: "Lentes", value: 45, amount: 168000, color: '#3b82f6' },
          { name: "Monturas", value: 25, amount: 93500, color: '#10b981' },
          { name: "Sol", value: 15, amount: 56100, color: '#f59e0b' },
          { name: "Contacto", value: 10, amount: 37400, color: '#ef4444' },
          { name: "Accesorios", value: 5, amount: 18700, color: '#8b5cf6' }
        ],
        productos: productosCompletos.año,
        metricas: {
          clientes: 156,
          productosVendidos: 1536,
          citasEfectivas: 128
        }
      }
    };

    return dataMap[timeFilter] || dataMap.dia;
  }, [timeFilter, yearFilter]);
};

// Componente de Análisis de Categorías 
const VentasChart = ({ data, timeFilter, title, chartType, onChartTypeChange }) => {
  const theme = useTheme();
  
  const formatValue = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const formatYAxis = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
  };

  const getXAxisInterval = () => {
    switch (timeFilter) {
      case 'dia': return 0;
      case 'mes': return 4;
      case 'año': return 0;
      default: return 0;
    }
  };

  const option = {
    grid: {
      left: '70px',
      right: '20px',
      top: '60px',
      bottom: '60px',
      containLabel: false
    },
    xAxis: {
      type: 'category',
      data: data?.labels || [],
      axisLine: {
        show: true,
        lineStyle: {
          color: theme.palette.divider
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
        interval: getXAxisInterval(),
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
    series: chartType === 'barras' ? [
      {
        name: title,
        type: 'bar',
        data: data?.data || [],
        barWidth: timeFilter === 'dia' ? '50%' : '30%',
        itemStyle: {
          color: title.includes('Ventas') ? theme.palette.primary.main : theme.palette.secondary.main,
          borderRadius: [4, 4, 0, 0]
        },
        label: {
          show: true,
          position: 'top',
          color: theme.palette.text.primary,
          fontWeight: 'bold',
          fontSize: 10,
          formatter: (params) => formatValue(params.value)
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
        smooth: true,
        symbol: 'circle',
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
            <span style="font-weight: bold;">${formatValue(param.value)}</span>
          </div>
        `;
      },
      backgroundColor: theme.palette.background.paper,
      borderColor: theme.palette.divider,
      textStyle: {
        color: theme.palette.text.primary
      },
      extraCssText: `box-shadow: ${theme.shadows[4]}; border-radius: 8px;`
    }
  };

  return (
    <Box sx={{ position: 'relative', height: 400 }}>
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
      <SafeECharts 
        option={option} 
        style={{ height: '100%', width: '100%' }} 
      />
    </Box>
  );
};

// Componente de análisis de categorías
const AnalisisCategorias = ({ data, timeFilter, yearFilter }) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState('pastel');
  const [showAll, setShowAll] = useState(false);

  // Agrupar categorías pequeñas cuando hay muchas
  const processedData = useMemo(() => {
    if (data.length <= 8 || showAll) {
      return data;
    }

    const sortedData = [...data].sort((a, b) => b.value - a.value);
    const topCategories = sortedData.slice(0, 7);
    const otherCategories = sortedData.slice(7);
    
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

  // CORRECCIÓN: Configuración separada y limpia para cada tipo de gráfica
  const barOption = useMemo(() => ({
    // CORRECCIÓN: Grid específico para barras
    grid: {
      left: processedData.length > 10 ? '100px' : '70px',
      right: '20px',
      top: '60px',
      bottom: processedData.length > 15 ? '100px' : '60px'
    },
    // CORRECCIÓN: Ejes específicos para barras
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
        fontSize: processedData.length > 15 ? 10 : 12,
        fontWeight: 500,
        margin: 10,
        interval: 0,
        rotate: processedData.length > 8 ? 45 : 0,
        formatter: (value) => {
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
      max: Math.max(...processedData.map(item => item.value)) + 10
    },
    dataZoom: processedData.length > 10 ? [
      {
        type: 'inside',
        xAxisIndex: 0,
        start: 0,
        end: Math.min(100, (8 / processedData.length) * 100)
      },
      {
        type: 'slider',
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
          borderRadius: [4, 4, 0, 0]
        }
      })),
      type: 'bar',
      barWidth: processedData.length > 15 ? '30%' : processedData.length > 8 ? '40%' : '50%',
      label: {
        show: processedData.length <= 15,
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

  // CORRECCIÓN: Configuración completamente separada para pastel
  const pieOption = useMemo(() => ({
    // CORRECCIÓN: Grid específico para pastel sin ejes
    grid: {
      left: '0%',
      right: processedData.length > 8 ? '25%' : '0%',
      top: '0%',
      bottom: '0%',
      containLabel: true
    },
    // CORRECCIÓN: Ejes explícitamente ocultos para pastel
    xAxis: {
      show: false,
      type: 'category', // Añadido para limpiar cualquier configuración previa
      data: [] // Datos vacíos para limpiar
    },
    yAxis: {
      show: false,
      type: 'value', // Añadido para limpiar cualquier configuración previa
    },
    // CORRECCIÓN: Remover dataZoom para pastel
    dataZoom: undefined,
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
      orient: processedData.length > 8 ? 'vertical' : 'horizontal',
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
        const displayName = name.length > 20 ? name.substring(0, 17) + '...' : name;
        return displayName;
      },
      type: processedData.length > 15 ? 'scroll' : 'plain'
    },
    series: [{
      name: 'Categorías',
      type: 'pie',
      radius: processedData.length > 8 ? ['30%', '60%'] : ['40%', '70%'],
      center: processedData.length > 8 ? ['40%', '50%'] : ['50%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 4,
        borderColor: theme.palette.background.paper,
        borderWidth: 2
      },
      label: {
        show: processedData.length <= 12,
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
        show: processedData.length <= 12,
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

  const getTitle = () => {
    const periodText = timeFilter === 'dia' ? 'Hoy' : 
                      timeFilter === 'mes' ? 'Este Mes' : 
                      `Año ${yearFilter}`;
    return `Análisis de Categorías - ${periodText}`;
  };

  const hasManyCategories = data.length > 8;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Category color="primary" />
            <Typography variant="h6" fontWeight={600}>
              {getTitle()}
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
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {hasManyCategories && (
              <Button
                variant={showAll ? "contained" : "outlined"}
                size="small"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Agrupar' : 'Ver todas'}
              </Button>
            )}
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

        {hasManyCategories && !showAll && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Mostrando top 7 categorías + otras {data.length - 7} categorías agrupadas
            </Typography>
          </Box>
        )}
        
        <Box sx={{ flex: 1, minHeight: 400 }}>
          <SafeECharts 
            key={chartType} // Key forzará recreación al cambiar tipo
            option={chartType === 'barras' ? barOption : pieOption} 
            style={{ height: '100%', width: '100%' }} 
            opts={{ renderer: 'svg' }}
          />
        </Box>

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
// Componente de productos más vendidos
const ProductosMasVendidos = ({ productos, timeFilter }) => {
  const theme = useTheme();
  const [topCount, setTopCount] = useState(5);
  
  // Usar topCount para mostrar la cantidad correcta
  const displayedProducts = productos.slice(0, topCount);

  const getPeriodText = () => {
    switch (timeFilter) {
      case 'dia': return 'Hoy';
      case 'mes': return 'Este mes';
      case 'año': return 'Este año';
      default: return 'Este período';
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Productos Más Vendidos
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={getPeriodText()} 
              size="small" 
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Top</InputLabel>
              <Select
                value={topCount}
                label="Top"
                onChange={(e) => setTopCount(e.target.value)}
              >
                <MenuItem value={5}>Top 5</MenuItem>
                <MenuItem value={10}>Top 10</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {displayedProducts.map((producto, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{
                p: 2,
                borderLeft: producto.top3 ? `4px solid ${theme.palette.warning.main}` : '4px solid transparent',
                bgcolor: producto.top3 ? alpha(theme.palette.warning.light, 0.1) : 'background.paper',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: theme.shadows[2],
                  transform: 'translateY(-1px)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    bgcolor: index < 3 ? theme.palette.warning.main : theme.palette.grey[200],
                    color: index < 3 ? 'white' : theme.palette.text.secondary,
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    flexShrink: 0
                  }}
                >
                  {index + 1}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography 
                    variant="body2" 
                    fontWeight="medium" 
                    gutterBottom
                    sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {producto.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {producto.quantity} unidades
                  </Typography>
                </Box>
                <Chip
                  label={`${producto.percentage}%`}
                  size="small"
                  color={index < 3 ? "warning" : "default"}
                  variant={index < 3 ? "filled" : "outlined"}
                  sx={{ fontWeight: 500, flexShrink: 0 }}
                />
              </Box>
            </Paper>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// Componente de métricas operativas
const MetricasOperativas = ({ metricas, timeFilter }) => {
  const theme = useTheme();
  
  const getPeriodText = () => {
    switch (timeFilter) {
      case 'dia': return 'Hoy';
      case 'mes': return 'Este mes';
      case 'año': return 'Este año';
      default: return 'Este período';
    }
  };

  const metrics = [
    {
      icon: <People />,
      label: "Número de Clientes",
      value: metricas.clientes,
      color: theme.palette.primary.main
    },
    {
      icon: <Inventory2 />,
      label: "Productos Vendidos",
      value: metricas.productosVendidos,
      color: theme.palette.secondary.main
    },
    {
      icon: <CalendarToday />,
      label: "Citas Efectivas",
      value: metricas.citasEfectivas,
      color: theme.palette.success.main
    }
  ];

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Métricas Operativas
          </Typography>
          <Chip 
            label={getPeriodText()} 
            size="small" 
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {metrics.map((metric, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{
                p: 2,
                borderLeft: `4px solid ${metric.color}`,
                bgcolor: alpha(metric.color, 0.05),
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: theme.shadows[1],
                  transform: 'translateY(-1px)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '8px',
                    bgcolor: alpha(metric.color, 0.1),
                    color: metric.color,
                    flexShrink: 0
                  }}
                >
                  {metric.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {metric.label}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color={metric.color}>
                    {metric.value.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// Componente principal del Dashboard 
export default function Dashboard() {
  const theme = useTheme();
  const [timeFilter, setTimeFilter] = useState('dia');
  const [yearFilter, setYearFilter] = useState('2024');
  const [ventasChartType, setVentasChartType] = useState('barras');
  const [comprasChartType, setComprasChartType] = useState('barras');
  
  const dashboardData = useDashboardData(timeFilter, yearFilter);

  // Función para obtener el texto del período
  const getPeriodText = () => {
    switch (timeFilter) {
      case 'dia': return 'Vista Diaria';
      case 'mes': return 'Vista Mensual';
      case 'año': return `Año ${yearFilter}`;
      default: return 'Vista Actual';
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.background.default, 0.3)} 50%, ${theme.palette.background.default} 100%)`,
      p: 3
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          fontWeight="bold" 
          gutterBottom
          sx={{ 
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 1
          }}
        >
          Resumen Operativo {/*timeFilter === 'año' ? yearFilter : ''*/}
        </Typography>
        <Typography 
          variant="h6" 
          component="h2" 
          color="text.primary"
          fontWeight="500"
          sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
        >
          Visual Outlet
          <Chip 
            label={getPeriodText()} 
            size="small" 
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
          />
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ButtonGroup variant="outlined" size="medium">
              <Button 
                onClick={() => setTimeFilter('dia')}
                variant={timeFilter === 'dia' ? 'contained' : 'outlined'}
                startIcon={<CalendarToday />}
              >
                Día
              </Button>
              <Button 
                onClick={() => setTimeFilter('mes')}
                variant={timeFilter === 'mes' ? 'contained' : 'outlined'}
                startIcon={<CalendarToday />}
              >
                Mes
              </Button>
              <Button 
                onClick={() => setTimeFilter('año')}
                variant={timeFilter === 'año' ? 'contained' : 'outlined'}
                startIcon={<CalendarToday />}
              >
                Año
              </Button>
            </ButtonGroup>
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Año</InputLabel>
              <Select
                value={yearFilter}
                label="Año"
                onChange={(e) => setYearFilter(e.target.value)}
                disabled={timeFilter !== 'año'}
              >
                <MenuItem value="2022">2022</MenuItem>
                <MenuItem value="2023">2023</MenuItem>
                <MenuItem value="2024">2024</MenuItem>
                <MenuItem value="2025">2025</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          {/* Indicador de período actual */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp color="primary" />
            <Typography variant="body2" color="text.secondary" fontWeight="500">
              {timeFilter === 'dia' ? 'Hoy' : 
               timeFilter === 'mes' ? 'Septiembre 2024' : 
               `Año completo ${yearFilter}`}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Contenido principal */}
      <Grid container spacing={3}>
        {/* Columna izquierda: Métricas y Productos */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MetricasOperativas 
                metricas={dashboardData.metricas} 
                timeFilter={timeFilter} 
              />
            </Grid>

            <Grid item xs={12}>
              <ProductosMasVendidos 
                productos={dashboardData.productos} 
                timeFilter={timeFilter} 
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Columna derecha: Gráficas principales */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <VentasChart 
                    data={dashboardData.ventas} 
                    timeFilter={timeFilter} 
                    title={`Totales de Ventas - ${getPeriodText()}`}
                    chartType={ventasChartType}
                    onChartTypeChange={setVentasChartType}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <VentasChart 
                    data={dashboardData.compras} 
                    timeFilter={timeFilter} 
                    title={`Totales de Compras - ${getPeriodText()}`}
                    chartType={comprasChartType}
                    onChartTypeChange={setComprasChartType}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <AnalisisCategorias 
                data={dashboardData.categorias} 
                timeFilter={timeFilter}
                yearFilter={yearFilter} 
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}