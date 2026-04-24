/**
 * Sidebar - Menú lateral principal de la aplicación
 * 
 * Funcionalidad:
 * - Muestra menú colapsable (íconos cuando está cerrado, texto cuando abierto)
 * - Filtra secciones según permisos del usuario
 * - Al hacer clic en ícono cuando está cerrado → abre el sidebar y expande la sección
 * - Solo una sección puede estar expandida a la vez (las demás se cierran automáticamente)
 * - Dashboard es elemento directo (sin submenú, navega al hacer clic)
 */

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
  Box,
  Tooltip,
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

  const { expandedSections, toggleSection, hasPermission, expandSection } = useSidebar(user);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const filteredSections = useMemo(
    () => menuStructure.filter(section => hasPermission(section.id)),
    [hasPermission]
  );

  // Manejar clic en sección principal
  const handleSectionClick = (section) => {
    const hasSubItems = section.items && section.items.length > 0;
    
    if (!open) {
      // Si el sidebar está cerrado, lo abrimos Y expandimos la sección
      onToggle();
      if (hasSubItems) {
        setTimeout(() => expandSection(section.id), 150);
      }
    } else {
      // Si está abierto, solo expandimos/colapsamos
      if (hasSubItems) {
        toggleSection(section.id);
      }
    }
  };

  // Renderizar Dashboard (sin submenú, navegable)
  const renderDashboard = (section) => {
    return (
      <NavLink
        to={section.path}
        style={{ textDecoration: "none", color: "inherit" }}
        onClick={() => {
          if (isMobile) onToggle();
        }}
      >
        <ListItemButton
          sx={{
            justifyContent: open ? "initial" : "center",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              color: "#fff",
              minWidth: 0,
              mr: open ? 2 : "auto",
              justifyContent: "center",
            }}
          >
            <IconRenderer name={section.icon} />
          </ListItemIcon>
          {open && <ListItemText primary={section.title} />}
        </ListItemButton>
      </NavLink>
    );
  };

  // Renderizar sección con submenú
  const renderSectionWithSubmenu = (section) => {
    return (
      <ListItemButton
        onClick={() => handleSectionClick(section)}
        sx={{
          justifyContent: open ? "initial" : "center",
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            color: "#fff",
            minWidth: 0,
            mr: open ? 2 : "auto",
            justifyContent: "center",
          }}
        >
          <IconRenderer name={section.icon} />
        </ListItemIcon>
        {open && <ListItemText primary={section.title} />}
        {open && (
          expandedSections[section.id] ? <ExpandLess /> : <ExpandMore />
        )}
      </ListItemButton>
    );
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      anchor="left"
      open={isMobile ? open : true}
      onClose={isMobile ? onToggle : undefined}
      sx={{
        width: isMobile ? drawerWidth : (open ? drawerWidth : 80),
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 80,
          overflowX: "hidden",
          transition: "width 0.3s ease",
          backgroundColor: "#1e293b",
          color: "#fff"
        }
      }}
    >
      <Toolbar />

      <Box sx={{ overflow: "auto" }}>
        <List>
          {filteredSections.map(section => {
            const hasSubItems = section.items && section.items.length > 0;
            const isDashboard = section.id === "dashboard";
            
            return (
              <Box key={section.id}>

                {/* BOTÓN DEL MÓDULO PRINCIPAL */}
                <Tooltip
                  title={!open ? section.title : ""}
                  placement="right"
                  arrow
                >
                  {isDashboard 
                    ? renderDashboard(section)
                    : renderSectionWithSubmenu(section)
                  }
                </Tooltip>

                {/* SUBMENÚ - solo si tiene items Y está abierto */}
                {hasSubItems && (
                  <Collapse
                    in={open && expandedSections[section.id]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {section.items.map(item => (
                        <Tooltip
                          key={item.path}
                          title={!open ? item.name : ""}
                          placement="right"
                          arrow
                        >
                          <ListItemButton
                            component={NavLink}
                            to={item.path}
                            onClick={isMobile ? onToggle : undefined}
                            sx={{
                              justifyContent: open ? "initial" : "center",
                              pl: open ? 4 : 2.5,
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                color: "#fff",
                                minWidth: 0,
                                mr: open ? 2 : "auto",
                                justifyContent: "center",
                              }}
                            >
                              <IconRenderer name={item.icon} />
                            </ListItemIcon>

                            {open && <ListItemText primary={item.name} />}
                          </ListItemButton>
                        </Tooltip>
                      ))}
                    </List>
                  </Collapse>
                )}

              </Box>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}