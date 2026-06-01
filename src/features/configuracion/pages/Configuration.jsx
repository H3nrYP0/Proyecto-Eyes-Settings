// features/configuracion/pages/Configuration.jsx
import { Box, Tab, Tabs, Button, CircularProgress, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@auth/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { getMiPerfil } from '@seguridad/user/services/userServices';
import Apariencia from '../components/general/Apariencia';
import Licencias from '../components/legal/Licencias';

const BRAND_COLOR = "#1a2540";
const BORDER_COLOR = "#e2e8f0";
const TEXT_SECONDARY = "#64748b";

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

  const { data: user, isLoading } = useQuery({
    queryKey: ['miPerfil'],
    queryFn: getMiPerfil,
    initialData: propUser,
    staleTime: 1000 * 60 * 5,
  });

  const handleVolver = () => navigate(-1);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando perfil...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Contenedor con flex: pestañas a la izquierda, botón a la derecha */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              color: TEXT_SECONDARY,
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
        <Apariencia user={user} onUserUpdate={onUserUpdate} canEdit />
      </TabPanel>

      {canViewLicencias && (
        <TabPanel value={tabValue} index={1}>
          <Licencias />
        </TabPanel>
      )}
    </Box>
  );
}