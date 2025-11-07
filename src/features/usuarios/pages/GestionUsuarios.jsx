import CrudLayout from "../../../shared/components/layouts/CrudLayout";
import "../../../shared/styles/components/CrudLayout.css";

export default function GestionUsuarios() {
  const handleAddUsuario = () => {
    alert("Agregar nuevo usuario");
  };

  return (
    <CrudLayout
      title="👥 Gestión de Usuarios"
      description="Administra los usuarios del sistema de la óptica."
      onAddClick={handleAddUsuario}
    >
      <div className="crud-center">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Fecha Registro</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Juan Pérez</td>
              <td>juan@visualoutlet.com</td>
              <td>Administrador</td>
              <td>2024-01-15</td>
              <td><span className="status-active">Activo</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>María González</td>
              <td>maria@visualoutlet.com</td>
              <td>Vendedor</td>
              <td>2024-01-10</td>
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