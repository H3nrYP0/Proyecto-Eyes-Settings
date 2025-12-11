export const menuStructure = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: "dashboard",
    items: [
      { name: "Resumen General", path: "/admin/dashboard", icon: "home-icon" }
    ]
  },
  {
    id: "ventas",
    title: "Ventas",
    icon: "ventas",
    items: [

      { name: "Clientes", path: "/admin/ventas/clientes", icon: "users-icon" },
      { name: "Pedidos", path: "/admin/ventas/pedidos", icon: "orders-icon" },
    ]
  },
  {
    id: "compras",
    title: "Compras",
    icon: "compras",
    items: [
      { name: "Compras", path: "/admin/compras", icon: "purchase-icon" },
      { name: "Productos", path: "/admin/compras/productos", icon: "products-icon" },
      { name: "Categorías", path: "/admin/compras/categorias", icon: "categories-icon" },
      { name: "Marcas", path: "/admin/compras/marcas", icon: "brands-icon" },
      { name: "Proveedores", path: "/admin/compras/proveedores", icon: "suppliers-icon" }
    ]
  },
  {
    id: "servicios",
    title: "Servicios",
    icon: "servicios",
    items: [
      { name: "Servicios", path: "/admin/servicios", icon: "services-icon" },
      { name: "Agenda", path: "/admin/servicios/agenda", icon: "calendar-icon" },
      { name: "Empleados", path: "/admin/servicios/empleados", icon: "employees-icon" },
      { name: "Campañas de Salud", path: "/admin/servicios/campanas-salud", icon: "campaigns-icon" }
    ]
  },
  {
    id: "usuarios",
    title: "Usuarios",
    icon: "usuarios",
    items: [
      { name: "Usuarios", path: "/admin/usuarios", icon: "users-icon" },
    ]
  },
  {
    id: "seguridad",
    title: "Seguridad",
    icon: "seguridad",
    items: [
      { name: "Roles", path: "/admin/seguridad/roles", icon: "roles-icon" }
    ]
  },
];