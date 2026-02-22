import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import HorarioForm from "./components/HorarioForm";
import { createAgenda } from "../../../../lib/data/agendaData";
import { getAllEmpleados } from "../../../../lib/data/empleadosData"; // ← CORREGIDO

export default function CrearAgenda() {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    const data = await getAllEmpleados(); // ← USAR getAllEmpleados
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