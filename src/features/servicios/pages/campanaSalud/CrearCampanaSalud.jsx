import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCampanaSalud } from '../../../../lib/data/campanasSaludData';
import { getAllEmpleados } from '../../../../lib/data/empleadosData';
import "../../../../shared/styles/components/crud-forms.css";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";

export default function CrearCampanaSalud() {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const [formData, setFormData] = useState({
    empresa: '',
    contacto: '',
    fecha: '',
    hora: '',
    direccion: '',
    observaciones: '',
    empleadoId: ''
  });

  const handleCloseNotification = () => {
    setNotification({ ...notification, isVisible: false });
  };

  useEffect(() => {
    const empleadosList = getAllEmpleados();
    const empleadosActivos = empleadosList.filter(empleado => empleado.estado === 'activo');
    setEmpleados(empleadosActivos);
  }, []);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // 👇 FUNCIÓN CORREGIDA: Verificar si es domingo (hora local)
  const isSunday = (dateString) => {
    if (!dateString) return false;
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Los meses en JS van de 0 a 11
    const day = parseInt(parts[2], 10);

    const date = new Date(year, month, day); // 👈 Hora local
    return date.getDay() === 0; // 0 es domingo
  };

  // 👇 NUEVA FUNCIÓN: Manejar el input de contacto (máximo 10 dígitos)
  const handleContactoChange = (e) => {
    let value = e.target.value;
    // Eliminar cualquier carácter que no sea un dígito
    value = value.replace(/\D/g, '');
    // Limitar a 10 caracteres
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setFormData({
      ...formData,
      contacto: value
    });
  };

  // Función para generar opciones de hora desde 06:00 hasta 18:00 con intervalos de 30 minutos
  const generarOpcionesHora = () => {
    const opciones = [];
    // Empezamos a las 6 AM (6) y terminamos a las 6 PM (18)
    for (let hora = 6; hora <= 18; hora++) {
      // Añadir la hora en punto (XX:00)
      opciones.push(`${hora.toString().padStart(2, '0')}:00`);
      // Añadir la media hora (XX:30), pero solo si no es la última hora (18:30 no se incluye)
      if (hora < 18) {
        opciones.push(`${hora.toString().padStart(2, '0')}:30`);
      }
    }
    return opciones;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación de contacto (debe tener 10 dígitos)
    if (formData.contacto.length !== 10) {
      setNotification({
        isVisible: true,
        message: 'El contacto debe tener exactamente 10 dígitos numéricos.',
        type: 'error'
      });
      return;
    }

    // 👇 VALIDACIÓN: No permitir domingos (CORREGIDA)
    if (isSunday(formData.fecha)) {
      setNotification({
        isVisible: true,
        message: 'No se permiten campañas en días domingos.',
        type: 'error'
      });
      return;
    }

    try {
      const nuevaCampana = createCampanaSalud({
        ...formData,
        empleadoId: Number(formData.empleadoId),
        estado: "activa"
      });
      console.log('Campaña creada:', nuevaCampana);

      setNotification({
        isVisible: true,
        message: '¡Campaña de salud creada con éxito!',
        type: 'success'
      });

      setTimeout(() => {
        navigate('/admin/servicios/campanas-salud');
      }, 2000);

    } catch (error) {
      setNotification({
        isVisible: true,
        message: 'Error al crear la campaña. Intente nuevamente.',
        type: 'error'
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <div className="crud-form-container">
        <div className="crud-form-header">
          <h1>Crear Nueva Campaña de Salud</h1>
        </div>
        
        <div className="crud-form-content">
          <form onSubmit={handleSubmit}>
            <div className="crud-form-section">
              <div className="crud-form-group">
                <label htmlFor="empresa">Empresa <span className="crud-required">*</span></label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  className="crud-input"
                  placeholder="Ej: Colegio San José, Empresa ABC Ltda"
                  required
                />
              </div>

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

              <div className="crud-form-row">
                <div className="crud-form-group">
                  <label htmlFor="contacto">Contacto <span className="crud-required">*</span></label>
                  <input
                    type="text"
                    id="contacto"
                    name="contacto"
                    value={formData.contacto}
                    onChange={handleContactoChange}
                    className="crud-input"
                    placeholder="3001234567"
                    required
                  />
                </div>

                <div className="crud-form-group">
                  <label htmlFor="direccion">Dirección</label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="crud-input"
                    placeholder="Calle 123 #45-67"
                  />
                </div>
              </div>

              <div className="crud-form-row">
                <div className="crud-form-group">
                  <label htmlFor="fecha">Fecha <span className="crud-required">*</span></label>
                  <input
                    type="date"
                    id="fecha"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    className="crud-input"
                    min={getTodayDate()}
                    required
                  />
                </div>

                <div className="crud-form-group">
                  <label htmlFor="hora">Hora <span className="crud-required">*</span></label>
                  <select
                    id="hora"
                    name="hora"
                    value={formData.hora}
                    onChange={handleChange}
                    className="crud-input"
                    required
                  >
                    <option value="">Seleccionar hora</option>
                    {generarOpcionesHora().map((opcion) => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="crud-form-group">
                <label htmlFor="observaciones">Observaciones</label>
                <textarea
                  id="observaciones"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  rows="3"
                  className="crud-input crud-textarea"
                  placeholder="Detalles adicionales sobre la campaña..."
                />
              </div>
            </div>

            <div className="crud-form-actions">
              <button 
                type="button" 
                className="crud-btn crud-btn-secondary"
                onClick={() => navigate('/admin/servicios/campanas-salud')}
              >
                Cancelar
              </button>
              <button type="submit" className="crud-btn crud-btn-primary">
                Crear Campaña
              </button>
            </div>
          </form>
        </div>
      </div>

      <CrudNotification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={handleCloseNotification}
      />
    </>
  );
}