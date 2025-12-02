// Servicio para manejar la sincronización de datos entre dashboard y landing

// Simular datos del dashboard (en producción esto vendría de tu API o base de datos)
export const getDashboardProducts = () => {
  // Esto simula obtener productos del módulo de compras del dashboard
  try {
    const productsFromStorage = localStorage.getItem('productos');
    if (productsFromStorage) {
      return JSON.parse(productsFromStorage);
    }
    
    // Datos de ejemplo del dashboard
    return [
      {
        id: 1,
        nombre: "Lentes Ray-Ban Aviator",
        categoria: "Lentes de Sol",
        precioVenta: 250000,
        precioCompra: 150000,
        stockActual: 10,
        stockMinimo: 5,
        estado: "activo",
        descripcion: "Lentes de sol clásicos con protección UV 400",
        codigo: "RB-AV001",
        marca: "Ray-Ban"
      },
      {
        id: 2,
        nombre: "Armazón Oakley Frame",
        categoria: "Monturas",
        precioVenta: 180000,
        precioCompra: 100000,
        stockActual: 8,
        stockMinimo: 3,
        estado: "activo",
        descripcion: "Armazón deportivo de alta resistencia",
        codigo: "OK-FR002",
        marca: "Oakley"
      },
      {
        id: 3,
        nombre: "Lentes de Contacto Acuvue",
        categoria: "Lentes de Contacto",
        precioVenta: 120000,
        precioCompra: 80000,
        stockActual: 0,
        stockMinimo: 10,
        estado: "inactivo",
        descripcion: "Lentes de contacto desechables mensuales",
        codigo: "AC-CL003",
        marca: "Johnson & Johnson"
      }
    ];
  } catch (error) {
    console.error('Error obteniendo productos del dashboard:', error);
    return [];
  }
};

export const getDashboardServices = () => {
  // Esto simula obtener servicios del módulo de servicios del dashboard
  try {
    const servicesFromStorage = localStorage.getItem('servicios');
    if (servicesFromStorage) {
      return JSON.parse(servicesFromStorage);
    }
    
    // Datos de ejemplo del dashboard
    return [
      {
        id: 1,
        nombre: "Examen de la Vista Completo",
        duracion: 30,
        precio: 50000,
        estado: "activo",
        descripcion: "Evaluación completa de agudeza visual, presión ocular y salud ocular",
        empleado: "Dr. Carlos Méndez",
        features: ["Agudeza visual", "Presión ocular", "Fondo de ojo", "Prescripción"]
      },
      {
        id: 2,
        nombre: "Ajuste y Reparación de Lentes",
        duracion: 15,
        precio: 15000,
        estado: "activo",
        descripcion: "Ajuste profesional de monturas y reparación de lentes",
        empleado: "Técnico Especializado",
        features: ["Ajuste de montura", "Cambio de plaquetas", "Reparación de varillas"]
      },
      {
        id: 3,
        nombre: "Lentes de Contacto Personalizados",
        duracion: 45,
        precio: 80000,
        estado: "activo",
        descripcion: "Adaptación y entrenamiento para lentes de contacto",
        empleado: "Dr. Ana López",
        features: ["Evaluación", "Adaptación", "Entrenamiento", "Seguimiento"]
      }
    ];
  } catch (error) {
    console.error('Error obteniendo servicios del dashboard:', error);
    return [];
  }
};

// Función para sincronizar productos automáticamente
export const syncProductsAutomatically = (syncFunction) => {
  try {
    const dashboardProducts = getDashboardProducts();
    syncFunction(dashboardProducts);
    console.log('✅ Productos sincronizados desde dashboard:', dashboardProducts.length);
    return true;
  } catch (error) {
    console.error('❌ Error sincronizando productos:', error);
    return false;
  }
};

// Función para sincronizar servicios automáticamente
export const syncServicesAutomatically = (syncFunction) => {
  try {
    const dashboardServices = getDashboardServices();
    syncFunction(dashboardServices);
    console.log('✅ Servicios sincronizados desde dashboard:', dashboardServices.length);
    return true;
  } catch (error) {
    console.error('❌ Error sincronizando servicios:', error);
    return false;
  }
};

// Función para verificar cambios en los datos del dashboard
export const checkForDashboardUpdates = () => {
  const lastSync = localStorage.getItem('last_sync');
  const currentTime = new Date().getTime();
  
  // Sincronizar automáticamente cada 5 minutos
  if (!lastSync || (currentTime - parseInt(lastSync)) > 5 * 60 * 1000) {
    localStorage.setItem('last_sync', currentTime.toString());
    return true;
  }
  
  return false;
};

// Función para forzar sincronización manual
export const forceSyncFromDashboard = (syncProducts, syncServices) => {
  const productsSuccess = syncProductsAutomatically(syncProducts);
  const servicesSuccess = syncServicesAutomatically(syncServices);
  
  return {
    products: productsSuccess,
    services: servicesSuccess,
    timestamp: new Date().toISOString()
  };
};

export default {
  getDashboardProducts,
  getDashboardServices,
  syncProductsAutomatically,
  syncServicesAutomatically,
  checkForDashboardUpdates,
  forceSyncFromDashboard
};
