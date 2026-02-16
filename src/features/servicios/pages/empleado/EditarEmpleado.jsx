import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmpleadoForm from "./components/empleadosForm";

import {
  getEmpleadoById,
  updateEmpleado,
} from "../../../../lib/data/empleadosData";

export default function EditarEmpleado() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================
  // Cargar empleado (API)
  // ============================
  useEffect(() => {
    const cargarEmpleado = async () => {
      const empleadoData = await getEmpleadoById(Number(id));

      if (!empleadoData) {
        navigate("/admin/servicios/empleados");
        return;
      }

      setEmpleado(empleadoData);
      setLoading(false);
    };

    cargarEmpleado();
  }, [id, navigate]);

  // ============================
  // Guardar cambios
  // ============================
  const handleUpdate = async (data) => {
    const empleadoActualizado = {
      nombre: data.nombre,
      tipoDocumento: data.tipoDocumento,
      numero_documento: data.numero_documento,
      telefono: data.telefono,
      correo: data.correo,
      direccion: data.direccion,
      fecha_ingreso: data.fecha_ingreso,
      cargo: data.cargo,
      estado: data.estado ?? empleado.estado,
    };

    await updateEmpleado(Number(id), empleadoActualizado);
    navigate("/admin/servicios/empleados");
  };

  if (loading) return null;

  return (
    <EmpleadoForm
      mode="edit"
      title="Editar Empleado"
      initialData={empleado}
      onSubmit={handleUpdate}
      onCancel={() => navigate("/admin/servicios/empleados")}
    />
  );
}