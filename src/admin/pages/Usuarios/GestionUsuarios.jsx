import CrudLayout from "../../components/CrudLayout";
import "../../styles/CrudLayout.css";

export default function GestionUsuarios() {
  const handleAddUsuario = () => {
    alert("Agregar nuevo usuario");
  };

  return (
    <CrudLayout
      title="👥 Gestión de Usuarios"
      description="Administra los usuarios del sistema y sus roles."
      onAddClick={handleAddUsuario}
    >
      <div className="crud-center">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Documento</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Juan</td>
              <td>Pérez</td>
              <td>juan.perez@visualoutlet.com</td>
              <td>3001234567</td>
              <td>123456789</td>
              <td>Administrador</td>
              <td><span className="status-active">Activo</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Resetear contraseña">🔐</button>
                <button title="Desactivar">⏸️</button>
              </td>
            </tr>
            <tr>
              <td>María</td>
              <td>González</td>
              <td>maria.gonzalez@visualoutlet.com</td>
              <td>3007654321</td>
              <td>987654321</td>
              <td>Vendedor</td>
              <td><span className="status-active">Activo</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Resetear contraseña">🔐</button>
                <button title="Desactivar">⏸️</button>
              </td>
            </tr>
            <tr>
              <td>Carlos</td>
              <td>Méndez</td>
              <td>carlos.mendez@visualoutlet.com</td>
              <td>3201112233</td>
              <td>456789123</td>
              <td>Optometrista</td>
              <td><span className="status-active">Activo</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Resetear contraseña">🔐</button>
                <button title="Desactivar">⏸️</button>
              </td>
            </tr>
            <tr>
              <td>Ana</td>
              <td>Rodríguez</td>
              <td>ana.rodriguez@visualoutlet.com</td>
              <td>3104445566</td>
              <td>789123456</td>
              <td>Optometrista</td>
              <td><span className="status-active">Activo</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Resetear contraseña">🔐</button>
                <button title="Desactivar">⏸️</button>
              </td>
            </tr>
            <tr>
              <td>Javier</td>
              <td>López</td>
              <td>javier.lopez@visualoutlet.com</td>
              <td>3157778899</td>
              <td>321654987</td>
              <td>Técnico</td>
              <td><span className="status-inactive">Inactivo</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Resetear contraseña">🔐</button>
                <button title="Activar">✅</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CrudLayout>
  );
}