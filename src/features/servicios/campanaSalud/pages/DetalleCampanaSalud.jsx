// features/servicios/campanaSalud/pages/DetalleCampanaSalud.jsx

import React from 'react';
import { useParams } from 'react-router-dom';
import { useCampanaSaludForm } from '../hooks/useCampanaSaludForm';
import CampanaSaludForm from '../components/CampanaSaludForm';
import { ESTADOS_BLOQUEADOS } from '../utils/constants';

const DetalleCampanaSalud = () => {
  const { id } = useParams();
  const formProps = useCampanaSaludForm(id, 'view');
  const { formData } = formProps;

  const isEstadoBloqueado = ESTADOS_BLOQUEADOS.includes(formData.estado_cita_id);
    
  return <CampanaSaludForm {...formProps} isEstadoBloqueado={isEstadoBloqueado} />;
};

export default DetalleCampanaSalud;