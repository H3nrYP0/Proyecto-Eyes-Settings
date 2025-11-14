import { useState, useEffect } from "react";

export default function AgendaForm({ mode, initialData, onSubmit, onCancel }) {
  
  // Estado base del formulario
  const [form, setForm] = useState({
    cliente: "",
    servicio: "",
    fecha: "",
    hora: "",
    duracion: "",
    metodoPago: "",
    estado: "pendiente",
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
        cliente: initialData.cliente || "",
        servicio: initialData.servicio || "",
        fecha: initialData.fecha || "",
        hora: convertirHora12a24(initialData.hora), // ⬅️ FIX DEL INPUT TIME
        duracion: initialData.duracion || "",
        metodoPago: initialData.metodoPago || "",
        estado: initialData.estado || "pendiente",
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
      hora: convertirHora24a12(form.hora), // ⬅️ Guardamos en AM/PM como tu tabla
    };

    onSubmit(dataFinal);
  };

  // Solo lectura en modo detalle
  const readOnly = mode === "detalle";

  return (
    <form className="crud-form" onSubmit={handleSubmit}>

      {/* CLIENTE */}
      <div className="form-group">
        <label>Cliente</label>
        <input
          type="text"
          name="cliente"
          value={form.cliente}
          onChange={handleChange}
          disabled={readOnly}
          required
        />
      </div>

      {/* SERVICIO */}
      <div className="form-group">
        <label>Servicio</label>
        <input
          type="text"
          name="servicio"
          value={form.servicio}
          onChange={handleChange}
          disabled={readOnly}
          required
        />
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
        <input
          type="text"
          name="duracion"
          value={form.duracion}
          onChange={handleChange}
          disabled={readOnly}
          required
        />
      </div>

      {/* MÉTODO DE PAGO */}
      <div className="form-group">
        <label>Método de Pago</label>
        <select
          name="metodoPago"
          value={form.metodoPago}
          onChange={handleChange}
          disabled={readOnly}
          required
        >
          <option value="">Seleccione...</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Tarjeta Crédito">Tarjeta Crédito</option>
          <option value="Tarjeta Débito">Tarjeta Débito</option>
          <option value="Transferencia">Transferencia</option>
        </select>
      </div>

      {/* ESTADO */}
      <div className="form-group">
        <label>Estado</label>
        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          disabled={readOnly}
        >
          <option value="pendiente">Pendiente</option>
          <option value="completada">Completada</option>
          <option value="cancelada">Cancelada</option>
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
        />
      </div>

      {/* BOTONES */}
      <div className="crud-form-actions">
        {!readOnly && (
          <button type="submit" className="btn-primary">Guardar</button>
        )}

        <button type="button" className="btn-secondary" onClick={onCancel}>
          {readOnly ? "Volver" : "Cancelar"}
        </button>
      </div>
    </form>
  );
}
