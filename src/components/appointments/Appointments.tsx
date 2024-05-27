import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { IAppointment, appointments } from "../../assets/MockData";
import { useContext, useRef, useState } from "react";
import SearchInput from "../SearchInput";
import ServiceFilterPanel from "./ServiceFilterPanel";

import VerticalTabView from "../VerticalTabView";
import { tabs } from "../userProfilePage/UserProfilePage";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import DetailedAppointmentView from "./DetailedApppointmentView";
import BackButton from "../backButton/BackButton";
import { PATH_NAME } from "../../utils/AppConstants";
import DualCalendar from "../dualCalendar/DualCalendar";
import { OverlayPanel } from "primereact/overlaypanel";
import HeaderContext from "../../context/HeaderContext";
import { getRowClasses } from "../../services/commonFunctions";

const Appointments = () => {
  const { updateHeaderTitle } = useContext(HeaderContext);
  updateHeaderTitle("Appointments");
  const [selectedAppoinement, setSelectedAppointment] = useState(
    {} as IAppointment
  );
  const [showPatinetDetails, setShowPatientDetails] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOpenCalendar, setIsOpenCalendar] = useState(false);
  const [dateFilter, setDateFilter] = useState<Date[]>();
  const op = useRef<OverlayPanel>(null);

  const handleViewAppointment = (value: IAppointment) => {
    setSelectedAppointment(value);
    setIsSidebarOpen(true);
    console.log(dateFilter);
  };
  const handleViewPatient = (value: boolean, appoinement: IAppointment) => {
    setShowPatientDetails(value);
    setSelectedAppointment(appoinement);
  };

  const handlers = {
    viewPatient: handleViewPatient,
    viewAppointment: handleViewAppointment,
  };

  const ColumnDetails = ({
    value,
    styleClass,
  }: {
    value: string | number;
    styleClass?: string;
  }) => {
    return (
      <div
        className={`text-[16px] font-tertiary capitalize ${styleClass && styleClass}`}
      >
        {value}
      </div>
    );
  };
  const columns = [
    {
      field: "patientName",
      header: "PATIENT NAME",
      body: (rowData: IAppointment) => (
        <ColumnDetails
          styleClass="text-purple-900"
          value={rowData.patientName}
        />
      ),
    },
    {
      field: "age",
      header: "AGE",
      body: (rowData: IAppointment) => <ColumnDetails value={rowData.age} />,
    },
    {
      field: "gender",
      header: "GENDER",
      body: (rowData: IAppointment) => <ColumnDetails value={rowData.gender} />,
    },
    {
      field: "insurance",
      header: "INSURANCE",
      body: (rowData: IAppointment) => (
        <ColumnDetails value={rowData.insurance} />
      ),
    },
    {
      field: "insurance",
      header: "DATE & TIME OF TEST",
      body: (rowData: IAppointment) => (
        <ColumnDetails value={rowData.dateAndTime} />
      ),
    },
    {
      field: "insurance",
      header: "APPOINTMENT FOR",
      body: (rowData: IAppointment) => (
        <ColumnDetails value={rowData.appointmentFor.join(", ")} />
      ),
    },
    {
      headerClassName:
        "flex justify-center text-sm font-secondary py-1 border-b bg-white",
      field: "",
      header: "VIEW APPOINTMENT",
      body: (rowData: IAppointment) => (
        <ViewAppointment appoinement={rowData} handlers={handlers} />
      ),
    },
  ];

  const handleSearch = () => {};

  const AppointmentHeader = () => {
    return (
      <div className="flex justify-between w-full pe-4 items-center">
        <label>Appointment Details</label>
        <Button
          onClick={() => {
            setShowPatientDetails(true);
            setIsSidebarOpen(false);
          }}
          icon="pi pi-user"
          label="View Profile"
          className="text-sm text-purple-900 shadow-none"
        />
      </div>
    );
  };

  const handleOnCancel = () => {
    setIsOpenCalendar(false);
    op?.current?.hide();
    setDateFilter([]);
  };

  const handleOnApply = (range: Date[]) => {
    setIsOpenCalendar(false);
    op?.current?.hide();
    setDateFilter(range);
  };

  const handleDateFilter: IDualCalendarReponse = {
    onApply: handleOnApply,
    onCancel: handleOnCancel,
  };

  return (
    <div className="h-[98%]">
      <div className="flex justify-between">
        {showPatinetDetails ? (
          <div
            onClick={() => {
              setShowPatientDetails(false);
              setSelectedAppointment({} as IAppointment);
            }}
          >
            <BackButton
              previousPage="Upcoming"
              currentPage={
                selectedAppoinement.patientName + "' " + "Appoinement"
              }
              backLink={PATH_NAME.APPOINTMENTS}
            />
          </div>
        ) : (
          <label className="color-primary font-primary text-xl">Upcoming</label>
        )}
        <div className="flex gap-2">
          {!showPatinetDetails && (
            <div
              className={`md:w-[20rem] border-primary max-h-[2.5rem] flex  items-center justify-between px-4 rounded-full ${isOpenCalendar ? "bg-primary text-white" : "color-primary bg-white"}`}
              onClick={(e) => {
                op?.current?.toggle(e);
                setIsOpenCalendar(true);
              }}
            >
              <i className="pi pi-calendar-minus" />
              <p className="font-primary">All Upcoming Appointments</p>
              {isOpenCalendar ? (
                <i className="pi pi-chevron-up" />
              ) : (
                <i className="pi pi-chevron-down" />
              )}
            </div>
          )}
          <span className="h-full w-[20rem]">
            <ServiceFilterPanel />
          </span>
          <SearchInput
            placeholder="Search patient name"
            handleSearch={handleSearch}
          />
        </div>
      </div>
      <div className="bg-white rounded-xl mt-2 h-[96%]">
        {!showPatinetDetails ? (
          <DataTable
            selection={selectedAppoinement}
            value={appointments}
            selectionMode="single"
            dataKey="id"
            tableStyle={{ minWidth: "50rem" }}
            className="mt-2 max-h-[90%] rowHoverable px-6 py-3"
            rowClassName={() => getRowClasses("h-10 border-b")}
            scrollHeight="40rem"
          >
            {columns.map((column, index) => {
              return (
                <Column
                  key={index}
                  headerClassName={
                    column.headerClassName
                      ? column.headerClassName
                      : "text-sm font-secondary py-1 border-b bg-white"
                  }
                  bodyClassName={"py-4 max-w-[10rem]"}
                  header={column.header}
                  field={column.field}
                  body={column.body}
                />
              );
            })}
          </DataTable>
        ) : (
          <div className="flex h-full bg-white flex-col rounded-xl overflow-hidden flex-grow border border-gray-100">
            <VerticalTabView
              tabs={tabs}
              changeTab={() => {}}
              hideTabs={false}
            />
          </div>
        )}
      </div>
      {isSidebarOpen && (
        <Sidebar
          onHide={() => {
            setSelectedAppointment({} as IAppointment);
            setIsSidebarOpen(false);
          }}
          className="detailed-view w-[35rem]"
          header={<AppointmentHeader />}
          visible={isSidebarOpen}
          position="right"
        >
          <DetailedAppointmentView details={selectedAppoinement} />
        </Sidebar>
      )}
      <OverlayPanel
        ref={op}
        className="w-auto"
        onHide={() => setIsOpenCalendar(false)}
      >
        <DualCalendar dateFilter={handleDateFilter} />
      </OverlayPanel>
    </div>
  );
};

const ViewAppointment = ({
  appoinement,
  handlers,
}: {
  appoinement: IAppointment;
  handlers: IHandlers;
}) => {
  return (
    <div className="flex w-full justify-center gap-4 items-center text-purple-900">
      <i
        aria-label="View Appointment"
        className="pi pi-calendar-minus"
        onClick={() => handlers.viewAppointment(appoinement)}
      />
      {/* <User
        className="stroke-purple-900"
        onClick={() => handlers.viewPatient(true, appoinement)}
      /> */}
      <i
        aria-label="View User"
        className="pi pi-user"
        onClick={() => handlers.viewPatient(true, appoinement)}
      />
    </div>
  );
};

interface IHandlers {
  viewAppointment: (value: IAppointment) => void;
  viewPatient: (value: boolean, appoinement: IAppointment) => void;
}

export interface IDualCalendarReponse {
  onApply: (range: Date[]) => void;
  onCancel: () => void;
}

export default Appointments;
