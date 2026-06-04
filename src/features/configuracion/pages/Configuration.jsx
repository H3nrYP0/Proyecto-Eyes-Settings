/**
 * Página principal de configuración que muestra pestañas para "Mi perfil" y "Configuración" (solo admin).
 * Carga el perfil del usuario usando el endpoint /mi-perfil a través del hook useConfiguracion,
 * y renderiza el componente Apariencia correspondiente.
 * Ya no depende de getMiPerfil de userServices, sino que usa el flujo unificado.
 */

import { Box, Tab, Tabs, Button, CircularProgress, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@auth/hooks/useAuth';
import Apariencia from '../components/general/Apariencia';
import Licencias from '../components/legal/Licencias';

const BRAND_COLOR = "#1a2540";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ padding: '24px 0' }}>
      {value === index && children}
    </div>
  );
}

export default function Configuration({ user: propUser, onUserUpdate }) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const canViewLicencias = isAdmin();

  // Simplemente pasamos propUser (opcional) y onUserUpdate.
  // El hook useConfiguracion dentro de Apariencia hará la llamada a GET /mi-perfil.

  const handleVolver = () => navigate(-1);

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              color: '#64748b',
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '0.95rem',
              '&.Mui-selected': { color: BRAND_COLOR },
            },
            '& .MuiTabs-indicator': { backgroundColor: BRAND_COLOR, height: 3 },
          }}
        >
          <Tab label="Mi perfil" />
          {canViewLicencias && <Tab label="Configuración" />}
        </Tabs>
        <Button onClick={handleVolver} sx={{ color: BRAND_COLOR, textTransform: 'none' }}>
          Volver
        </Button>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Apariencia user={propUser} onUserUpdate={onUserUpdate} canEdit />
      </TabPanel>

      {canViewLicencias && (
        <TabPanel value={tabValue} index={1}>
          <Licencias />
        </TabPanel>
      )}
    </Box>
  );
}