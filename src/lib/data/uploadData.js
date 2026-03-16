import axios from "axios";

export const UploadData = {
  // Subir una imagen a Cloudinary
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'productos_preset'); // ← TU PRESET
    formData.append('cloud_name',  'dgcayso7n'); // ← TU CLOUD NAME

    try {
      const response = await axios.post(
         'https://api.cloudinary.com/v1_1/dgcayso7n/image/upload', 
        formData
      );
      
      console.log(' Imagen subida a Cloudinary:', response.data.secure_url);
      return response.data.secure_url; 
      
    } catch (error) {
      console.error(' Error al subir imagen:', error);
      throw error;
    }
  },
  async uploadMultipleImages(files) {
    try {
      const uploadPromises = files.map(file => this.uploadImage(file));
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      throw error;
    }
  }
};