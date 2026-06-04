import { Stack, IconButton, Tooltip } from "@mui/material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export default function CrudActions({ actions = [], item }) {
  return (
    <Stack direction="row" spacing={0.5} justifyContent="center">
      {actions.map((action, index) => {
        let icon = null;
        let color = "default";
        let tooltip = action.label || "";

        switch (action.type) {
          case "view":
            icon = <RemoveRedEyeOutlinedIcon fontSize="small" />;
            tooltip = tooltip || "Ver";
            break;
          case "edit":
            icon = <EditOutlinedIcon fontSize="small" />;
            tooltip = tooltip || "Editar";
            break;
          case "delete":
            icon = <DeleteOutlineOutlinedIcon fontSize="small" />;
            color = "error";
            tooltip = tooltip || "Eliminar";
            break;
          default:
            return null;
        }

        return (
          <Tooltip key={`${action.type}-${index}`} title={tooltip}>
            <IconButton size="small" color={color} onClick={() => action.onClick(item)}>
              {icon}
            </IconButton>
          </Tooltip>
        );
      })}
    </Stack>
  );
}