import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Toolbar,
  Box
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState, useMemo } from "react";
import { NavLink } from "react-router-dom";

import { menuStructure } from "../../constants/menuStructure";
import { IconRenderer } from "../ui/SidebarIcons";
import { useSidebar } from "../../hooks/useSidebar";

const drawerWidth = 240;

export default function Sidebar({ open, user }) {
  const { hasPermission } = useSidebar(user);
  const [openSections, setOpenSections] = useState({});

  const filteredSections = useMemo(
    () => menuStructure.filter(section => hasPermission(section.id)),
    [hasPermission]
  );

  const toggleSection = (id) => {
    setOpenSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
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

              <ListItemButton onClick={() => toggleSection(section.id)}>
                <ListItemIcon sx={{ color: "#fff" }}>
                  <IconRenderer name={section.icon} />
                </ListItemIcon>
                <ListItemText primary={section.title} />
                {openSections[section.id] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={openSections[section.id]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {section.items.map(item => (
                    <ListItemButton
                      key={item.path}
                      component={NavLink}
                      to={item.path}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon sx={{ color: "#fff" }}>
                        <IconRenderer name={item.icon} />
                      </ListItemIcon>
                      <ListItemText primary={item.name} />
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
