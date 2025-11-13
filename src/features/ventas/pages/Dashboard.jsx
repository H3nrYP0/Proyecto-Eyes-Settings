// src/features/ventas/pages/Dashboard.jsx
import { useState } from "react";

// Styles
import "/src/shared/styles/features/Dashboard.css";

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState("mes"); // "dia", "mes", "año"
  const [topProductsCount, setTopProductsCount] = useState(5); // 5 o 10
  const [chartType, setChartType] = useState("barras"); // "barras" o "pastel"

  // Función que genera datos según el filtro de tiempo
  const getChartData = () => {
    switch (timeFilter) {
      case "dia":
        return {
          // Datos para gráficas de ventas y compras
          ventasLabels: ["1/08", "2/08", "3/08", "4/08", "5/08", "6/08", "7/08"],
          ventasData: [150000, 300000, 450000, 434350, 250000, 400000, 450000],
          comprasLabels: ["jun", "jul", "ago", "sept", "oct", "nov", "dic"],
          comprasData: [2000000, 4000000, 6000000, 5000000, 7000000, 8000000, 7500000],
          
          // Datos para ventas por categoría
          purchaseLabels: ["Lentes", "Monturas", "Sol", "Contacto", "Accesorios"],
          purchaseData: [35, 25, 20, 15, 5],
          purchasePrices: ["$1,250", "$890", "$540", "$380", "$120"],
          purchaseColors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
          
          // Productos más vendidos
          products: [
            { name: "Lentes de Contacto Acuwe", percentage: 35, quantity: 42, top3: true },
            { name: "Montura Ray-Ban Aviator", percentage: 22, quantity: 28, top3: true },
            { name: "Gafas de Sol Oakley", percentage: 18, quantity: 22, top3: true },
            { name: "Lentes Progresivos Essilor", percentage: 12, quantity: 15 },
            { name: "Estuches Premium", percentage: 8, quantity: 10 }
          ],
          
          // Métricas operativas
          metrics: {
            numeroClientes: 12,
            numeroProductosVendidos: 97,
            numeroCitasEfectivas: 8
          }
        };
      case "mes":
        return {
          // Datos para gráficas de ventas y compras
          ventasLabels: ["Sem1", "Sem2", "Sem3", "Sem4"],
          ventasData: [300000, 450000, 600000, 550000],
          comprasLabels: ["Jun", "Jul", "Ago", "Sept"],
          comprasData: [2000000, 4000000, 6000000, 8000000],
          
          // Datos para ventas por categoría
          purchaseLabels: ["Lentes", "Monturas", "Sol", "Contacto", "Accesorios"],
          purchaseData: [40, 30, 15, 10, 5],
          purchasePrices: ["$14,800", "$11,200", "$5,600", "$3,750", "$1,250"],
          purchaseColors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
          
          // Productos más vendidos
          products: [
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
          
          // Métricas operativas
          metrics: {
            numeroClientes: 47,
            numeroProductosVendidos: 378,
            numeroCitasEfectivas: 25
          }
        };
      case "año":
        return {
          // Datos para gráficas de ventas y compras
          ventasLabels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
          ventasData: [1000000, 2000000, 3000000, 4000000, 5000000, 6000000, 7000000],
          comprasLabels: ["Q1", "Q2", "Q3", "Q4"],
          comprasData: [3000000, 6000000, 9000000, 12000000],
          
          // Datos para ventas por categoría
          purchaseLabels: ["Lentes", "Monturas", "Sol", "Contacto", "Accesorios"],
          purchaseData: [45, 25, 15, 10, 5],
          purchasePrices: ["$168,000", "$93,500", "$56,100", "$37,400", "$18,700"],
          purchaseColors: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
          
          // Productos más vendidos
          products: [
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
          ],
          
          // Métricas operativas
          metrics: {
            numeroClientes: 156,
            numeroProductosVendidos: 1536,
            numeroCitasEfectivas: 128
          }
        };
      default:
        return getChartData().mes;
    }
  };

  const chartData = getChartData();
  const displayedProducts = chartData.products.slice(0, topProductsCount);

  // Calcular datos para el gráfico de pastel
  const totalVentas = chartData.purchasePrices.reduce((total, price) => {
    return total + parseFloat(price.replace(/[$,]/g, ''));
  }, 0);

  const pieChartData = chartData.purchaseLabels.map((label, index) => {
    const value = parseFloat(chartData.purchasePrices[index].replace(/[$,]/g, ''));
    const percentage = ((value / totalVentas) * 100).toFixed(1);
    return {
      label,
      value,
      percentage,
      color: chartData.purchaseColors[index],
      price: chartData.purchasePrices[index]
    };
  });

  // Función para formatear números grandes en las gráficas
  const formatLargeNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h2>Resumen Operativo</h2>
          </div>
          <div className="filter-controls">
            <span className="filter-label">Período:</span>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${timeFilter === "dia" ? "active" : ""}`}
                onClick={() => setTimeFilter("dia")}
              >
                Día
              </button>
              <button 
                className={`filter-btn ${timeFilter === "mes" ? "active" : ""}`}
                onClick={() => setTimeFilter("mes")}
              >
                Mes
              </button>
              <button 
                className={`filter-btn ${timeFilter === "año" ? "active" : ""}`}
                onClick={() => setTimeFilter("año")}
              >
                Año
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Columna izquierda - Gráficas principales */}
        <div className="dashboard-column">
          {/* Totales de Ventas */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Totales de Ventas</h3>
              <span className="chart-period">
                {timeFilter === "dia" ? "Hoy" : 
                 timeFilter === "mes" ? "Este mes" : "Este año"}
              </span>
            </div>
            <div className="sales-chart">
              <div className="chart-y-axis">
                <span>{formatLargeNumber(Math.max(...chartData.ventasData))}</span>
                <span>{formatLargeNumber(Math.max(...chartData.ventasData) * 0.75)}</span>
                <span>{formatLargeNumber(Math.max(...chartData.ventasData) * 0.5)}</span>
                <span>{formatLargeNumber(Math.max(...chartData.ventasData) * 0.25)}</span>
                <span>0</span>
              </div>
              <div className="chart-content">
                <div className="chart-bars">
                  {chartData.ventasData.map((value, index) => {
                    const maxValue = Math.max(...chartData.ventasData);
                    const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    return (
                      <div key={index} className="bar-wrapper">
                        <div 
                          className="chart-bar ventas" 
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className="bar-value">${formatLargeNumber(value)}</span>
                        <span className="bar-label">{chartData.ventasLabels[index]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Totales de Compras */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Totales de Compras</h3>
              <span className="chart-period">
                {timeFilter === "dia" ? "Hoy" : 
                 timeFilter === "mes" ? "Este mes" : "Este año"}
              </span>
            </div>
            <div className="sales-chart">
              <div className="chart-y-axis">
                <span>{formatLargeNumber(Math.max(...chartData.comprasData))}</span>
                <span>{formatLargeNumber(Math.max(...chartData.comprasData) * 0.75)}</span>
                <span>{formatLargeNumber(Math.max(...chartData.comprasData) * 0.5)}</span>
                <span>{formatLargeNumber(Math.max(...chartData.comprasData) * 0.25)}</span>
                <span>0</span>
              </div>
              <div className="chart-content">
                <div className="chart-bars">
                  {chartData.comprasData.map((value, index) => {
                    const maxValue = Math.max(...chartData.comprasData);
                    const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    return (
                      <div key={index} className="bar-wrapper">
                        <div 
                          className="chart-bar compras" 
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className="bar-value">${formatLargeNumber(value)}</span>
                        <span className="bar-label">{chartData.comprasLabels[index]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Ventas por Categoría */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Ventas por Categoría</h3>
              <div className="chart-controls">
                <span className="chart-period">
                  {timeFilter === "dia" ? "Hoy" : 
                   timeFilter === "mes" ? "Este mes" : "Este año"}
                </span>
                <div className="chart-type-selector">
                  <button 
                    className={`chart-type-btn ${chartType === "barras" ? "active" : ""}`}
                    onClick={() => setChartType("barras")}
                  >
                    Barras
                  </button>
                  <button 
                    className={`chart-type-btn ${chartType === "pastel" ? "active" : ""}`}
                    onClick={() => setChartType("pastel")}
                  >
                    Pastel
                  </button>
                </div>
              </div>
            </div>

            {chartType === "barras" ? (
              // Gráfico de Barras
              <div className="purchases-chart">
                <div className="chart-y-axis">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>
                <div className="chart-content">
                  <div className="chart-bars horizontal-bars">
                    {chartData.purchaseData.map((percentage, index) => (
                      <div key={index} className="bar-category-wrapper">
                        <div className="category-bar-container">
                          <div 
                            className="chart-bar category-bar" 
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: chartData.purchaseColors[index]
                            }}
                          ></div>
                        </div>
                        <div className="category-info">
                          <span className="category-name">{chartData.purchaseLabels[index]}</span>
                          <span className="price-label">{chartData.purchasePrices[index]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Gráfico de Pastel
              <div className="pie-chart-container">
                <div className="pie-chart-content">
                  <div className="pie-chart">
                    <svg viewBox="0 0 100 100" className="pie-svg">
                      {pieChartData.reduce((acc, segment, index) => {
                        const prevValue = acc.reduce((sum, s) => sum + parseFloat(s.percentage), 0);
                        return [
                          ...acc,
                          <circle
                            key={index}
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke={segment.color}
                            strokeWidth="20"
                            strokeDasharray={`${segment.percentage} ${100 - segment.percentage}`}
                            strokeDashoffset={-prevValue}
                            transform="rotate(-90 50 50)"
                          />
                        ];
                      }, [])}
                    </svg>
                    <div className="pie-center">
                      <span className="pie-total">Total</span>
                      <span className="pie-amount">
                        {timeFilter === "dia" ? "$3,180" : 
                         timeFilter === "mes" ? "$36,600" : "$373,700"}
                      </span>
                    </div>
                  </div>
                  <div className="pie-legend">
                    {pieChartData.map((segment, index) => (
                      <div key={index} className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: segment.color }}></div>
                        <div className="legend-info">
                          <span className="legend-label">{segment.label}</span>
                          <span className="legend-percentage">{segment.percentage}%</span>
                        </div>
                        <span className="legend-price">{segment.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha - Métricas y Productos */}
        <div className="dashboard-column">
          {/* Productos Más Vendidos */}
          <div className="metrics-card">
            <div className="chart-header">
              <h3 className="chart-title">Productos Más Vendidos</h3>
              <div className="chart-controls">
                <span className="chart-period">
                  {timeFilter === "dia" ? "Hoy" : 
                   timeFilter === "mes" ? "Este mes" : "Este año"}
                </span>
                <div className="top-selector">
                  <button 
                    className={`top-btn ${topProductsCount === 5 ? "active" : ""}`}
                    onClick={() => setTopProductsCount(5)}
                  >
                    Top 5
                  </button>
                  <button 
                    className={`top-btn ${topProductsCount === 10 ? "active" : ""}`}
                    onClick={() => setTopProductsCount(10)}
                  >
                    Top 10
                  </button>
                </div>
              </div>
            </div>
            <div className="products-list">
              {displayedProducts.map((product, index) => (
                <div 
                  key={index} 
                  className={`product-item ${product.top3 ? "top3" : ""}`}
                >
                  <div className="product-rank">
                    {index + 1}
                  </div>
                  <div className="product-info">
                    <span className="product-name">{product.name}</span>
                    <span className="product-quantity">{product.quantity} unidades</span>
                  </div>
                  <span className="product-percentage">{product.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Métricas Operativas */}
          <div className="metrics-card">
            <div className="chart-header">
              <h3 className="chart-title">Métricas Operativas</h3>
              <span className="chart-period">
                {timeFilter === "dia" ? "Hoy" : 
                 timeFilter === "mes" ? "Este mes" : "Este año"}
              </span>
            </div>
            <div className="metrics-grid">
              <div className="metric-row">
                <span className="metric-label">Número de Clientes</span>
                <span className="metric-value">{chartData.metrics.numeroClientes}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Productos Vendidos</span>
                <span className="metric-value">{chartData.metrics.numeroProductosVendidos}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Citas Efectivas</span>
                <span className="metric-value">{chartData.metrics.numeroCitasEfectivas}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}