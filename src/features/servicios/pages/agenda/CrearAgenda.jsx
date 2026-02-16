import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import HorarioForm from "./components/HorarioForm";
import { createAgenda, getEmpleados } from "../../../../lib/data/agendaData";

export default function CrearAgenda() {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    const data = await getEmpleados();
    setEmpleados(data || []);
  };

  const handleCreate = async (data) => {
    await createAgenda(data);
    navigate("/admin/servicios/agenda");
  };

  return (
    <HorarioForm
      mode="create"
      title="Crear Nuevo Horario"
      empleados={empleados}
      onSubmit={handleCreate}
      onCancel={() => navigate("/admin/servicios/agenda")}
    />
  );
}
