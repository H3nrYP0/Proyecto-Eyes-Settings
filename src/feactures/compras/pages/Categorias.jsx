import CrudLayout from "../../../shared/componets/layouts/CrudLayout";
import "../../styles/CrudLayout.css";

export default function Categorias() {
  const handleAddCategoria = () => {
    alert("Agregar nueva categoría");
  };

  return (
    <CrudLayout
      title="📁 Categorías de Productos"
      description="Administra las categorías para organizar los productos de la óptica."
      onAddClick={handleAddCategoria}
    >
      <div className="crud-center">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Productos Asociados</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Lentes de Sol</td>
              <td>Lentes para protección solar con diferentes estilos y marcas</td>
              <td>15 productos</td>
              <td><span className="status-active">Activa</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Ver productos">📦</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Lentes de Contacto</td>
              <td>Lentes de contacto de diferentes tipos y duración</td>
              <td>8 productos</td>
              <td><span className="status-active">Activa</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Ver productos">📦</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Monturas</td>
              <td>Armazones para lentes oftálmicos en diversos materiales</td>
              <td>22 productos</td>
              <td><span className="status-active">Activa</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Ver productos">📦</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Accesorios</td>
              <td>Estuches, líquidos de limpieza y otros accesorios</td>
              <td>12 productos</td>
              <td><span className="status-active">Activa</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Ver productos">📦</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Lentes Oftálmicos</td>
              <td>Lentes con graduación para monturas</td>
              <td>18 productos</td>
              <td><span className="status-active">Activa</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Ver productos">📦</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CrudLayout>
  );
}