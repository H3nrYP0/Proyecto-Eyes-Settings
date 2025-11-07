import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import "../../../shared/styles/components/CrudLayout.css"; 

export default function Horarios() {
  const handleAddHorario = () => {
    alert("Agregar nuevo horario");
  };

  return (
    <CrudLayout
      title="⏰ Horarios"
      description="Gestiona los horarios de trabajo del personal de la óptica."
      onAddClick={handleAddHorario}
    >
      <div className="crud-center">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Empleado</th>
              <th>Día</th>
              <th>Hora Inicio</th>
              <th>Hora Final</th>
              <th>Duración</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Carlos Méndez</td>
              <td>Lunes a Viernes</td>
              <td>08:00 AM</td>
              <td>05:00 PM</td>
              <td>9 horas</td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Ana Rodríguez</td>
              <td>Lunes a Sábado</td>
              <td>09:00 AM</td>
              <td>06:00 PM</td>
              <td>9 horas</td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Javier López</td>
              <td>Martes a Domingo</td>
              <td>10:00 AM</td>
              <td>07:00 PM</td>
              <td>9 horas</td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Carlos Méndez</td>
              <td>Sábado</td>
              <td>08:00 AM</td>
              <td>12:00 PM</td>
              <td>4 horas</td>
              <td className="actions">
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