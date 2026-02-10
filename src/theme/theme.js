import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb", // azul moderno
    },
    secondary: {
      main: "#0f172a",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // ❌ NO MAYÚSCULAS
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
