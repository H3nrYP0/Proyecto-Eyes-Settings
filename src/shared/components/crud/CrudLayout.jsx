import { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  IconButton,
  Button,
  Select,
  MenuItem,
  InputAdornment,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";

export default function CrudLayout({
  title,
  description,
  onAddClick,
  children,

  // búsqueda y filtros
  showSearch = false,
  searchPlaceholder = "Buscar...",
  searchValue = "",
  onSearchChange = null,
  searchFilters = null,
  filterEstado = "",
  onFilterChange = null,
  searchPosition = "left",
}) {
  const [internalSearch, setInternalSearch] = useState("");
  const [internalFilter, setInternalFilter] = useState("");

  const useInternalState = !onSearchChange && !onFilterChange;
  const searchTerm = useInternalState ? internalSearch : searchValue;
  const filterValue = useInternalState ? internalFilter : filterEstado;

  const handleSearchChange = (value) => {
    onSearchChange ? onSearchChange(value) : setInternalSearch(value);
  };

  const handleFilterChange = (value) => {
    onFilterChange ? onFilterChange(value) : setInternalFilter(value);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, overflow: "hidden" }}>
      {/* HEADER */}
      <Stack spacing={1} mb={3}>
        <Typography variant="h4">{title}</Typography>
        {description && (
          <Typography color="text.secondary">{description}</Typography>
        )}
      </Stack>

      {/* SEARCH + ACTIONS */}
      {showSearch && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction="column" spacing={2}>

            {/* BUSCADOR — full width */}
            <TextField
              fullWidth
              size="small"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => handleSearchChange("")}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />

            {/* FILTRO + BOTÓN en una misma fila */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              useFlexGap
            >
              {searchFilters && (
                <Select
                  value={filterValue}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  displayEmpty
                  size="small"
                  sx={{ flex: 1, minWidth: 140, maxWidth: { xs: "100%", sm: 220 } }}
                >
                  {searchFilters.map((filter) => (
                    <MenuItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </MenuItem>
                  ))}
                </Select>
              )}

              {onAddClick && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={onAddClick}
                  sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
                >
                  Agregar
                </Button>
              )}
            </Stack>

          </Stack>
        </Paper>
      )}

      {/* CONTENT */}
      {children}
    </Box>
  );
}