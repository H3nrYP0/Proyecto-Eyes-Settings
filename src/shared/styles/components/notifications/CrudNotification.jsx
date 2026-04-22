// src/shared/components/notifications/CrudNotification.jsx
import { useEffect, useState, useRef } from 'react';
import { Paper, Box, LinearProgress, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function CrudNotification({
  message,
  type = 'success',
  isVisible,
  onClose,
  duration = 10000
}) {
  const [progress, setProgress] = useState(100);
  const [open, setOpen] = useState(false);
  const startTimeRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      setOpen(true);
      setProgress(100);
      startTimeRef.current = performance.now();

      const updateProgress = (now) => {
        const elapsed = now - startTimeRef.current;
        const remainingPercent = Math.max(0, ((duration - elapsed) / duration) * 100);
        setProgress(remainingPercent);

        if (remainingPercent > 0) {
          animationRef.current = requestAnimationFrame(updateProgress);
        } else {
          handleClose();
        }
      };

      animationRef.current = requestAnimationFrame(updateProgress);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      setOpen(false);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setOpen(false);
    onClose();
  };

  if (!open) return null;

  const isSuccess = type === 'success';

  return (
    <Paper
      elevation={6}
      sx={{
        position: 'fixed',
        top: 80,
        right: 20,
        minWidth: 320,
        maxWidth: 450,
        zIndex: 9999,
        backgroundColor: isSuccess ? '#f0fdf4' : '#fef2f2',
        borderLeft: `4px solid ${isSuccess ? '#22c55e' : '#ef4444'}`,
        overflow: 'hidden',
        animation: 'slideInRight 0.3s ease-out',
        '@keyframes slideInRight': {
          from: {
            transform: 'translateX(100%)',
            opacity: 0,
          },
          to: {
            transform: 'translateX(0)',
            opacity: 1,
          },
        },
      }}
    >
      <Box sx={{ p: 2, pr: 5 }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '0.95rem',
            color: isSuccess ? '#166534' : '#991b1b',
            mb: 2,
            pr: 1,
          }}
        >
          {message}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 4,
            borderRadius: 2,
            backgroundColor: isSuccess ? '#bbf7d0' : '#fecaca',
            '& .MuiLinearProgress-bar': {
              borderRadius: 2,
              backgroundColor: isSuccess ? '#22c55e' : '#ef4444',
              transition: 'width 0.05s linear',
            },
          }}
        />

        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: isSuccess ? '#166534' : '#991b1b',
            '&:hover': {
              backgroundColor: isSuccess ? '#dcfce7' : '#fee2e2',
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
}