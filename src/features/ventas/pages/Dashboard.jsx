import { useState } from "react";

// Styles
import "/src/shared/styles/features/Dashboard.css";

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState("mes"); // "dia", "semana", "mes", "año"

  // ✅ FUNCIÓN getChartData DEFINIDA - REEMPLAZA EL COMENTARIO CON ESTO
  const getChartData = () => {
    switch (timeFilter) {
      case "dia":
        return {
          salesLabels: ["9:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00"],
          salesData: [85, 60, 45, 70, 90, 55, 75],
          purchaseLabels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
          purchaseData: [60, 90, 40, 75, 85, 50, 65],
          products: [
            { name: "Lentes de Contacto Acuwe", percentage: 35 },
            { name: "Montura Ray-Ban Aviator", percentage: 22 },
            { name: "Gafas de Sol Oakley", percentage: 18 }
          ],
          metrics: {
            clientes: 12,
            citas: 8,
            productos: 15,
            ventas: "$450K",
            conversion: "72%",
            nuevosClientes: 4
          }
        };
      case "semana":
        return {
          salesLabels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
          salesData: [85, 60, 45, 70, 90, 55, 75],
          purchaseLabels: ["Sem1", "Sem2", "Sem3", "Sem4"],
          purchaseData: [60, 90, 40, 75],
          products: [
            { name: "Lentes de Contacto Acuwe", percentage: 30 },
            { name: "Montura Ray-Ban Aviator", percentage: 20 },
            { name: "Gafas de Sol Oakley", percentage: 15 }
          ],
          metrics: {
            clientes: 28,
            citas: 25,
            productos: 45,
            ventas: "$1.2M",
            conversion: "68%",
            nuevosClientes: 8
          }
        };
      case "mes":
        return {
          salesLabels: ["1/08", "2/08", "3/08", "4/08", "5/08", "6/08", "7/08"],
          salesData: [85, 60, 45, 70, 90, 55, 75],
          purchaseLabels: ["vie", "sáb", "dom", "lun", "mar", "mié", "jue"],
          purchaseData: [60, 90, 40, 75, 85, 50, 65],
          products: [
            { name: "Lentes de Contacto Acuwe", percentage: 27 },
            { name: "Montura Ray-Ban Aviator", percentage: 18 },
            { name: "Gafas de Sol Oakley", percentage: 18 }
          ],
          metrics: {
            clientes: 7,
            citas: 0,
            productos: 20,
            ventas: "$1.2M",
            conversion: "65%",
            nuevosClientes: 3
          }
        };
      case "año":
        return {
          salesLabels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
          salesData: [65, 70, 75, 80, 85, 90, 95],
          purchaseLabels: ["Q1", "Q2", "Q3", "Q4"],
          purchaseData: [70, 85, 60, 90],
          products: [
            { name: "Lentes de Contacto Acuwe", percentage: 25 },
            { name: "Montura Ray-Ban Aviator", percentage: 20 },
            { name: "Gafas de Sol Oakley", percentage: 15 }
          ],
          metrics: {
            clientes: 156,
            citas: 128,
            productos: 450,
            ventas: "$14.5M",
            conversion: "70%",
            nuevosClientes: 45
          }
        };
      default:
        return {
          salesLabels: ["1/08", "2/08", "3/08", "4/08", "5/08", "6/08", "7/08"],
          salesData: [85, 60, 45, 70, 90, 55, 75],
          purchaseLabels: ["vie", "sáb", "dom", "lun", "mar", "mié", "jue"],
          purchaseData: [60, 90, 40, 75, 85, 50, 65],
          products: [
            { name: "Lentes de Contacto Acuwe", percentage: 27 },
            { name: "Montura Ray-Ban Aviator", percentage: 18 },
            { name: "Gafas de Sol Oakley", percentage: 18 }
          ],
          metrics: {
            clientes: 7,
            citas: 0,
            productos: 20,
            ventas: "$1.2M",
            conversion: "65%",
            nuevosClientes: 3
          }
        };
    }
  };

  const chartData = getChartData();

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h2>📊 Dashboard Visual Outlet</h2>
            <p>Resumen operativo de la óptica</p>
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
                className={`filter-btn ${timeFilter === "semana" ? "active" : ""}`}
                onClick={() => setTimeFilter("semana")}
              >
                Semana
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
        {/* Columna izquierda - Gráficas */}
        <div className="dashboard-column">
          {/* Totales de Ventas */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Totales de Ventas</h3>
              <span className="chart-period">
                {timeFilter === "dia" ? "Hoy" : 
                 timeFilter === "semana" ? "Esta semana" :
                 timeFilter === "mes" ? "Este mes" : "Este año"}
              </span>
            </div>
            <div className="sales-chart">
              <div className="chart-y-axis">
                <span>600000</span>
                <span>450000</span>
                <span>300000</span>
                <span>150000</span>
                <span>0</span>
              </div>
              <div className="chart-content">
                <div className="chart-bars">
                  {chartData.salesData.map((height, index) => (
                    <div 
                      key={index}
                      className="chart-bar" 
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
                <div className="chart-x-axis">
                  {chartData.salesLabels.map((label, index) => (
                    <span key={index}>{label}</span>
                  ))}
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
                 timeFilter === "semana" ? "Esta semana" :
                 timeFilter === "mes" ? "Este mes" : "Este año"}
              </span>
            </div>
            <div className="purchases-chart">
              <div className="chart-y-axis">
                <span>4</span>
                <span>3</span>
                <span>2</span>
                <span>1</span>
                <span>0</span>
              </div>
              <div className="chart-content">
                <div className="chart-bars">
                  {chartData.purchaseData.map((height, index) => (
                    <div 
                      key={index}
                      className="chart-bar purchase" 
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
                <div className="chart-x-axis">
                  {chartData.purchaseLabels.map((label, index) => (
                    <span key={index}>{label}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha - Métricas y Productos */}
        <div className="dashboard-column">
          {/* Productos Más Vendidos */}
          <div className="metrics-card">
            <div className="chart-header">
              <h3 className="chart-title">Productos Más Vendidos</h3>
              <span className="chart-period">
                {timeFilter === "dia" ? "Hoy" : 
                 timeFilter === "semana" ? "Esta semana" :
                 timeFilter === "mes" ? "Este mes" : "Este año"}
              </span>
            </div>
            <div className="products-list">
              {chartData.products.map((product, index) => (
                <div key={index} className="product-item">
                  <span className="product-name">{product.name}</span>
                  <span className="product-percentage">{product.percentage}%</span>
                </div>
              ))}
              <div className="product-item">
                <span className="product-name">Lentes Progresivos</span>
                <span className="product-percentage">12%</span>
              </div>
              <div className="product-item">
                <span className="product-name">Estuches Premium</span>
                <span className="product-percentage">8%</span>
              </div>
            </div>
          </div>

          {/* Métricas Operativas */}
          <div className="metrics-card">
            <div className="chart-header">
              <h3 className="chart-title">Métricas Operativas</h3>
              <span className="chart-period">
                {timeFilter === "dia" ? "Hoy" : 
                 timeFilter === "semana" ? "Esta semana" :
                 timeFilter === "mes" ? "Este mes" : "Este año"}
              </span>
            </div>
            <div className="metrics-grid">
              <div className="metric-row">
                <span className="metric-label">Total de Clientes</span>
                <span className="metric-value">{chartData.metrics.clientes}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Citas Efectivas</span>
                <span className="metric-value">{chartData.metrics.citas}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Productos Vendidos</span>
                <span className="metric-value">{chartData.metrics.productos}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Ventas del {timeFilter === "dia" ? "Día" : timeFilter === "semana" ? "Semana" : timeFilter === "mes" ? "Mes" : "Año"}</span>
                <span className="metric-value">{chartData.metrics.ventas}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Tasa Conversión</span>
                <span className="metric-value">{chartData.metrics.conversion}</span>
              </div>
              <div className="metric-row">
                <span className="metric-label">Clientes Nuevos</span>
                <span className="metric-value">{chartData.metrics.nuevosClientes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}