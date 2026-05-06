// =============================================================
// ShoppingCart.jsx — Carrito verde oscuro teal + Wishlist
// Carrito persiste en localStorage (funciona sin login)
// CAMBIOS v3:
//   - Fondo del drawer: verde oscuro teal (#0d2e2e) en vez de negro
//   - Texto "PSE · Nequi · Tarjeta" en blanco
//   - Dirección guardada en localStorage (persiste entre sesiones)
//   - BUG FIX: PaymentModal ahora se renderiza FUERA del drawer
//     para que no se cierre cuando el drawer se oculta
// =============================================================

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PaymentModal from "./PaymentModal";

const BASE_URL  = "https://optica-api-vad8.onrender.com";
const CART_KEY  = "vo_cart_items";
const WISH_KEY  = "vo_wishlist_items";
const ADDR_KEY  = "vo_delivery_address";   // ← nueva clave para dirección

const loadFromStorage = (key) => {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : null; } catch { return null; }
};
const saveToStorage = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
};

// Dirección vacía por defecto
const emptyAddress = {
  ciudad:"", departamento:"", direccion:"", complemento:"",
  barrio:"", receptor:"", telefono:"", indicaciones:"",
};

const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
};

const formatPrice = (price) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })
    .format(Number(price) || 0);

const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token") || null;

// ─── Provider ────────────────────────────────────────────────
export const CartProvider = ({ children, user }) => {
  const [items,    setItems]    = useState(() => loadFromStorage(CART_KEY) || []);
  const [wishlist, setWishlist] = useState(() => loadFromStorage(WISH_KEY) || []);
  const [isOpen,   setIsOpen]   = useState(false);
  const [wishOpen, setWishOpen] = useState(false);

  // ── Estado del modal de pago — vive en el Provider para sobrevivir al cierre del drawer ──
  const [pagoModalOpen,  setPagoModalOpen]  = useState(false);
  const [pedidoData,     setPedidoData]     = useState(null);

  useEffect(() => { saveToStorage(CART_KEY, items); },    [items]);
  useEffect(() => { saveToStorage(WISH_KEY, wishlist); }, [wishlist]);

  const cartCount = items.reduce((s, i) => s + i.cantidad, 0);
  const cartTotal = items.reduce((s, i) => s + i.precioVenta * i.cantidad, 0);
  const wishCount = wishlist.length;

  const addToCart = useCallback((producto) => {
    const { id, nombre, precioVenta, imagenPrincipal, imagenes, stockActual, cantidad = 1 } = producto;
    setItems(prev => {
      const existe = prev.find(i => i.id === id);
      if (existe) return prev.map(i => i.id === id ? { ...i, cantidad: Math.min(i.cantidad + cantidad, stockActual) } : i);
      return [...prev, { id, nombre, precioVenta, imagenPrincipal, imagenes, stockActual, cantidad }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart  = useCallback((id) => setItems(prev => prev.filter(i => i.id !== id)), []);

  const updateQuantity  = useCallback((id, delta) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const nueva = item.cantidad + delta;
      if (nueva < 1 || nueva > item.stockActual) return item;
      return { ...item, cantidad: nueva };
    }));
  }, []);

  const clearCart = useCallback(() => { setItems([]); saveToStorage(CART_KEY, []); }, []);

  const toggleWishlist   = useCallback((producto) => {
    setWishlist(prev => {
      const existe = prev.find(i => i.id === producto.id);
      return existe ? prev.filter(i => i.id !== producto.id) : [...prev, producto];
    });
  }, []);

  const isInWishlist      = useCallback((id) => wishlist.some(i => i.id === id), [wishlist]);
  const removeFromWishlist = useCallback((id) => setWishlist(prev => prev.filter(i => i.id !== id)), []);

  const toggleCart    = useCallback(() => setIsOpen(p => !p), []);
  const closeCart     = useCallback(() => setIsOpen(false), []);
  const openCart      = useCallback(() => setIsOpen(true), []);
  const openWishlist  = useCallback(() => { setWishOpen(true); setIsOpen(false); }, []);
  const closeWishlist = useCallback(() => setWishOpen(false), []);

  // Abrir el modal de pago desde el drawer (se pasa la data del pedido)
  const openPagoModal = useCallback((data) => {
    setPedidoData(data);
    setPagoModalOpen(true);
  }, []);

  const closePagoModal = useCallback(() => {
    setPagoModalOpen(false);
    setPedidoData(null);
  }, []);

  return (
    <CartContext.Provider value={{
      items, cartCount, cartTotal, isOpen,
      wishlist, wishCount, wishOpen,
      addToCart, removeFromCart, updateQuantity, clearCart,
      toggleWishlist, isInWishlist, removeFromWishlist,
      toggleCart, closeCart, openCart, openWishlist, closeWishlist,
      openPagoModal, closePagoModal, pagoModalOpen, pedidoData,
      user,
    }}>
      {children}

      {/* ── PaymentModal montado FUERA de todo drawer ── */}
      {pagoModalOpen && pedidoData && (
        <PaymentModal
          isOpen={pagoModalOpen}
          onClose={closePagoModal}
          onPedidoCreado={(id) => {
            clearCart();
            closePagoModal();
          }}
          items={pedidoData.items}
          total={pedidoData.total}
          metodoEntrega={pedidoData.metodoEntrega}
          direccion={pedidoData.direccion}
          user={user}
        />
      )}
    </CartContext.Provider>
  );
};

// ─── Formulario de domicilio — guarda en localStorage ────────
const DeliveryForm = ({ value, onChange, errors }) => (
  <div className="sc-delivery-form">
    <p className="sc-delivery-title">Dirección de entrega</p>
    <div className="sc-field-row">
      <div className="sc-field">
        <label>Ciudad *</label>
        <input type="text" placeholder="Ej: Medellín" value={value.ciudad}
          onChange={e => onChange({ ...value, ciudad: e.target.value })}
          className={errors.ciudad ? "sc-input--error" : ""} />
        {errors.ciudad && <span className="sc-field-error">{errors.ciudad}</span>}
      </div>
      <div className="sc-field">
        <label>Departamento *</label>
        <input type="text" placeholder="Ej: Antioquia" value={value.departamento}
          onChange={e => onChange({ ...value, departamento: e.target.value })}
          className={errors.departamento ? "sc-input--error" : ""} />
        {errors.departamento && <span className="sc-field-error">{errors.departamento}</span>}
      </div>
    </div>
    <div className="sc-field">
      <label>Dirección principal *</label>
      <input type="text" placeholder="Ej: Calle 10 # 43A-15" value={value.direccion}
        onChange={e => onChange({ ...value, direccion: e.target.value })}
        className={errors.direccion ? "sc-input--error" : ""} />
      {errors.direccion && <span className="sc-field-error">{errors.direccion}</span>}
    </div>
    <div className="sc-field-row">
      <div className="sc-field">
        <label>Apto / Torre / Interior</label>
        <input type="text" placeholder="Ej: Apto 301, Torre B" value={value.complemento}
          onChange={e => onChange({ ...value, complemento: e.target.value })} />
      </div>
      <div className="sc-field">
        <label>Barrio *</label>
        <input type="text" placeholder="Ej: El Poblado" value={value.barrio}
          onChange={e => onChange({ ...value, barrio: e.target.value })}
          className={errors.barrio ? "sc-input--error" : ""} />
        {errors.barrio && <span className="sc-field-error">{errors.barrio}</span>}
      </div>
    </div>
    <div className="sc-field">
      <label>Nombre del receptor *</label>
      <input type="text" placeholder="¿Quién recibe el pedido?" value={value.receptor}
        onChange={e => onChange({ ...value, receptor: e.target.value })}
        className={errors.receptor ? "sc-input--error" : ""} />
      {errors.receptor && <span className="sc-field-error">{errors.receptor}</span>}
    </div>
    <div className="sc-field">
      <label>Teléfono de contacto *</label>
      <input type="tel" placeholder="Ej: 300 123 4567" value={value.telefono}
        onChange={e => onChange({ ...value, telefono: e.target.value.replace(/\D/g,"").slice(0,10) })}
        className={errors.telefono ? "sc-input--error" : ""} />
      {errors.telefono && <span className="sc-field-error">{errors.telefono}</span>}
    </div>
    <div className="sc-field">
      <label>Indicaciones adicionales</label>
      <textarea placeholder="Ej: Casa de rejas negras. Llamar al llegar." value={value.indicaciones}
        onChange={e => onChange({ ...value, indicaciones: e.target.value })} rows={2} />
    </div>
  </div>
);

// ─── Wishlist Drawer ──────────────────────────────────────────
export const WishlistDrawer = ({ user }) => {
  const { wishlist, wishOpen, closeWishlist, removeFromWishlist, addToCart } = useCart();

  return (
    <>
      {wishOpen && <div className="sc-backdrop" onClick={closeWishlist} aria-hidden="true" />}
      <div className={`wl-drawer${wishOpen ? " wl-drawer--open" : ""}`} role="dialog" aria-label="Lista de deseos">
        <div className="wl-header">
          <h2 className="wl-title">
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            Lista de deseos
          </h2>
          <button className="wl-close" onClick={closeWishlist} aria-label="Cerrar">×</button>
        </div>
        <div className="wl-body">
          {wishlist.length === 0 ? (
            <div className="wl-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
              <p>Tu lista de deseos está vacía</p>
              <button className="wl-empty-btn" onClick={closeWishlist}>Explorar productos</button>
            </div>
          ) : (
            <ul className="wl-items">
              {wishlist.map(item => (
                <li key={item.id} className="wl-item">
                  <div className="wl-item-img">
                    {item.imagenPrincipal
                      ? <img src={item.imagenPrincipal} alt={item.nombre} />
                      : <div className="wl-item-no-img"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="7" width="18" height="14" rx="2"/></svg></div>
                    }
                  </div>
                  <div className="wl-item-data">
                    <p className="wl-item-name">{item.nombre}</p>
                    <p className="wl-item-price">{formatPrice(item.precioVenta)}</p>
                    <button className="wl-add-btn" onClick={() => { addToCart({ ...item, cantidad: 1 }); closeWishlist(); }}>
                      Añadir al carrito
                    </button>
                  </div>
                  <button className="wl-item-remove" onClick={() => removeFromWishlist(item.id)} aria-label="Eliminar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

// ─── Carrito Drawer ───────────────────────────────────────────
const ShoppingCart = ({ user }) => {
  const navigate = useNavigate();
  const {
    items, cartTotal, isOpen,
    removeFromCart, updateQuantity, clearCart, closeCart,
    openPagoModal,
  } = useCart();

  const [metodEntrega, setMetodEntrega] = useState("tienda");

  // Dirección: cargar desde localStorage al montar
  const [delivery, setDelivery] = useState(
    () => loadFromStorage(ADDR_KEY) || emptyAddress
  );
  const [deliveryErrors, setDeliveryErrors] = useState({});
  const [submitting,     setSubmitting]     = useState(false);
  const [errorMsg,       setErrorMsg]       = useState("");

  // Guardar dirección en localStorage cada vez que cambia
  useEffect(() => {
    saveToStorage(ADDR_KEY, delivery);
  }, [delivery]);

  const validateDelivery = () => {
    const e = {};
    if (!delivery.ciudad.trim())       e.ciudad       = "Requerido";
    if (!delivery.departamento.trim()) e.departamento = "Requerido";
    if (!delivery.direccion.trim())    e.direccion    = "Requerido";
    if (!delivery.barrio.trim())       e.barrio       = "Requerido";
    if (!delivery.receptor.trim())     e.receptor     = "Requerido";
    if (!delivery.telefono.trim() || delivery.telefono.length < 10)
                                       e.telefono     = "Teléfono de 10 dígitos requerido";
    return e;
  };

  const handleCheckout = () => {
    if (!user) { closeCart(); navigate("/login"); return; }
    if (items.length === 0) return;

    if (metodEntrega === "domicilio") {
      const errs = validateDelivery();
      if (Object.keys(errs).length > 0) { setDeliveryErrors(errs); return; }
    }
    setDeliveryErrors({});
    setErrorMsg("");

    const direccionFull = metodEntrega === "domicilio"
      ? [
          delivery.direccion,
          delivery.complemento && `, ${delivery.complemento}`,
          `, ${delivery.barrio}`,
          `, ${delivery.ciudad}`,
          `, ${delivery.departamento}`,
          `. Receptor: ${delivery.receptor}`,
          `. Tel: ${delivery.telefono}`,
          delivery.indicaciones && `. ${delivery.indicaciones}`,
        ].filter(Boolean).join("")
      : "";

    // Cerrar el drawer y abrir el modal (que vive en el Provider)
    closeCart();
    openPagoModal({
      items,
      total:         cartTotal,
      metodoEntrega: metodEntrega,
      direccion:     direccionFull,
    });
  };

  return (
    <>
      {isOpen && <div className="sc-backdrop" onClick={closeCart} aria-hidden="true" />}
      <div className={`sc-drawer${isOpen ? " sc-drawer--open" : ""}`} role="dialog" aria-label="Carrito">
        <div className="sc-header">
          <h2 className="sc-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            Carrito
            {items.length > 0 && <span className="sc-title-count">{items.length}</span>}
          </h2>
          <button className="sc-close" onClick={closeCart} aria-label="Cerrar">×</button>
        </div>

        <div className="sc-body">
          {items.length === 0 && (
            <div className="sc-empty">
              <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M8 2L2 8v40a4 4 0 004 4h44a4 4 0 004-4V8L48 2z"/>
                <line x1="2" y1="8" x2="58" y2="8"/>
                <path d="M40 24a8 8 0 01-16 0"/>
              </svg>
              <p>Tu carrito está vacío</p>
              <button className="sc-empty-btn" onClick={closeCart}>Explorar productos</button>
            </div>
          )}

          {items.length > 0 && (
            <>
              <ul className="sc-items">
                {items.map(item => (
                  <li key={item.id} className="sc-item">
                    <div className="sc-item-img">
                      {item.imagenPrincipal
                        ? <img src={item.imagenPrincipal} alt={item.nombre} />
                        : <div className="sc-item-no-img"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="7" width="18" height="14" rx="2"/></svg></div>
                      }
                    </div>
                    <div className="sc-item-data">
                      <p className="sc-item-name">{item.nombre}</p>
                      <p className="sc-item-price">{formatPrice(item.precioVenta)}</p>
                      <div className="sc-item-qty">
                        <button className="sc-qty-btn" onClick={() => updateQuantity(item.id,-1)} disabled={item.cantidad<=1}>−</button>
                        <span className="sc-qty-val">{item.cantidad}</span>
                        <button className="sc-qty-btn" onClick={() => updateQuantity(item.id,1)} disabled={item.cantidad>=item.stockActual}>+</button>
                      </div>
                    </div>
                    <div className="sc-item-right">
                      <span className="sc-item-subtotal">{formatPrice(item.precioVenta*item.cantidad)}</span>
                      <button className="sc-item-remove" onClick={() => removeFromCart(item.id)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="sc-options">
                {/* Texto de pago en BLANCO ← cambio solicitado */}
                <div className="sc-option-group">
                  <label className="sc-option-label">Pago</label>
                  <div className="sc-pago-info">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                      <rect x="2" y="5" width="16" height="11" rx="2"/>
                      <path d="M2 9h16"/>
                    </svg>
                    PSE · Nequi · Tarjeta — elige al confirmar
                  </div>
                </div>

                <div className="sc-option-group">
                  <label className="sc-option-label">Método de entrega</label>
                  <div className="sc-radio-group">
                    <label className={`sc-radio${metodEntrega==="tienda"?" sc-radio--active":""}`}>
                      <input type="radio" name="entrega" value="tienda" checked={metodEntrega==="tienda"} onChange={()=>setMetodEntrega("tienda")}/>
                      Retirar en tienda
                    </label>
                    <label className={`sc-radio${metodEntrega==="domicilio"?" sc-radio--active":""}`}>
                      <input type="radio" name="entrega" value="domicilio" checked={metodEntrega==="domicilio"} onChange={()=>setMetodEntrega("domicilio")}/>
                      Domicilio
                    </label>
                  </div>
                </div>
                {metodEntrega==="domicilio" && (
                  <DeliveryForm value={delivery} onChange={setDelivery} errors={deliveryErrors} />
                )}
              </div>
              {errorMsg && <div className="sc-error-msg">{errorMsg}</div>}
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="sc-footer">
            <div className="sc-total-row">
              <span className="sc-total-label">Subtotal</span>
              <span className="sc-total-val">{formatPrice(cartTotal)}</span>
            </div>
            {!user && (
              <p className="sc-login-hint">
                Los productos se guardan.{" "}
                <button className="sc-login-link" onClick={()=>{closeCart();navigate("/login");}}>
                  Inicia sesión
                </button>{" "}para confirmar tu pedido.
              </p>
            )}
            <button
              className={`sc-checkout-btn${submitting?" sc-checkout-btn--loading":""}`}
              onClick={handleCheckout}
              disabled={submitting}
            >
              {submitting
                ? <span className="sc-spinner"/>
                : user
                ? <>Pagar por transferencia <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M5 10h10M12 7l3 3-3 3"/></svg></>
                : "Iniciar sesión para comprar"
              }
            </button>
            <button className="sc-clear-btn" onClick={clearCart} disabled={submitting}>
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ShoppingCart;