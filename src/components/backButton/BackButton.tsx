import { Link } from "react-router-dom";
import { Button as PrimeButton } from "primereact/button";

const BackButton = ({
  previousPage,
  currentPage,
  backLink,
}: {
  previousPage: string;
  currentPage: string;
  backLink: string;
}) => {
  return (
    <div className="flex justify-between items-center">
      <Link to={backLink}>
        <PrimeButton className="p-2 bg-white shadow-none" text raised>
          <i className="pi pi-arrow-left color-primary" color="danger"></i>
        </PrimeButton>
        <label className="text-blue-200 font-primary  text-xl cursor-pointer px-2">
          {previousPage}
        </label>
      </Link>
      <label className="color-primary font-primary text-xl px-2">
        /{currentPage}
      </label>
    </div>
  );
};
export default BackButton;
