import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
  Box,
  useTheme,
  useMediaQuery
} from "@mui/material";

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useMemo } from "react";
import { NavLink } from "react-router-dom";

import { menuStructure } from "../../constants/menuStructure";
import { IconRenderer } from "../ui/SidebarIcons";
import { useSidebar } from "../../hooks/useSidebar";

const drawerWidth = 240;

export default function Sidebar({ open, onToggle, user }) {

  const {
    expandedSections,   // secciones abiertas
    toggleSection,      // función para abrir/cerrar secciones
    hasPermission       // verifica permisos del usuario
  } = useSidebar(user);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  /*
  ============================================
  Filtra los módulos del menú según permisos
  del usuario que vienen del backend
  ============================================
  */
  const filteredSections = useMemo(
    () => menuStructure.filter(section => hasPermission(section.id)),
    [hasPermission]
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      anchor="left"
      open={isMobile ? open : true}
      onClose={isMobile ? onToggle : undefined}
      sx={{
        width: isMobile ? drawerWidth : (open ? drawerWidth : 80),
        flexShrink: 0,

        /*
        ============================================
        Estilos del sidebar
        ============================================
        */
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 80,
          overflowX: "hidden",
          transition: "width 0.3s ease",
          backgroundColor: "#1e293b",
          color: "#fff"
        }
      }}
    >

      {/* espacio para que no se superponga con el navbar */}
      <Toolbar />

      <Box sx={{ overflow: "auto" }}>
        <List>

          {filteredSections.map(section => (
            <Box key={section.id}>

              {/* ===============================
                  BOTÓN DEL MÓDULO PRINCIPAL
                 =============================== */}
              <ListItemButton
                onClick={() => toggleSection(section.id)}
              >

                {/* ICONO DEL MÓDULO */}
                <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                  <IconRenderer name={section.icon} />
                </ListItemIcon>

                {/* TEXTO DEL MÓDULO (solo visible cuando el sidebar está abierto) */}
                {open && <ListItemText primary={section.title} />}

                {/* ICONO EXPANDIR / COLAPSAR */}
                {open && (
                  expandedSections[section.id]
                    ? <ExpandLess />
                    : <ExpandMore />
                )}

              </ListItemButton>

              {/* ===============================
                  SUBMENÚ DEL MÓDULO
                 =============================== */}

              <Collapse
                in={expandedSections[section.id]}
                timeout="auto"
                unmountOnExit
              >

                <List component="div" disablePadding>

                  {section.items.map(item => (

                    <ListItemButton
                      key={item.path}
                      component={NavLink}
                      to={item.path}
                      sx={{ pl: 4 }}
                      onClick={isMobile ? onToggle : undefined}
                    >

                      {/* ICONO DEL ITEM */}
                      <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>
                        <IconRenderer name={item.icon} />
                      </ListItemIcon>

                      {/* TEXTO DEL ITEM */}
                      {open && <ListItemText primary={item.name} />}

                    </ListItemButton>

                  ))}

                </List>

              </Collapse>

            </Box>
          ))}

        </List>
      </Box>
    </Drawer>
  );
}