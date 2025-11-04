import CrudLayout from "../../components/CrudLayout";
import "../../styles/CrudLayout.css";

export default function Proveedores() {
  const handleAddProveedor = () => {
    alert("Agregar nuevo proveedor");
  };

  return (
    <CrudLayout
      title="🚚 Proveedores"
      description="Administra los proveedores de productos para la óptica."
      onAddClick={handleAddProveedor}
    >
      <div className="crud-center">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Razón Social</th>
              <th>NIT</th>
              <th>Contacto</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Ciudad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Persona Jurídica</td>
              <td>Optical Supplies S.A.S.</td>
              <td>900123456-7</td>
              <td>Carlos Rodríguez</td>
              <td>6013456789</td>
              <td>ventas@opticalsupplies.com</td>
              <td>Bogotá</td>
              <td><span className="status-active">Activo</span></td>
              <td className="actions">
                <button title="Editar">✏️</button>
                <button title="Eliminar">🗑️</button>
              </td>
            </tr>
            <tr>
              <td>Persona Natural</td>
              <td>Lentes Premium</td>
              <td>123456789-0</td>
              <td>María García</td>
              <td>3009876543</td>
              <td>info@lentespremium.com</td>
              <td>Medellín</td>
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