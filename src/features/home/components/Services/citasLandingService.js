// citasLandingService.js
// Servicio de citas para el Landing Page
// Llama directamente a la API pública — sin axios interno del admin

// citasLandingService.js
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
  // Si el backend responde con success: false, lanzar error
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
// Devuelve un Map<hora, empleadoId> y un Set de horas disponibles
// Este endpoint es más eficiente porque el backend hace toda la lógica
export async function getHorasDisponiblesMultiple(servicioId, fecha, intervaloMinutos = 30, empleadosIds = null) {
  if (!servicioId || !fecha) return { horasMap: new Map(), horasSet: new Set() };

  const params = new URLSearchParams({
    servicio_id: servicioId,
    fecha: fecha,
    intervalo_minutos: intervaloMinutos,
  });
  
  // Opcional: filtrar por empleados específicos
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
    
    // Si la fecha es hoy, filtrar horas pasadas
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

// ── DISPONIBILIDAD — MÚLTIPLES EMPLEADOS (LEGACY) ─────────
// Versión anterior que hace múltiples llamadas al backend
// Mantenida por compatibilidad, pero recomiendo usar getHorasDisponiblesMultiple
export async function getHorasDisponibles(servicioId, fecha, duracion, empleados) {
  if (!servicioId || !fecha || !duracion || !empleados.length) return new Set();
  
  // Generar todas las horas posibles (8am a 6pm, intervalos de 30 min, respetando duración)
  const horasPosibles = [];
  const inicio = 8 * 60;
  const fin = 18 * 60;
  for (let mins = inicio; mins + duracion <= fin; mins += 30) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    horasPosibles.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
  }
  
  // Consultar disponibilidad para cada hora con cualquier empleado
  const results = await Promise.all(
    horasPosibles.map(async (hora) => {
      for (const emp of empleados) {
        const res = await verificarDisponibilidadLanding(emp.id, fecha, hora, servicioId, duracion);
        if (res.disponible) return hora;
      }
      return null;
    })
  );
  
  const disponibles = new Set(results.filter(h => h !== null));
  
  // Si la fecha es hoy, filtrar horas pasadas
  const hoy = new Date();
  const hoyStr = hoy.toISOString().split('T')[0];
  const esHoy = fecha === hoyStr;
  if (esHoy) {
    const ahora = new Date();
    const horasFiltradas = new Set();
    disponibles.forEach(hora => {
      const [h, m] = hora.split(':');
      const horaDate = new Date();
      horaDate.setHours(parseInt(h), parseInt(m), 0, 0);
      if (horaDate > ahora) horasFiltradas.add(hora);
    });
    return horasFiltradas;
  }
  
  return disponibles;
}

// ── DISPONIBILIDAD — EMPLEADO ESPECÍFICO ───────────────────
export async function getHorasDisponiblesPorEmpleado(empleadoId, fecha, servicioId, duracion, todasLasHoras) {
  if (!empleadoId || !fecha || !servicioId || !duracion || !todasLasHoras?.length) return new Set();

  const checks = await Promise.allSettled(
    todasLasHoras.map((hora) =>
      verificarDisponibilidadLanding(empleadoId, fecha, hora, servicioId, duracion)
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

// ── VERIFICAR DISPONIBILIDAD CON HORARIO LABORAL ───────────
export async function verificarDisponibilidadConHorario(empleadoId, fecha, hora, servicioId, duracion, horariosEmpleado) {
  if (!horariosEmpleado || horariosEmpleado.length === 0) {
    return { disponible: false, mensaje: "El empleado no tiene horarios configurados" };
  }
  
  const fechaObj = new Date(fecha);
  const diaSemana = fechaObj.getDay();
  const backendDay = diaSemana === 0 ? 7 : diaSemana;
  
  const horarioDia = horariosEmpleado.find(h => h.dia === backendDay && h.activo === true);
  
  if (!horarioDia) {
    return { disponible: false, mensaje: "El empleado no trabaja este día" };
  }
  
  const [horaH, horaM] = hora.split(':').map(Number);
  const minutosSeleccionados = horaH * 60 + horaM;
  
  const [inicioH, inicioM] = horarioDia.hora_inicio.split(':').map(Number);
  const [finH, finM] = horarioDia.hora_final.split(':').map(Number);
  
  const minutosInicio = inicioH * 60 + inicioM;
  const minutosFin = finH * 60 + finM;
  
  if (minutosSeleccionados < minutosInicio || minutosSeleccionados >= minutosFin) {
    return { disponible: false, mensaje: "Hora fuera del horario laboral" };
  }
  
  return await verificarDisponibilidadLanding(empleadoId, fecha, hora, servicioId, duracion);
}

// ── OBTENER HORAS DISPONIBLES CON FILTRO DE HORARIO ────────
export async function getHorasDisponiblesConHorario(empleadoId, fecha, servicioId, duracion, horariosEmpleado) {
  if (!empleadoId || !fecha || !servicioId || !duracion || !horariosEmpleado?.length) {
    return new Set();
  }
  
  const fechaObj = new Date(fecha);
  const diaSemana = fechaObj.getDay();
  const backendDay = diaSemana === 0 ? 7 : diaSemana;
  const horarioDia = horariosEmpleado.find(h => h.dia === backendDay && h.activo === true);
  
  if (!horarioDia) {
    return new Set();
  }
  
  const todasLasHoras = generarHorasPosibles(
    duracion,
    horarioDia.hora_inicio.substring(0, 5),
    horarioDia.hora_final.substring(0, 5)
  );
  
  return await getHorasDisponiblesPorEmpleado(empleadoId, fecha, servicioId, duracion, todasLasHoras);
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

// ── OBTENER EMPLEADO DISPONIBLE PARA UNA HORA ──────────────
export async function getEmpleadoDisponible(fecha, hora, servicioId, duracion, empleados) {
  for (const emp of empleados) {
    const res = await verificarDisponibilidadLanding(emp.id, fecha, hora, servicioId, duracion);
    if (res.disponible) return emp.id;
  }
  return null;
}

// ── OBTENER PERFIL DEL CLIENTE LOGUEADO ──────────────────
export async function getMiPerfil() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) throw new Error("No hay sesión activa");

  const res = await fetch(`${BASE_URL}/cliente/perfil`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al obtener perfil");
  }
  return res.json();
}

// ── OBTENER CITAS DEL CLIENTE LOGUEADO ──────────────────
export async function getMisCitas() {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) throw new Error("No hay sesión activa");

  const res = await fetch(`${BASE_URL}/cliente/citas`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al obtener citas");
  }
  return res.json();
}

// ── CANCELAR UNA CITA ───────────────────────────────────
export async function cancelarCita(citaId) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) throw new Error("No hay sesión activa");

  const res = await fetch(`${BASE_URL}/cliente/citas/${citaId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al cancelar cita");
  }
  return res.json();
}