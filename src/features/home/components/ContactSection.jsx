import { useState, useEffect } from "react";
import "/src/shared/styles/features/home/ContactSection.css";

// ─── Lista de países con prefijo telefónico ───────────────────────────────────
const COUNTRY_CODES = [
  { code: "+57",  flag: "🇨🇴", name: "Colombia",        maxDigits: 10 },
  { code: "+1",   flag: "🇺🇸", name: "EE.UU. / Canadá", maxDigits: 10 },
  { code: "+52",  flag: "🇲🇽", name: "México",           maxDigits: 10 },
  { code: "+34",  flag: "🇪🇸", name: "España",           maxDigits: 9  },
  { code: "+54",  flag: "🇦🇷", name: "Argentina",        maxDigits: 10 },
  { code: "+56",  flag: "🇨🇱", name: "Chile",            maxDigits: 9  },
  { code: "+51",  flag: "🇵🇪", name: "Perú",             maxDigits: 9  },
  { code: "+58",  flag: "🇻🇪", name: "Venezuela",        maxDigits: 10 },
  { code: "+593", flag: "🇪🇨", name: "Ecuador",          maxDigits: 9  },
  { code: "+55",  flag: "🇧🇷", name: "Brasil",           maxDigits: 11 },
  { code: "+44",  flag: "🇬🇧", name: "Reino Unido",      maxDigits: 10 },
  { code: "+49",  flag: "🇩🇪", name: "Alemania",         maxDigits: 11 },
  { code: "+33",  flag: "🇫🇷", name: "Francia",          maxDigits: 9  },
  { code: "+39",  flag: "🇮🇹", name: "Italia",           maxDigits: 10 },
  { code: "+351", flag: "🇵🇹", name: "Portugal",         maxDigits: 9  },
];

// ─── Validadores de datos reales ─────────────────────────────────────────────

// Secuencias de teclado obvias que no son nombres reales
const KEYBOARD_PATTERNS = ["qwerty", "asdf", "zxcv", "qwer", "asdfg", "zxcvb"];

const isValidName = (v) => {
  const val = v.trim();

  // Mínimo dos palabras (nombre + apellido)
  const words = val.split(/\s+/).filter(Boolean);
  if (words.length < 2) return { ok: false, msg: "Ingresa tu nombre y apellido." };

  // Cada palabra debe tener al menos 2 letras
  if (words.some((w) => w.length < 2)) return { ok: false, msg: "Cada parte del nombre debe tener al menos 2 letras." };

  // Solo letras y tildes
  if (!/^[a-zA-ZÀ-ÿñÑ\s]+$/.test(val)) return { ok: false, msg: "Solo se permiten letras." };

  const lower = val.toLowerCase().replace(/\s/g, "");

  // Detectar caracteres repetidos excesivamente (ej: "aaaa", "jjjj")
  if (/(.)\1{2,}/.test(lower)) return { ok: false, msg: "El nombre no parece real." };

  // Detectar patrones de teclado
  if (KEYBOARD_PATTERNS.some((p) => lower.includes(p))) return { ok: false, msg: "El nombre no parece real." };

  return { ok: true, msg: "" };
};

// Prefijos de correo claramente falsos
const FAKE_EMAIL_PREFIXES = [
  "test", "prueba", "ejemplo", "example", "fake", "demo",
  "admin", "noreply", "no-reply", "aaa", "bbb", "zzz",
  "asdf", "qwerty", "abc", "xyz", "foo", "bar",
];

const isValidGmail = (v) => {
  const val = v.trim().toLowerCase();

  // Formato base @gmail.com
  if (!/^[a-zA-Z0-9._%+\-]+@gmail\.com$/.test(val))
    return { ok: false, msg: "Debe ser un correo Gmail válido (ejemplo@gmail.com)." };

  const prefix = val.split("@")[0];

  // Prefijos falsos conocidos
  if (FAKE_EMAIL_PREFIXES.includes(prefix))
    return { ok: false, msg: "Ingresa tu correo Gmail real." };

  // Prefijo demasiado corto (menos de 4 caracteres)
  if (prefix.length < 4)
    return { ok: false, msg: "El correo parece inválido. Verifica que sea el tuyo." };

  // Solo dígitos en el prefijo → ej: 12345@gmail.com
  if (/^\d+$/.test(prefix))
    return { ok: false, msg: "El correo no parece real. Ingresa tu Gmail personal." };

  // Caracteres repetidos excesivamente → ej: aaaa@gmail.com
  if (/(.)\1{3,}/.test(prefix))
    return { ok: false, msg: "El correo no parece real." };

  // 5+ consonantes seguidas sin vocal — detecta cadenas aleatorias como "asdnakjsdas"
  if (/[bcdfghjklmnpqrstvwxyz]{5,}/i.test(prefix))
    return { ok: false, msg: "El correo no parece real. Ingresa tu Gmail personal." };

  // Si menos del 20% de las letras son vocales, el prefijo es aleatorio
  const onlyLetters = prefix.replace(/[^a-záéíóúüñ]/gi, "");
  if (onlyLetters.length >= 6) {
    const vowels = (onlyLetters.match(/[aeiouáéíóúü]/gi) || []).length;
    const ratio  = vowels / onlyLetters.length;
    if (ratio < 0.20)
      return { ok: false, msg: "El correo no parece real. Ingresa tu Gmail personal." };
  }

  return { ok: true, msg: "" };
};

const isValidPhone = (v, max) => {
  if (!/^\d+$/.test(v) || v.length < 7 || v.length > max)
    return { ok: false, msg: null }; // el mensaje lo pone el handler con el país

  // Todos los dígitos iguales → 1111111111
  if (/^(\d)\1+$/.test(v))
    return { ok: false, msg: "El número no parece real." };

  // Secuencia ascendente o descendente → 1234567890 / 9876543210
  const digits = v.split("").map(Number);
  const isAsc  = digits.every((d, i) => i === 0 || d === digits[i - 1] + 1);
  const isDesc = digits.every((d, i) => i === 0 || d === digits[i - 1] - 1);
  if (isAsc || isDesc)
    return { ok: false, msg: "El número no parece real." };

  return { ok: true, msg: "" };
};

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ visible, onClose }) => {
  // Auto-cierre a los 4 segundos
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [visible, onClose]);

  return (
    <div className={`toast ${visible ? "toast--show" : ""}`} role="alert" aria-live="polite">
      <div className="toast-icon">✅</div>
      <div className="toast-body">
        <strong>¡Mensaje enviado!</strong>
        <span>Nos pondremos en contacto contigo muy pronto.</span>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Cerrar">✕</button>
    </div>
  );
};

// ─── Componente principal ─────────────────────────────────────────────────────
const ContactSection = () => {
  const [fields, setFields] = useState({ name: "", email: "", phone: "", message: "" });
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [errors, setErrors] = useState({ name: null, email: null, phone: null });
  const [toastVisible, setToastVisible] = useState(false);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleNameChange = (e) => {
    const raw = e.target.value.replace(/[^a-zA-ZÀ-ÿñÑ\s]/g, "");
    setFields((p) => ({ ...p, name: raw }));
    const { ok, msg } = isValidName(raw);
    setErrors((p) => ({ ...p, name: ok ? "" : msg }));
  };

  const handleEmailChange = (e) => {
    const raw = e.target.value;
    setFields((p) => ({ ...p, email: raw }));
    const { ok, msg } = isValidGmail(raw);
    setErrors((p) => ({ ...p, email: ok ? "" : msg }));
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/[^\d]/g, "").slice(0, selectedCountry.maxDigits);
    setFields((p) => ({ ...p, phone: raw }));
    const { ok, msg } = isValidPhone(raw, selectedCountry.maxDigits);
    setErrors((p) => ({
      ...p,
      phone: ok ? "" : (msg || `Ingresa entre 7 y ${selectedCountry.maxDigits} dígitos para ${selectedCountry.name}.`),
    }));
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setCountryOpen(false);
    if (fields.phone) {
      const { ok, msg } = isValidPhone(fields.phone, country.maxDigits);
      setErrors((p) => ({
        ...p,
        phone: ok ? "" : (msg || `Ingresa entre 7 y ${country.maxDigits} dígitos para ${country.name}.`),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameResult  = isValidName(fields.name);
    const emailResult = isValidGmail(fields.email);
    const phoneResult = isValidPhone(fields.phone, selectedCountry.maxDigits);

    const nameErr  = nameResult.ok  ? "" : nameResult.msg;
    const emailErr = emailResult.ok ? "" : emailResult.msg;
    const phoneErr = phoneResult.ok ? "" : (phoneResult.msg || `Ingresa entre 7 y ${selectedCountry.maxDigits} dígitos para ${selectedCountry.name}.`);

    setErrors({ name: nameErr, email: emailErr, phone: phoneErr });

    if (!nameErr && !emailErr && !phoneErr) {
      setToastVisible(true);
      setFields({ name: "", email: "", phone: "", message: "" });
      setErrors({ name: null, email: null, phone: null });
      // → aquí iría la llamada al backend
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Toast fijo arriba a la derecha, fuera del flujo del formulario */}
      <Toast visible={toastVisible} onClose={() => setToastVisible(false)} />

      <section id="contact" className="contact-section">
        <div className="contact-container">
          <div className="contact-content">

            {/* ── Info lateral ── */}
            <div className="contact-info">
              <div className="contact-description">
                <h2 className="contact-title">Contáctanos</h2>
                <p className="contact-subtitle">
                  Implementación en 24 horas, soporte personalizado y control total
                  de tu negocio desde el primer día.
                </p>
              </div>

              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">📧</div>
                  <div className="contact-text">
                    <strong>Email</strong>
                    <span>visualoutlet2000@gmail.com</span>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📱</div>
                  <div className="contact-text">
                    <strong>WhatsApp</strong>
                    <span>300 613 9449</span>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📞</div>
                  <div className="contact-text">
                    <strong>Teléfono Fijo</strong>
                    <span>(+57) 604 579 9276</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Formulario ── */}
            <div className="contact-form">
              <form className="form" onSubmit={handleSubmit} noValidate>

                {/* Nombre */}
                <div className={`form-group ${errors.name === "" ? "valid" : errors.name ? "invalid" : ""}`}>
                  <label htmlFor="name">Nombre Completo</label>
                  <input
                    type="text" id="name" placeholder="Tu nombre"
                    className="form-input" value={fields.name}
                    onChange={handleNameChange} autoComplete="name" maxLength={60}
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                  {errors.name === "" && <span className="field-ok">✓ Nombre válido</span>}
                </div>

                {/* Gmail */}
                <div className={`form-group ${errors.email === "" ? "valid" : errors.email ? "invalid" : ""}`}>
                  <label htmlFor="email">Correo Gmail</label>
                  <input
                    type="email" id="email" placeholder="ejemplo@gmail.com"
                    className="form-input" value={fields.email}
                    onChange={handleEmailChange} autoComplete="email"
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                  {errors.email === "" && <span className="field-ok">✓ Correo válido</span>}
                </div>

                {/* Teléfono */}
                <div className={`form-group ${errors.phone === "" ? "valid" : errors.phone ? "invalid" : ""}`}>
                  <label htmlFor="phone">Teléfono</label>
                  <div className="phone-field">
                    <div className="country-selector">
                      <button
                        type="button" className="country-trigger"
                        onClick={() => setCountryOpen((p) => !p)}
                        aria-label="Seleccionar país"
                      >
                        <span className="country-flag">{selectedCountry.flag}</span>
                        <span className="country-code">{selectedCountry.code}</span>
                        <span className="country-arrow">{countryOpen ? "▲" : "▼"}</span>
                      </button>

                      {countryOpen && (
                        <ul className="country-dropdown" role="listbox">
                          {COUNTRY_CODES.map((c) => (
                            <li
                              key={c.code + c.name}
                              className={`country-option ${c.code === selectedCountry.code && c.name === selectedCountry.name ? "selected" : ""}`}
                              role="option" aria-selected={c.code === selectedCountry.code}
                              onClick={() => handleCountrySelect(c)}
                            >
                              <span>{c.flag}</span>
                              <span className="option-name">{c.name}</span>
                              <span className="option-code">{c.code}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <input
                      type="text" id="phone" inputMode="numeric" pattern="[0-9]*"
                      placeholder={`Ej: ${"3".repeat(selectedCountry.maxDigits - 1)}0`}
                      className="form-input phone-input" value={fields.phone}
                      onChange={handlePhoneChange} autoComplete="tel"
                    />
                  </div>
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                  {errors.phone === "" && <span className="field-ok">✓ Número válido</span>}
                </div>

                {/* Mensaje */}
                <div className="form-group">
                  <label htmlFor="message">Mensaje</label>
                  <textarea
                    id="message" rows="3"
                    placeholder="¿Qué necesitas para tu óptica?"
                    className="form-textarea" value={fields.message}
                    onChange={(e) => setFields((p) => ({ ...p, message: e.target.value }))}
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Solicitar Información
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default ContactSection;