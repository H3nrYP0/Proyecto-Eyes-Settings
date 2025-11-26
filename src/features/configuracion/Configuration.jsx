import { useState } from "react";
import { Box, Tabs, Tab, Container,Paper, Alert } from "@mui/material";

// Importar constantes de roles
import { ROLES } from "../../shared/constants/roles";
// Importar componentes
import EmpresaInfo from "../configuracion/componets/general/EmpresaInfo";
import PreferenciasSistema from "../configuracion/componets/general/PreferenciasSistema";
import Apariencia from "../configuracion/componets/general/Apariencia";
import TerminosCondiciones from "../configuracion/componets/legal/TerminosCondiciones";
import PoliticaPrivacidad from "../configuracion/componets/legal/PoliticaPrivacidad";
import Licencias from "../configuracion/componets/legal/Licencias";

// Componente de pestaña
function TabPanel({ children, value, index, ...other }) {
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Configuration = ({ user }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Verificar permisos del usuario actual
  const canEdit = user?.role === ROLES.ADMIN || user?.role === ROLES.SUPER_ADMIN;
  const canView = user?.role === ROLES.VENDEDOR || user?.role === ROLES.OPTICO || canEdit;

  // Si no puede ver, mostrar mensaje
  if (!canView) {
    return (
      <div className="configuracion-container">
        <Alert severity="warning">
          No tienes permisos para acceder a la configuración del sistema.
        </Alert>
      </div>
    );
  }

  const tabs = [
    { 
      label: "Empresa", 
      component: <EmpresaInfo canEdit={canEdit} /> 
    },
    { 
      label: "Preferencias", 
      component: <PreferenciasSistema canEdit={canEdit} /> 
    },
    { 
      label: "Apariencia", 
      component: <Apariencia canEdit={canEdit} /> 
    },
    { 
      label: "Términos", 
      component: <TerminosCondiciones canEdit={canEdit} /> 
    },
    { 
      label: "Privacidad", 
      component: <PoliticaPrivacidad canEdit={canEdit} /> 
    },
    { 
      label: "Licencias", 
      component: <Licencias canEdit={canEdit} /> 
    }
  ];

  return (
    <div className="configuracion-container">
      <div className="configuracion-header">
        <h1>Configuración del Sistema</h1>
        <p>Gestiona las preferencias y configuraciones de tu óptica</p>
        
        {!canEdit && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Estás en modo de solo lectura. Solo los administradores pueden realizar cambios.
          </Alert>
        )}
      </div>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={2}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>

          {tabs.map((tab, index) => (
            <TabPanel key={index} value={activeTab} index={index}>
              {tab.component}
            </TabPanel>
          ))}
        </Paper>
      </Container>
    </div>
  );
};

export default Configuration;