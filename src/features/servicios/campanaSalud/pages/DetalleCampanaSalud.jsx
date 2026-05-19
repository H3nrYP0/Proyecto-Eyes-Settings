import { useParams } from 'react-router-dom';
import { useCampanaSaludForm } from '../hooks/useCampanaSaludForm';
import CampanaSaludForm from '../components/CampanaSaludForm';

/**
 * Página de detalle de una Campaña de Salud.
 * Muestra el formulario en modo solo lectura (isView=true).
 * El botón "Editar" aparece automáticamente en CampanaSaludForm
 * cuando isView=true y la campaña no está en un estado bloqueado.
 */
const DetalleCampanaSalud = () => {
  const { id } = useParams();
  //  Fix: el hook ya expone handleEdit que navega a /editar/:id
  // CampanaSaludForm muestra el botón cuando showEdit={isView && !isEstadoBloqueado}
  const formProps = useCampanaSaludForm(id, 'view');
  return <CampanaSaludForm {...formProps} />;
};

export default DetalleCampanaSalud;