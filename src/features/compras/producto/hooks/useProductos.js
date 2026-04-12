// src/features/compras/pages/producto/hooks/useProductos.js
import { useState, useEffect, useCallback, useMemo } from "react";
import { ProductoData } from "../services/productosService";
import { marcasService as MarcaData } from "../../marca/services/marcasService";
import { getAllCategorias } from "../../categoria/services/categoriasService";

const ESTADO_ACTIVA = "activa";
const ESTADO_INACTIVA = "inactiva";

export const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterMarca, setFilterMarca] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });
  const [notification, setNotification] = useState({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type, isVisible: true });
    setTimeout(() => setNotification(prev => ({ ...prev, isVisible: false })), 6000);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  }, []);

  const ordenarProductos = (productosArray) => {
    return [...productosArray].sort((a, b) => {
      return a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' });
    });
  };

  const loadData = useCallback(async () => {
    if (initialLoadDone) return;
    
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

      // Cargar imágenes para cada producto
      const productosConImagenes = await Promise.all(
        productosConNombres.map(async (producto) => {
          try {
            const productoDetalle = await ProductoData.getProductoById(producto.id);
            return {
              ...producto,
              imagenes: productoDetalle.imagenes || [],
            };
          } catch {
            return { ...producto, imagenes: [] };
          }
        })
      );

      const productosOrdenados = ordenarProductos(productosConImagenes);

      setProductos(productosOrdenados);
      setMarcas(marcasData.filter(m => m.estado === true));
      setCategorias(categoriasData.filter(c => c.estado === true));
      setError(null);
      setInitialLoadDone(true);
    } catch (error) {
      setError("No se pudieron cargar los productos");
      showNotification("Error al cargar los productos", "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification, initialLoadDone]);

  const refreshData = useCallback(async () => {
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

      // Cargar imágenes para cada producto
      const productosConImagenes = await Promise.all(
        productosConNombres.map(async (producto) => {
          try {
            const productoDetalle = await ProductoData.getProductoById(producto.id);
            return {
              ...producto,
              imagenes: productoDetalle.imagenes || [],
            };
          } catch {
            return { ...producto, imagenes: [] };
          }
        })
      );

      const productosOrdenados = ordenarProductos(productosConImagenes);

      setProductos(productosOrdenados);
      setMarcas(marcasData.filter(m => m.estado === true));
      setCategorias(categoriasData.filter(c => c.estado === true));
      setError(null);
    } catch (error) {
      setError("No se pudieron cargar los productos");
      showNotification("Error al cargar los productos", "error");
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const handleDelete = useCallback((id, nombre) => {
    setModalDelete({ open: true, id, nombre });
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      const { tieneAsociaciones, detalles } = await ProductoData.hasProductoAsociaciones(modalDelete.id);
      
      if (tieneAsociaciones) {        
        const tiposAsociaciones = [];
        if (detalles.compras) tiposAsociaciones.push('compras');
        if (detalles.ventas) tiposAsociaciones.push('ventas');
        if (detalles.pedidos) tiposAsociaciones.push('pedidos');
        
        const mensaje = `El producto "${modalDelete.nombre}" no se puede eliminar porque está asociado a: ${tiposAsociaciones.join(', ')}.`;
        
        showNotification(mensaje, "warning");
        setModalDelete({ open: false, id: null, nombre: "" });
        return;
      }
      
      await ProductoData.deleteProducto(modalDelete.id);
      await refreshData();
      setModalDelete({ open: false, id: null, nombre: "" });
      showNotification(`Producto "${modalDelete.nombre}" eliminado correctamente`, "success");
    } catch (err) {
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
  }, [modalDelete.id, modalDelete.nombre, showNotification, refreshData]);

  const handleCancelDelete = useCallback(() => {
    setModalDelete({ open: false, id: null, nombre: "" });
  }, []);

  const cambiarEstado = useCallback(async (row) => {
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
      await refreshData();
      showNotification(`Error al cambiar el estado para el producto "${row.nombre}"`, "error");
    }
  }, [showNotification, refreshData]);

  const filteredProductos = useMemo(() => {
    return productos.filter((p) => {
      const matchesSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        (p.codigo && p.codigo.toLowerCase().includes(search.toLowerCase()));

      const matchesEstado = !filterEstado || p.estado === filterEstado;
      const matchesMarca = !filterMarca || p.marca_id?.toString() === filterMarca;
      const matchesCategoria = !filterCategoria || p.categoria_id?.toString() === filterCategoria;

      return matchesSearch && matchesEstado && matchesMarca && matchesCategoria;
    });
  }, [productos, search, filterEstado, filterMarca, filterCategoria]);

  const marcaFilters = useMemo(() => [
    { value: "", label: "Todas las marcas" },
    ...marcas.map(m => ({ value: m.id.toString(), label: m.nombre }))
  ], [marcas]);

  const categoriaFilters = useMemo(() => [
    { value: "", label: "Todas las categorías" },
    ...categorias.map(c => ({ value: c.id.toString(), label: c.nombre }))
  ], [categorias]);

  const estadoFilters = [
    { value: "", label: "Todos los estados" },
    { value: ESTADO_ACTIVA, label: "Activos" },
    { value: ESTADO_INACTIVA, label: "Inactivos" },
  ];

  useEffect(() => {
    const savedNotification = localStorage.getItem('productoNotification');
    if (savedNotification) {
      const { message, type } = JSON.parse(savedNotification);
      showNotification(message, type);
      localStorage.removeItem('productoNotification');
    }
  }, [showNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const showEmptyState = filteredProductos.length === 0 && !search && !filterEstado && !filterMarca && !filterCategoria && !loading;

  return {
    productos: filteredProductos,
    loading,
    error,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    filterMarca,
    setFilterMarca,
    filterCategoria,
    setFilterCategoria,
    marcaFilters,
    categoriaFilters,
    estadoFilters,
    cambiarEstado,
    showEmptyState,
    notification,
    hideNotification,
    modalDelete,
    confirmDelete,
    handleCancelDelete,
    handleDelete,
    refreshData
  };
};