import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CrudLayout from "../../../../shared/components/layouts/CrudLayout";
import CrudTable from "../../../../shared/components/ui/CrudTable";
import Modal from "../../../../shared/components/ui/Modal";
import "../../../../shared/styles/components/crud-table.css";

// Importamos las funciones del backend
import {
  getAllProductos,
  deleteProducto,
  updateEstadoProducto,
} from "../../../../lib/data/productosData";

export default function Productos() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('');

  const [modalDelete, setModalDelete] = useState({
    open: false,
    id: null,
    nombre: "",
  });

  // Cargar datos
  useEffect(() => {
    const productosData = getAllProductos();
    setProductos(productosData);
  }, []);

  // =============================
  //    MODAL DE ELIMINACIÓN
  // =============================
  const handleDelete = (id, nombre) => {
    setModalDelete({
      open: true,
      id,
      nombre,
    });
  };

  const confirmDelete = () => {
    const updated = deleteProducto(modalDelete.id);
    setProductos([...updated]);
    setModalDelete({ open: false, id: null, nombre: "" });
  };

  // =============================
  //    CAMBIAR ESTADO
  // =============================
  const toggleEstado = (id) => {
    const updated = updateEstadoProducto(id);
    setProductos([...updated]);
  };

  // =============================
  //          BUSCADOR
  // =============================
  const filteredProductos = productos.filter(producto => {
    const matchesSearch = 
      producto.nombre.toLowerCase().includes(search.toLowerCase()) ||
      producto.codigo.toLowerCase().includes(search.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(search.toLowerCase()) ||
      producto.marca.toLowerCase().includes(search.toLowerCase()) ||
      producto.precioVenta.toString().includes(search) ||
      producto.stockActual.toString().includes(search);
    
    const matchesFilter = !filterEstado || producto.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  // FILTROS PARA PRODUCTOS
  const searchFilters = [
    { value: 'activo', label: 'Activos' },
    { value: 'inactivo', label: 'Inactivos' },
    { value: 'bajo-stock', label: 'Bajo Stock' }
  ];

  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`;
  };

  // =============================
  //          COLUMNAS
  // =============================
  const columns = [
    { field: "nombre", header: "Nombre" },
    { field: "codigo", header: "Código" },
    { 
      field: "precioVenta", 
      header: "Precio Venta",
      render: (item) => formatCurrency(item.precioVenta)
    },
    { 
      field: "precioCompra", 
      header: "Precio Compra",
      render: (item) => formatCurrency(item.precioCompra)
    },
    { 
      field: "stockActual", 
      header: "Stock",
      render: (item) => (
        <span className={item.stockActual <= item.stockMinimo ? "stock-bajo" : ""}>
          {item.stockActual}
        </span>
      )
    },
    { field: "categoria", header: "Categoría" },
    { field: "marca", header: "Marca" },
    {
      field: "estado",
      header: "Estado",
      render: (item) => (
        <button
          className={`estado-btn ${
            item.estado === "activo" ? "activo" : 
            item.estado === "bajo-stock" ? "bajo-stock" : "inactivo"
          }`}
          onClick={() => toggleEstado(item.id)}
        >
          {item.estado === "activo" ? "✅ Activo" : 
           item.estado === "bajo-stock" ? "⚠️ Bajo Stock" : "❌ Inactivo"}
        </button>
      ),
    },
  ];

  // =============================
  //          ACCIONES
  // =============================
  const tableActions = [
    {
      label: "Ver Detalles",
      type: "view",
      onClick: (item) => navigate(`/admin/compras/productos/detalle/${item.id}`),
    },
    {
      label: "Editar",
      type: "edit",
      onClick: (item) => navigate(`/admin/compras/productos/editar/${item.id}`),
    },
    {
      label: "Imágenes",
      type: "image",
      onClick: (item) => navigate(`/admin/compras/productos/imagenes/${item.id}`),
    },
    {
      label: "Eliminar",
      type: "delete",
      onClick: (item) => handleDelete(item.id, item.nombre),
    },
  ];

  return (
    <CrudLayout
      title="Productos"
      onAddClick={() => navigate("/admin/compras/productos/crear")}
      showSearch={true}
      searchPlaceholder="Buscar por nombre, código, categoría..."
      searchValue={search}
      onSearchChange={setSearch}
      searchFilters={searchFilters}
      filterEstado={filterEstado}
      onFilterChange={setFilterEstado}
      searchPosition="left"
    >
      {/* Tabla */}
      <CrudTable 
        columns={columns} 
        data={filteredProductos} 
        actions={tableActions}
        emptyMessage={
          search || filterEstado ? 
            'No se encontraron productos para los filtros aplicados' : 
            'No hay productos registrados'
        }
      />

      {/* Botón para primer producto */}
      {filteredProductos.length === 0 && !search && !filterEstado && (
        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
          <button 
            onClick={() => navigate("/admin/compras/productos/crear")}
            className="btn-primary"
            style={{padding: 'var(--spacing-md) var(--spacing-lg)'}}
          >
            Registrar Primer Producto
          </button>
        </div>
      )}

      {/* Modal de Confirmación */}
      <Modal
        open={modalDelete.open}
        type="warning"
        title="¿Eliminar Producto?"
        message={`Esta acción eliminará el producto "${modalDelete.nombre}" y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        showCancel={true}
        onConfirm={confirmDelete}
        onCancel={() => setModalDelete({ open: false, id: null, nombre: "" })}
      />
    </CrudLayout>
  );
}