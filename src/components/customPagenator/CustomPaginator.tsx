import { Paginator } from "primereact/paginator";
import { useState } from "react";

const CustomPaginator = ({
  rowLimit,
  handlePageChange,
  totalRecords,
}: {
  handlePageChange: any;
  totalRecords: number;
  rowLimit?: number;
}) => {
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(1);

  const onPageChange = (event: any) => {
    setFirst(event.first);
    setPage(event.page + 1);
    handlePageChange(event);
  };

  return (
    <Paginator
      first={first}
      rows={rowLimit ? rowLimit : 20}
      totalRecords={totalRecords}
      onPageChange={(event) => onPageChange(event)}
      prevPageLinkIcon={<i className="pi pi-arrow-left" />}
      nextPageLinkIcon={<i className="pi pi-arrow-right" />}
      template={{ layout: "PrevPageLink CurrentPageReport NextPageLink" }}
      currentPageReportTemplate={`${page} of ${Math.ceil(totalRecords / (rowLimit ? rowLimit : 10))} pages`}
    />
  );
};
export default CustomPaginator;
