import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { IconButton, Tooltip } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import VisibilityIcon from '@mui/icons-material/Visibility';

export const ImageGallery = ({ images, size = 'small', showAsButton = false }) => {
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const slides = images.map(img => ({ src: img.url }));

  const handleOpen = (index = 0) => {
    setPhotoIndex(index);
    setOpen(true);
  };

  if (showAsButton) {
    return (
      <>
        <Tooltip title="Ver galería de imágenes">
          <IconButton onClick={() => handleOpen(0)} size={size}>
            <ImageIcon fontSize={size} />
          </IconButton>
        </Tooltip>
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={photoIndex}
          slides={slides}
          styles={{ container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' } }}
        />
      </>
    );
  }

  return (
    <>
      <Tooltip title="Ver imágenes" arrow>
        <IconButton
          size={size}
          onClick={() => handleOpen(0)}
          sx={{
            color: '#1976d2',
            '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' }
          }}
        >
          <ImageIcon fontSize={size} />
        </IconButton>
      </Tooltip>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={photoIndex}
        slides={slides}
        styles={{ container: { backgroundColor: 'rgba(0, 0, 0, 0.95)' } }}
      />
    </>
  );
};