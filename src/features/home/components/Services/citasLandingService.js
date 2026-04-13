// citasLandingService.js
// Servicio de citas para el Landing Page
// Llama directamente a la API pública — sin axios interno del admin

const BASE_URL = "https://optica-api-vad8.onrender.com";

const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = data?.error || data?.mensaje || `Error ${res.status}`;
    throw Object.assign(new Error(msg), { status: res.status, data });
  }
  return data;
};

// ── SERVICIOS ─────────────────────────────────────────────
export async function getServiciosActivosLanding() {
  const servicios = await apiFetch("/servicios");
  return servicios
    .filter((s) => s.estado === true)
    .map((s) => ({
      id: s.id,
      nombre: s.nombre,
      descripcion: s.descripcion || "",
      duracion: s.duracion_min,
      precio: s.precio,
    }));
}

// ── EMPLEADOS ─────────────────────────────────────────────
export async function getEmpleadosActivosLanding() {
  const empleados = await apiFetch("/empleados");
  return empleados
    .filter((e) => e.estado === true)
    .map((e) => ({
      id: e.id,
      nombre: e.nombre,
      cargo: e.cargo || "Optómetra",
    }));
}

// ── ESTADOS DE CITA ───────────────────────────────────────
export async function getEstadosCitaLanding() {
  return await apiFetch("/estado-cita");
}

// ── CLIENTES ──────────────────────────────────────────────
export async function buscarClientePorDocumento(numeroDocumento) {
  try {
    const clientes = await apiFetch("/clientes");
    return (
      clientes.find(
        (c) =>
          c.numero_documento === String(numeroDocumento).trim() &&
          c.estado === true
      ) || null
    );
  } catch {
    return null;
  }
}

export async function crearClienteLanding(data) {
  return await apiFetch("/clientes", {
    method: "POST",
    body: JSON.stringify({
      nombre: data.nombre.trim(),
      apellido: data.apellido.trim(),
      tipo_documento: data.tipo_documento || "CC",
      numero_documento: data.numero_documento.trim(),
      fecha_nacimiento: data.fecha_nacimiento,
      telefono: data.telefono?.trim() || undefined,
      correo: data.correo?.trim() || undefined,
    }),
  });
}

// ── DISPONIBILIDAD — una hora ─────────────────────────────
export async function verificarDisponibilidadLanding(empleadoId, fecha, hora, servicioId) {
  try {
    const params = new URLSearchParams({
      empleado_id: empleadoId,
      fecha,
      hora,
      servicio_id: servicioId,
    });
    const res = await fetch(`${BASE_URL}/verificar-disponibilidad?${params}`, {
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return data; // siempre tiene { disponible, mensaje }
  } catch {
    return { disponible: false, mensaje: "Error de red" };
  }
}

// ── DISPONIBILIDAD — todas las horas en paralelo ──────────
// Devuelve un Set<string> con las horas disponibles ("HH:MM")
export async function getHorasDisponibles(empleadoId, fecha, servicioId, todasLasHoras) {
  if (!empleadoId || !fecha || !servicioId) return new Set();

  const checks = await Promise.allSettled(
    todasLasHoras.map((hora) =>
      verificarDisponibilidadLanding(empleadoId, fecha, hora, servicioId)
    )
  );

  const disponibles = new Set();
  checks.forEach((r, i) => {
    if (r.status === "fulfilled" && r.value?.disponible === true) {
      disponibles.add(todasLasHoras[i]);
    }
  });
  return disponibles;
}

// ── CREAR CITA ────────────────────────────────────────────
export async function crearCitaLanding({
  clienteId, servicioId, empleadoId, estadoCitaId, fecha, hora,
}) {
  return await apiFetch("/citas", {
    method: "POST",
    body: JSON.stringify({
      cliente_id: clienteId,
      servicio_id: servicioId,
      empleado_id: empleadoId,
      estado_cita_id: estadoCitaId,
      fecha,
      hora,
      metodo_pago: null,
    }),
  });
}