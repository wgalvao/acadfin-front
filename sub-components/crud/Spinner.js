import { Loader2 } from "lucide-react";

const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <Loader2 size={48} className="spinner" />
  </div>
);

export default LoadingSpinner;
