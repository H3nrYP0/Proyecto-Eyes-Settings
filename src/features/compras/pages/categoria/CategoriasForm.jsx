import { useState, useEffect } from "react";

export default function CategoriasForm({ mode, initialData, onSubmit, onCancel }) {
  
  // Estado base del formulario
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    estado: "activa",
  });

  // Cargar datos al editar / ver detalle
  useEffect(() => {
    if (initialData) {
      setForm({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
        estado: initialData.estado || "activa",
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

      {/* NOMBRE */}
      <div className="form-group">
        <label>Nombre de la Categoría</label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          disabled={readOnly}
          required
        />
      </div>

      {/* DESCRIPCIÓN */}
      <div className="form-group">
        <label>Descripción</label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          disabled={readOnly}
          required
          rows="4"
        />
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
            <option value="activa">Activa</option>
            <option value="inactiva">Inactiva</option>
          </select>
        </div>
      )}

      {/* BOTONES */}
      <div className="crud-form-actions">
        {!readOnly && (
          <button type="submit" className="btn-primary">
            {mode === "crear" ? "Crear Categoría" : "Guardar Cambios"}
          </button>
        )}

        <button type="button" className="btn-secondary" onClick={onCancel}>
          {readOnly ? "Volver" : "Cancelar"}
        </button>
      </div>
    </form>
  );
}