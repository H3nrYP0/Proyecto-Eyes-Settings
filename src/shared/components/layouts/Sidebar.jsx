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

  const { expandedSections, toggleSection, hasPermission } = useSidebar(user);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
          {filteredSections.map(section => (
            <Box key={section.id}>

              {/* BOTÓN DEL MÓDULO PRINCIPAL */}
              <Tooltip
                title={!open ? section.title : ""}
                placement="right"
                arrow
              >
                <ListItemButton
                  onClick={() => toggleSection(section.id)}
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
              </Tooltip>

              {/* SUBMENÚ */}
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

            </Box>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}