// Styles
import "/src/shared/styles/components/CrudLayout.css";

export default function CrudLayout({ 
  title, 
  description, 
  onAddClick, 
  hideAddButton = false,  // ✅ NUEVA PROP
  children 
}) {
  return (
    <div className="crud-layout">
      
      {/* Header */}
      <div className="crud-header">
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>

        {/* ✅ El botón solo aparece si NO estamos en crear/editar */}
        {!hideAddButton && onAddClick && (
          <button className="crud-add-btn" onClick={onAddClick}>
            ➕ Nuevo
          </button>
        )}
      </div>

      {/* Contenido principal (tabla, formularios, etc.) */}
      <div className="crud-content">
        {children}
      </div>
    </div>
  );
}
