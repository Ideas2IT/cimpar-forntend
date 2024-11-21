import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ITestDetails } from "../../interfaces/appointment";

const TestDetailsTable = ({ testDetails }: { testDetails: ITestDetails[] }) => {
  return (
    <div className="border border-gray-300 rounded-md py-2">
      {testDetails?.length ? (
        <DataTable
          scrollable
          scrollHeight="12rem"
          value={testDetails}
          rowClassName={() => {
            return "border-t";
          }}
        >
          <Column field="display" header="Test Name" />
          <Column
            header="Telehealth Required"
            bodyClassName="text-center"
            headerClassName="justify-items-center"
            body={(rowData) => (rowData.telehealthRequired ? "Yes" : "No")}
          />
        </DataTable>
      ) : (
        <div>Test Details are not available</div>
      )}
    </div>
  );
};

export default TestDetailsTable;
