// Componente wrapper seguro para ReactECharts
// Previene memory leaks y errores al desmontar componentes con gráficas ECharts

import React, { useRef, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

const SafeECharts = React.forwardRef(({ option, style, ...props }, ref) => {
  const echartsRef = useRef(null);

  // Efecto para limpieza: destruye la instancia de ECharts cuando el componente se desmonta
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

  return (
    <ReactECharts
      ref={(node) => {
        echartsRef.current = node;
        // Maneja tanto ref de función como ref de objeto
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
      opts={{ renderer: 'svg' }} // Usa renderizador SVG para mejor calidad y escalabilidad
      {...props}
    />
  );
});

SafeECharts.displayName = 'SafeECharts';

export default SafeECharts;