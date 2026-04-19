import { useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useAuth } from '@auth/hooks/useAuth';
import Apariencia from '../components/general/Apariencia';
import Licencias from '../components/legal/Licencias';

// Colores del panel admin
const BRAND_COLOR = "#1a2540";
const BRAND_HOVER = "#2d3a6b";
const TEXT_SECONDARY = "#64748b";
const BORDER_COLOR = "#e2e8f0";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ padding: '24px 0' }}>
      {value === index && children}
    </div>
  );
}

export default function Configuration({ user, onUserUpdate }) {
  const { user: currentUser, hasPermisoCRUD, isAdmin } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  // Cualquier usuario autenticado puede ver su perfil
  // No se necesita permiso especial para ver/editar datos propios
  const canViewLicencias = isAdmin();
  
  // Para editar, cualquiera puede editar sus propios datos
  const canUpdate = true;

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Debes iniciar sesión para ver tu perfil</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Configuración
      </Typography>
      
      <Box>
        <Tabs 
          value={tabValue} 
          onChange={(e, v) => setTabValue(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: `1px solid ${BORDER_COLOR}`,
            '& .MuiTab-root': {
              color: TEXT_SECONDARY,
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '0.95rem',
              '&.Mui-selected': {
                color: BRAND_COLOR,
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: BRAND_COLOR,
              height: 3,
            },
          }}
        >
          <Tab label="Apariencia" />
          {canViewLicencias && <Tab label="Licencias" />}
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <Apariencia 
            user={user} 
            onUserUpdate={onUserUpdate}
            canEdit={canUpdate}
          />
        </TabPanel>
        
        {canViewLicencias && (
          <TabPanel value={tabValue} index={1}>
            <Licencias />
          </TabPanel>
        )}
      </Box>
    </Box>
  );
}