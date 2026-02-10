import React, { useState } from 'react';
import "../../styles/components/CrudLayout.css";

export default function CrudLayout({ 
  title, 
  description, 
  onAddClick, 
  children,
  
  // Props para búsqueda y filtrado
  showSearch = false,
  searchPlaceholder = "Buscar...",
  searchValue = "",
  onSearchChange = null,
  searchFilters = null,
  filterEstado = "",
  onFilterChange = null,
  searchPosition = "left"
}) {
  // Estados internos para búsqueda si no se proveen manejadores externos
  const [internalSearch, setInternalSearch] = useState('');
  const [internalFilter, setInternalFilter] = useState('');

  // Determinar si usamos estados internos o externos
  const useInternalState = !onSearchChange && !onFilterChange;
  const searchTerm = useInternalState ? internalSearch : (searchValue || '');
  const filterValue = useInternalState ? internalFilter : (filterEstado || '');

  // Función para manejar cambios en búsqueda
  const handleSearchChange = (value) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setInternalSearch(value);
    }
  };

  // Función para manejar cambios en filtro
  const handleFilterChange = (value) => {
    if (onFilterChange) {
      onFilterChange(value);
    } else {
      setInternalFilter(value);
    }
  };

  return (
    <div className="crud-layout">
      {/* Header Principal */}
      <div className="crud-header">
        <div className="crud-title">
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>
      
      {/* BARRA DE BÚSQUEDA Y BOTÓN AGREGAR EN MISMA FILA */}
      {showSearch && (
        <div className="search-and-actions-row">
          <div className={`search-container search-${searchPosition}`}>
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => handleSearchChange('')}
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>
            
            {/* FILTROS ADICIONALES */}
            {searchFilters && (
              <div className="search-filters">
                <select 
                  value={filterValue}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Todos los estados</option>
                  {searchFilters.map(filter => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          {/* BOTÓN AGREGAR EN LA MISMA FILA */}
          <div className="actions-container">
            <button onClick={onAddClick} className="btn-primary add-button">
              ➕ Agregar 
            </button>
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
}