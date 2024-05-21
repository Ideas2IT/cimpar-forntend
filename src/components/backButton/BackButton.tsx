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
    <div className="flex justify-between items-center lg:flex-row md:flex-col sm:flex-col">
      <Link to={backLink} className="flex items-center">
        <PrimeButton
          type="button"
          className="p-2 bg-white shadow-none rounded-md"
          text
          raised
        >
          <i className="pi pi-arrow-left color-primary"></i>
        </PrimeButton>
        <label className="text-blue-200 font-primary lg:text-xl md:text-md sm:text-sm cursor-pointer px-1">
          {previousPage}
        </label>
      </Link>
      <label className="color-primary font-primary md:block px-1 lg:text-xl md:text-md sm:text-sm">
        /{currentPage}
      </label>
    </div>
  );
};
export default BackButton;
