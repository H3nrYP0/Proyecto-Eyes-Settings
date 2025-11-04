import CrudLayout from "../../components/CrudLayout";
import "../../styles/CrudLayout.css";

export default function GestionAcceso() {
  const handleAddAcceso = () => {
    alert("Configurar nuevo acceso");
  };

  return (
    <CrudLayout
      title="🔒 Gestión de Acceso"
      description="Administra los permisos y accesos de los usuarios del sistema."
      onAddClick={handleAddAcceso}
    >
      <div className="crud-center">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Módulos Acceso</th>
              <th>Último Acceso</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Juan Pérez</td>
              <td>Administrador</td>
              <td>Todos los módulos</td>
              <td>2024-01-20 09:15</td>
              <td><span className="status-active">Activo</span></td>
              <td className="actions">
                <button title="Editar permisos">🔑</button>
                <button title="Bloquear">🚫</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>María González</td>
              <td>Vendedor</td>
              <td>Ventas, Clientes, Productos</td>
              <td>2024-01-20 10:30</td>
              <td><span className="status-active">Activo</span></td>
              <td className="actions">
                <button title="Editar permisos">🔑</button>
                <button title="Bloquear">🚫</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Carlos Méndez</td>
              <td>Optometrista</td>
              <td>Servicios, Agenda, Clientes</td>
              <td>2024-01-19 16:45</td>
              <td><span className="status-inactive">Inactivo</span></td>
              <td className="actions">
                <button title="Editar permisos">🔑</button>
                <button title="Activar">✅</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Ana Rodríguez</td>
              <td>Optometrista</td>
              <td>Servicios, Agenda, Clientes</td>
              <td>2024-01-20 11:20</td>
              <td><span className="status-active">Activo</span></td>
              <td className="actions">
                <button title="Editar permisos">🔑</button>
                <button title="Bloquear">🚫</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CrudLayout>
  );
}