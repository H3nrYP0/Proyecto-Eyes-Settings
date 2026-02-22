import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCompraById, updateCompra } from "../../../lib/data/comprasData";
import ComprasForm from "../components/ComprasForm";

export default function EditarCompra() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [compra, setCompra] = useState(null);

  useEffect(() => {
    const data = getCompraById(Number(id));
    if (!data) {
      navigate("/admin/compras");
      return;
    }
    setCompra(data);
  }, [id]);

  if (!compra) {
    return <div>Cargando...</div>;
  }

  const handleUpdate = (data) => {
    updateCompra(Number(id), data);
    navigate("/admin/compras");
  };

  return (
    <ComprasForm
      mode="edit"
      title={`Editar Compra #${compra.id}`}
      initialData={compra}
      onSubmit={handleUpdate}
      onCancel={() => navigate("/admin/compras")}
    />
  );
}