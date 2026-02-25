import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrudLayout from "../../../../shared/components/crud/CrudLayout";
import CrudTable from "../../../../shared/components/crud/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import "../../../../shared/styles/components/crud-table.css";
import "../../../../shared/styles/components/modal.css";

import { ProductoData } from "../../../../lib/data/productosData";
import { MarcaData } from "../../../../lib/data/marcasData";
import { getAllCategorias } from "../../../../lib/data/categoriasData";

export default function Productos() {
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

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  useEffect(() => {
    loadData();
  }, []);

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
          estado: producto.estado ? 'activo' : 'inactivo'
        };
      });

      setProductos(productosConNombres);
      setMarcas(marcasData.filter(m => m.estado === true));
      setCategorias(categoriasData.filter(c => c.estado === true));
      setError(null);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setError("No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, nombre) => {
    setModalDelete({ open: true, id, nombre });
  };

  const confirmDelete = async () => {
    try {
      await ProductoData.deleteProducto(modalDelete.id);
      await loadData();
      setModalDelete({ open: false, id: null, nombre: "" });
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Error al eliminar el producto");
    }
  };

  const handleCancelDelete = () => {
    setModalDelete({ open: false, id: null, nombre: "" });
  };

  //  ACTUALIZACIÓN OPTIMISTA - Cambia el estado instantáneamente
 const cambiarEstado = async (row, newStatus) => {
  try {
  
    const nuevoEstadoUI = newStatus =newStatus;
     
   setProductos(prev => prev.map(p => 
      p.id === row.id ? { ...p, estado: nuevoEstadoUI  } : p
    ));
      // Llamar a la función específica para cambiar estado
   await ProductoData.updateEstadoProducto(row.id, nuevoEstadoUI);
    
  } catch (err) {
    console.error("Error al cambiar estado:", err);
    loadData(); // Revertir cambio si hay error
  }
};




  const filteredProductos = productos.filter((p) => {
    const matchesSearch =
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (p.codigo && p.codigo.toLowerCase().includes(search.toLowerCase()));

    const matchesEstado = !filterEstado || p.estado === filterEstado;
    const matchesMarca = !filterMarca || p.marca_id?.toString() === filterMarca;
    const matchesCategoria = !filterCategoria || p.categoria_id?.toString() === filterCategoria;

    return matchesSearch && matchesEstado && matchesMarca && matchesCategoria;
  });

  const estadoFilters = [
    { value: "", label: "Todos los estados" },
    { value: "activo", label: "Activos" },
    { value: "inactivo", label: "Inactivos" },
  ];

  const marcaFilters = [
    { value: "", label: "Todas las marcas" },
    ...marcas.map(m => ({ value: m.id.toString(), label: m.nombre }))
  ];

  const categoriaFilters = [
    { value: "", label: "Todas las categorías" },
    ...categorias.map(c => ({ value: c.id.toString(), label: c.nombre }))
  ];

  const formatCOP = (value) => {
    if (!value) return '$0';
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0
    }).format(value);
  };

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
      render: (item) => (
        <span className={item.stockActual <= item.stockMinimo ? 'stock-bajo' : ''}>
          {item.stockActual}
        </span>
      )
    }
  ];

  const tableActions = [
    {
      label: "Cambiar estado",
      type: "toggle-status",
      onClick: (item) => cambiarEstado(item),
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
      <CrudLayout
        title="Productos"
        showSearch={true}
        searchPlaceholder="Buscar por nombre o código..."
        searchPosition="left"
      >
        <div className="loading-container">Cargando productos...</div>
      </CrudLayout>
    );
  }

  return (
    <CrudLayout
      title="Productos"
      onAddClick={() => navigate("crear")}
      showSearch
      searchPlaceholder="Buscar por nombre o código..."
      searchValue={search}
      onSearchChange={setSearch}
      searchFilters={estadoFilters}
      filterEstado={filterEstado}
      onFilterChange={setFilterEstado}
    >
      <div className="unified-search-container" style={{ marginBottom: '16px' }}>
        <select
          value={filterMarca}
          onChange={(e) => setFilterMarca(e.target.value)}
          className="unified-filter-select"
        >
          {marcaFilters.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        <select
          value={filterCategoria}
          onChange={(e) => setFilterCategoria(e.target.value)}
          className="unified-filter-select"
        >
          {categoriaFilters.map(f => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="unified-no-data" style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          marginBottom: '16px'
        }}>
          ⚠️ {error}
        </div>
      )}

      <CrudTable
        columns={columns}
        data={filteredProductos}
        actions={tableActions}
        onChangeStatus={cambiarEstado}
        emptyMessage={
          search || filterEstado || filterMarca || filterCategoria
            ? "No se encontraron productos para los filtros aplicados"
            : "No hay productos registrados"
        }
      />

      {filteredProductos.length === 0 && !search && !filterEstado && !filterMarca && !filterCategoria && !loading && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button 
            onClick={() => navigate("crear")}
            className="btn-primary"
            style={{ padding: '12px 24px' }}
          >
            Crear Primer Producto
          </button>
        </div>
      )}

      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Producto?"
        message={`Esta acción eliminará el producto "${modalDelete.nombre}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel
        onConfirm={confirmDelete}
        onCancel={handleCancelDelete}
      />
    </CrudLayout>
  );
}