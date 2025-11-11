// Componente de tabla reutilizable para módulos CRUD
// Renderiza una tabla simple basada en columnas, datos y acciones
// Autor: (Tu nombre) - Proyecto Eyes Settings



export default function CrudTable({ columns, data, actions }) {
  return (
    <div className="crud-table-container">
      <table className="crud-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.field}>{col.header}</th>
            ))}
            {actions && <th>Acciones</th>}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="no-data">
                No hay datos para mostrar
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col.field}>{row[col.field]}</td>
                ))}

                {actions && (
                  <td className="crud-actions">
                    {actions.map((action, i) => (
                      <button
                        key={i}
                        className={`crud-action-btn ${action.type}`}
                        onClick={() => action.onClick(row)}
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
