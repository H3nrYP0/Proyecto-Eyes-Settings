import CrudLayout from "../../components/CrudLayout";
import "../../styles/CrudLayout.css";

export default function Pedidos() {
  const handleAddPedido = () => {
    alert("Crear nuevo pedido");
  };

  return (
    <CrudLayout
      title="📋 Pedidos"
      description="Gestiona los pedidos especiales y órdenes de trabajo."
      onAddClick={handleAddPedido}
    >
      <div className="crud-center">
        <table className="crud-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Producto/Servicio</th>
              <th>Fecha Pedido</th>
              <th>Fecha Entrega</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#P001</td>
              <td>Laura Martínez</td>
              <td>Lentes Progresivos</td>
              <td>2024-01-15</td>
              <td>2024-01-22</td>
              <td>$450,000</td>
              <td><span className="status-pending">En Proceso</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Completar">✅</button>
                <button title="Cancelar">❌</button>
              </td>
            </tr>
            <tr>
              <td>#P002</td>
              <td>Roberto Silva</td>
              <td>Montura Especial</td>
              <td>2024-01-14</td>
              <td>2024-01-21</td>
              <td>$320,000</td>
              <td><span className="status-completed">Entregado</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Ver detalle">👁️</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>#P003</td>
              <td>María González</td>
              <td>Lentes Fotocromáticos</td>
              <td>2024-01-13</td>
              <td>2024-01-25</td>
              <td>$380,000</td>
              <td><span className="status-pending">Pendiente</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Iniciar">🚀</button>
                <button title="Cancelar">❌</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CrudLayout>
  );
}