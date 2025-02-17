import { differenceInDays } from "date-fns";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { OverlayPanel } from "primereact/overlaypanel";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchInput from "../components/SearchInput";
import { IDualCalendarReponse } from "../components/appointments/Appointments";
import CustomPaginator from "../components/customPagenator/CustomPaginator";
import DualCalendar from "../components/dualCalendar/DualCalendar";
import CustomServiceDropDown from "../components/serviceFilter/CustomServiceDropdown";
import useToast from "../components/useToast/UseToast";
import { IDownloadCsvPayload, ITransaction, ITransactionPayload, ITransactionResponse, } from "../interfaces/appointment";
import { downloadtransactionsThunk, getAllTransactionsThunk, } from "../store/slices/appointmentSlice";
import { selectServiceCategories } from "../store/slices/masterTableSlice";
import { AppDispatch } from "../store/store";
import { DATE_FORMAT, MESSAGE, PAGE_LIMIT, PAYMENT_STATUS, RESPONSE, } from "../utils/AppConstants";
import { dateFormatter } from "../utils/Date";

const Transaction = () => {

  const serviceCategories = useSelector(selectServiceCategories);

  const dispatch = useDispatch<AppDispatch>();

  const [transactionResponse, setTransactionResponse] = useState<ITransactionResponse>({} as ITransactionResponse);
  const [selectedTransaction, setSelectedTransaction] = useState<ITransaction>({} as ITransaction);
  const [isOpenCalendar, setIsOpenCalendar] = useState<boolean>(false);
  const [dateFilter, setDateFilter] = useState<Date[]>();
  const [transactionPayload, setTransactionPayload] =
    useState<ITransactionPayload>({
      page: 1,
      page_size: PAGE_LIMIT,
      start_date: "",
      service_category: "",
    } as ITransactionPayload);

  const dataTableRef = useRef<DataTable<ITransaction[]>>(null);
  const op = useRef<OverlayPanel>(null);

  const { toast, errorToast } = useToast();


  useEffect(() => {
    dispatch(getAllTransactionsThunk(transactionPayload)).then((response) => {
      const _response = response.payload as ITransactionResponse;
      if (_response?.transactions?.length) {
        setTransactionResponse(_response);
      } else {
        setTransactionResponse({} as ITransactionResponse);
      }
    });
    dataTableRef?.current && dataTableRef.current.resetScroll();
  }, [transactionPayload]);

  useEffect(() => {
    if (dateFilter?.length && dateFilter[0]) {
      setTransactionPayload({
        ...transactionPayload,
        page: 1,
        start_date: convertStartToUTC(dateFilter[0]),
        end_date: "",
      });
      if (dateFilter[1]) {
        setTransactionPayload({
          ...transactionPayload,
          page: 1,
          start_date: convertStartToUTC(dateFilter[0]),
          end_date: convertEndToUTC(dateFilter[1]),
        });
      }
    } else {
      setTransactionPayload({
        ...transactionPayload,
        start_date: "",
        end_date: "",
        page: 1,
      });
    }
  }, [dateFilter]);


  function convertStartToUTC(date: Date): string {
    date.setHours(0, 0, 0, 0)
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const utcDate = new Date(date.getTime() + timezoneOffset);
    return dateFormatter(utcDate, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS_Z);
  }

  function convertEndToUTC(date: Date): string {
    date?.setHours(23, 59, 59, 999);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const utcDate = new Date(date.getTime() + timezoneOffset);
    return dateFormatter(utcDate, DATE_FORMAT.YYYY_MM_DD_HH_MM_SS_Z);
  }


  const handleCloseCalendar = () => {
    setTimeout(() => {
      op?.current?.hide();
    }, 0);
  };

  const handleOnCancel = useCallback(() => {
    setDateFilter([]);
    setIsOpenCalendar(false);
    handleCloseCalendar();
  }, []);

  const handleOnApply = useCallback((range: Date[]) => {
    handleCloseCalendar();
    setDateFilter(range);
    setIsOpenCalendar(false);
  }, []);

  const handleDateFilter: IDualCalendarReponse = {
    onApply: handleOnApply,
    onCancel: handleOnCancel,
    selectedRange: dateFilter,
  };


  const exportCsv = (transactionId: string = '', appointmentId: string = '') => {
    let payload: IDownloadCsvPayload;

    if (transactionId && appointmentId) {
      payload = {
        transaction_id: transactionId,
        appointment_id: appointmentId,
        start_date: transactionPayload.start_date,
        end_date: transactionPayload.end_date,
      }
    } else {
      const daysBetween = differenceInDays(transactionPayload?.end_date, transactionPayload?.start_date);
      if (daysBetween > 31 || isNaN(daysBetween)) {
        errorToast("Invalid Date Range", "Please select a date range of up to one month to download the CSV file.");
        return;
      }
      payload = {
        transaction_id: '',
        appointment_id: '',
        start_date: transactionPayload.start_date,
        end_date: transactionPayload.end_date,
        patient_name: transactionPayload.patient_name,
        service_category: transactionPayload.service_category,
      }
    }
    dispatch(
      downloadtransactionsThunk(payload)
    ).then((response) => {
      if (
        response?.payload &&
        response.meta.requestStatus === RESPONSE.FULFILLED
      ) {
        const url = window.URL.createObjectURL(new Blob([response.payload]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `transactions.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const errorResponse = response.payload;
        errorToast(MESSAGE.UNABLE_TO_DOWNLOAD, errorResponse.message || "No data available for the selected date range. Please choose a different date");
      }
    });
  }

  const handleSearch = useCallback(
    (patient_name: string) => {
      setTransactionPayload({
        ...transactionPayload,
        patient_name: patient_name,
        page: 1,
      });
    },
    [transactionPayload]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setTransactionPayload({ ...transactionPayload, page: newPage });
    },
    [transactionPayload]
  );


  const getColumnValue = (value: string) => {
    let bgColor = "";
    switch (value?.toLowerCase()) {
      case PAYMENT_STATUS.PAID:
        bgColor = "bg-green-100";
        break;
      case PAYMENT_STATUS.PENDING:
        bgColor = "bg-red-100";
        break;
      case PAYMENT_STATUS.REFUNDED:
        bgColor = "bg-purple-100";
        break;
      case PAYMENT_STATUS.FAILED:
        bgColor = "bg-red-300";
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

  const renderAmountPaid = (row: ITransaction) => (
    <>{`$${row.amountPaid ? row.amountPaid : "0"}`}</>
  );

  const renderTransactionDateTime = (row: ITransaction) => (
    <>
      {dateFormatter(row.transactionDateAndTime, DATE_FORMAT.DD_MMM_YYYY_HH_MM_A)}
    </>
  );

  const renderActionButtons = (row: ITransaction) =>
  (<button type="button"
    className="cursor-pointer"
    onClick={() => setSelectedTransaction(row)}
  >
    <i className="pi pi-eye text-xl text-purple-900 font-bold" />
  </button>
  )

  const columns = [
    {
      header: "Patient Name",
      field: "patientName",
    },
    {
      header: "Test Name",
      field: "testName",
    },
    { header: "Service Location", field: "serviceType" },
    {
      header: "Amount Paid",
      field: "amountPaid",
      body: (row: ITransaction) => renderAmountPaid(row),
    },
    {
      header: "Transaction Date & Time",
      body: (row: ITransaction) => renderTransactionDateTime(row),
    },
    {
      header: "payment status",
      body: (row: ITransaction) => getColumnValue(row.status),
    },
    {
      header: "",
      body: (row: ITransaction) => renderActionButtons(row),
    },
  ];


  const sidebarHeader = () => {
    return (
      <div className="flex justify-start gap-3 items-center w-full">
        <span>Transaction Details</span>
        <Button
          onClick={() =>
            exportCsv(
              selectedTransaction.transactionId,
              selectedTransaction.appointmentId,
            )
          }
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
    rowClassName: () => 'no-pointe',
    value: transactionResponse.transactions,
    ref: dataTableRef,
    selection: selectedTransaction,
    scrollable: true,
    scrollHeight: "calc(100vh - 200px)",
    emptyMessage: (
      <div className="flex justify-center w-full">No transaction found</div>
    ),
  } as const;

  return (
    <div>
      <div className="flex w-full h-[3rem] justify-end gap-3">
        <button type="button"
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
        </button>
        <span className="h-[2.5rem] w-[20rem]">
          <CustomServiceDropDown
            label="All Services"
            options={serviceCategories}
            onApplyFilter={(selectedCategories) => {
              setTransactionPayload({
                ...transactionPayload,
                page: 1,
                service_category: selectedCategories.join(","),
              });
            }}
          />
        </span>
        <SearchInput
          placeholder="Search For Patient"
          handleSearch={(patient_name: string) => handleSearch(patient_name)}
        />
        <Button
          onClick={() => exportCsv()}
          type="button"
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
          <DualCalendar dateFilter={handleDateFilter} />
        </OverlayPanel>

      </div>
      <div className="rounded-lg bg-white p-2 h-[calc(100vh-180px)] flex-grow">
        <DataTable {...tableProps}>
          {columns.map((column) => (
            <Column
              key={column.header}
              headerClassName="border-b font-tertiary text-sm uppercase"
              header={column.header}
              field={column.field}
              bodyClassName="border-b font-tertiary"
              body={column.body}
            />
          ))}
        </DataTable>
        {transactionResponse?.pagination?.total_pages > 1 && (
          <CustomPaginator
            currentPage={transactionResponse?.pagination?.current_page}
            handlePageChange={(newPage) => handlePageChange(newPage)}
            totalPages={transactionResponse?.pagination?.total_pages}
          />
        )}
      </div>
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
      <Toast ref={toast} />
    </div>
  );
};

const TransactionDetailedView = ({
  transaction,
}: {
  transaction: ITransaction;
}) => {

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
      label: "Preferred Location",
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
      value: transaction.transactionId,
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
      <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
        {transactionFields.map((field) => {
          return (
            <DetailRow
              key={field.label}
              label={field.label}
              value={field.value}
              styleClasses={field.styleClasses ?? ""}
            />
          );
        })}
      </div>
    </div>
  );
};

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
    <label className="font-primary">{value ?? "-"}</label>
  </div>
);

export default Transaction;
