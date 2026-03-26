import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CampanaSaludForm from "./components/CampanaSaludForm";
import { getCampanaSaludById } from "../../../lib/data/campanasSaludData";
import { getAllEmpleados } from "../empleado/services/empleadosService";
import CrudNotification from "../../../shared/styles/components/notifications/CrudNotification"

export default function DetalleCampanaSalud() {
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
  console.log('🏁 DetalleCampanaSalud montado - ID desde params:', id, 'Tipo:', typeof id);
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
      console.error("Error al cargar campaña:", err);
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

  const handleEdit = () => {
    navigate(`/admin/servicios/campanas-salud/editar/${id}`);
  };

  const handleCancel = () => {
    navigate('/admin/servicios/campanas-salud');
  };

  if (loading) {
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

  if (!campana) {
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
        mode="view"
        title={`Detalle de Campaña: ${campana.empresa}`}
        initialData={campana}
        empleadosDisponibles={empleados}
        onCancel={handleCancel}
        onEdit={handleEdit}
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