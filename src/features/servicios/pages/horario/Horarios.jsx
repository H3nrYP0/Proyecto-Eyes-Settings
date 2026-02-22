import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEmpleadoById } from '../../../../lib/data/empleadosData';
import "../../../../shared/styles/components/horario.css";

import "../../../../shared/styles/components/crud-forms.css";

export default function Horarios() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [empleado, setEmpleado] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [horariosEspeciales, setHorariosEspeciales] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingHorario, setEditingHorario] = useState(null);

  // Cargar datos
  useEffect(() => {
    const empleadoData = getEmpleadoById(Number(id));
    if (empleadoData) {
      setEmpleado(empleadoData);
      setHorarios(getHorariosByEmpleado(Number(id)));
      setHorariosEspeciales(getHorariosEspecialesByEmpleado(Number(id)));
    }
  }, [id]);

  const [formData, setFormData] = useState({
    tipo: 'regular',
    dias: [],
    horaInicio: '08:00',
    horaFinal: '17:00',
    descansoInicio: '12:00',
    descansoFinal: '13:00',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: '',
    motivo: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const horarioData = {
      empleadoId: Number(id),
      empleadoNombre: empleado.nombre,
      ...formData
    };

    if (editingHorario) {
      updateHorario(editingHorario.id, horarioData);
    } else {
      createHorario(horarioData);
    }

    // Recargar datos
    setHorarios(getHorariosByEmpleado(Number(id)));
    setShowModal(false);
    setEditingHorario(null);
    setFormData({
      tipo: 'regular',
      dias: [],
      horaInicio: '08:00',
      horaFinal: '17:00',
      descansoInicio: '12:00',
      descansoFinal: '13:00',
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaFin: '',
      motivo: ''
    });
  };

  const handleEdit = (horario) => {
    setEditingHorario(horario);
    setFormData({
      tipo: horario.tipo,
      dias: horario.dias,
      horaInicio: horario.horaInicio,
      horaFinal: horario.horaFinal,
      descansoInicio: horario.descansoInicio,
      descansoFinal: horario.descansoFinal,
      fechaInicio: horario.fechaInicio,
      fechaFin: horario.fechaFin || '',
      motivo: horario.motivo || ''
    });
    setShowModal(true);
  };

  const handleDelete = (horarioId) => {
    if (window.confirm('¿Estás seguro de eliminar este horario?')) {
      deleteHorario(horarioId);
      setHorarios(getHorariosByEmpleado(Number(id)));
    }
  };

  const toggleDia = (dia) => {
    setFormData(prev => ({
      ...prev,
      dias: prev.dias.includes(dia) 
        ? prev.dias.filter(d => d !== dia)
        : [...prev.dias, dia]
    }));
  };

  if (!empleado) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="crud-form-container">
      <div className="crud-form-header">
        <h1>Horarios - {empleado.nombre}</h1>
      </div>

      <div className="crud-form-content">
        {/* Resumen de Horarios */}
        <div className="crud-form-section">
          <h3>Horarios Regulares</h3>
          {horarios.length === 0 ? (
            <p>No hay horarios regulares configurados</p>
          ) : (
            horarios.map(horario => (
              <div key={horario.id} className="horario-item">
                <div className="horario-info">
                  <strong>Días: </strong>{horario.dias.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}
                  <br />
                  <strong>Horario: </strong>{horario.horaInicio} - {horario.horaFinal}
                  <br />
                  <strong>Descanso: </strong>{horario.descansoInicio} - {horario.descansoFinal}
                </div>
                <div className="horario-actions">
                  <button onClick={() => handleEdit(horario)} className="crud-btn crud-btn-secondary">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(horario.id)} className="crud-btn crud-btn-delete">
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Horarios Especiales */}
        <div className="crud-form-section">
          <h3>Horarios Especiales</h3>
          {horariosEspeciales.length === 0 ? (
            <p>No hay horarios especiales configurados</p>
          ) : (
            horariosEspeciales.map(horario => (
              <div key={horario.id} className="horario-item especial">
                <div className="horario-info">
                  <strong>Tipo: </strong>{horario.tipo}
                  <br />
                  <strong>Período: </strong>{horario.fechaInicio} - {horario.fechaFin}
                  <br />
                  <strong>Motivo: </strong>{horario.motivo}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="crud-form-actions">
          <button 
            type="button" 
            className="crud-btn crud-btn-secondary"
            onClick={() => navigate('/admin/servicios/empleados')}
          >
            Volver
          </button>
          <button 
            type="button" 
            className="crud-btn crud-btn-primary"
            onClick={() => setShowModal(true)}
          >
            Agregar Horario
          </button>
        </div>
      </div>

      {/* Modal para agregar/editar horario */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingHorario ? 'Editar Horario' : 'Agregar Horario'}</h3>
              <button onClick={() => {setShowModal(false); setEditingHorario(null);}}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-content">
                <div className="crud-form-group">
                  <label>Tipo de Horario</label>
                  <select 
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                    className="crud-input"
                  >
                    {tiposHorario.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                    ))}
                  </select>
                </div>

                {formData.tipo === 'regular' && (
                  <>
                    <div className="crud-form-group">
                      <label>Días de la semana</label>
                      <div className="dias-container">
                        {diasSemana.map(dia => (
                          <label key={dia.value} className="dia-checkbox">
                            <input
                              type="checkbox"
                              checked={formData.dias.includes(dia.value)}
                              onChange={() => toggleDia(dia.value)}
                            />
                            {dia.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="crud-form-row">
                      <div className="crud-form-group">
                        <label>Hora de inicio</label>
                        <input
                          type="time"
                          value={formData.horaInicio}
                          onChange={(e) => setFormData({...formData, horaInicio: e.target.value})}
                          className="crud-input"
                        />
                      </div>
                      <div className="crud-form-group">
                        <label>Hora de fin</label>
                        <input
                          type="time"
                          value={formData.horaFinal}
                          onChange={(e) => setFormData({...formData, horaFinal: e.target.value})}
                          className="crud-input"
                        />
                      </div>
                    </div>

                    <div className="crud-form-row">
                      <div className="crud-form-group">
                        <label>Inicio descanso</label>
                        <input
                          type="time"
                          value={formData.descansoInicio}
                          onChange={(e) => setFormData({...formData, descansoInicio: e.target.value})}
                          className="crud-input"
                        />
                      </div>
                      <div className="crud-form-group">
                        <label>Fin descanso</label>
                        <input
                          type="time"
                          value={formData.descansoFinal}
                          onChange={(e) => setFormData({...formData, descansoFinal: e.target.value})}
                          className="crud-input"
                        />
                      </div>
                    </div>
                  </>
                )}

                {(formData.tipo === 'vacaciones' || formData.tipo === 'permiso') && (
                  <>
                    <div className="crud-form-row">
                      <div className="crud-form-group">
                        <label>Fecha inicio</label>
                        <input
                          type="date"
                          value={formData.fechaInicio}
                          onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
                          className="crud-input"
                        />
                      </div>
                      <div className="crud-form-group">
                        <label>Fecha fin</label>
                        <input
                          type="date"
                          value={formData.fechaFin}
                          onChange={(e) => setFormData({...formData, fechaFin: e.target.value})}
                          className="crud-input"
                        />
                      </div>
                    </div>
                    <div className="crud-form-group">
                      <label>Motivo</label>
                      <input
                        type="text"
                        value={formData.motivo}
                        onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                        className="crud-input"
                        placeholder="Motivo del horario especial"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="crud-btn crud-btn-secondary"
                  onClick={() => {setShowModal(false); setEditingHorario(null);}}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="crud-btn crud-btn-primary"
                >
                  {editingHorario ? 'Actualizar' : 'Guardar'}
                </button>
            </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}