import { Button } from "primereact/button";

const CustomPaginator = ({
  handlePageChange,
  totalPages,
  currentPage,
}: {
  handlePageChange: (value: number) => void;
  totalPages: number;
  currentPage: number;
}) => {
  return (
    <div className="flex w-full h-[2rem] my-2 justify-center items-center">
      <Button
        disabled={currentPage <= 1}
        className="pi pi-arrow-left py-2 shadow-none"
        onClick={() => handlePageChange(currentPage - 1)}
      />
      <span className="px-2">
        {currentPage} of {totalPages} pages
      </span>
      <Button
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="pi pi-arrow-right py-2 shadow-none"
      />
    </div>
  );
};

export default CustomPaginator;
