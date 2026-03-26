import { Box, Typography } from "@mui/material";

export default function BaseViewField({ label, value }) {
  return (
    <Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 0.5 }}
      >
        {label}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          padding: "10px 12px",
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          backgroundColor: "#fafafa",
          minHeight: "42px",
          display: "flex",
          alignItems: "center"
        }}
      >
        {value || "—"}
      </Typography>
    </Box>
  );
}
