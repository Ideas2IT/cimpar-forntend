import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ITestDetails } from "../../interfaces/appointment";
import { PRICING_SCHEME } from "../../utils/AppConstants";

const TestDetailsTable = ({
  testDetails,
  totalCost,
  testLocation,
}: {
  testDetails: ITestDetails[];
  totalCost: string;
  testLocation: string;
}) => {
  const calculatePrice = (test: ITestDetails) => {
    if (testLocation === PRICING_SCHEME.HOME) {
      return `$${Number(test?.home_price).toFixed(2) || "0.00"}`;
    } else {
      return `$${Number(test?.center_price).toFixed(2) || "0.00"}`;
    }
  };

  const tableFooter = () => {
    return (
      <div className="flex w-full justify-between">
        <span>TOTAL PRICE</span>
        <span>${Number(totalCost).toFixed(2) || "0.00"}</span>
      </div>
    );
  };

  return (
    <div className="border border-gray-300 rounded-md py-2">
      {testDetails?.length ? (
        <DataTable
          className="test-details"
          value={testDetails}
          rowClassName={() => {
            return "border-b";
          }}
          header={
            <div className="border-b px-3 pb-2">
              Note: <span className="text-red-500">*</span> Indicates that
              TeleHealth is required.
            </div>
          }
          footer={tableFooter}
        >
          <Column
            header="Name"
            headerClassName="border-b"
            body={(rowData: ITestDetails) => (
              <span>
                {rowData.is_telehealth_required && (
                  <span className="text-red-500">*</span>
                )}
                {rowData.display}
              </span>
            )}
          />
          <Column
            header="Price"
            body={(dataRow: ITestDetails) => <>{calculatePrice(dataRow)}</>}
            headerClassName="justify-items-end details-header border-b"
            bodyClassName="justify-end text-end"
          />
        </DataTable>
      ) : (
        <div>Test Details are not available</div>
      )}
    </div>
  );
};

export default TestDetailsTable;
