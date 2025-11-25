import "/src/shared/styles/features/home/ContactSection.css";

const ContactSection = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-content">
          <div className="contact-info">
            <h2 className="section-title">
              ¿Listo para empezar?
            </h2>
            <p className="contact-description">
              Únete a las ópticas que ya están transformando su gestión con Visual Outlet. 
              Implementación rápida, soporte dedicado y resultados desde el primer día.
            </p>
            
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div className="contact-text">
                  <strong>Email</strong>
                  <span>hola@visualoutlet.com</span>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div className="contact-text">
                  <strong>Teléfono</strong>
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">💬</div>
                <div className="contact-text">
                  <strong>Chat en Vivo</strong>
                  <span>Disponible 24/7</span>
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
                <label htmlFor="optic">Nombre de la Óptica</label>
                <input 
                  type="text" 
                  id="optic" 
                  placeholder="Ej: Óptica Visión Perfecta"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Mensaje</label>
                <textarea 
                  id="message" 
                  rows="4"
                  placeholder="Cuéntanos sobre tu óptica y necesidades..."
                  className="form-textarea"
                ></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary btn-large">
                Solicitar Demo Personalizado
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;