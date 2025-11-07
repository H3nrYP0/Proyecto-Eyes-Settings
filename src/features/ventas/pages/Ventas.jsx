import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import "../../../shared/styles/components/CrudLayout.css";

export default function Ventas() {
  const handleAddVenta = () => {
    alert("Registrar nueva venta");
  };

  return (
    <CrudLayout
      title="💸 Ventas"
      description="Gestiona las ventas de productos y servicios de la óptica."
      onAddClick={handleAddVenta}
    >
      <div className="crud-center">
        <table className="crud-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Método Pago</th>
              <th>Total</th>
              <th>Empleado</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#V001</td>
              <td>Laura Martínez</td>
              <td>2024-01-15</td>
              <td>Tarjeta Débito</td>
              <td>$350,000</td>
              <td>Ana Rodríguez</td>
              <td><span className="status-completed">Completada</span></td>
              <td className="actions">
                <button title="Ver detalle">👁️</button>
                <button title="Editar">✏️</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>#V002</td>
              <td>Roberto Silva</td>
              <td>2024-01-14</td>
              <td>Efectivo</td>
              <td>$280,000</td>
              <td>Carlos Méndez</td>
              <td><span className="status-completed">Completada</span></td>
              <td className="actions">
                <button title="Ver detalle">👁️</button>
                <button title="Editar">✏️</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>#V003</td>
              <td>María González</td>
              <td>2024-01-13</td>
              <td>Transferencia</td>
              <td>$420,000</td>
              <td>Javier López</td>
              <td><span className="status-pending">Pendiente</span></td>
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