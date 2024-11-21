import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { OverlayPanel } from "primereact/overlaypanel";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import SearchInput from "../components/SearchInput";
import { IDualCalendarReponse } from "../components/appointments/Appointments";
import CustomModal from "../components/customModal/CustomModal";
import DualCalendar from "../components/dualCalendar/DualCalendar";
import CustomServiceDropDown from "../components/serviceFilter/CustomServiceDropdown";
import useToast from "../components/useToast/UseToast";
import { ITransaction } from "../interfaces/appointment";
import {
  downloadtransactionsThunk,
  getAllTransactionsThunk,
} from "../store/slices/appointmentSlice";
import { AppDispatch } from "../store/store";
import { DATE_FORMAT, PAYMENT_STATUS, RESPONSE } from "../utils/AppConstants";
import { dateFormatter } from "../utils/Date";

const transaction = () => {
  const filters = ["At Home", "Service Center"];
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<ITransaction>(
    {} as ITransaction
  );
  const [isOpenCalendar, setIsOpenCalendar] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const op = useRef<OverlayPanel>(null);
  const dataTableRef = useRef<DataTable<ITransaction[]>>(null);

  useEffect(() => {
    dispatch(getAllTransactionsThunk()).then((response) => {
      const data = response.payload as ITransaction[];
      setTransactions(data);
    });
  }, []);

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
        className={`text-sm text-gray-600 px-4 py-2 rounded-full capitalize ${bgColor}`}
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
    {
      header: "Transaction Date & Time",
      body: (row: ITransaction) => (
        <>
          {dateFormatter(
            row.transactionDateAndTime,
            DATE_FORMAT.DD_MMM_YYYY_HH_MM_A
          )}
        </>
      ),
    },
    {
      header: "status",
      body: (row: ITransaction) => getColumnValue(row.status),
    },
    {
      header: "",
      body: (row: ITransaction) => (
        <div
          className="cursor-pointer"
          onClick={() => setSelectedTransaction(row)}
        >
          <i className="pi pi-eye text-xl text-purple-900 font-bold" />
        </div>
      ),
    },
  ];

  const exportCsv = (startDate: Date, endDate: Date) => {
    // dataTableRef.current?.exportCSV();
    setShowDownloadModal(false);
  };

  const sidebarHeader = () => {
    return (
      <div className="flex justify-start gap-3 items-center w-full">
        <span>Transaction Header</span>
        <Button
          onClick={() => setShowDownloadModal(true)}
          icon="pi pi-download px-1"
          className="rounded-full font-primary text-purple-900 bg-purple-100 h-[2.5rem] px-4 text-sm py-3 border border-purple-900"
          title="Download CSV"
        >
          Download as CSV
        </Button>
      </div>
    );
  };

  const tableProps = {
    value: transactions || [],
    ref: dataTableRef,
    selectionMode: "single",
    selection: selectedTransaction,
  } as const;
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
            options={filters}
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
        <DataTable {...tableProps}>
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
      {/* <CustomPaginator
          currentPage={1}
          handlePageChange={() => {}}
          totalPages={10}
        /> */}
      {!!Object.keys(selectedTransaction)?.length && (
        <Sidebar
          header={sidebarHeader()}
          className="detailed-view w-[30rem]"
          visible={!!Object.keys(selectedTransaction)?.length}
          position="right"
          onHide={() => setSelectedTransaction({} as ITransaction)}
        >
          <TransactionDetailedView transaction={selectedTransaction} />
        </Sidebar>
      )}
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
  const { errorToast, toast } = useToast();

  const dispatch = useDispatch<AppDispatch>();
  const downloadCsvFile = () => {
    dispatch(downloadtransactionsThunk()).then((response) => {
      if (response.meta.requestStatus === RESPONSE.FULFILLED) {
        const url = window.URL.createObjectURL(new Blob([response.payload]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "iris-data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        errorToast("Failed to download", "Failed to download csv file");
      }
    });
  };
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
          // onClick={() => exportCsv(startDate, endDate)}
          onClick={downloadCsvFile}
        >
          Download CSV
        </Button>
      </div>
      <Toast ref={toast} />
    </div>
  );
};

const TransactionDetailedView = ({
  transaction,
}: {
  transaction: ITransaction;
}) => {
  const DetailRow = ({
    label,
    value,
    styleClasses,
  }: {
    label: string;
    value: string | number;
    styleClasses: string;
  }) => (
    <div className={`border-b ${styleClasses}`}>
      <div className="input-label !uppercase text-gray-900 font-secondary pt-4">
        {label || ""}
      </div>
      <label className="font-primary">{value || "-"}</label>
    </div>
  );

  const transactionFields = [
    {
      label: "patient name",
      value: transaction.patientName,
      styleClasses: "col-span-2",
    },
    {
      label: "test name",
      value: transaction.testName,
      styleClasses: "col-span-2",
    },
    {
      label: "test date",
      value: dateFormatter(transaction.testDate, DATE_FORMAT.DD_MMM_YYYY),
    },
    {
      label: "service type",
      value: transaction.serviceType,
    },
    {
      label: "amount paid",
      value: "$" + transaction.amountPaid || "0",
    },
    {
      label: "transaction date",
      value: dateFormatter(
        transaction.transactionDateAndTime,
        DATE_FORMAT.DD_MMM_YYYY
      ),
    },
    {
      label: "transaction id",
      value: transaction.transactionID,
    },
    {
      label: "transaction status",
      value: transaction.status,
    },
    {
      label: "payment mode",
      value: transaction.payment_mode,
    },
  ];

  return (
    <div className="px-3 py-4">
      <span className="font-primary text-xl">Transaction details</span>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
        {transactionFields.map((field) => {
          return (
            <DetailRow
              label={field.label}
              value={field.value}
              styleClasses={field.styleClasses || ""}
            />
          );
        })}
      </div>
    </div>
  );
};

export default transaction;
