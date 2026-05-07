import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from './App.jsx'
import './App.css'
import theme from "../theme/theme.js";

// Configuración óptima para evitar refetch al cambiar de módulo
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,   // 10 minutos sin refetch si hay caché
      gcTime: 1000 * 60 * 30,       // 30 minutos que la caché vive en memoria (React Query v5)
      retry: 1,
      refetchOnWindowFocus: false,  // evita refetch al cambiar pestaña
      refetchOnReconnect: true,    // hace refetch al recuperar internet
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);