import { useState } from 'react';
import { Box, Tab, Tabs, Typography, Paper } from '@mui/material';
import { useAuth } from '@auth/hooks/useAuth';
import Apariencia from '../components/general/Apariencia';
import Licencias from '../components/legal/Licencias';

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

  // Obtener permisos CRUD para el módulo configuración
  const configPermisos = hasPermisoCRUD('configuracion');
  
  // Verificar si puede leer (ver la página)
  const canRead = isAdmin() || configPermisos?.leer === true;
  
  // Verificar si puede actualizar (editar apariencia/perfil)
  const canUpdate = isAdmin() || configPermisos?.actualizar === true;
  
  // Solo admin puede ver Licencias
  const canViewLicencias = isAdmin();

  // Si no tiene permiso de lectura
  if (!canRead && !isAdmin()) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error" variant="h6">
            No tienes permiso para ver esta página
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Contacta con el administrador del sistema
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Configuración
      </Typography>
      
      <Paper sx={{ width: '100%' }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, v) => setTabValue(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {/* Apariencia - Visible para todos */}
          <Tab label="Apariencia" />
          
          {/* Licencias - Solo admin */}
          {canViewLicencias && <Tab label="Licencias" />}
        </Tabs>
        
        {/* PANEL 1: APARIENCIA */}
        <TabPanel value={tabValue} index={0}>
          <Apariencia 
            user={user} 
            onUserUpdate={onUserUpdate}
            canEdit={canUpdate}
          />
        </TabPanel>
        
        {/* PANEL 2: LICENCIAS - Solo admin */}
        {canViewLicencias && (
          <TabPanel value={tabValue} index={1}>
            <Licencias />
          </TabPanel>
        )}
      </Paper>
    </Box>
  );
}