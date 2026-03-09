import {
  Dashboard as DashboardIcon,
  PointOfSale as SalesIcon,
  ShoppingCart as PurchasesIcon,
  Build as ServicesIcon,
  People as UsersIcon,
  Security as SecurityIcon,
  CalendarToday as CalendarIcon,
  AccessTime as AccessTimeIcon,
  Campaign as CampaignIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Home as HomeIcon,
  Receipt as ReceiptIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  LocalOffer as BrandIcon,
  LocalShipping as SupplierIcon,
  MedicalServices as MedicalIcon,
  EventNote as AppointmentIcon,
  Payment as PaymentIcon,
  ManageAccounts as RolesIcon,
} from "@mui/icons-material";

const iconMappings = {
  // ── Secciones principales ──
  dashboard:   { component: DashboardIcon,          size: 19, opacity: 0.9 },
  ventas:      { component: SalesIcon,              size: 19, opacity: 0.9 },
  compras:     { component: PurchasesIcon,          size: 19, opacity: 0.9 },
  servicios:   { component: ServicesIcon,           size: 19, opacity: 0.9 },
  seguridad:   { component: SecurityIcon,           size: 19, opacity: 0.9 },

  // ── Items del menú ──
  'home-icon':        { component: HomeIcon,              size: 15, opacity: 0.8 },
  'users-icon':       { component: UsersIcon,             size: 15, opacity: 0.8 },
  'orders-icon':      { component: ReceiptIcon,           size: 15, opacity: 0.8 },
  'payment-icon':     { component: PaymentIcon,           size: 15, opacity: 0.8 },
  'purchase-icon':    { component: PurchasesIcon,         size: 15, opacity: 0.8 },
  'products-icon':    { component: InventoryIcon,         size: 15, opacity: 0.8 },
  'categories-icon':  { component: CategoryIcon,          size: 15, opacity: 0.8 },
  'brands-icon':      { component: BrandIcon,             size: 15, opacity: 0.8 },
  'suppliers-icon':   { component: SupplierIcon,          size: 15, opacity: 0.8 },
  'services-icon':    { component: MedicalIcon,           size: 15, opacity: 0.8 },
  'appointments-icon':{ component: AppointmentIcon,       size: 15, opacity: 0.8 },
  'calendar-icon':    { component: CalendarIcon,          size: 15, opacity: 0.8 },
  'employees-icon':   { component: UsersIcon,             size: 15, opacity: 0.8 },
  'time-icon':        { component: AccessTimeIcon,        size: 15, opacity: 0.8 },
  'campaigns-icon':   { component: CampaignIcon,          size: 15, opacity: 0.8 },
  'roles-icon':       { component: AdminPanelSettingsIcon,size: 15, opacity: 0.8 },
  'sales-icon':       { component: SalesIcon,             size: 15, opacity: 0.8 },
};


export const IconRenderer = ({ name }) => {
  const config = iconMappings[name];
  if (!config) return null;
  
  const IconComponent = config.component;
  return (
    <IconComponent 
      sx={{ 
        fontSize: config.size, 
        color: `rgba(255,255,255,${config.opacity})` 
      }} 
    />
  );
};