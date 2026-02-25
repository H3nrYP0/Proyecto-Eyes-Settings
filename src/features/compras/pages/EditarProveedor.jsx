import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProveedorForm from "../components/ProveedoresForm";
import { ProveedoresData } from "../../../lib/data/proveedoresData";

export default function EditarProveedor() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [proveedor, setProveedor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ProveedoresData.getProveedorById(Number(id))
      .then(setProveedor)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (data) => {
    try {
      await ProveedoresData.updateProveedor(Number(id), data);
      navigate("/admin/compras/proveedores");
    } catch (error) {
      console.error("Error al actualizar proveedor:", error);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!proveedor) return <div>Proveedor no encontrado.</div>;

  return (
    <ProveedorForm
      mode="edit"
      title={`Editar Proveedor: ${proveedor.razonSocial}`}
      initialData={proveedor}
      onSubmit={handleUpdate}
      onCancel={() => navigate("/admin/compras/proveedores")}
    />
  );
}