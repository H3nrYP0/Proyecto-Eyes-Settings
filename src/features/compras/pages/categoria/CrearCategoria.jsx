import { useNavigate } from "react-router-dom";
import CategoriaForm from "./components/categoriasForm"; // ajusta la ruta si es necesario
import { createCategoria } from "../../../../lib/data/categoriasData";

export default function CrearCategoria() {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    // Agregamos estado por defecto a la categoría nueva
    const categoriaConEstado = {
      ...data,
      estado: "activa",
    };

    await createCategoria(categoriaConEstado);
    navigate("/admin/compras/categorias");
  };

  return (
    <CategoriaForm
      mode="create"
      title="Crear Nueva Categoría"
      onSubmit={handleCreate}
      onCancel={() => navigate("/admin/compras/categorias")}
    />
  );
}
