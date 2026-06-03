import Loading from "@shared/components/ui/Loading";

const LoadingSpinner = ({ mensaje = "Cargando..." }) => {
  return (
    <Loading
      message={mensaje}
      size="44px"
      color="#2563eb"
      minHeight="180px"
    />
  );
};

export default LoadingSpinner;