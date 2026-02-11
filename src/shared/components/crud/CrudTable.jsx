import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import CrudActions from "../ui/CrudActions";

export default function UnifiedCrudTable({
  columns = [],
  data = [],
  actions = [],
  loading = false,
  emptyMessage = "No hay registros.",
}) {
  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Cargando...
        </Typography>
      </Paper>
    );
  }

  const visibleColumns = columns.filter(col => col.field !== "id");
  const hasActions = actions && actions.length > 0;

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {visibleColumns.map(col => (
              <TableCell key={col.field}>
                {col.header}
              </TableCell>
            ))}
            {hasActions && (
              <TableCell align="center">Acciones</TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {(!data || data.length === 0) ? (
            <TableRow>
              <TableCell
                colSpan={visibleColumns.length + (hasActions ? 1 : 0)}
                align="center"
                sx={{ py: 6 }}
              >
                <Typography variant="body2" color="text.secondary">
                  {emptyMessage}
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map(row => (
              <TableRow key={row.id} hover>
                {visibleColumns.map(col => (
                  <TableCell key={col.field}>
                    {typeof col.render === "function"
                      ? col.render(row)
                      : row[col.field]
                    }
                  </TableCell>
                ))}

                {hasActions && (
                  <TableCell align="center">
                    <CrudActions
                      actions={actions}
                      item={row}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

