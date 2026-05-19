import { useCampanaSaludForm } from '../hooks/useCampanaSaludForm';
import CampanaSaludForm from '../components/CampanaSaludForm';

const CrearCampanaSalud = () => {
  const formProps = useCampanaSaludForm(null, 'create');
  return <CampanaSaludForm {...formProps} />;
};

export default CrearCampanaSalud;