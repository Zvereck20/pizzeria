import { RootState } from "@/app/store";
import { useSelector } from "react-redux";

export const GlobalLoader = () => {
  const pending = useSelector((state: RootState) => state.async.pending);

  if (!pending) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-spinner"></div>
    </div>
  );
};
