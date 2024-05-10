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
      <Link to={backLink} className="flex items-center">
        <PrimeButton className="p-2 bg-white shadow-none rounded-md" text raised>
          <i className="pi pi-arrow-left color-primary"></i>
        </PrimeButton>
        <label className="text-blue-200 font-primary text-xl cursor-pointer px-1">
          {previousPage}
        </label>
      </Link>
      <label className="color-primary font-primary text-xl px-1">
        /{currentPage}
      </label>
    </div>
  );
};
export default BackButton;
