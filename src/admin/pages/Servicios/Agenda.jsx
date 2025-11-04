import CrudLayout from "../../components/CrudLayout";
import "../../styles/CrudLayout.css";

export default function Agenda() {
  const handleAddCita = () => {
    alert("Agendar nueva cita");
  };

  return (
    <CrudLayout
      title="📅 Agenda"
      description="Gestiona las citas y appointments de los clientes."
      onAddClick={handleAddCita}
    >
      <div className="crud-center">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Duración</th>
              <th>Método Pago</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Laura Martínez</td>
              <td>Examen de la Vista</td>
              <td>2024-01-20</td>
              <td>09:00 AM</td>
              <td>30 min</td>
              <td>Efectivo</td>
              <td><span className="status-pending">Pendiente</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Confirmar">✅</button>
                <button title="Cancelar">❌</button>
              </td>
            </tr>
            <tr>
              <td>Roberto Silva</td>
              <td>Adaptación Lentes de Contacto</td>
              <td>2024-01-19</td>
              <td>02:30 PM</td>
              <td>45 min</td>
              <td>Tarjeta Crédito</td>
              <td><span className="status-completed">Completada</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Ver detalle">👁️</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>María González</td>
              <td>Limpieza y Ajuste</td>
              <td>2024-01-18</td>
              <td>11:00 AM</td>
              <td>15 min</td>
              <td>Efectivo</td>
              <td><span className="status-cancelled">Cancelada</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Reagendar">🔄</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CrudLayout>
  );
}