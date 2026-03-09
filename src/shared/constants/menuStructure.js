export const menuStructure = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: "dashboard",
    // ── permisos del backend requeridos para ver esta sección ──
    permisos: ["dashboard"],
    items: [
      { name: "Resumen General", path: "/admin/dashboard", icon: "home-icon" }
    ]
  },
    {
    id: "servicios",
    title: "Servicios",
    icon: "servicios",
    permisos: ["servicios", "citas"],
    items: [
      { name: "Servicios", path: "/admin/servicios", icon: "services-icon" },
      { name: "Citas", path: "/admin/servicios/citas", icon: "appointments-icon" },
      { name: "Agenda", path: "/admin/servicios/agenda", icon: "calendar-icon" },
      { name: "Empleados", path: "/admin/servicios/empleados", icon: "employees-icon" },
      { name: "Campañas de Salud", path: "/admin/servicios/campanas-salud", icon: "campaigns-icon" }
    ]
  },
    {
    id: "compras",
    title: "Compras",
    icon: "compras",
    permisos: ["compras", "productos", "proveedores"],
    items: [
      { name: "Compras", path: "/admin/compras", icon: "purchase-icon" },
      { name: "Productos", path: "/admin/compras/productos", icon: "products-icon" },
      { name: "Categorías", path: "/admin/compras/categorias", icon: "categories-icon" },
      { name: "Marcas", path: "/admin/compras/marcas", icon: "brands-icon" },
      { name: "Proveedores", path: "/admin/compras/proveedores", icon: "suppliers-icon" }
    ]
  },
  {
    id: "ventas",
    title: "Ventas",
    icon: "ventas",
    permisos: ["ventas", "clientes", "pedidos"],
    items: [
      { name: "Clientes", path: "/admin/ventas/clientes", icon: "users-icon" },
      { name: "Pedidos", path: "/admin/ventas/pedidos", icon: "orders-icon" },
    ]
  },
  {
    id: "seguridad",
    title: "Seguridad",
    icon: "seguridad",
    permisos: ["usuarios", "roles"],
    items: [
      { name: "Usuarios", path: "/admin/seguridad/usuarios", icon: "users-icon" },
      { name: "Roles", path: "/admin/seguridad/roles", icon: "roles-icon" }
    ]
  },
];