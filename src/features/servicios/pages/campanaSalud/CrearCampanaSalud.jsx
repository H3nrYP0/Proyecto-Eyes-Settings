import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CampanaSaludForm from './components/CampanaSaludForm';
import { createCampanaSalud } from '../../../../lib/data/campanasSaludData';
import { getAllEmpleados } from '../empleado/services/empleadosService';
import CrudNotification from "../../../../shared/styles/components/notifications/CrudNotification"

export default function CrearCampanaSalud() {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    loadEmpleados();
  }, []);

  const loadEmpleados = async () => {
    try {
      setLoading(true);
      const data = await getAllEmpleados();
      const empleadosActivos = data.filter(
        emp => emp.estado === true || emp.estado === 'Activo'
      );
      setEmpleados(empleadosActivos);
    } catch (error) {
      console.error("Error cargando campañas de salud:", error);
      setNotification({
        isVisible: true,
        message: 'Error al cargar campañas de salud',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await createCampanaSalud(formData);

      setNotification({
        isVisible: true,
        message: 'Campaña creada correctamente',
        type: 'success'
      });

      setTimeout(() => {
        navigate('/admin/servicios/campanas-salud');
      }, 800);
    } catch (error) {
      console.error("Error creando campaña:", error);
      setNotification({
        isVisible: true,
        message: error.response?.data?.error || 'Error al crear la campaña',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/servicios/campanas-salud');
  };

  if (loading) {
    return (
      <div className="crud-form-container">
        <div className="crud-form-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Cargando campañas de salud...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <CampanaSaludForm
        mode="create"
        title="Crear Nueva Campaña de Salud"
        empleadosDisponibles={empleados}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
      
      <CrudNotification
        isVisible={notification.isVisible}
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
      />
    </>
  );
}