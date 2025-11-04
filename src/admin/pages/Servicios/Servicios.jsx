import CrudLayout from "../../components/CrudLayout";
import "../../styles/CrudLayout.css";

export default function Servicios() {
  const handleAddServicio = () => {
    alert("Agregar nuevo servicio");
  };

  return (
    <CrudLayout
      title="🛠️ Servicios"
      description="Administra los servicios optométricos ofrecidos por la óptica."
      onAddClick={handleAddServicio}
    >
      <div className="crud-center">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Duración (min)</th>
              <th>Precio</th>
              <th>Empleado</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Examen de la Vista</td>
              <td>Examen completo de agudeza visual</td>
              <td>30</td>
              <td>$50,000</td>
              <td>Dr. Carlos Méndez</td>
              <td><span className="status-active">Activo</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Adaptación Lentes de Contacto</td>
              <td>Primera adaptación y enseñanza de uso</td>
              <td>45</td>
              <td>$80,000</td>
              <td>Dra. Ana Rodríguez</td>
              <td><span className="status-active">Activo</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Limpieza y Ajuste de Monturas</td>
              <td>Mantenimiento y ajuste de armazones</td>
              <td>15</td>
              <td>$15,000</td>
              <td>Técnico Javier López</td>
              <td><span className="status-active">Activo</span></td>
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