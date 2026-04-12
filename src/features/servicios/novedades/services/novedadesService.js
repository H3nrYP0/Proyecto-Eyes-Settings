import api from "../../../../lib/axios";

export async function getAllNovedades() {
  try {
    const res = await api.get("/novedades");
    return res.data;
  } catch (error) {
    console.error("Error cargando novedades:", error);
    return [];
  }
}

export async function getNovedadById(id) {
  try {
    const res = await api.get(`/novedades/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error cargando novedad:", error);
    return null;
  }
}

export async function getNovedadesByEmpleado(empleadoId) {
  try {
    const res = await api.get(`/novedades/empleado/${empleadoId}`);
    return res.data;
  } catch (error) {
    console.error("Error cargando novedades del empleado:", error);
    return [];
  }
}

export async function createNovedad(data) {
  const payload = {
    empleado_id: Number(data.empleado_id),
    fecha_inicio: data.fecha_inicio,
    fecha_fin: data.fecha_fin,
    hora_inicio: data.hora_inicio || null,
    hora_fin: data.hora_fin || null,
    tipo: data.tipo,
    motivo: data.motivo || null,
    activo: data.activo !== undefined ? data.activo : true,
  };

  try {
    const res = await api.post("/novedades", payload);
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error creando novedad:", error);
    const errorMsg = error.response?.data?.error || "Error al crear novedad";
    return { success: false, error: errorMsg };
  }
}

export async function updateNovedad(id, data) {
  const payload = {
    empleado_id: Number(data.empleado_id),
    fecha_inicio: data.fecha_inicio,
    fecha_fin: data.fecha_fin,
    hora_inicio: data.hora_inicio || null,
    hora_fin: data.hora_fin || null,
    tipo: data.tipo,
    motivo: data.motivo || null,
    activo: data.activo !== undefined ? data.activo : true,
  };

  try {
    const res = await api.put(`/novedades/${id}`, payload);
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error actualizando novedad:", error);
    const errorMsg = error.response?.data?.error || "Error al actualizar novedad";
    return { success: false, error: errorMsg };
  }
}

export async function deleteNovedad(id) {
  try {
    const res = await api.delete(`/novedades/${id}`);
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error eliminando novedad:", error);
    const errorMsg = error.response?.data?.error || "Error al eliminar novedad";
    return { success: false, error: errorMsg };
  }
}