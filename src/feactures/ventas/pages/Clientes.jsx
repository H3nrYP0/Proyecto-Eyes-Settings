import CrudLayout from "../../../shared/componets/layouts/CrudLayout";
import "../../styles/CrudLayout.css";

export default function Clientes() {
  const handleAddCliente = () => {
    alert("Agregar nuevo cliente");
  };

  return (
    <CrudLayout
      title="👥 Clientes"
      description="Administra la información de los clientes de la óptica."
      onAddClick={handleAddCliente}
    >
      <div className="crud-center">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Documento</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Ciudad</th>
              <th>Fecha Nacimiento</th>
              <th>Género</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Laura</td>
              <td>Martínez</td>
              <td>123456789</td>
              <td>3001112233</td>
              <td>laura.m@email.com</td>
              <td>Bogotá</td>
              <td>1985-03-15</td>
              <td>Femenino</td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Ver historial">📊</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Roberto</td>
              <td>Silva</td>
              <td>987654321</td>
              <td>3104445566</td>
              <td>roberto.s@email.com</td>
              <td>Medellín</td>
              <td>1978-07-22</td>
              <td>Masculino</td>
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