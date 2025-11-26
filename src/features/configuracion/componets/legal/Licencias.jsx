import { Box, Typography, Paper, Link, Chip } from "@mui/material";

const Licencias = ({ canEdit = false }) => {
  return (
    <div className="configuracion-section">
      <div className="section-header">
        <h2>Licencias de Software Open Source</h2>
        <Chip 
          label={canEdit ? "Administrador" : "Solo Lectura"} 
          color={canEdit ? "primary" : "default"}
          size="small"
          variant="outlined"
        />
      </div>
      
      {!canEdit && (
        <div className="read-only-notice">
          <p>ⓘ Esta sección es informativa. Todos los usuarios pueden ver las licencias del software.</p>
        </div>
      )}

      <Paper elevation={2} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
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
          
          <Box component="ul" sx={{ pl: 3 }}>
            <li>
              <strong>React</strong> © Meta Platforms, Inc. — Licencia MIT —{" "}
              <Link href="https://react.dev" target="_blank">https://react.dev</Link>
            </li>
            <li>
              <strong>Material UI (MUI)</strong> © MUI, Inc. — Licencia MIT —{" "}
              <Link href="https://mui.com" target="_blank">https://mui.com</Link>
            </li>
            <li>
              <strong>Apache ECharts</strong> © Apache Software Foundation — Licencia Apache 2.0 —{" "}
              <Link href="https://echarts.apache.org" target="_blank">https://echarts.apache.org</Link>
            </li>
            <li>
              <strong>React Router</strong> — Licencia MIT —{" "}
              <Link href="https://reactrouter.com" target="_blank">https://reactrouter.com</Link>
            </li>
            <li>
              <strong>Vite</strong> — Licencia MIT —{" "}
              <Link href="https://vitejs.dev" target="_blank">https://vitejs.dev</Link>
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

      <div className="legal-disclaimer">
        <Typography variant="caption" color="text.secondary">
          <strong>Nota:</strong> Esta información sobre licencias es de acceso público y 
          cumple con los requisitos de transparencia de las licencias open source utilizadas.
        </Typography>
      </div>
    </div>
  );
};

export default Licencias;