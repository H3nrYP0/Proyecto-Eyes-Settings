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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";

const BRAND_COLOR = "#1a2540";
const BRAND_HOVER = "#2d3a6b";

export default function CrudLayout({
  title,
  description,
  onAddClick,
  children,

  showSearch = false,
  searchPlaceholder = "Buscar...",
  searchValue = "",
  onSearchChange = null,
  searchFilters = null,
  filterEstado = "",
  onFilterChange = null,
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
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        gap={1.5}
        mb={description ? 1 : 3}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, flexShrink: 0 }}
        >
          {title}
        </Typography>

        {showSearch && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{ ml: { sm: "auto" } }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <TextField
                size="small"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                sx={{ flex: 1, width: { sm: 200 } }}
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

              {searchFilters && (
                <Select
                  value={filterValue}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  displayEmpty
                  size="small"
                  sx={{ flexShrink: 0, minWidth: 130 }}
                >
                  {searchFilters.map((filter) => (
                    <MenuItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Stack>

            {onAddClick && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onAddClick}
                sx={{
                  whiteSpace: "nowrap",
                  width: { xs: "100%", sm: "auto" },
                  backgroundColor: BRAND_COLOR,
                  "&:hover": { backgroundColor: BRAND_HOVER },
                }}
              >
                Agregar
              </Button>
            )}
          </Stack>
        )}
      </Stack>

      {description && (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
      )}

      {children}
    </Box>
  );
}