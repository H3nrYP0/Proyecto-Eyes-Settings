import "/src/shared/styles/features/home/ContactSection.css";

const ContactSection = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-content">
          <div className="contact-info">
            {/* ELIMINADO el h2 con section-title */}
            <div className="contact-description">
              <h2 className="contact-title">Contactanos</h2>
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
          
          <div className="contact-form">
            <form className="form">
              <div className="form-group">
                <label htmlFor="name">Nombre Completo</label>
                <input 
                  type="text" 
                  id="name" 
                  placeholder="Tu nombre"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="tu@email.com"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="optic">Teléfono</label>
                <input 
                  type="number" 
                  id="optic" 
                  placeholder="Ej: 3337295555"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Mensaje</label>
                <textarea 
                  id="message" 
                  rows="3"
                  placeholder="¿Qué necesitas para tu óptica?"
                  className="form-textarea"
                ></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary">
                Solicitar Información
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;