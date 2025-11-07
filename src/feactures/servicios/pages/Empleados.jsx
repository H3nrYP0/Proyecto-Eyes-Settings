import CrudLayout from "../../../shared/componets/layouts/CrudLayout";
import "../../styles/CrudLayout.css";

export default function Empleados() {
  const handleAddEmpleado = () => {
    alert("Agregar nuevo empleado");
  };

  return (
    <CrudLayout
      title="💼 Empleados"
      description="Administra la información del personal de la óptica."
      onAddClick={handleAddEmpleado}
    >
      <div className="crud-center">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Documento</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Fecha Ingreso</th>
              <th>Género</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Carlos Méndez</td>
              <td>123456789</td>
              <td>3001112233</td>
              <td>Optometrista</td>
              <td>2023-01-15</td>
              <td>Masculino</td>
              <td><span className="status-active">Activo</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Ana Rodríguez</td>
              <td>987654321</td>
              <td>3104445566</td>
              <td>Optometrista</td>
              <td>2023-03-20</td>
              <td>Femenino</td>
              <td><span className="status-active">Activo</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Javier López</td>
              <td>456789123</td>
              <td>3207778899</td>
              <td>Técnico</td>
              <td>2023-02-10</td>
              <td>Masculino</td>
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