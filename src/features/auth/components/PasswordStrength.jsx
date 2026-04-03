import { useMemo } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

export default function PasswordStrength({ password }) {
  const strength = useMemo(() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6)          score += 25;
    if (/[A-Z]/.test(password))        score += 25;
    if (/[0-9]/.test(password))        score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    return Math.min(score, 100);
  }, [password]);

  const getColor = () => strength < 40 ? 'error' : strength < 70 ? 'warning' : 'success';
  const getLabel = () => strength < 40 ? 'Débil'  : strength < 70 ? 'Media'   : 'Fuerte';

  if (!password) return null;

  return (
    <Box sx={{ mt: 0.5, mb: 1 }}>
      <LinearProgress variant="determinate" value={strength} color={getColor()}
        sx={{ height: 4, borderRadius: 2 }} />
      <Typography variant="caption" color="text.secondary"
        sx={{ fontSize: '0.75rem', fontWeight: '500' }}>
        Fortaleza: {getLabel()}
      </Typography>
    </Box>
  );
}