import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import "../../../shared/styles/components/CrudLayout.css";

export default function Abonos() {
  const handleAddAbono = () => {
    alert("Registrar nuevo abono");
  };

  return (
    <CrudLayout
      title="💳 Abonos"
      description="Gestiona los abonos y pagos a crédito de los clientes."
      onAddClick={handleAddAbono}
    >
      <div className="crud-center">
        <table className="crud-table">
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>Cliente</th>
              <th>Fecha Abono</th>
              <th>Monto Abonado</th>
              <th>Saldo Pendiente</th>
              <th>Método Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#V001</td>
              <td>Laura Martínez</td>
              <td>2024-01-15</td>
              <td>$150,000</td>
              <td>$200,000</td>
              <td>Efectivo</td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Ver historial">📊</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>#V002</td>
              <td>Roberto Silva</td>
              <td>2024-01-14</td>
              <td>$100,000</td>
              <td>$180,000</td>
              <td>Transferencia</td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Ver historial">📊</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>#V001</td>
              <td>Laura Martínez</td>
              <td>2024-01-20</td>
              <td>$100,000</td>
              <td>$100,000</td>
              <td>Tarjeta Débito</td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Ver historial">📊</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CrudLayout>
  );
}