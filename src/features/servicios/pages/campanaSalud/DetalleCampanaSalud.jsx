import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCampanaSaludById } from '../../../../lib/data/campanasSaludData';
import { getAllEmpleados } from '../../../../lib/data/empleadosData'; // Para mostrar el nombre del empleado
import "../../../../shared/styles/components/crud-forms.css";

export default function DetalleCampanaSalud() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campana, setCampana] = useState(null);
  const [empleadoNombre, setEmpleadoNombre] = useState('');

  useEffect(() => {
    const campanaData = getCampanaSaludById(Number(id));
    if (campanaData) {
      setCampana(campanaData);

      // Buscar el nombre del empleado por su ID
      const empleados = getAllEmpleados();
      const empleado = empleados.find(emp => emp.id === Number(campanaData.empleadoId));
      setEmpleadoNombre(empleado ? `${empleado.nombre} - ${empleado.cargo}` : 'Empleado no encontrado');
    }
  }, [id]);

  if (!campana) {
    return <div className="crud-form-container" style={{ padding: '32px' }}>Cargando...</div>;
  }

  // Función para formatear el estado
  const getEstadoTexto = (estado) => {
    switch(estado) {
      case 'activa': return 'Activa';
      case 'proxima': return 'Próxima';
      case 'finalizada': return 'Finalizada';
      case 'inactiva': return 'Inactiva';
      default: return estado;
    }
  };

  // Función para obtener la clase del badge
  const getEstadoBadge = (estado) => {
    switch(estado) {
      case 'activa': return 'crud-badge-success';
      case 'proxima': return 'crud-badge-warning';
      case 'finalizada': return 'crud-badge';
      case 'inactiva': return 'crud-badge-error';
      default: return 'crud-badge';
    }
  };

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Detalle de Campaña: {campana.empresa}</h1>
      </div>
      
      <div className="crud-form-content" style={{ padding: '0px' }}>
        <form>
          <div className="crud-form-section">
            <div className="crud-form-group">
              <label htmlFor="empresa">Empresa</label>
              <input
                type="text"
                id="empresa"
                name="empresa"
                value={campana.empresa || ''}
                disabled
                className="crud-input"
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="empleadoId">Empleado</label>
              <input
                type="text"
                id="empleadoId"
                name="empleadoId"
                value={empleadoNombre}
                disabled
                className="crud-input"
              />
            </div>

            <div className="crud-form-row">
              <div className="crud-form-group">
                <label htmlFor="contacto">Contacto</label>
                <input
                  type="text"
                  id="contacto"
                  name="contacto"
                  value={campana.contacto || ''}
                  disabled
                  className="crud-input"
                />
              </div>

              <div className="crud-form-group">
                <label htmlFor="direccion">Dirección</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={campana.direccion || ''}
                  disabled
                  className="crud-input"
                />
              </div>
            </div>

            <div className="crud-form-row">
              <div className="crud-form-group">
                <label htmlFor="fecha">Fecha</label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  value={campana.fecha || ''}
                  disabled
                  className="crud-input"
                />
              </div>

              <div className="crud-form-group">
                <label htmlFor="hora">Hora</label>
                <input
                  type="time"
                  id="hora"
                  name="hora"
                  value={campana.hora || ''}
                  disabled
                  className="crud-input"
                />
              </div>
            </div>

            

            <div className="crud-form-group ">
              <label htmlFor="observaciones">Observaciones</label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={campana.observaciones || ''}
                disabled
                rows="3"
                className="crud-input crud-textarea"
              />
            </div>

            <div className="crud-form-group">
              <label htmlFor="estado">Estado</label>
              <input
                type="text"
                id="estado"
                name="estado"
                value={getEstadoTexto(campana.estado)}
                disabled
                className="crud-input"
              />
            </div>
          </div>

          <div className="crud-form-actions">
            <button 
              type="button"
              onClick={() => navigate('/admin/servicios/campanas-salud')}
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