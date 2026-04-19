import { Box, Typography, Paper, Link, Alert } from "@mui/material";
import { Gavel } from "@mui/icons-material";

const Licencias = ({ canEdit = false }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Gavel color="primary" />
        <Typography variant="h6" component="h2">
          Licencias de Software Open Source
        </Typography>
      </Box>
      
      {!canEdit && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Esta sección es informativa. Todos los usuarios pueden ver las licencias del software.
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: 'background.default' }}>
        <Typography variant="h6" gutterBottom color="primary">
          Aviso de Uso de Software Open Source
        </Typography>
        
        <Typography variant="body1" paragraph>
          <strong>Visual Outtle © 2025</strong> - Sistema de Gestión para Ópticas
        </Typography>

        <Typography variant="body2" paragraph>
          Este software ha sido desarrollado por el equipo de Visual Outtle y utiliza 
          las siguientes tecnologías open source, cada una con su licencia correspondiente:
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Tecnologías Utilizadas:
          </Typography>
          
          <Box component="ul" sx={{ pl: 3, '& li': { mb: 1 } }}>
            <li>
              <strong>React</strong> © Meta Platforms, Inc. — Licencia MIT —{" "}
              <Link href="https://react.dev" target="_blank" rel="noopener">https://react.dev</Link>
            </li>
            <li>
              <strong>Material UI (MUI)</strong> © MUI, Inc. — Licencia MIT —{" "}
              <Link href="https://mui.com" target="_blank" rel="noopener">https://mui.com</Link>
            </li>
            <li>
              <strong>Apache ECharts</strong> © Apache Software Foundation — Licencia Apache 2.0 —{" "}
              <Link href="https://echarts.apache.org" target="_blank" rel="noopener">https://echarts.apache.org</Link>
            </li>
            <li>
              <strong>React Router</strong> — Licencia MIT —{" "}
              <Link href="https://reactrouter.com" target="_blank" rel="noopener">https://reactrouter.com</Link>
            </li>
            <li>
              <strong>Vite</strong> — Licencia MIT —{" "}
              <Link href="https://vitejs.dev" target="_blank" rel="noopener">https://vitejs.dev</Link>
            </li>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
          Estas bibliotecas se emplean únicamente a través de sus APIs públicas 
          y no se ha modificado su código fuente original. Visual Outtle reconoce 
          y respeta los derechos de autor, marcas registradas y las condiciones 
          de uso de cada proyecto open source.
        </Typography>

        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" align="center" color="text.secondary">
            © 2025 Visual Outtle — Todos los derechos reservados.
          </Typography>
        </Box>
      </Paper>

      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          <strong>Nota:</strong> Esta información sobre licencias es de acceso público y 
          cumple con los requisitos de transparencia de las licencias open source utilizadas.
        </Typography>
      </Box>
    </Box>
  );
};

export default Licencias;