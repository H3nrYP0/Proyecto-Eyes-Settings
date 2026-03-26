import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CampanaSaludForm from "./components/CampanaSaludForm";
import { getAllEmpleados } from "../empleado/services/empleadosService";
import { getCampanaSaludById, updateCampanaSalud } from "../../../lib/data/campanasSaludData";
import CrudNotification from "../../../shared/styles/components/notifications/CrudNotification"

export default function EditarCampanaSalud() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [campana, setCampana] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [campanaData, empleadosData] = await Promise.all([
        getCampanaSaludById(id),
        getAllEmpleados()
      ]);
      
      setCampana(campanaData);
      
      const empleadosActivos = empleadosData.filter(
        emp => emp.estado === true || emp.estado === 'Activo'
      );
      setEmpleados(empleadosActivos);
      
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setNotification({
        isVisible: true,
        message: 'No se pudo cargar la campaña',
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
      await updateCampanaSalud(parseInt(id), formData);
      
      setNotification({
        isVisible: true,
        message: 'Campaña actualizada correctamente',
        type: 'success'
      });

      setTimeout(() => {
        navigate('/admin/servicios/campanas-salud');
      }, 800);
    } catch (error) {
      console.error("Error al actualizar campaña:", error);
      setNotification({
        isVisible: true,
        message: error.response?.data?.error || 'Error al actualizar la campaña',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/servicios/campanas-salud');
  };

  if (loading && !campana) {
    return (
      <div className="crud-form-container">
        <div className="crud-form-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Cargando campaña...
          </div>
        </div>
      </div>
    );
  }

  if (!campana && !loading) {
    return (
      <div className="crud-form-container">
        <div className="crud-form-content">
          <div style={{ textAlign: 'center', padding: '40px', color: '#d32f2f' }}>
            Campaña no encontrada
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <CampanaSaludForm
        mode="edit"
        title={`Editar Campaña: ${campana?.empresa || ''}`}
        initialData={campana}
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