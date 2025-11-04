import Header from "../components/Header";

export default function Home({ onGoAdmin }) {
  return (
    <div className="home">
      <Header />
      <main className="home-content">
        <h1>Bienvenido a Visual Outlet</h1>
        <p>Tu sistema de gestión óptica integral.</p>
        <button onClick={onGoAdmin}>Ir al Panel de Administración</button>
      </main>
    </div>
  );
}
