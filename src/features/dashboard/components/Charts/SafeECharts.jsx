import React, { useRef, useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme, useMediaQuery } from '@mui/material';

const SafeECharts = React.forwardRef(({ option, style, ...props }, ref) => {
  const echartsRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [chartKey, setChartKey] = useState(0);

  // Efecto para limpieza
  useEffect(() => {
    return () => {
      if (echartsRef.current) {
        try {
          const instance = echartsRef.current;
          if (instance && typeof instance.dispose === 'function') {
            instance.dispose();
          }
        } catch (error) {
          console.warn('Error cleaning up ECharts instance:', error);
        }
      }
    };
  }, []);

  // Forzar re-render cuando cambia el tamaño de pantalla
  useEffect(() => {
    setChartKey(prev => prev + 1);
  }, [isMobile]);

  // Función para manejar el resize del chart
  const handleResize = () => {
    if (echartsRef.current) {
      try {
        echartsRef.current.resize();
      } catch (error) {
        console.warn('Error resizing ECharts:', error);
      }
    }
  };

  // Escuchar cambios de tamaño de ventana
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ReactECharts
      key={chartKey}
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
      style={{ 
        ...style,
        transition: 'all 0.3s ease'
      }}
      opts={{ 
        renderer: 'svg'
      }}
      onEvents={{
        resize: handleResize
      }}
      {...props}
    />
  );
});

SafeECharts.displayName = 'SafeECharts';

export default SafeECharts;