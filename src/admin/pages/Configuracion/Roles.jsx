import CrudLayout from "../../components/CrudLayout";
import "../../styles/CrudLayout.css";

export default function Roles() {
  const handleAddRole = () => {
    alert("Agregar nuevo rol");
  };

  return (
    <CrudLayout
      title="👥 Roles"
      description="Administra los roles del sistema y sus permisos asociados."
      onAddClick={handleAddRole}
    >
      {/* CONTENEDOR RESPONSIVE MEJORADO */}
      <div className="table-responsive-container">
        <div className="crud-center">
          <table className="crud-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Administrador</td>
                <td>Acceso total al sistema con todos los permisos disponibles para gestionar toda la óptica</td>
                <td className="actions">
                  <button title="Editar">✏️</button>
                  <button title="Eliminar">🗑️</button>
                </td>
              </tr>
              <tr>
                <td>Vendedor</td>
                <td>Gestiona ventas, clientes y procesos comerciales de la óptica</td>
                <td className="actions">
                  <button title="Editar">✏️</button>
                  <button title="Eliminar">🗑️</button>
                </td>
              </tr>
              <tr>
                <td>Optometrista</td>
                <td>Administra servicios médicos, agenda de citas y exámenes visuales</td>
                <td className="actions">
                  <button title="Editar">✏️</button>
                  <button title="Eliminar">🗑️</button>
                </td>
              </tr>
              <tr>
                <td>Recepcionista</td>
                <td>Atención al cliente, gestión de citas y apoyo administrativo</td>
                <td className="actions">
                  <button title="Editar">✏️</button>
                  <button title="Eliminar">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </CrudLayout>
  );
}