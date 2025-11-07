import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import "../../../shared/styles/components/CrudLayout.css";

export default function Products() {
  const handleAddProducto = () => {
    alert("Agregar nuevo producto");
  };

  return (
    <CrudLayout
      title="📦 Productos"
      description="Administra el inventario de productos de la óptica."
      onAddClick={handleAddProducto}
    >
      <div className="crud-center">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio Venta</th>
              <th>Precio Compra</th>
              <th>Stock Actual</th>
              <th>Stock Mínimo</th>
              <th>Categoría</th>
              <th>Marca</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Lente Solar Ray-Ban Aviator</td>
              <td>$150,000</td>
              <td>$90,000</td>
              <td>25</td>
              <td>5</td>
              <td>Lentes de Sol</td>
              <td>Ray-Ban</td>
              <td><span className="status-active">Activo</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Ver imágenes">🖼️</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Montura Acetato Negro</td>
              <td>$80,000</td>
              <td>$45,000</td>
              <td>15</td>
              <td>3</td>
              <td>Monturas</td>
              <td>Oakley</td>
              <td><span className="status-active">Activo</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Ver imágenes">🖼️</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Lentes de Contacto Diarios</td>
              <td>$120,000</td>
              <td>$75,000</td>
              <td>8</td>
              <td>10</td>
              <td>Lentes de Contacto</td>
              <td>Johnson & Johnson</td>
              <td><span className="status-inactive">Bajo Stock</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Ver imágenes">🖼️</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Estuche para Lentes</td>
              <td>$25,000</td>
              <td>$12,000</td>
              <td>30</td>
              <td>5</td>
              <td>Accesorios</td>
              <td>Generic</td>
              <td><span className="status-active">Activo</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Ver imágenes">🖼️</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CrudLayout>
  );
}