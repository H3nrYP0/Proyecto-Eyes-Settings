// src/features/compras/pages/Compras.jsx - CON BÚSQUEDA ESPECÍFICA
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompras } from '../context/ComprasContext';
import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import "../../../shared/styles/components/CrudLayout.css";

export default function Compras() {
  const navigate = useNavigate();
  const { state, actions } = useCompras();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  const handleAddCompra = () => {
    navigate('/admin/compras/crear');
  };

  const handleView = (id) => {
    navigate(`/admin/compras/detalle/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/compras/editar/${id}`);
  };

  const handleDelete = (id, numeroCompra) => {
    if (window.confirm(`¿Estás seguro de eliminar la compra "${numeroCompra}"?`)) {
      actions.deleteCompra(id);
    }
  };

  const handleAnular = (id, numeroCompra) => {
    if (window.confirm(`¿Estás seguro de anular la compra "${numeroCompra}"?`)) {
      actions.anularCompra(id);
    }
  };

  // BÚSQUEDA Y FILTRADO
  const filteredCompras = state.compras.filter(compra => {
    const matchesSearch = 
      compra.numeroCompra.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compra.proveedorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compra.observaciones.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compra.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compra.fecha.includes(searchTerm) ||
      compra.total.toString().includes(searchTerm);
    
    const matchesFilter = !filterEstado || compra.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  // FILTROS PARA COMPRAS
  const searchFilters = [
    { value: 'Completada', label: 'Completadas' },
    { value: 'Anulada', label: 'Anuladas' }
  ];

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <CrudLayout
      title="💰 Compras"
      description="Registra y gestiona las compras de productos a proveedores."
      onAddClick={handleAddCompra}
      showSearch={true}
      searchPlaceholder="Buscar compras..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchFilters={searchFilters}
      onFilterChange={setFilterEstado}
    >
      <div className="crud-center">
        
        {/* ESTADÍSTICAS DE BÚSQUEDA */}
        <div className="search-stats">
          <p>
            Mostrando <strong>{filteredCompras.length}</strong> de <strong>{state.compras.length}</strong> compras
            {searchTerm && (
              <span> para "<strong>{searchTerm}</strong>"</span>
            )}
            {filterEstado && (
              <span> - Filtrado por: <strong>{filterEstado}</strong></span>
            )}
          </p>
        </div>

        <table className="crud-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Proveedor</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompras.map(compra => (
              <tr key={compra.id}>
                <td>
                  <strong>{compra.numeroCompra}</strong>
                </td>
                <td>{compra.proveedorNombre}</td>
                <td>{compra.fecha}</td>
                <td>
                  <span className="amount">{formatCurrency(compra.total)}</span>
                </td>
                <td>
                  <span className={`status-badge status-${compra.estado.toLowerCase()}`}>
                    {compra.estado === "Completada" ? "✅ Completada" : "❌ Anulada"}
                  </span>
                </td>
                <td>
                  {compra.observaciones ? (
                    <span title={compra.observaciones}>
                      {compra.observaciones.length > 50 
                        ? compra.observaciones.substring(0, 50) + '...' 
                        : compra.observaciones
                      }
                    </span>
                  ) : '-'}
                </td>
                <td className="actions">
                  <button 
                    title="Ver detalle"
                    onClick={() => handleView(compra.id)}
                    className="btn-view"
                  >
                    👁️
                  </button>
                  <button 
                    title="Editar"
                    onClick={() => handleEdit(compra.id)}
                    className="btn-edit"
                    disabled={compra.estado === "Anulada"}
                  >
                    ✏️
                  </button>
                  <button 
                    title="Anular"
                    onClick={() => handleAnular(compra.id, compra.numeroCompra)}
                    className="btn-warning"
                    disabled={compra.estado === "Anulada"}
                  >
                    🚫
                  </button>
                  <button 
                    title="Eliminar"
                    onClick={() => handleDelete(compra.id, compra.numeroCompra)}
                    className="btn-delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredCompras.length === 0 && (
          <div className="no-data">
            {searchTerm || filterEstado ? 
              `No se encontraron compras para los filtros aplicados` : 
              'No hay compras registradas'
            }
            {!searchTerm && !filterEstado && (
              <button 
                onClick={handleAddCompra}
                className="btn-primary"
                style={{marginTop: '1rem'}}
              >
                ➕ Registrar Primera Compra
              </button>
            )}
          </div>
        )}
      </div>
    </CrudLayout>
  );
}