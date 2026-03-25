// src/features/compras/pages/productos/components/ProductosContainer.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import CrudLayout from "../../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../../shared/components/crud/CrudTable";
import Modal from "../../../../../shared/components/ui/Modal";
import CrudNotification from "../../../../../shared/styles/components/notifications/CrudNotification";
import { formatCOP } from "../../../../../shared/utils/formatCOP";
import StockCell from "../components/StockCell";
import { ProductoData } from "../../../../../lib/data/productosData";
import { MarcaData } from "../../marca/services/marcasService";
import { getAllCategorias } from "../../../../../lib/data/categoriasData";
import ProductosPresentational from "../Presentational/ProductosPresentational";

const ESTADO_ACTIVA = "activa";
const ESTADO_INACTIVA = "inactiva";

const estadoFilters = [
  { value: "", label: "Todos los estados" },
  { value: ESTADO_ACTIVA, label: "Activos" },
  { value: ESTADO_INACTIVA, label: "Inactivos" },
];

export default function ProductosContainer() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterMarca, setFilterMarca] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [notification, setNotification] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  useEffect(() => {
    const savedNotification = localStorage.getItem('productoNotification');
    if (savedNotification) {
      const { message, type } = JSON.parse(savedNotification);
      showNotification(message, type);
      localStorage.removeItem('productoNotification');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, isVisible: true });
    setTimeout(() => setNotification(prev => ({ ...prev, isVisible: false })), 6000);
  };
  
  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [productosData, marcasData, categoriasData] = await Promise.all([
        ProductoData.getAllProductos(),
        MarcaData.getAllMarcas(),
        getAllCategorias()
      ]);

      const productosConNombres = productosData.map(producto => {
        const marca = marcasData.find(m => m.id === producto.marca_id);
        const categoria = categoriasData.find(c => c.id === producto.categoria_id);
        
        return {
          id: producto.id,
          nombre: producto.nombre,
          codigo: producto.codigo || '',
          descripcion: producto.descripcion || '',
          precioVenta: producto.precio_venta,
          precioCompra: producto.precio_compra,
          stockActual: producto.stock,
          stockMinimo: producto.stock_minimo,
          marca: marca?.nombre || '-',
          categoria: categoria?.nombre || '-',
          marca_id: producto.marca_id,
          categoria_id: producto.categoria_id,
          estado: producto.estado ? ESTADO_ACTIVA : ESTADO_INACTIVA,
        };
      });

      setProductos(productosConNombres);
      setMarcas(marcasData.filter(m => m.estado === true));
      setCategorias(categoriasData.filter(c => c.estado === true));
      setError(null);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setError("No se pudieron cargar los productos");
      showNotification("Error al cargar los productos", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, nombre) => {
    setModalDelete({ open: true, id, nombre });
  };

  const confirmDelete = async () => {
    try {
      const { tieneAsociaciones, detalles } = await ProductoData.hasProductoAsociaciones(modalDelete.id);
      
      if (tieneAsociaciones) {        
        const tiposAsociaciones = [];
        if (detalles.compras) tiposAsociaciones.push('compras');
        if (detalles.ventas) tiposAsociaciones.push('ventas');
        if (detalles.pedidos) tiposAsociaciones.push('pedidos');
        
        const mensaje = `El producto "${modalDelete.nombre}" no se puede eliminar porque está asociado a : ${tiposAsociaciones.join(', ')}.`;
        
        showNotification(mensaje, "warning");
        setModalDelete({ open: false, id: null, nombre: "" });
        return;
      }
      
      await ProductoData.deleteProducto(modalDelete.id);
      await loadData();
      setModalDelete({ open: false, id: null, nombre: "" });
      showNotification(`Producto "${modalDelete.nombre}" eliminado correctamente`, "success");
    } catch (err) {
      console.error("Error al eliminar:", err);
      
      let errorMessage = `Error al eliminar el producto "${modalDelete.nombre}"`;
      if (err.response?.data?.error) {
        errorMessage = `No se puede eliminar "${modalDelete.nombre}": ${err.response.data.error}`;
      } else if (err.response?.status === 400) {
        errorMessage = `El producto "${modalDelete.nombre}" está siendo usado en otras operaciones`;
      } else if (err.response?.status === 404) {
        errorMessage = `El producto "${modalDelete.nombre}" ya no existe`;
      } else if (err.request) {
        errorMessage = "No se pudo conectar con el servidor";
      }
      
      showNotification(errorMessage, "error");
      setModalDelete({ open: false, id: null, nombre: "" });
    }
  };

  const handleCancelDelete = () => {
    setModalDelete({ open: false, id: null, nombre: "" });
  };

  const cambiarEstado = async (row) => {
    try {
      const estadoAnterior = row.estado;
      const nuevoEstadoUI = estadoAnterior === ESTADO_ACTIVA ? ESTADO_INACTIVA : ESTADO_ACTIVA;
      const accion = estadoAnterior === ESTADO_ACTIVA ? "desactivado" : "activado";
      
      setProductos(prev => prev.map(p => 
        p.id === row.id ? { ...p, estado: nuevoEstadoUI } : p
      ));

      await ProductoData.updateEstadoProducto(row.id, nuevoEstadoUI === ESTADO_ACTIVA);
      
      showNotification(`Producto "${row.nombre}" ${accion} correctamente`, "success");
      
    } catch (err) {
      console.error("Error al cambiar estado:", err); 
      await loadData();
      showNotification(`Error al cambiar el estado para el producto "${row.nombre}"`, "error");
    }
  };

  const filteredProductos = productos.filter((p) => {
    const matchesSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (p.codigo && p.codigo.toLowerCase().includes(search.toLowerCase()));

    const matchesEstado = !filterEstado || p.estado === filterEstado;
    const matchesMarca = !filterMarca || p.marca_id?.toString() === filterMarca;
    const matchesCategoria = !filterCategoria || p.categoria_id?.toString() === filterCategoria;

    return matchesSearch && matchesEstado && matchesMarca && matchesCategoria;
  });

  const marcaFilters = [
    { value: "", label: "Todas las marcas" },
    ...marcas.map(m => ({ value: m.id.toString(), label: m.nombre }))
  ];

  const categoriaFilters = [
    { value: "", label: "Todas las categorías" },
    ...categorias.map(c => ({ value: c.id.toString(), label: c.nombre }))
  ];

  const columns = [
    { field: "nombre", header: "Nombre" },
    { field: "marca", header: "Marca" },
    { field: "categoria", header: "Categoría" },
    { 
      field: "precioVenta", 
      header: "Precio Venta",
      render: (item) => formatCOP(item.precioVenta)
    },
    { 
      field: "stockActual", 
      header: "Stock",
      render: (item) => <StockCell item={item} />
    }
  ];

  const tableActions = [
    {
      label: "Cambiar estado",
      type: "toggle-status",
      onClick: cambiarEstado,
    },
    {
      label: "Ver",
      type: "view",
      onClick: (row) => navigate(`detalle/${row.id}`),
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (row) => navigate(`editar/${row.id}`),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (row) => handleDelete(row.id, row.nombre),
    },
  ];

  if (loading) {
    return (
      <CrudLayout title="Productos">
        <Box sx={{ textAlign: 'center', py: 8 }}>Cargando productos...</Box>
      </CrudLayout>
    );
  }

  return (
    <ProductosPresentational
      search={search}
      setSearch={setSearch}
      filterEstado={filterEstado}
      setFilterEstado={setFilterEstado}
      filterMarca={filterMarca}
      setFilterMarca={setFilterMarca}
      filterCategoria={filterCategoria}
      setFilterCategoria={setFilterCategoria}
      marcaFilters={marcaFilters}
      categoriaFilters={categoriaFilters}
      estadoFilters={estadoFilters}
      error={error}
      columns={columns}
      data={filteredProductos}
      actions={tableActions}
      loading={loading}
      emptyMessage={
        search || filterEstado || filterMarca || filterCategoria
          ? "No se encontraron productos para los filtros aplicados"
          : "No hay productos registrados"
      }
      onChangeStatus={cambiarEstado}
      showEmptyState={
        filteredProductos.length === 0 && !search && !filterEstado && !filterMarca && !filterCategoria && !loading
      }
      onCreateClick={() => navigate("crear")}
      notification={notification}
      hideNotification={hideNotification}
      modalDelete={modalDelete}
      onConfirmDelete={confirmDelete}
      onCancelDelete={handleCancelDelete}
    />
  );
}