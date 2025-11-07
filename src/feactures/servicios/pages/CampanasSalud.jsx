import CrudLayout from "../../../shared/componets/layouts/CrudLayout";
import "../../styles/CrudLayout.css";

export default function CampanasSalud() {
  const handleAddCampana = () => {
    alert("Crear nueva campaña de salud");
  };

  return (
    <CrudLayout
      title="🏥 Campañas de Salud"
      description="Gestiona las campañas de salud visual y promociones especiales."
      onAddClick={handleAddCampana}
    >
      <div className="crud-center">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Descuento</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Chequeo Visual Gratuito</td>
              <td>Campaña de exámenes visuales sin costo</td>
              <td>2024-02-01</td>
              <td>2024-02-29</td>
              <td>100%</td>
              <td><span className="status-pending">Próxima</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Activar">🚀</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Descuento en Lentes de Sol</td>
              <td>Promoción especial en lentes de sol Ray-Ban</td>
              <td>2024-01-15</td>
              <td>2024-01-31</td>
              <td>20%</td>
              <td><span className="status-active">Activa</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Desactivar">⏸️</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Campaña Escolar</td>
              <td>Descuentos especiales para estudiantes</td>
              <td>2024-01-10</td>
              <td>2024-01-25</td>
              <td>15%</td>
              <td><span className="status-completed">Finalizada</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Reactivar">🔄</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CrudLayout>
  );
}