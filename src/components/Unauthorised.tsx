import { Button } from "primereact/button";
import { PATH_NAME } from "../utils/AppConstants";

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <p className="font-primary text-2xl text-center">Unauthorized</p>
        <p className="font-secondary text-xl text-center" />
        <p>401 - You do not have access to this page.</p>
        <Button
          outlined
          icon="pi pi-refresh pe-2"
          className="border px-3 py-2 rounded-lg border-purple-800 font-primary text-purple-800  text-center cursor-pointer"
          onClick={() => (window.location.href = PATH_NAME.HOME)}
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
