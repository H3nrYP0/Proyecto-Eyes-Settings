import { useState, useEffect } from "react";
import { empleadosList, diasList } from "../../../../lib/data/horariosData";

export default function HorariosForm({ mode, initialData, onSubmit, onCancel }) {
  
  // Estado base del formulario
  const [form, setForm] = useState({
    empleado: "",
    dia: "",
    horaInicio: "",
    horaFinal: "",
    duracion: "0 horas",
    estado: "activo",
  });

  // Calcular duración automáticamente cuando cambian las horas
  useEffect(() => {
    if (form.horaInicio && form.horaFinal) {
      const calcularDuracion = () => {
        const inicio = new Date(`2000-01-01T${form.horaInicio}`);
        const final = new Date(`2000-01-01T${form.horaFinal}`);
        const diffMs = final - inicio;
        const diffHoras = diffMs / (1000 * 60 * 60);
        
        if (diffHoras < 0) {
          return "0 horas";
        }
        
        return `${diffHoras} horas`;
      };

      setForm(prev => ({
        ...prev,
        duracion: calcularDuracion()
      }));
    }
  }, [form.horaInicio, form.horaFinal]);

  // Cargar datos al editar / ver detalle
  useEffect(() => {
    if (initialData) {
      setForm({
        empleado: initialData.empleado || "",
        dia: initialData.dia || "",
        horaInicio: initialData.horaInicio || "",
        horaFinal: initialData.horaFinal || "",
        duracion: initialData.duracion || "0 horas",
        estado: initialData.estado || "activo",
      });
    }
  }, [initialData]);

  // Cambio de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Enviar form
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  // Solo lectura en modo detalle
  const readOnly = mode === "detalle";

  return (
    <form className="crud-form" onSubmit={handleSubmit}>

      {/* EMPLEADO */}
      <div className="form-group">
        <label>Empleado</label>
        <select
          name="empleado"
          value={form.empleado}
          onChange={handleChange}
          disabled={readOnly}
          required
        >
          <option value="">Seleccione un empleado...</option>
          {empleadosList.map((empleado) => (
            <option key={empleado} value={empleado}>
              {empleado}
            </option>
          ))}
        </select>
      </div>

      {/* DÍA */}
      <div className="form-group">
        <label>Día</label>
        <select
          name="dia"
          value={form.dia}
          onChange={handleChange}
          disabled={readOnly}
          required
        >
          <option value="">Seleccione el día...</option>
          {diasList.map((dia) => (
            <option key={dia} value={dia}>
              {dia}
            </option>
          ))}
        </select>
      </div>

      {/* HORA INICIO */}
      <div className="form-group">
        <label>Hora Inicio</label>
        <input
          type="time"
          name="horaInicio"
          value={form.horaInicio}
          onChange={handleChange}
          disabled={readOnly}
          required
        />
      </div>

      {/* HORA FINAL */}
      <div className="form-group">
        <label>Hora Final</label>
        <input
          type="time"
          name="horaFinal"
          value={form.horaFinal}
          onChange={handleChange}
          disabled={readOnly}
          required
        />
      </div>

      {/* DURACIÓN (Calculada automáticamente) */}
      <div className="form-group">
        <label>Duración</label>
        <input
          type="text"
          name="duracion"
          value={form.duracion}
          disabled
          className="disabled-input"
        />
        <small>Calculada automáticamente</small>
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
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      {/* BOTONES */}
      <div className="crud-form-actions">
        {!readOnly && (
          <button type="submit" className="btn-primary">
            {mode === "crear" ? "Crear Horario" : "Guardar Cambios"}
          </button>
        )}

        <button type="button" className="btn-secondary" onClick={onCancel}>
          {readOnly ? "Volver" : "Cancelar"}
        </button>
      </div>
    </form>
  );
}