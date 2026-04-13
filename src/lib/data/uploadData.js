import axios from "axios";

export const UploadData = {
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'productos_preset');
    formData.append('cloud_name', 'dgcayso7n');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dgcayso7n/image/upload',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Cloudinary error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error?.message || 'Error subiendo imagen');
    }
  },

  async uploadMultipleImages(files) {
    const uploadPromises = files.map(file => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }
};