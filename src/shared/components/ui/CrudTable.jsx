import React from "react";
import "../../../shared/styles/components/crud-table.css";

export default function UnifiedCrudTable({ 
  columns = [], 
  data = [], 
  actions = [],
  emptyMessage = "No hay registros.",
  loading = false 
}) {
  if (loading) {
    return (
      <div className="unified-crud-container">
        <div className="unified-no-data">
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="unified-crud-container">
      <table className="unified-table" aria-label="Tabla de datos">
        <thead>
          <tr>
            {columns.map(col => (
              col.field === "id" ? null : (
                <th key={col.field}>{col.header}</th>
              )
            ))}
            {actions && actions.length > 0 && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {(!data || data.length === 0) ? (
            <tr>
              <td 
                colSpan={
                  columns.filter(col => col.field !== "id").length + 
                  (actions && actions.length > 0 ? 1 : 0)
                } 
                style={{ textAlign: "center", padding: "40px" }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => (
                  col.field === "id" ? null : (
                    <td key={col.field}>
                      {typeof col.render === "function" 
                        ? col.render(row) 
                        : row[col.field]
                      }
                    </td>
                  )
                ))}
                {actions && actions.length > 0 && (
                  <td className="unified-actions">
                    {actions.map((action, idx) => (
                      <button
                        key={idx}
                        className={`unified-action-btn unified-btn-${action.type}`}
                        onClick={() => action.onClick?.(row)}
                        disabled={action.disabled?.(row)}
                        title={action.title}
                        type="button"
                      >
                        {action.icon && <span>{action.icon}</span>}
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}