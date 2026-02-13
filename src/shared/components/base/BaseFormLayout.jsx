import { Box, Paper, Typography } from "@mui/material";

export default function BaseFormLayout({
  title,
  children,
  maxWidth = "1100px"
}) {
  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.default"
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            {title}
          </Typography>
        </Box>

        {/* CONTENT */}
        <Box
          sx={{
            px: 3,
            py: 3,
            display: "flex",
            flexDirection: "column",
            gap: 3
          }}
        >
          {children}
        </Box>
      </Paper>
    </Box>
  );

}
