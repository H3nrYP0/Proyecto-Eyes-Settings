/**
 * Componente que decide qué vista de perfil mostrar según el rol del usuario.
 * 
 * FIX: El hook useConfiguracion se instancia UNA SOLA VEZ aquí y se pasa
 * como prop `useConfiguracionHook` a los hijos. Antes se llamaba dos veces
 * (aquí para leer `esCliente` y otra vez dentro del hijo), duplicando la
 * llamada al API y causando el error "useConfiguracionHook is not a function".
 */

import { useConfiguracion } from '../../hooks/useConfiguracion';
import AparienciaAdmin from './AparienciaAdmin';
import AparienciaCliente from './AparienciaCliente';

export default function Apariencia({ user, onUserUpdate, canEdit = false }) {
  // Una única instancia del hook para toda la jerarquía
  const configuracion = useConfiguracion(user, onUserUpdate);

  if (configuracion.esCliente) {
    return (
      <AparienciaCliente
        user={user}
        onUserUpdate={onUserUpdate}
        canEdit={canEdit}
        configuracion={configuracion}
      />
    );
  }

  return (
    <AparienciaAdmin
      user={user}
      onUserUpdate={onUserUpdate}
      canEdit={canEdit}
      configuracion={configuracion}
    />
  );
} 