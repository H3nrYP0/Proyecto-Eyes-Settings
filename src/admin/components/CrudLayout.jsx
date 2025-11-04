import "../styles/CrudLayout.css";

export default function CrudLayout({ title, description, onAddClick, children }) {
  return (
    <div className="crud-layout">
      {/* Header */}
      <div className="crud-header">
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        <button className="crud-add-btn" onClick={onAddClick}>
          ➕ Nuevo
        </button>
      </div>

      {/* Contenido principal (tabla, formularios, etc.) */}
      <div className="crud-content">
        {children}
      </div>
    </div>
  );
}