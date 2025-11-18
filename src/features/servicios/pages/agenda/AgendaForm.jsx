import { useState, useEffect } from "react";
import { 
  clientesList, 
  serviciosList, 
  empleadosList, 
  estadosCitaList,
  metodosPagoList 
} from "../../../../lib/data/agendaData";

export default function AgendaForm({ mode, initialData, onSubmit, onCancel }) {
  
  // Estado base del formulario con los nuevos campos
  const [form, setForm] = useState({
    clienteId: "",
    servicioId: "",
    empleadoId: "",
    metodo_pago: "",
    hora: "",
    duracion: "",
    fecha: "",
    estadoDeCitaId: "",
    notas: "",
  });

  // 🔄 Convertir "02:30 PM" → "14:30" (compatible con input type="time")
  const convertirHora12a24 = (hora12) => {
    if (!hora12) return "";
    const [time, ampm] = hora12.split(" ");
    let [h, m] = time.split(":");
    h = parseInt(h, 10);

    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;

    return `${String(h).padStart(2, "0")}:${m}`;
  };

  // ⬅️ Cargar datos al editar / ver detalle
  useEffect(() => {
    if (initialData) {
      setForm({
        clienteId: initialData.clienteId || "",
        servicioId: initialData.servicioId || "",
        empleadoId: initialData.empleadoId || "",
        metodo_pago: initialData.metodo_pago || "",
        hora: convertirHora12a24(initialData.hora),
        duracion: initialData.duracion || "",
        fecha: initialData.fecha || "",
        estadoDeCitaId: initialData.estadoDeCitaId || "",
        notas: initialData.notas || "",
      });
    }
  }, [initialData]);

  // 🔄 Cambio de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔁 Convertir "14:30" → "02:30 PM" al guardar
  const convertirHora24a12 = (hora24) => {
    if (!hora24) return "";
    let [h, m] = hora24.split(":");
    h = parseInt(h, 10);

    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;

    return `${String(h).padStart(2, "0")}:${m} ${ampm}`;
  };

  // 🟢 Enviar form al CRUD
  const handleSubmit = (e) => {
    e.preventDefault();

    const dataFinal = {
      ...form,
      hora: convertirHora24a12(form.hora),
    };

    onSubmit(dataFinal);
  };

  // Solo lectura en modo detalle
  const readOnly = mode === "detalle";

  return (
    <form className="crud-form" onSubmit={handleSubmit}>

      {/* CLIENTE ID */}
      <div className="form-group">
        <label>Cliente</label>
        <select
          name="clienteId"
          value={form.clienteId}
          onChange={handleChange}
          disabled={readOnly}
          required
        >
          <option value="">Seleccione un cliente...</option>
          {clientesList.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* SERVICIO ID */}
      <div className="form-group">
        <label>Servicio</label>
        <select
          name="servicioId"
          value={form.servicioId}
          onChange={handleChange}
          disabled={readOnly}
          required
        >
          <option value="">Seleccione un servicio...</option>
          {serviciosList.map((servicio) => (
            <option key={servicio.id} value={servicio.id}>
              {servicio.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* EMPLEADO ID */}
      <div className="form-group">
        <label>Empleado</label>
        <select
          name="empleadoId"
          value={form.empleadoId}
          onChange={handleChange}
          disabled={readOnly}
          required
        >
          <option value="">Seleccione un empleado...</option>
          {empleadosList.map((empleado) => (
            <option key={empleado.id} value={empleado.id}>
              {empleado.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* FECHA */}
      <div className="form-group">
        <label>Fecha</label>
        <input
          type="date"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          disabled={readOnly}
          required
        />
      </div>

      {/* HORA */}
      <div className="form-group">
        <label>Hora</label>
        <input
          type="time"
          name="hora"
          value={form.hora}
          onChange={handleChange}
          disabled={readOnly}
          required
        />
      </div>

      {/* DURACIÓN */}
      <div className="form-group">
        <label>Duración</label>
        <select
          name="duracion"
          value={form.duracion}
          onChange={handleChange}
          disabled={readOnly}
          required
        >
          <option value="">Seleccione duración...</option>
          <option value="15 min">15 minutos</option>
          <option value="30 min">30 minutos</option>
          <option value="45 min">45 minutos</option>
          <option value="1 hora">1 hora</option>
          <option value="1.5 horas">1.5 horas</option>
          <option value="2 horas">2 horas</option>
        </select>
      </div>

      {/* MÉTODO DE PAGO */}
      <div className="form-group">
        <label>Método de Pago</label>
        <select
          name="metodo_pago"
          value={form.metodo_pago}
          onChange={handleChange}
          disabled={readOnly}
          required
        >
          <option value="">Seleccione método...</option>
          {metodosPagoList.map((metodo) => (
            <option key={metodo} value={metodo}>
              {metodo}
            </option>
          ))}
        </select>
      </div>

      {/* ESTADO DE CITA */}
      <div className="form-group">
        <label>Estado de Cita</label>
        <select
          name="estadoDeCitaId"
          value={form.estadoDeCitaId}
          onChange={handleChange}
          disabled={readOnly}
          required
        >
          <option value="">Seleccione estado...</option>
          {estadosCitaList.map((estado) => (
            <option key={estado.id} value={estado.id}>
              {estado.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* NOTAS */}
      <div className="form-group">
        <label>Notas</label>
        <textarea
          name="notas"
          value={form.notas}
          onChange={handleChange}
          disabled={readOnly}
          rows="3"
        />
      </div>

      {/* BOTONES */}
      <div className="crud-form-actions">
        {!readOnly && (
          <button type="submit" className="btn-primary">
            {mode === "crear" ? "Crear Cita" : "Guardar Cambios"}
          </button>
        )}

        <button type="button" className="btn-secondary" onClick={onCancel}>
          {readOnly ? "Volver" : "Cancelar"}
        </button>
      </div>
    </form>
  );
}