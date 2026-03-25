import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCompraById, updateCompra } from "../../../lib/data/comprasData";
import ComprasForm from "../components/ComprasForm";

export default function EditarCompra() {
  const navigate = useNavigate();
  const { id }   = useParams();

  const [compra,  setCompra]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompraById(Number(id))
      .then((data) => {
        if (!data) { navigate("/admin/compras"); return; }
        setCompra(data);
      })
      .catch(() => navigate("/admin/compras"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!compra)  return null;

  const handleUpdate = async (data) => {
    await updateCompra(Number(id), data);
    navigate("/admin/compras");
  };

  return (
    <ComprasForm
      mode="edit"
      title={`Editar Compra — ${compra.numeroCompra}`}
      initialData={compra}
      onSubmit={handleUpdate}
      onCancel={() => navigate("/admin/compras")}
    />
  );
}