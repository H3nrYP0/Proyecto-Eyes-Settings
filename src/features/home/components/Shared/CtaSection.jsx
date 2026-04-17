const CtaSection = ({ onAgendar }) => (
  <section style={styles.ctaSection}>
    <div style={styles.ctaCard}>
      <div style={styles.ctaDeco1} />
      <div style={styles.ctaDeco2} />
      <div style={styles.ctaContent}>
        <div style={styles.ctaLeft}>
          <span style={styles.ctaEye}>👁️</span>
          <div>
            <h2 style={styles.ctaTitle}>¿Listo para cuidar tu visión?</h2>
            <p style={styles.ctaDesc}>Agenda tu cita en minutos y recibe atención personalizada de nuestros optómetras especializados.</p>
            <div style={styles.ctaTags}>
              {["Sin filas", "Confirmación por WhatsApp", "Atención inmediata"].map((t) => (
                <span key={t} style={styles.ctaTag}>✓ {t}</span>
              ))}
            </div>
          </div>
        </div>
        <button style={styles.ctaBtn} onClick={onAgendar}>
          <span style={{ fontSize: "1.2rem" }}>📅</span>
          <span>Agendar mi cita</span>
          <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>→</span>
        </button>
      </div>
    </div>
  </section>
);

const styles = {
  ctaSection: { padding: "3rem 2rem 4rem", background: "linear-gradient(160deg,#f3f8f8 0%,#fff 60%,#e6f2f2 100%)" },
  ctaCard: { maxWidth: "900px", margin: "0 auto", background: "linear-gradient(135deg,#0d2e2e 0%,#1a4a4a 55%,#3d8080 100%)", borderRadius: "1.5rem", padding: "2.5rem 2.5rem", position: "relative", overflow: "hidden", boxShadow: "0 20px 50px rgba(13,46,46,0.25)" },
  ctaDeco1: { position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(106,174,174,0.15)", pointerEvents: "none" },
  ctaDeco2: { position: "absolute", bottom: "-60px", left: "30%", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" },
  ctaContent: { position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" },
  ctaLeft: { display: "flex", alignItems: "flex-start", gap: "1.25rem", flex: 1, minWidth: "260px" },
  ctaEye: { fontSize: "2.5rem", flexShrink: 0, background: "rgba(255,255,255,0.12)", borderRadius: "1rem", padding: "0.6rem", border: "1px solid rgba(255,255,255,0.18)" },
  ctaTitle: { fontSize: "clamp(1.2rem,3vw,1.6rem)", fontWeight: 800, color: "#fff", margin: "0 0 0.5rem", lineHeight: 1.2 },
  ctaDesc: { fontSize: "0.88rem", color: "rgba(255,255,255,0.80)", margin: "0 0 0.85rem", lineHeight: 1.55, maxWidth: "380px" },
  ctaTags: { display: "flex", gap: "0.5rem", flexWrap: "wrap" },
  ctaTag: { fontSize: "0.72rem", fontWeight: 600, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "999px", padding: "0.2rem 0.65rem", color: "rgba(255,255,255,0.90)" },
  ctaBtn: { display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.9rem 1.75rem", background: "#fff", color: "#0d2e2e", border: "none", borderRadius: "0.875rem", fontWeight: 800, fontSize: "1rem", cursor: "pointer", fontFamily: "inherit", flexShrink: 0, boxShadow: "0 8px 24px rgba(0,0,0,0.2)", transition: "transform 0.18s, box-shadow 0.18s", whiteSpace: "nowrap" },
};

export default CtaSection;