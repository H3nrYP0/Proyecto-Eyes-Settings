// src/features/compras/pages/CategoriaForm.jsx
// FORMULARIO REUTILIZABLE PARA CREAR, EDITAR Y VER DETALLE DE CATEGORÍAS

import { useState, useEffect } from "react";

export default function CategoriaForm({ mode, initialData, onSubmit, onCancel }) {
  const isDetail = mode === "detalle"; // ⬅️ Nuevo modo

  // ESTADO DEL FORMULARIO
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    estado: "activa",
  });

  // CARGAR DATOS EN EDITAR O DETALLE
  useEffect(() => {
    if ((mode === "editar" || mode === "detalle") && initialData) {
      setFormData(initialData);
    }
  }, [mode, initialData]);

  // MANEJO DE CAMBIOS EN INPUTS (deshabilitado en detalle)
  const handleChange = (e) => {
    if (isDetail) return; // ⬅️ Bloquea cambios en detalle

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // MANEJO DEL SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isDetail) return; // ⬅️ No permitir submit en detalle
    onSubmit(formData);
  };

  return (
    <form className="categoria-form" onSubmit={handleSubmit}>

      {/* ID - SOLO SE USA EN EDITAR (OCULTO) */}
      {(mode === "editar" || mode === "detalle") && (
        <input type="hidden" name="id" value={formData.id} />
      )}

      {/* NOMBRE */}
      <div className="form-group">
        <label>
          Nombre <span className="required">*</span>
        </label>
        <input
          type="text"
          name="nombre"
          placeholder="Ingrese el nombre de la categoría"
          value={formData.nombre}
          onChange={handleChange}
          required
          disabled={isDetail} // ⬅️ Bloqueado en detalle
        />
      </div>

      {/* DESCRIPCIÓN */}
      <div className="form-group">
        <label>
          Descripción <span className="required">*</span>
        </label>
        <textarea
          name="descripcion"
          placeholder="Ingrese una descripción"
          value={formData.descripcion}
          onChange={handleChange}
          required
          disabled={isDetail} // ⬅️ Bloqueado en detalle
        ></textarea>
      </div>

      {/* ESTADO — SOLO EN EDITAR Y DETALLE */}
      {(mode === "editar" || mode === "detalle") && (
        <div className="form-group">
          <label>Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            disabled={isDetail} // ⬅️ Bloqueado en detalle
          >
            <option value="activa">Activa</option>
            <option value="inactiva">Inactiva</option>
          </select>
        </div>
      )}

      {/* BOTONES */}
      <div className="form-actions">

        {/* ⛔ Ocultar botón guardar en detalle */}
        {!isDetail && (
          <button type="submit" className="btn-primary">
            {mode === "crear" ? "Crear Categoría" : "Guardar Cambios"}
          </button>
        )}

        {/* Este botón siempre aparece */}
        <button type="button" className="btn-secondary" onClick={onCancel}>
          {isDetail ? "Volver" : "Cancelar"}
        </button>
      </div>
    </form>
  );
}
