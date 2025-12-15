import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createServicio } from '../../../../lib/data/serviciosData';
import { getAllEmpleados } from '../../../../lib/data/empleadosData'; // 👈 Nueva importación
import "../../../../shared/styles/components/crud-forms.css";
import { formatToPesos, parseFromPesos } from '../../../../shared/utils/formatCOP'; // 👈 Nueva importación

// 👇 IMPORTACIÓN DEL COMPONENTE DE NOTIFICACIÓN
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";

export default function CrearServicio() {
  const navigate = useNavigate();

  // 👇 ESTADO PARA LA NOTIFICACIÓN
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // 👇 ESTADO PARA LA LISTA DE EMPLEADOS
  const [empleados, setEmpleados] = useState([]);

  // 👇 ESTADO PARA EL PRECIO CON FORMATO VISUAL
  const [precioFormatted, setPrecioFormatted] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    duracion: '',
    precio: '',
    empleadoId: '', // 👈 Cambiamos de 'empleado' a 'empleadoId'
    estado: 'activo'
  });

  // 👇 CARGAR EMPLEADOS ACTIVOS AL MONTAR
  useEffect(() => {
    const empleadosList = getAllEmpleados();
    const empleadosActivos = empleadosList.filter(empleado => empleado.estado === 'activo');
    setEmpleados(empleadosActivos);
  }, []);

  // 👇 CERRAR NOTIFICACIÓN
  const handleCloseNotification = () => {
    setNotification({ ...notification, isVisible: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre.trim()) {
      setNotification({
        isVisible: true,
        message: 'El nombre del servicio es obligatorio.',
        type: 'error'
      });
      return;
    }

    if (!formData.empleadoId) {
      setNotification({
        isVisible: true,
        message: 'Debe seleccionar un empleado.',
        type: 'error'
      });
      return;
    }

    if (Number(formData.duracion) <= 0) {
      setNotification({
        isVisible: true,
        message: 'La duración debe ser mayor a 0 minutos.',
        type: 'error'
      });
      return;
    }

    if (Number(formData.precio) <= 0) {
      setNotification({
        isVisible: true,
        message: 'El precio debe ser mayor a 0.',
        type: 'error'
      });
      return;
    }

    try {
      const nuevoServicio = createServicio({
        ...formData,
        duracion: Number(formData.duracion),
        precio: Number(formData.precio),
        // Guardamos el ID, no el nombre
        empleado: formData.empleadoId // 👈 Guardamos el ID del empleado
      });

      console.log('Servicio creado:', nuevoServicio);

      setNotification({
        isVisible: true,
        message: '¡Servicio creado con éxito!',
        type: 'success'
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/admin/servicios');
      }, 2000);

    } catch (error) {
      setNotification({
        isVisible: true,
        message: 'Error al crear el servicio. Intente nuevamente.',
        type: 'error'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 👇 MANEJADOR ESPECIAL PARA EL PRECIO
  const handlePrecioChange = (e) => {
    const rawValue = e.target.value;
    const cleanValue = parseFromPesos(rawValue); // Solo dígitos
    const formattedValue = formatToPesos(rawValue); // Con puntos

    setPrecioFormatted(formattedValue);
    setFormData({
      ...formData,
      precio: cleanValue
    });
  };

  return (
    <>
      <div className="crud-form-container">
        <div className="crud-form-header">
          <h1>Crear Nuevo Servicio</h1>
        </div>
        
        <div className="crud-form-content" style={{ padding: '0px' }}>
          <form onSubmit={handleSubmit}>
            <div className="crud-form-section">
              <div className="crud-form-group">
                <label htmlFor="nombre">Nombre <span className="crud-required">*</span></label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="crud-input"
                  placeholder="Ej: Examen de la Vista, Adaptación Lentes de Contacto, etc."
                  required
                />
              </div>

              <div className="crud-form-group">
                <label htmlFor="duracion">Duración (min) <span className="crud-required">*</span></label>
                <input
                  type="number"
                  id="duracion"
                  name="duracion"
                  value={formData.duracion}
                  onChange={handleChange}
                  className="crud-input"
                  placeholder="30"
                  min="1"
                  required
                />
              </div>

              <div className="crud-form-group">
                <label htmlFor="precio">Precio <span className="crud-required">*</span></label>
                <input
                  type="text" // 👈 Cambiado a "text" para poder formatear
                  id="precio"
                  name="precio"
                  value={precioFormatted}
                  onChange={handlePrecioChange}
                  className="crud-input"
                  placeholder="0"
                  required
                />
              </div>

              {/* 👇 CAMPO DE EMPLEADO AHORA ES UN SELECT */}
              <div className="crud-form-group">
                <label htmlFor="empleadoId">Empleado <span className="crud-required">*</span></label>
                <select
                  id="empleadoId"
                  name="empleadoId"
                  value={formData.empleadoId}
                  onChange={handleChange}
                  className="crud-input"
                  required
                >
                  <option value="">Seleccionar empleado</option>
                  {empleados.map((empleado) => (
                    <option key={empleado.id} value={empleado.id}>
                      {empleado.nombre} - {empleado.cargo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="crud-form-group full-width">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="3"
                  className="crud-input crud-textarea"
                  placeholder="Descripción del servicio..."
                />
              </div>
            </div>

            <div className="crud-form-actions">
              <button 
                type="button" 
                className="crud-btn crud-btn-secondary"
                onClick={() => navigate('/admin/servicios')}
              >
                Cancelar
              </button>
              <button type="submit" className="crud-btn crud-btn-primary">
                Crear Servicio
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 👇 NOTIFICACIÓN REUTILIZABLE */}
      <CrudNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={handleCloseNotification}
      />
    </>
  );
}