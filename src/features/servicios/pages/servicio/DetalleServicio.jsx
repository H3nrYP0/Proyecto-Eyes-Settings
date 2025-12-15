import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServicioById } from '../../../../lib/data/serviciosData';
import { getAllEmpleados } from '../../../../lib/data/empleadosData'; 
import { formatToPesos } from '../../../../shared/utils/formatCOP'; 

export default function DetalleServicio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [servicio, setServicio] = useState(null);
  const [empleadoNombre, setEmpleadoNombre] = useState('');

  useEffect(() => {
    const servicioData = getServicioById(Number(id));
    if (servicioData) {
      setServicio(servicioData);

      // Buscar el nombre del empleado por su ID
      const empleados = getAllEmpleados();
      const empleado = empleados.find(emp => emp.nombre === servicioData.empleado);
      setEmpleadoNombre(empleado ? `${empleado.nombre} - ${empleado.cargo}` : 'Empleado no encontrado');
    }
  }, [id]);

  if (!servicio) {
    return <div className="crud-form-container" style={{ padding: '32px' }}>Cargando...</div>;
  }

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle de Servicio: {servicio.nombre}</h1>
      </div>
      
      <div className="crud-form-content" style={{ padding: '0px' }}>
        <form>
          <div className="crud-form-section">
            <div className="crud-form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={servicio.nombre || ''}
                disabled
                className="crud-input"
                placeholder="Ej: Examen de la Vista, Adaptación Lentes de Contacto, etc."
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="duracion">Duración (min)</label>
              <input
                type="number"
                id="duracion"
                name="duracion"
                value={servicio.duracion || ''}
                disabled
                className="crud-input"
                placeholder="30"
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="precio">Precio</label>
              <input
                type="text"
                id="precio"
                name="precio"
                value={formatToPesos(servicio.precio?.toString() || '0')}
                disabled
                className="crud-input"
                placeholder="0"
              />
            </div>

            <div className ="crud-form-group">
              <label htmlFor="empleado">Empleado</label>
              <input
                type="text"
                id="empleado"
                name="empleado"
                value={empleadoNombre}
                disabled
                className="crud-input"
                placeholder="Ej: Dr. Carlos Méndez"
              />
            </div>

            <div className="crud-form-group full-width">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={servicio.descripcion || ''}
                disabled
                rows="3"
                className="crud-input crud-textarea"
                placeholder="Descripción del servicio..."
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="estado">Estado</label>
              <input
                type="text"
                id="estado"
                name="estado"
                value={servicio.estado === 'activo' ? 'Activo' : 'Inactivo'}
                disabled
                className="crud-input"
              />
            </div>
          </div>

          <div className="crud-form-actions">
            <button 
              type="button"
              onClick={() => navigate('/admin/servicios')}
              className="crud-btn crud-btn-secondary"
            >
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}