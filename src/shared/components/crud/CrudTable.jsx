import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";

export default function UnifiedCrudTable({
  columns = [],
  data = [],
  actions = [],
  emptyMessage = "No hay registros.",
  loading = false,
}) {
  // =============================
  //        LOADING
  // =============================
  if (loading) {
    return (
      <Paper sx={{ padding: 4, textAlign: "center" }}>
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
      <Table size="small" aria-label="Tabla de datos">
        {/* =============================
            HEADER
        ============================= */}
        <TableHead>
          <TableRow>
            {visibleColumns.map(col => (
              <TableCell key={col.field}>
                {col.header}
              </TableCell>
            ))}
            {hasActions && (
              <TableCell align="right">
                Acciones
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        {/* =============================
            BODY
        ============================= */}
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
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      {actions.map((action, idx) => (
                        <Button
                          key={idx}
                          size="small"
                          variant="outlined"
                          sx={{ textTransform: "none" }}
                          color={
                            action.type === "delete"
                              ? "error"
                              : action.type === "edit"
                              ? "primary"
                              : "inherit"
                          }
                          onClick={() => action.onClick?.(row)}
                          disabled={action.disabled?.(row)}
                          title={action.title}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </Stack>
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
