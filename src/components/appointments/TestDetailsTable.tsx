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
      return `$${test?.home_price || "-"}`;
    } else {
      return `$${test?.center_price || "-"}`;
    }
  };

  const tableFooter = () => {
    return (
      <div className="flex w-full justify-between">
        <span>TOTAL COST</span>
        <span>${totalCost}</span>
      </div>
    );
  };

  return (
    <div className="border border-gray-300 rounded-md py-2">
      {testDetails?.length ? (
        <DataTable
          scrollable
          scrollHeight="12rem"
          value={testDetails}
          rowClassName={() => {
            return "border-b";
          }}
          footer={tableFooter}
        >
          <Column field="display" header="Name" headerClassName="border-b" />
          <Column
            header="Telehealth Required"
            bodyClassName="text-center"
            headerClassName="justify-items-center text-center border-b"
            body={(rowData: ITestDetails) =>
              rowData.telehealth_required ? "Yes" : "No"
            }
          />
          <Column
            header="Cost"
            body={(dataRow: ITestDetails) => <>{calculatePrice(dataRow)}</>}
            headerClassName="justify-items-end border-b"
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
