import { useLandingData } from './LandingContext';

// Hook personalizado para acceder a los datos del landing
export const useLandingProducts = () => {
  const { products, loading, getFeaturedProducts, updateProduct } = useLandingData();
  
  return {
    products,
    loading,
    featuredProducts: getFeaturedProducts(),
    updateProduct
  };
};

export const useLandingServices = () => {
  const { services, loading, getFeaturedServices, updateService } = useLandingData();
  
  return {
    services,
    loading,
    featuredServices: getFeaturedServices(),
    updateService
  };
};

export const useLandingSync = () => {
  const { syncProductsFromDashboard, syncServicesFromDashboard } = useLandingData();
  
  return {
    syncProductsFromDashboard,
    syncServicesFromDashboard
  };
};

export default useLandingData;
