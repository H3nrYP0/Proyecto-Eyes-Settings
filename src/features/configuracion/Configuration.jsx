import { useState } from "react";
import { 
  Box, 
  Tabs, 
  Tab, 
  Container, 
  Paper, 
  Alert,
  Typography,
  Chip,
  useTheme
} from "@mui/material";
import {
  Business,
  Settings,
  Palette,
  Description,
  Security,
  Code
} from "@mui/icons-material";

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
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Verificar permisos del usuario actual
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;
  const isAdmin = user?.role === ROLES.ADMIN;
  const isVendedor = user?.role === ROLES.VENDEDOR;
  const isOptico = user?.role === ROLES.OPTICO;
  
  // Lógica de permisos corregida:
  const canEditGlobal = isSuperAdmin || isAdmin; // Puede editar configuraciones globales
  const canEditAparienciaPersonal = isVendedor || isOptico; // Puede editar apariencia personal
  const canView = canEditGlobal || canEditAparienciaPersonal;

  // Definir pestañas disponibles por rol
  const getTabsByRole = () => {
    const allTabs = [
      { 
        label: "Empresa", 
        component: <EmpresaInfo canEdit={canEditGlobal} isGlobal={true} userRole={user?.role} />,
        icon: <Business />,
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN] // Solo admins
      },
      { 
        label: "Preferencias", 
        component: <PreferenciasSistema canEdit={canEditGlobal} isGlobal={true} userRole={user?.role} />,
        icon: <Settings />,
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN] // Solo admins
      },
      { 
        label: "Apariencia", 
        component: (
          <Apariencia 
            canEdit={canEditGlobal || canEditAparienciaPersonal} // ✅ Aquí está la corrección
            isGlobal={canEditGlobal} // Global solo para admins, personal para otros
            userRole={user?.role} 
          />
        ),
        icon: <Palette />,
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.VENDEDOR, ROLES.OPTICO] // Todos pueden ver
      },
      { 
        label: "Términos", 
        component: <TerminosCondiciones canEdit={canEditGlobal} userRole={user?.role} />,
        icon: <Description />,
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN] // Solo admins
      },
      { 
        label: "Privacidad", 
        component: <PoliticaPrivacidad canEdit={canEditGlobal} userRole={user?.role} />,
        icon: <Security />,
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN] // Solo admins
      },
      { 
        label: "Licencias", 
        component: <Licencias canEdit={canEditGlobal} userRole={user?.role} />,
        icon: <Code />,
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.VENDEDOR, ROLES.OPTICO] // Todos pueden ver (solo lectura)
      }
    ];

    return allTabs.filter(tab => tab.roles.includes(user?.role));
  };

  const tabs = getTabsByRole();

  // Si no puede ver, mostrar mensaje
  if (!canView) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">
          No tienes permisos para acceder a la configuración del sistema.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      p: 3, 
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default
    }}>
      {/* Header compacto */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h5" 
          component="h1" 
          sx={{ 
            fontWeight: 600,
            fontSize: { xs: '1.4rem', md: '1.6rem' },
            mb: 1
          }}
        >
          Configuración del Sistema
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Gestiona las preferencias y configuraciones de tu óptica
        </Typography>
        
        {/* Indicador de Rol */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label={user?.role?.toUpperCase()} 
            color={isSuperAdmin ? "secondary" : isAdmin ? "primary" : "default"}
            size="small"
            variant="outlined"
          />
          {(isVendedor || isOptico) && (
            <Chip 
              label="Configuración Personal" 
              color="info"
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        {(isVendedor || isOptico) && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Tienes acceso limitado a la configuración. Solo puedes personalizar tu apariencia personal.
          </Alert>
        )}
      </Box>

      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Paper elevation={2}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                gap: 1
              }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab 
                key={index} 
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
              />
            ))}
          </Tabs>

          {tabs.map((tab, index) => (
            <TabPanel key={index} value={activeTab} index={index}>
              {tab.component}
            </TabPanel>
          ))}
        </Paper>
      </Container>
    </Box>
  );
};

export default Configuration;