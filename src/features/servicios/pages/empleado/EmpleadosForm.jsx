import { useState, useEffect } from "react";
import { tiposDocumento, cargosList } from "../../../../lib/data/empleadosData";

export default function EmpleadosForm({ mode, initialData, onSubmit, onCancel }) {
  
  // Estado base del formulario
  const [form, setForm] = useState({
    tipoDocumento: "",
    numero_documento: "",
    nombre: "",
    telefono: "",
    direccion: "",
    fecha_ingreso: "",
    cargo: "",
    estado: "activo",
  });

  // Cargar datos al editar / ver detalle
  useEffect(() => {
    if (initialData) {
      setForm({
        tipoDocumento: initialData.tipoDocumento || "",
        numero_documento: initialData.numero_documento || "",
        nombre: initialData.nombre || "",
        telefono: initialData.telefono || "",
        direccion: initialData.direccion || "",
        fecha_ingreso: initialData.fecha_ingreso || "",
        cargo: initialData.cargo || "",
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
  // No mostrar estado en modo crear
  const showEstado = mode !== "crear";

  return (
    <form className="crud-form" onSubmit={handleSubmit}>

      {/* TIPO DOCUMENTO */}
      <div className="form-group">
        <label>Tipo de Documento</label>
        <select
          name="tipoDocumento"
          value={form.tipoDocumento}
          onChange={handleChange}
          disabled={readOnly}
          required
        >
          <option value="">Seleccione tipo...</option>
          {tiposDocumento.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>

      {/* NÚMERO DOCUMENTO */}
      <div className="form-group">
        <label>Número de Documento</label>
        <input
          type="text"
          name="numero_documento"
          value={form.numero_documento}
          onChange={handleChange}
          disabled={readOnly}
          required
        />
      </div>

      {/* NOMBRE */}
      <div className="form-group">
        <label>Nombre Completo</label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          disabled={readOnly}
          required
        />
      </div>

      {/* TELÉFONO */}
      <div className="form-group">
        <label>Teléfono</label>
        <input
          type="text"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          disabled={readOnly}
          required
        />
      </div>

      {/* DIRECCIÓN */}
      <div className="form-group">
        <label>Dirección</label>
        <textarea
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          disabled={readOnly}
          required
        />
      </div>

      {/* FECHA INGRESO */}
      <div className="form-group">
        <label>Fecha de Ingreso</label>
        <input
          type="date"
          name="fecha_ingreso"
          value={form.fecha_ingreso}
          onChange={handleChange}
          disabled={readOnly}
          required
        />
      </div>

      {/* CARGO */}
      <div className="form-group">
        <label>Cargo</label>
        <select
          name="cargo"
          value={form.cargo}
          onChange={handleChange}
          disabled={readOnly}
          required
        >
          <option value="">Seleccione cargo...</option>
          {cargosList.map((cargo) => (
            <option key={cargo} value={cargo}>
              {cargo}
            </option>
          ))}
        </select>
      </div>

      {/* ESTADO - Solo mostrar en editar y detalle */}
      {showEstado && (
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
      )}

      {/* BOTONES */}
      <div className="crud-form-actions">
        {!readOnly && (
          <button type="submit" className="btn-primary">
            {mode === "crear" ? "Crear Empleado" : "Guardar Cambios"}
          </button>
        )}

        <button type="button" className="btn-secondary" onClick={onCancel}>
          {readOnly ? "Volver" : "Cancelar"}
        </button>
      </div>
    </form>
  );
}