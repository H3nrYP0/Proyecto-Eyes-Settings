// src/features/compras/producto/components/ImageGallery.jsx
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { IconButton, Tooltip, Box } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { useImageGallery } from '../hooks/useImageGallery';

const ImageInfoOverlay = ({ productName, currentIndex, total }) => (
  <Box
    sx={{
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'white',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: '8px 16px',
      borderRadius: '8px',
      margin: '0 auto',
      width: 'fit-content',
      pointerEvents: 'none',
      zIndex: 10,
      fontSize: '14px',
      fontFamily: 'sans-serif',
    }}
  >
    {productName && <span style={{ fontWeight: 'bold' }}>{productName}</span>}
    {productName && ' - '}
    <span>Imagen {currentIndex + 1} de {total}</span>
  </Box>
);

const LightboxSlide = ({ slide, productName, currentIndex, total }) => (
  <Box
    sx={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(58, 58, 58, 0.3)',
    }}
  >
    <Box
      component="img"
      src={slide.src}
      alt=""
      sx={{
        maxWidth: '90%',
        maxHeight: '90%',
        objectFit: 'contain',
      }}
    />
    <ImageInfoOverlay
      productName={productName}
      currentIndex={currentIndex}
      total={total}
    />
  </Box>
);

export const ImageGallery = ({ images, size = 'small', showAsButton = false, productName = '' }) => {
  const {
    open,
    currentIndex,
    slides,
    total,
    handleOpen,
    handleClose,
    handleViewChange,
  } = useImageGallery(images);

  if (!images || images.length === 0) return null;

  const commonLightboxProps = {
    open,
    close: handleClose,
    index: currentIndex,
    slides,
    styles: { container: { backgroundColor: 'rgba(0, 0, 0, 0.85)' } },
    on: {
      view: handleViewChange,
    },
  };

  const renderSlide = ({ slide }) => (
    <LightboxSlide
      slide={slide}
      productName={productName}
      currentIndex={currentIndex}
      total={total}
    />
  );

  if (showAsButton) {
    return (
      <>
        <Tooltip title="Ver galería de imágenes">
          <IconButton onClick={() => handleOpen(0)} size={size}>
            <ImageIcon fontSize={size} />
          </IconButton>
        </Tooltip>
        <Lightbox {...commonLightboxProps} render={{ slide: renderSlide }} />
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
            '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' },
          }}
        >
          <ImageIcon fontSize={size} />
        </IconButton>
      </Tooltip>
      <Lightbox {...commonLightboxProps} render={{ slide: renderSlide }} />
    </>
  );
};