import { useParams } from 'react-router-dom';
import { useCampanaSaludForm } from '../hooks/useCampanaSaludForm';
import CampanaSaludForm from '../components/CampanaSaludForm';

const EditarCampanaSalud = () => {
  const { id } = useParams();
  const formProps = useCampanaSaludForm(id, 'edit');
  return <CampanaSaludForm {...formProps} />;
};

export default EditarCampanaSalud;