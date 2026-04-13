// features/servicios/campanaSalud/pages/DetalleCampanaSalud.jsx

import React from 'react';
import { useParams } from 'react-router-dom';
import { useCampanaSaludForm } from '../hooks/useCampanaSaludForm';
import CampanaSaludForm from '../components/CampanaSaludForm';

const DetalleCampanaSalud = () => {
  const { id } = useParams();
  const formProps = useCampanaSaludForm(id, 'view');
  return <CampanaSaludForm {...formProps} />;
};

export default DetalleCampanaSalud; 