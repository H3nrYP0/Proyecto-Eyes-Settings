import CrudLayout from "../../../shared/componets/layouts/CrudLayout";
import "../../styles/CrudLayout.css";

export default function Compras() {
  const handleAddCompra = () => {
    alert("Registrar nueva compra");
  };

  return (
    <CrudLayout
      title="💰 Compras"
      description="Registra y gestiona las compras de productos a proveedores."
      onAddClick={handleAddCompra}
    >
      <div className="crud-center">
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
            <tr>
              <td>#001</td>
              <td>Optical Supplies S.A.S.</td>
              <td>2024-01-15</td>
              <td>$2,500,000</td>
              <td><span className="status-active">Completada</span></td>
              <td>Pedido regular de lentes</td>
              <td className="actions">
                <button title="Ver detalle">👁️</button>
                <button title="Editar">✏️</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>#002</td>
              <td>Lentes Premium</td>
              <td>2024-01-10</td>
              <td>$1,800,000</td>
              <td><span className="status-active">Completada</span></td>
              <td>Monturas de acetato</td>
              <td className="actions">
                <button title="Ver detalle">👁️</button>
                <button title="Editar">✏️</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CrudLayout>
  );
}