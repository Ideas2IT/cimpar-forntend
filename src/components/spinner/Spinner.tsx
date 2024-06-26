import { ProgressSpinner } from "primereact/progressspinner";
import "./Spinner.css";

const Spinner = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div
      className={`${isLoading ? "fixed flex z-50 items-center justify-center bg-gray-100/50 left-0 top-0 bottom-0 right-0" : "hidden"}`}
    >
      <ProgressSpinner className="custom-spinner" />
    </div>
  );
};
export default Spinner;
