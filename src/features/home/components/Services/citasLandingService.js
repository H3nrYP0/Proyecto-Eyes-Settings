// Servicio de citas para el Landing Page.
// Las funciones públicas usan fetch; las autenticadas usan axios (con interceptor).

import api from "@lib/axios";

const BASE_URL = 'https://optica-api-vad8.onrender.com';

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
    const docBuscado = String(numeroDocumento).trim();
    return (
      clientes.find((c) => {
        const docCliente = String(c.numero_documento).trim();
        return docCliente === docBuscado && c.estado === true;
      }) || null
    );
  } catch (err) {
    console.error("Error en buscarClientePorDocumento:", err);
    return null;
  }
}

export async function crearClienteLanding(data) {
  const response = await apiFetch("/clientes", {
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
  if (response.success === false) {
    throw new Error(response.error || "Error al registrar cliente");
  }
  return response;
}

// ── HORARIOS DE EMPLEADOS ─────────────────────────────────
export async function getHorariosDeEmpleados(empleadosIds) {
  if (!empleadosIds || !empleadosIds.length) return {};
  
  const resultados = await Promise.allSettled(
    empleadosIds.map(async (id) => {
      const res = await fetch(`${BASE_URL}/horarios/empleado/${id}`);
      const data = await res.json();
      return { id, horarios: Array.isArray(data) ? data : [] };
    })
  );
  
  const horariosPorEmpleado = {};
  resultados.forEach((r) => {
    if (r.status === "fulfilled") {
      horariosPorEmpleado[r.value.id] = r.value.horarios;
    } else {
      horariosPorEmpleado[r.value?.id] = [];
    }
  });
  return horariosPorEmpleado;
}

// ── NOVEDADES DE EMPLEADOS ─────────────────────────────────
export async function getNovedadesDeEmpleados(empleadosIds) {
  if (!empleadosIds || !empleadosIds.length) return {};
  
  const resultados = await Promise.allSettled(
    empleadosIds.map(async (id) => {
      const res = await fetch(`${BASE_URL}/novedades/empleado/${id}`);
      const data = await res.json();
      return { id, novedades: Array.isArray(data) ? data : [] };
    })
  );
  
  const novedadesPorEmpleado = {};
  resultados.forEach((r) => {
    if (r.status === "fulfilled") {
      novedadesPorEmpleado[r.value.id] = r.value.novedades;
    } else {
      novedadesPorEmpleado[r.value?.id] = [];
    }
  });
  return novedadesPorEmpleado;
}

// ── GENERAR HORAS POSIBLES ─────────────────────────────────
export function generarHorasPosibles(duracionMinutos = 30, horarioInicio = "08:00", horarioFin = "18:00") {
  const horas = [];
  const [inicioH, inicioM] = horarioInicio.split(':').map(Number);
  const [finH, finM] = horarioFin.split(':').map(Number);
  const inicio = inicioH * 60 + inicioM;
  const fin = finH * 60 + finM;
  for (let minutos = inicio; minutos + duracionMinutos <= fin; minutos += 30) {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    horas.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
  }
  return horas;
}

// ── VERIFICAR DISPONIBILIDAD (una hora, un empleado) ───────
export async function verificarDisponibilidadLanding(empleadoId, fecha, hora, servicioId, duracion) {
  try {
    const params = new URLSearchParams({
      empleado_id: empleadoId,
      fecha,
      hora,
      servicio_id: servicioId,
      duracion: duracion,
    });
    const res = await fetch(`${BASE_URL}/verificar-disponibilidad?${params}`, {
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return data;
  } catch {
    return { disponible: false, mensaje: "Error de red" };
  }
}

// ── DISPONIBILIDAD MÚLTIPLE (NUEVO ENDPOINT OPTIMIZADO) ────
export async function getHorasDisponiblesMultiple(servicioId, fecha, intervaloMinutos = 30, empleadosIds = null) {
  if (!servicioId || !fecha) return { horasMap: new Map(), horasSet: new Set() };

  const params = new URLSearchParams({
    servicio_id: servicioId,
    fecha: fecha,
    intervalo_minutos: intervaloMinutos,
  });
  
  if (empleadosIds && empleadosIds.length > 0) {
    params.append('empleados_ids', empleadosIds.join(','));
  }

  try {
    const res = await fetch(`${BASE_URL}/verificar-disponibilidad-multiple?${params}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `Error ${res.status}`);
    }
    const data = await res.json();
    const horasMap = new Map();
    const horasSet = new Set();
    
    if (data.horas_disponibles && Array.isArray(data.horas_disponibles)) {
      data.horas_disponibles.forEach(item => {
        horasMap.set(item.hora, item.empleado_id);
        horasSet.add(item.hora);
      });
    }
    
    const hoy = new Date();
    const hoyStr = hoy.toISOString().split('T')[0];
    const esHoy = fecha === hoyStr;
    if (esHoy) {
      const ahora = new Date();
      const horasFiltradasMap = new Map();
      const horasFiltradasSet = new Set();
      horasMap.forEach((empleadoId, hora) => {
        const [h, m] = hora.split(':');
        const horaDate = new Date();
        horaDate.setHours(parseInt(h), parseInt(m), 0, 0);
        if (horaDate > ahora) {
          horasFiltradasMap.set(hora, empleadoId);
          horasFiltradasSet.add(hora);
        }
      });
      return { horasMap: horasFiltradasMap, horasSet: horasFiltradasSet };
    }
    
    return { horasMap, horasSet };
  } catch (error) {
    console.error("Error en getHorasDisponiblesMultiple:", error);
    return { horasMap: new Map(), horasSet: new Set() };
  }
}

// ── CREAR CITA (para cliente autenticado) ──────────────────
export async function crearCitaLanding(data) {
  // Usamos api (axios) que ya incluye el token automáticamente
  const response = await api.post('/cliente/citas', {
    servicio_id: data.servicioId,
    empleado_id: data.empleadoId,
    fecha: data.fecha,
    hora: data.hora,
    metodo_pago: data.metodo_pago || null,
  });
  return response.data;
}

// ── OBTENER PERFIL DEL CLIENTE LOGUEADO ──────────────────
export async function getMiPerfil() {
  const response = await api.get('/cliente/perfil');
  return response.data;
}

// ── OBTENER CITAS DEL CLIENTE LOGUEADO ──────────────────
export async function getMisCitas() {
  const response = await api.get('/cliente/citas');
  return response.data;
}

// ── CANCELAR UNA CITA ───────────────────────────────────
export async function cancelarCita(citaId) {
  const response = await api.delete(`/cliente/citas/${citaId}`);
  return response.data;
}

// Las siguientes funciones permanecen con fetch por simplicidad (son públicas o legacy)
// (getHorasDisponibles, getHorasDisponiblesPorEmpleado, verificarDisponibilidadConHorario, getHorasDisponiblesConHorario, getEmpleadoDisponible)
// No se modifican porque no requieren autenticación.