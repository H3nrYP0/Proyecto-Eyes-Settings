import { Stack, IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

export default function CrudActions({ actions = [], item }) {
  return (
    <Stack direction="row" spacing={0.5} justifyContent="center">
      {actions.map((action, index) => {
        if (action.type === "toggle-status") {
          const isActive = item.estado === "activo";
          const Icon = isActive ? ToggleOnIcon : ToggleOffIcon;

          return (
            <Tooltip
              key={index}
              title={isActive ? "Desactivar" : "Activar"}
            >
              <IconButton
                size="small"
                color={isActive ? "success" : "default"}
                onClick={() => action.onClick(item)}
              >
                <Icon fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        }

        if (action.type === "view") {
          return (
            <Tooltip key={index} title={action.label}>
              <IconButton
                size="small"
                onClick={() => action.onClick(item)}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        }

        if (action.type === "edit") {
          return (
            <Tooltip key={index} title={action.label}>
              <IconButton
                size="small"
                onClick={() => action.onClick(item)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        }

        if (action.type === "delete") {
          return (
            <Tooltip key={index} title={action.label}>
              <IconButton
                size="small"
                color="error"
                onClick={() => action.onClick(item)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        }

        return null;
      })}
    </Stack>
  );
}
