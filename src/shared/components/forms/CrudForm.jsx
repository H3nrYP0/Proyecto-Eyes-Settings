import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/CrudLayout.css";

export default function CrudForm({ 
  title, 
  description, 
  initialData, 
  onSubmit, 
  onCancel,
  validationRules,
  fields,
  esEdicion = false 
}) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  // Actualizar formData cuando initialData cambie
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
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

    if (validationRules) {
      Object.keys(validationRules).forEach(field => {
        const rule = validationRules[field];
        const value = formData[field];
        
        if (rule.required && !value) {
          nuevosErrores[field] = rule.required;
        } else if (rule.minLength && value && value.length < rule.minLength.value) {
          nuevosErrores[field] = rule.minLength.message;
        } else if (rule.custom && rule.custom(value, formData)) {
          nuevosErrores[field] = rule.custom(value, formData);
        }
      });
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    onSubmit(formData);
  };

  const renderField = (field) => {
    const { type, label, placeholder, options, required } = field;
    
    switch (type) {
      case 'text':
      case 'number':
      case 'email':
        return (
          <div className="form-group" key={field.name}>
            <label className="form-label">
              {label} {required && '*'}
            </label>
            <input
              type={type}
              className={`form-input ${errors[field.name] ? 'error' : ''}`}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={placeholder}
            />
            {errors[field.name] && (
              <span className="error-message">{errors[field.name]}</span>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div className="form-group" key={field.name}>
            <label className="form-label">
              {label} {required && '*'}
            </label>
            <textarea
              className={`form-input form-textarea ${errors[field.name] ? 'error' : ''}`}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={placeholder}
              rows={field.rows || 3}
            />
            {errors[field.name] && (
              <span className="error-message">{errors[field.name]}</span>
            )}
          </div>
        );

      case 'select':
        return (
          <div className="form-group" key={field.name}>
            <label className="form-label">
              {label} {required && '*'}
            </label>
            <select
              className={`form-input form-select ${errors[field.name] ? 'error' : ''}`}
              value={formData[field.name] || ''}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
            >
              <option value="">Seleccionar {label.toLowerCase()}</option>
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors[field.name] && (
              <span className="error-message">{errors[field.name]}</span>
            )}
          </div>
        );

      case 'radio':
        return (
          <div className="form-group" key={field.name}>
            <label className="form-label">{label}</label>
            <div className="status-options">
              {options.map(option => (
                <label key={option.value} className="status-option">
                  <input
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={formData[field.name] === option.value}
                    onChange={(e) => handleInputChange(field.name, e.target.value === 'true')}
                  />
                  <span className={option.value ? 'status-active' : 'status-inactive'}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="crud-layout">
      {/* Header */}
      <div className="crud-header">
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        <button 
          className="btn btn-secondary"
          onClick={onCancel}
        >
          ↩️ Volver
        </button>
      </div>

      {/* Formulario */}
      <div className="crud-center">
        <form onSubmit={handleSubmit} className="crud-form">
          {fields.map(field => renderField(field))}

          <div className="form-actions">
            <button 
              type="button"
              className="btn btn-secondary" 
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="btn btn-primary" 
            >
              {esEdicion ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}