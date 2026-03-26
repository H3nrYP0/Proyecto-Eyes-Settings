import { AppBar, Toolbar, IconButton, Typography, Button, Tooltip } from "@mui/material";
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Home as HomeIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function AppHeader({ onToggleSidebar, user, onLogout }) {
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#0f172a"
      }}
    >
      <Toolbar>

        <Tooltip title="Menú">
          <IconButton color="inherit" edge="start" onClick={onToggleSidebar}>
            <MenuIcon />
          </IconButton>
        </Tooltip>

        <Typography
          sx={{
            flexGrow: 1,
            ml: 2,
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: "1.3rem",
            letterSpacing: "0.5px"
          }}
        >
          Visual Outlet
        </Typography>

        <Tooltip title="Ir al inicio">
          <IconButton color="inherit" onClick={() => navigate("/")}>
            <HomeIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Ver mi perfil">
          <Button
            color="inherit"
            startIcon={<PersonIcon />}
            onClick={() => navigate("/admin/configuracion")}
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            {user?.nombre || user?.name || "Mi Perfil"}
          </Button>
        </Tooltip>

        <Tooltip title="Cerrar sesión">
          <IconButton color="inherit" onClick={onLogout}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>

      </Toolbar>
    </AppBar>
  );
}