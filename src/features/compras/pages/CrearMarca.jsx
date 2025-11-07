import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../shared/styles/components/CrudLayout.css";

// Datos de ejemplo
const marcasIniciales = [
  { id: 1, nombre: "Ray-Ban", estado: true },
  { id: 2, nombre: "Oakley", estado: true },
  { id: 3, nombre: "Essilor", estado: true },
  { id: 4, nombre: "Johnson & Johnson", estado: true }
];

export default function CrearMarca() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [marcas, setMarcas] = useState(marcasIniciales);
  
  const [marca, setMarca] = useState({
    nombre: "",
    estado: true
  });

  const [errors, setErrors] = useState({});

  const esEdicion = Boolean(id);

  // Cargar datos si es edición
  useEffect(() => {
    if (esEdicion) {
      const marcaExistente = marcas.find(m => m.id === parseInt(id));
      if (marcaExistente) {
        setMarca(marcaExistente);
      } else {
        alert("Marca no encontrada");
        navigate("/admin/marcas");
      }
    }
  }, [id, esEdicion, navigate]);

  const handleInputChange = (field, value) => {
    setMarca(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!marca.nombre.trim()) {
      nuevosErrores.nombre = "El nombre de la marca es requerido";
    } else if (marca.nombre.trim().length < 2) {
      nuevosErrores.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    // Validar que no exista una marca con el mismo nombre (excepto en edición)
    const nombreExistente = marcas.find(m => 
      m.nombre.toLowerCase() === marca.nombre.toLowerCase().trim() && 
      (!esEdicion || m.id !== parseInt(id))
    );
    
    if (nombreExistente) {
      nuevosErrores.nombre = "Ya existe una marca con este nombre";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    if (esEdicion) {
      // Actualizar marca existente
      setMarcas(prevMarcas => 
        prevMarcas.map(m => 
          m.id === parseInt(id) ? { ...marca } : m
        )
      );
      alert("Marca actualizada exitosamente");
    } else {
      // Crear nueva marca
      const nuevaMarca = {
        ...marca,
        id: Math.max(...marcas.map(m => m.id), 0) + 1
      };
      setMarcas(prevMarcas => [...prevMarcas, nuevaMarca]);
      alert("Marca creada exitosamente");
    }

    // Redirigir a la lista de marcas
    navigate("/admin/marcas");
  };

  const handleCancel = () => {
    if (window.confirm("¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.")) {
      navigate("/admin/marcas");
    }
  };

  return (
    <div className="crud-layout">
      {/* Header */}
      <div className="crud-header">
        <div>
          <h2>{esEdicion ? "✏️ Editar Marca" : "🏷️ Crear Nueva Marca"}</h2>
          <p>
            {esEdicion 
              ? "Modifica la información de la marca seleccionada."
              : "Completa el formulario para agregar una nueva marca al sistema."
            }
          </p>
        </div>
        <button 
          className="btn btn-secondary"
          onClick={handleCancel}
        >
          ↩️ Volver
        </button>
      </div>

      {/* Formulario */}
      <div className="crud-center">
        <form onSubmit={handleSubmit} className="crud-form">
          <div className="form-group">
            <label className="form-label">
              Nombre de la Marca *
            </label>
            <input
              type="text"
              className={`form-input ${errors.nombre ? 'error' : ''}`}
              value={marca.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Ej: Ray-Ban, Oakley, Essilor, etc."
              autoFocus
            />
            {errors.nombre && (
              <span className="error-message">{errors.nombre}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Estado</label>
            <div className="status-options">
              <label className="status-option">
                <input
                  type="radio"
                  name="estado"
                  checked={marca.estado === true}
                  onChange={() => handleInputChange('estado', true)}
                />
                <span className="status-active">Activo</span>
              </label>
              <label className="status-option">
                <input
                  type="radio"
                  name="estado"
                  checked={marca.estado === false}
                  onChange={() => handleInputChange('estado', false)}
                />
                <span className="status-inactive">Inactivo</span>
              </label>
            </div>
            <p className="form-help">
              Las marcas inactivas no estarán disponibles para asignar a nuevos productos.
            </p>
          </div>

          <div className="form-actions">
            <button 
              type="button"
              className="btn btn-secondary" 
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="btn btn-primary" 
            >
              {esEdicion ? "Actualizar Marca" : "Crear Marca"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}