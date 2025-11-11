// src/shared/components/ui/CrudTable.jsx
// Tabla genérica que soporta columnas simples y columnas con "render" (función).
import React from "react";
/* IMPORTA CSS desde tu carpeta de estilos compartida (ajusta la ruta si la tienes en otro sitio) */
import "/src/shared/styles/components/crud-table.css";

export default function CrudTable({ columns = [], data = [], actions = [] }) {
  return (
    <div className="table-responsive-container">
      <table className="crud-table" aria-label="Tabla genérica">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.field || col.header}>{col.header}</th>
            ))}
            {actions && actions.length > 0 && <th>Acciones</th>}
          </tr>
        </thead>

        <tbody>
          {(!data || data.length === 0) ? (
            <tr>
              <td colSpan={(columns.length) + (actions && actions.length > 0 ? 1 : 0)} style={{ textAlign: "center", padding: 24 }}>
                No hay registros.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id ?? JSON.stringify(row)}>
                {columns.map((col) => (
                  <td key={col.field || col.header}>
                    {typeof col.render === "function" ? col.render(row) : row[col.field]}
                  </td>
                ))}

                {actions && actions.length > 0 && (
                  <td className="actions">
                    {actions.map((action, idx) => (
                      <button
                        key={idx}
                        className={`crud-action-btn crud-${action.type}`}
                        onClick={() => action.onClick?.(row)}
                        type="button"
                      >
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
