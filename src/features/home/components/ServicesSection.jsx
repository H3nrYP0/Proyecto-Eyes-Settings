// ServicesSection.jsx — Sección de servicios en home con datos reales del backend
import { useState, useEffect } from "react";
import ServicesList from "../components/Services/ServicesList";
import "/src/shared/styles/features/home/ServicesSection.css";

// ServicesSection simplemente renderiza ServicesList
// que ya maneja la carga de datos desde la API
const ServicesSection = () => {
  return <ServicesList />;
};

export default ServicesSection;