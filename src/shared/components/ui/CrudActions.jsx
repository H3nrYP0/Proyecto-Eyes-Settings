import { Stack, IconButton, Tooltip } from "@mui/material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

export default function CrudActions({ actions = [], item }) {
  return (
    <Stack direction="row" spacing={0.5} justifyContent="center">
      {actions.map((action, index) => {
        if (action.type === "view") {
          return (
            <Tooltip key={index} title={action.label || "Ver"}>
              <IconButton size="small" onClick={() => action.onClick(item)}>
                <RemoveRedEyeOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        }

        if (action.type === "edit") {
          return (
            <Tooltip key={index} title={action.label || "Editar"}>
              <IconButton size="small" onClick={() => action.onClick(item)}>
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        }

        if (action.type === "delete") {
          return (
            <Tooltip key={index} title={action.label || "Eliminar"}>
              <IconButton
                size="small"
                color="error"
                onClick={() => action.onClick(item)}
              >
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          );
        }

        return null;
      })}
    </Stack>
  );
}
