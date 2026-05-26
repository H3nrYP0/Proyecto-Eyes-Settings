/**
 * menuStructure - Definición de la estructura del menú principal
 * 
 * Estructura:
 * - id: identificador único de la sección
 * - title: texto visible en el menú
 * - icon: nombre del ícono (debe coincidir con IconRenderer)
 * - path: ruta de navegación (opcional, si no tiene items)
 * - permisos: array de permisos REQUERIDOS (ahora son granulares: "ver_dashboard", "ver_ventas", etc.)
 * - items: submenús (si está vacío, el elemento navega directamente)
 */

export const menuStructure = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: "dashboard",
    permisos: ["ver_dashboard"],   // ← granular
    path: "/admin/dashboard",
    items: []
  },
  {
    id: "servicios",
    title: "Servicios",
    icon: "servicios",
    permisos: ["ver_citas"],       // ← granular (para ver citas)
    items: [
      { name: "Servicios", path: "/admin/servicios", icon: "services-icon", permisos: ["ver_citas"] },
      { name: "Citas", path: "/admin/servicios/citas", icon: "appointments-icon", permisos: ["ver_citas"] },
      { name: "Agenda", path: "/admin/servicios/agenda", icon: "calendar-icon", permisos: ["ver_citas"] },
      { name: "Empleados", path: "/admin/servicios/empleados", icon: "employees-icon", permisos: ["ver_empleados"] },
      { name: "Campañas de Salud", path: "/admin/servicios/campanas-salud", icon: "campaigns-icon", permisos: ["ver_citas"] }
    ]
  },
  {
    id: "compras",
    title: "Compras",
    icon: "compras",
    permisos: ["ver_productos", "ver_proveedores"],   // granulares
    items: [
      { name: "Compras", path: "/admin/compras", icon: "purchase-icon", permisos: ["ver_compras"] },
      { name: "Productos", path: "/admin/compras/productos", icon: "products-icon", permisos: ["ver_productos"] },
      { name: "Categorías", path: "/admin/compras/categorias", icon: "categories-icon", permisos: ["ver_productos"] },
      { name: "Marcas", path: "/admin/compras/marcas", icon: "brands-icon", permisos: ["ver_productos"] },
      { name: "Proveedores", path: "/admin/compras/proveedores", icon: "suppliers-icon", permisos: ["ver_proveedores"] }
    ]
  },
  {
    id: "ventas",
    title: "Ventas",
    icon: "ventas",
    permisos: ["ver_ventas", "ver_clientes"],   // granulares
    items: [
      { name: "Clientes", path: "/admin/ventas/clientes", icon: "user-icon", permisos: ["ver_clientes"] },
      { name: "Pedidos",  path: "/admin/ventas/pedidos",  icon: "orders-icon", permisos: ["ver_pedidos"] },
      { name: "Ventas",   path: "/admin/ventas",          icon: "sales-icon", permisos: ["ver_ventas"] },
    ]
  },
  {
    id: "seguridad",
    title: "Seguridad",
    icon: "seguridad",
    permisos: ["ver_usuarios", "gestionar_configuracion"],  // granulares
    items: [
      { name: "Usuarios", path: "/admin/seguridad/usuarios", icon: "user-icon", permisos: ["ver_usuarios"] },
      { name: "Roles", path: "/admin/seguridad/roles", icon: "roles-icon", permisos: ["gestionar_configuracion"] }
    ]
  },
];