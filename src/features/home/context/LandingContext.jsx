import { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const LandingContext = createContext();

// Hook personalizado para usar el contexto
export const useLandingData = () => {
  const context = useContext(LandingContext);
  if (!context) {
    throw new Error('useLandingData debe ser usado dentro de LandingProvider');
  }
  return context;
};

// Proveedor del contexto
export const LandingProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos iniciales desde localStorage o datos de ejemplo
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    // Intentar cargar desde localStorage primero
    const savedProducts = localStorage.getItem('landing_products');
    const savedServices = localStorage.getItem('landing_services');

    if (savedProducts && savedServices) {
      setProducts(JSON.parse(savedProducts));
      setServices(JSON.parse(savedServices));
    } else {
      // Datos de ejemplo iniciales
      const initialProducts = [
        {
          id: 1,
          name: "Lentes Ray-Ban Aviator",
          category: "Lentes de Sol",
          price: 250000,
          image: "/api/placeholder/300/300",
          description: "Lentes de sol clásicos con protección UV 400",
          inStock: true,
          featured: true
        },
        {
          id: 2,
          name: "Armazón Oakley Frame",
          category: "Monturas",
          price: 180000,
          image: "/api/placeholder/300/300",
          description: "Armazón deportivo de alta resistencia",
          inStock: true,
          featured: true
        }
      ];

      const initialServices = [
        {
          id: 1,
          name: "Examen de la Vista Completo",
          duration: "30 min",
          price: 50000,
          description: "Evaluación completa de agudeza visual, presión ocular y salud ocular",
          features: ["Agudeza visual", "Presión ocular", "Fondo de ojo", "Prescripción"],
          featured: true
        },
        {
          id: 2,
          name: "Ajuste y Reparación de Lentes",
          duration: "15 min",
          price: 15000,
          description: "Ajuste profesional de monturas y reparación de lentes",
          features: ["Ajuste de montura", "Cambio de plaquetas", "Reparación de varillas"],
          featured: true
        }
      ];

      setProducts(initialProducts);
      setServices(initialServices);
      
      // Guardar en localStorage para persistencia
      localStorage.setItem('landing_products', JSON.stringify(initialProducts));
      localStorage.setItem('landing_services', JSON.stringify(initialServices));
    }
    
    setLoading(false);
  };

  // Sincronizar productos desde el dashboard
  const syncProductsFromDashboard = (dashboardProducts) => {
    const formattedProducts = dashboardProducts.map(product => ({
      id: product.id,
      name: product.nombre,
      category: product.categoria,
      price: product.precioVenta,
      image: product.imagen || "/api/placeholder/300/300",
      description: product.descripcion || `Producto ${product.nombre} de calidad`,
      inStock: product.estado === 'activo' && product.stockActual > 0,
      featured: product.estado === 'activo'
    }));

    setProducts(formattedProducts);
    localStorage.setItem('landing_products', JSON.stringify(formattedProducts));
  };

  // Sincronizar servicios desde el dashboard
  const syncServicesFromDashboard = (dashboardServices) => {
    const formattedServices = dashboardServices.map(service => ({
      id: service.id,
      name: service.nombre,
      duration: `${service.duracion} min`,
      price: service.precio,
      description: service.descripcion || `Servicio ${service.nombre} profesional`,
      features: service.features || ["Servicio profesional", "Atención personalizada"],
      featured: service.estado === 'activo'
    }));

    setServices(formattedServices);
    localStorage.setItem('landing_services', JSON.stringify(formattedServices));
  };

  // Obtener productos destacados
  const getFeaturedProducts = () => {
    return products.filter(product => product.featured);
  };

  // Obtener servicios destacados
  const getFeaturedServices = () => {
    return services.filter(service => service.featured);
  };

  // Actualizar estado de un producto
  const updateProduct = (productId, updates) => {
    const updatedProducts = products.map(product =>
      product.id === productId ? { ...product, ...updates } : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('landing_products', JSON.stringify(updatedProducts));
  };

  // Actualizar estado de un servicio
  const updateService = (serviceId, updates) => {
    const updatedServices = services.map(service =>
      service.id === serviceId ? { ...service, ...updates } : service
    );
    setServices(updatedServices);
    localStorage.setItem('landing_services', JSON.stringify(updatedServices));
  };

  const value = {
    products,
    services,
    loading,
    syncProductsFromDashboard,
    syncServicesFromDashboard,
    getFeaturedProducts,
    getFeaturedServices,
    updateProduct,
    updateService
  };

  return (
    <LandingContext.Provider value={value}>
      {children}
    </LandingContext.Provider>
  );
};

export default LandingContext;