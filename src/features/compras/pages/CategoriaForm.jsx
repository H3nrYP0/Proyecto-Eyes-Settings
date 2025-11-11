// src/features/compras/pages/CategoriaForm.jsx
// FORMULARIO REUTILIZABLE PARA CREAR Y EDITAR CATEGORÍAS

import { useState, useEffect } from "react";

export default function CategoriaForm({ mode, initialData, onSubmit, onCancel }) {
  // ESTADO DEL FORMULARIO
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    estado: "activa", // Valor por defecto (pero oculto en crear)
  });

  // CARGAR DATOS EN MODO EDITAR
  useEffect(() => {
    if (mode === "editar" && initialData) {
      setFormData(initialData);
    }
  }, [mode, initialData]);

  // MANEJO DE CAMBIOS EN INPUTS
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // MANEJO DEL SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="categoria-form" onSubmit={handleSubmit}>

      {/* ID - SOLO SE USA EN EDITAR (OCULTO) */}
      {mode === "editar" && (
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
        ></textarea>
      </div>

      {/* ESTADO — SOLO EN EDITAR */}
      {mode === "editar" && (
        <div className="form-group">
          <label>Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="activa">Activa</option>
            <option value="inactiva">Inactiva</option>
          </select>
        </div>
      )}

      {/* BOTONES */}
      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {mode === "crear" ? "Crear Categoría" : "Guardar Cambios"}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
