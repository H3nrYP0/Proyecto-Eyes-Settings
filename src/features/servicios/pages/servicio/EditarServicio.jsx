import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import CrudLayout from "../../../../shared/components/layouts/CrudLayout"; // 👈 ELIMINADO
import { getServicioById, updateServicio } from "../../../../lib/data/serviciosData";
import { getAllEmpleados } from '../../../../lib/data/empleadosData'; // 👈 Para el select
import "../../../../shared/styles/components/crud-forms.css";
import { formatToPesos, parseFromPesos } from '../../../../shared/utils/formatCOP'; // 👈 Para el precio

// 👇 IMPORTACIÓN DEL COMPONENTE DE NOTIFICACIÓN
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification";

export default function EditarServicio() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [empleados, setEmpleados] = useState([]);
  const [precioFormatted, setPrecioFormatted] = useState('');

  // 👇 ESTADO PARA NOTIFICACIONES
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // 👇 ESTADO PARA VALIDAR CAMBIOS
  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    duracion: '',
    precio: '',
    empleadoId: '', // 👈 Usamos ID
    estado: 'activo'
  });

  // 👇 Cargar empleados activos
  useEffect(() => {
    const empleadosList = getAllEmpleados();
    const empleadosActivos = empleadosList.filter(empleado => empleado.estado === 'activo');
    setEmpleados(empleadosActivos);
  }, []);

  // 👇 Cargar datos del servicio
  // 👇 Cargar datos del servicio
  useEffect(() => {
    if (!id) return;
    const servicio = getServicioById(Number(id));
    if (servicio) {
      // Buscar el ID del empleado usando su NOMBRE
      const empleadosList = getAllEmpleados();
      const empleadoEncontrado = empleadosList.find(emp => emp.nombre === servicio.empleado);

      const data = {
        nombre: servicio.nombre || '',
        descripcion: servicio.descripcion || '',
        duracion: servicio.duracion || '',
        precio: servicio.precio || '',
        // 👇 Usar el ID encontrado, o un string vacío si no se encuentra
        empleadoId: empleadoEncontrado ? String(empleadoEncontrado.id) : '',
        estado: servicio.estado || 'activo'
      };
      setFormData(data);
      setOriginalData({ ...data });
      setPrecioFormatted(formatToPesos(servicio.precio?.toString() || '0'));
    } else {
      navigate('/admin/servicios');
    }
  }, [id, navigate]);

  // 👇 Cerrar notificación
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

    const duracionNum = Number(formData.duracion);
    const precioNum = Number(formData.precio);

    if (duracionNum <= 0) {
      setNotification({
        isVisible: true,
        message: 'La duración debe ser mayor a 0 minutos.',
        type: 'error'
      });
      return;
    }

    if (precioNum <= 0) {
      setNotification({
        isVisible: true,
        message: 'El precio debe ser mayor a 0.',
        type: 'error'
      });
      return;
    }

    // 👇 VALIDACIÓN: No permitir guardar si no hay cambios
    if (originalData && JSON.stringify(formData) === JSON.stringify(originalData)) {
      setNotification({
        isVisible: true,
        message: 'No se han realizado cambios para guardar.',
        type: 'error'
      });
      return;
    }

    try {
      // Actualizar en la base de datos
      const servicioActualizado = {
        ...formData,
        duracion: duracionNum,
        precio: precioNum,
        // Guardamos el ID del empleado en el campo 'empleado'
        empleado: formData.empleadoId
      };

      updateServicio(Number(id), servicioActualizado);

      setNotification({
        isVisible: true,
        message: '¡Servicio actualizado con éxito!',
        type: 'success'
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/admin/servicios');
      }, 2000);

    } catch (error) {
      setNotification({
        isVisible: true,
        message: 'Error al actualizar el servicio. Intente nuevamente.',
        type: 'error'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 👇 Manejar cambio de precio con formato
  const handlePrecioChange = (e) => {
    const rawValue = e.target.value;
    const cleanValue = parseFromPesos(rawValue);
    const formattedValue = formatToPesos(rawValue);

    setPrecioFormatted(formattedValue);
    setFormData(prev => ({
      ...prev,
      precio: cleanValue
    }));
  };

  if (!formData.nombre && formData.nombre !== '') {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <div className="crud-form-container">
        <div className="crud-form-header">
          <h1>Editando: {formData.nombre}</h1>
        </div>

        <div className="crud-form-content" style={{ padding: '0px' }}>
          <form onSubmit={handleSubmit}>
            <div className="crud-form-section">
              {/* 👇 MISMO ORDEN QUE CrearServicio */}
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
                  type="text" // 👈 Texto para formatear
                  id="precio"
                  name="precio"
                  value={precioFormatted}
                  onChange={handlePrecioChange}
                  className="crud-input"
                  placeholder="0"
                  required
                />
              </div>

              {/* 👇 SELECT DE EMPLEADOS */}
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
                  rows="2"
                  className="crud-input crud-textarea"
                  placeholder="Descripción del servicio..."
                />
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
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
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
                Actualizar Servicio
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