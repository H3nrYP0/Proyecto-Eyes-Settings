import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
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

        <IconButton color="inherit" edge="start" onClick={onToggleSidebar}>
          <MenuIcon />
        </IconButton>

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

        <IconButton color="inherit" onClick={() => navigate("/")}>
          <HomeIcon />
        </IconButton>

        <Button
          color="inherit"
          startIcon={<PersonIcon />}
          onClick={() => navigate("/admin/perfil")}
        >
          {user?.nombre || "Mi Perfil"}
        </Button>

        <IconButton color="inherit" onClick={onLogout}>
          <LogoutIcon />
        </IconButton>

      </Toolbar>
    </AppBar>
  );
}