import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCampanaSaludById, updateCampanaSalud } from '../../../../lib/data/campanasSaludData';
import { getAllEmpleados } from '../../../../lib/data/empleadosData'; // Para el select
import "../../../../shared/styles/components/crud-forms.css";
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification"; // Para notificaciones

export default function EditarCampanaSalud() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [empleados, setEmpleados] = useState([]);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // 👇 Para la validación de cambios
  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    empresa: '',
    contacto: '',
    fecha: '',
    hora: '',
    direccion: '',
    observaciones: '',
    empleadoId: '',
    estado: 'activa'
  });

  const handleCloseNotification = () => {
    setNotification({ ...notification, isVisible: false });
  };

  // Cargar empleados
  useEffect(() => {
    const empleadosList = getAllEmpleados();
    const empleadosActivos = empleadosList.filter(empleado => empleado.estado === 'activo');
    setEmpleados(empleadosActivos);
  }, []);

  // Cargar datos de la campaña
  useEffect(() => {
    if (!id) return;
    const campana = getCampanaSaludById(Number(id));
    if (campana) {
      setFormData(campana);
      setOriginalData({ ...campana }); // Guardar copia original
    } else {
      navigate('/admin/servicios/campanas-salud');
    }
  }, [id, navigate]);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // 👇 FUNCIÓN CORREGIDA: Verificar si es domingo (hora local)
  const isSunday = (dateString) => {
    if (!dateString) return false;
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    return date.getDay() === 0;
  };

  // 👇 Manejar el input de contacto (máximo 10 dígitos)
  const handleContactoChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '');
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setFormData({
      ...formData,
      contacto: value
    });
  };

  // 👇 Generar opciones de hora (6AM - 6PM)
  const generarOpcionesHora = () => {
    const opciones = [];
    for (let hora = 6; hora <= 18; hora++) {
      opciones.push(`${hora.toString().padStart(2, '0')}:00`);
      if (hora < 18) {
        opciones.push(`${hora.toString().padStart(2, '0')}:30`);
      }
    }
    return opciones;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación de cambios
    if (originalData && JSON.stringify(formData) === JSON.stringify(originalData)) {
      setNotification({
        isVisible: true,
        message: 'No se han realizado cambios para guardar.',
        type: 'error'
      });
      return;
    }

    // Validación de contacto
    if (formData.contacto.length !== 10) {
      setNotification({
        isVisible: true,
        message: 'El contacto debe tener exactamente 10 dígitos numéricos.',
        type: 'error'
      });
      return;
    }

    // Validación de domingo
    if (isSunday(formData.fecha)) {
      setNotification({
        isVisible: true,
        message: 'No se permiten campañas en días domingos.',
        type: 'error'
      });
      return;
    }

    try {
      updateCampanaSalud(Number(id), formData);
      setNotification({
        isVisible: true,
        message: '¡Campaña actualizada con éxito!',
        type: 'success'
      });
      setTimeout(() => {
        navigate('/admin/servicios/campanas-salud');
      }, 2000);
    } catch (error) {
      setNotification({
        isVisible: true,
        message: 'Error al actualizar la campaña. Intente nuevamente.',
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

  if (!formData.empresa && formData.empresa !== '') {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <div className="crud-form-container">
        <div className="crud-form-header">
          <h1>Editando: {formData.empresa}</h1>
        </div>
        
        <div className="crud-form-content" style={{ padding: '0px' }}>
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
                <label htmlFor="estado">Estado</label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="crud-input"
                >
                  <option value="proxima">Próxima</option>
                  <option value="activa">Activa</option>
                  <option value="finalizada">Finalizada</option>
                  <option value="inactiva">Inactiva</option>
                </select>
              </div>

              <div className="crud-form-group width">
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
                Actualizar Campaña
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