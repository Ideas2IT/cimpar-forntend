import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef, useState } from "react";
import { transactions } from "../assets/MockData";
import SearchInput from "../components/SearchInput";
import { IDualCalendarReponse } from "../components/appointments/Appointments";
import CustomModal from "../components/customModal/CustomModal";
import DualCalendar from "../components/dualCalendar/DualCalendar";
import CustomServiceDropDown from "../components/serviceFilter/CustomServiceDropdown";
import { PAYMENT_STATUS } from "../utils/AppConstants";

const transaction = () => {
  const [isOpenCalendar, setIsOpenCalendar] = useState<boolean>(false);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const op = useRef<OverlayPanel>(null);
  const dataTableRef = useRef<DataTable<any>>(null);

  const getColumnValue = (value: string) => {
    let bgColor = "bg-white";
    switch (value) {
      case PAYMENT_STATUS.COMPLETED:
        bgColor = "bg-green-100";
        break;
      case PAYMENT_STATUS.PENDING:
        bgColor = "bg-red-100";
        break;
      case PAYMENT_STATUS.REFUNDED:
        bgColor = "bg-purple-100";
        break;
      default:
        bgColor = "white";
    }
    return (
      <span
        className={`text-md text-gray-600 px-3 py-2 rounded-full capitalize ${bgColor}`}
      >
        {value}
      </span>
    );
  };

  const columns = [
    {
      header: "Patient Name",
      field: "patientName",
    },
    {
      header: "Test Name",
      field: "testName",
    },
    { header: "Service Type", field: "serviceType" },

    { header: "Amount Paid", field: "amountPaid" },

    { header: "Transaction Id", field: "transactionID" },
    { header: "status", body: (row: any) => getColumnValue(row.status) },
  ];

  const exportCsv = (startDate: Date, endDate: Date) => {
    console.log(startDate, endDate);
    dataTableRef.current?.exportCSV();
    setShowDownloadModal(false);
  };

  return (
    <div>
      <div className="flex w-full h-[3rem] justify-end gap-3">
        <div
          className={`md:w-[13rem] cursor-pointer border-primary max-h-[2.5rem] flex  items-center justify-between px-4 rounded-full ${isOpenCalendar ? "bg-primary text-white" : "color-primary bg-white"}`}
          onClick={(e) => {
            op?.current?.toggle(e);
            setIsOpenCalendar(true);
          }}
        >
          <i className="pi pi-calendar-minus" />
          <p className="font-primary">All Date Range</p>
          {isOpenCalendar ? (
            <i className="pi pi-chevron-up" />
          ) : (
            <i className="pi pi-chevron-down" />
          )}
        </div>
        <span className="h-[2.5rem] w-[20rem]">
          <CustomServiceDropDown
            label="All Services"
            options={[]}
            onApplyFilter={() => {}}
          />
        </span>
        <SearchInput />
        <Button
          onClick={() => setShowDownloadModal(true)}
          icon="pi pi-download px-1"
          className="rounded-full font-primary  text-purple-900 bg-purple-100 h-[2.5rem] px-4 py-3 border border-purple-900"
          title="Download CSV"
        >
          Download as CSV
        </Button>
        <OverlayPanel
          ref={op}
          className="w-auto"
          onHide={() => setIsOpenCalendar(false)}
        >
          <DualCalendar dateFilter={{} as IDualCalendarReponse} />
        </OverlayPanel>
        {showDownloadModal && (
          <CustomModal
            handleClose={() => setShowDownloadModal(false)}
            showCloseButton={true}
            styleClass="h-[20rem] w-[40rem]"
            header={<div className="px-3">Download Transactions</div>}
          >
            <DownloadTransactions
              exportCsv={exportCsv}
              onCancel={() => setShowDownloadModal(false)}
            />
          </CustomModal>
        )}
      </div>
      <div className="rounded-lg bg-white p-2 h-[calc(100vh-175px)] flex-grow">
        <DataTable value={transactions} ref={dataTableRef}>
          {columns.map((column, index) => (
            <Column
              key={index}
              headerClassName="border-b font-tertiary text-sm uppercase"
              header={column.header}
              field={column.field}
              bodyClassName="border-b font-tertiary"
              body={column.body}
            />
          ))}
        </DataTable>
      </div>
    </div>
  );
};

const DownloadTransactions = ({
  exportCsv,
  onCancel,
}: {
  exportCsv: (startDate: Date, endDate: Date) => void;
  onCancel: () => void;
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const calendarProps = {
    classNames: "h-[2.5rem] rounded-lg border border-gray-300 p-2",
    showIcon: true,
    icon: "pi pi-calendar-minus",
  } as const;
  const buttonStyle =
    "w-full pe-3 py-2 border rounded-full border-purple-900 font-primary text-purple-900 justify-center items-center";
  return (
    <div className="flex-grow">
      <p className="font-primary text-xl py-6">Select Date Range</p>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        <span>
          <label>From*</label>
          <Calendar
            value={startDate}
            onChange={(e) => e.target.value && setStartDate(e?.target?.value)}
            className={calendarProps.classNames}
            showIcon
            icon={calendarProps.icon}
          />
        </span>
        <span>
          <label>To*</label>
          <Calendar
            value={endDate}
            onChange={(e) => e.target.value && setEndDate(e?.target?.value)}
            className={calendarProps.classNames}
            showIcon
            icon={calendarProps.icon}
          />
        </span>
        <div className="border-b w-full py-2 col-span-2" />
        <Button
          className={buttonStyle}
          onClick={onCancel}
          icon="pi pi-times px-3"
        >
          Cancel
        </Button>
        <Button
          className={`${buttonStyle} bg-purple-100`}
          icon="pi pi-download px-3 py-2"
          onClick={() => exportCsv(startDate, endDate)}
        >
          Download CSV
        </Button>
      </div>
    </div>
  );
};

export default transaction;
