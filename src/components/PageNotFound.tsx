import { Button } from "primereact/button";
import { PATH_NAME } from "../utils/AppConstants";

const PageNotFound = () => {
  return (
    <div className="flex flex h-full items-center justify-center">
      <span className="text-center">
        <div className="text-2xl font-primary text-center">404 Not Found</div>
        <div className="text-xl font-secondary block">
          The page you are looking for does not exist.
        </div>
        <Button
          outlined
          icon="pi pi-refresh pe-2"
          className="border px-3 py-2 rounded-lg border-purple-800 font-primary text-purple-800  text-center cursor-pointer"
          onClick={() => (window.location.href = PATH_NAME.HOME)}
        >
          Return to Home
        </Button>
      </span>
    </div>
  );
};

export default PageNotFound;
