// src/shared/components/layouts/CrudLayout.jsx - CON BÚSQUEDA
import "../../styles/components/CrudLayout.css";

export default function CrudLayout({ 
  title, 
  description, 
  onAddClick, 
  children,
  showSearch = false,
  searchPlaceholder = "Buscar...",
  searchValue = "",
  onSearchChange = () => {},
  searchFilters = null,
  onFilterChange = () => {}
}) {
  return (
    <div className="crud-layout">
      <div className="crud-header">
        <div className="crud-title">
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        
        <div className="crud-actions">
          {/* BARRA DE BÚSQUEDA */}
          {showSearch && (
            <div className="search-container">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="search-input"
                />
                {searchValue && (
                  <button 
                    className="clear-search"
                    onClick={() => onSearchChange('')}
                  >
                    ✕
                  </button>
                )}
              </div>
              
              {/* FILTROS ADICIONALES (opcional) */}
              {searchFilters && (
                <div className="search-filters">
                  <select 
                    onChange={(e) => onFilterChange(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">Todos</option>
                    {searchFilters.map(filter => (
                      <option key={filter.value} value={filter.value}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
          
          {/* BOTÓN AGREGAR */}
          <button onClick={onAddClick} className="btn-primary add-button">
            ➕ Agregar
          </button>
        </div>
      </div>
      
      {children}
    </div>
  );
}