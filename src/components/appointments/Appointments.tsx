import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { OverlayPanel } from "primereact/overlaypanel";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FilterIcon from "../../assets/icons/filter.svg?react";
import { IAppointmentList, IGetAppointmentPayload } from "../../interfaces/appointment";
import { ErrorResponse } from "../../interfaces/common";
import { IServiceHistoryPayload } from "../../interfaces/immunization";
import Tab from "../../interfaces/Tab";
import { getRowClasses } from "../../services/commonFunctions";
import { getAllAppointmentsThunk, getTotalAppointment, selectAppointments } from "../../store/slices/appointmentSlice";
import { selectIsAdmin } from "../../store/slices/loginSlice";
import { getPatientDetailsThunk, selectSelectedPatient } from "../../store/slices/PatientSlice";
import { getServiceHistoryThunk } from "../../store/slices/serviceHistorySlice";
import { AppDispatch } from "../../store/store";
import { DATE_FORMAT, PAGE_LIMIT, PATH_NAME, RESPONSE, TABS } from "../../utils/AppConstants";
import { dateFormatter } from "../../utils/Date";
import { IItem } from "../appointmentForm/AppointmentForm";
import BackButton from "../backButton/BackButton";
import CustomPaginator from "../customPagenator/CustomPaginator";
import DualCalendar from "../dualCalendar/DualCalendar";
import InsuranceDetails from "../insuranceDetails/InsuranceDetails";
import MedicalConditionDetails from "../medicalDetails/MedicalConditionDetails";
import Medication from "../medication/Medication";
import SearchInput from "../SearchInput";
import ServiceHistory from "../serviceHistory/ServiceHistory";
import Unauthorized from "../Unauthorised";
import UserDetails from "../userDetails/UserDetails";
import useToast from "../useToast/UseToast";
import VerticalTabView from "../VerticalTabView";
import VisitHistory from "../visitHistory/VisitHistory";
import DetailedAppointmentView from "./DetailedApppointmentView";
import ServiceFilterPanel from "./ServiceFilterPanel";

interface IHandlers {
  viewAppointment: () => void;
  viewPatient: (value: boolean, appoinement: IAppointmentList) => void;
}

export interface IDualCalendarReponse {
  onApply: (range: Date[]) => void;
  onCancel: () => void;
  selectedRange: Date[] | undefined;
}

const Appointments = () => {

  const [serviceHistoryPayload, setServiceHistoryPayload] =
    useState<IServiceHistoryPayload>({
      page_size: PAGE_LIMIT,
      page: 1,
      searchValue: "",
    } as IServiceHistoryPayload);

  const appointments = useSelector(selectAppointments);
  const patientId = useSelector(selectSelectedPatient)?.basicDetails?.id;
  const appointmentMeta = useSelector(getTotalAppointment);
  const isAdmin = useSelector(selectIsAdmin);

  const services = [
    { id: 1, name: "Lab Results", value: "lab_result" },
    { id: 2, name: "Immunization", value: "Immunization" },
    { id: 3, name: "Imaging", value: "Imaging" },
    { id: 4, name: "Home Care", value: "Home_care" },
  ];
  const tabs: Tab[] = [
    {
      key: "serviceHistory",
      value: TABS.SERVICE_HISTORY,
      content: (
        <div className="ps-6 py-1 h-full">
          <ServiceHistory
            handlePageChange={(page) => {
              setServiceHistoryPayload({
                ...serviceHistoryPayload,
                page: page,
              });
            }}
          />
        </div>
      ),
    },
    {
      key: "Personal",
      value: "Personal",
      content: (
        <div className="px-6 py-1 h-full">
          <UserDetails />
        </div>
      ),
    },
    {
      key: "medications",
      value: "Medications",
      content: (
        <div className="px-6 py-1 h-full">
          <Medication />
        </div>
      ),
    },
    {
      key: "insurance",
      value: "Insurance",
      content: (
        <div className="px-6 py-1 h-full">
          <InsuranceDetails />
        </div>
      ),
    },
    {
      key: "MedicalConditions",
      value: "Medical Conditions & Allergies",
      content: (
        <div className="ps-6 py-1 h-full">
          <MedicalConditionDetails />
        </div>
      ),
    },
    {
      key: "visitHistory",
      value: "Visit History",
      content: (
        <div className="px-6 py-1 h-full">
          <VisitHistory />
        </div>
      ),
    },
  ];

  const [selectedAppointment, setSelectedAppointment] = useState({} as IAppointmentList);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOpenCalendar, setIsOpenCalendar] = useState(false);
  const [dateFilter, setDateFilter] = useState<Date[]>();
  const op = useRef<OverlayPanel>(null);
  const opService = useRef<OverlayPanel>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { toast, errorToast } = useToast();

  const handleViewAppointment = () => {
    setIsSidebarOpen(true);
  };

  const handleViewPatient = (value: boolean, appointment: IAppointmentList) => {
    setSelectedAppointment(appointment);
    dispatch(getPatientDetailsThunk(appointment?.patientId));
    setShowPatientDetails(value);
  };
  const [selectedTab, setSelectedTab] = useState(TABS.SERVICE_HISTORY);
  const [appointmentPayload, setAppointmentPayload] =
    useState<IGetAppointmentPayload>({
      page: 1,
      service_name: [] as string[],
      end_date: "",
      page_size: PAGE_LIMIT,
      patient_name: "",
      appointmentFor: [],
      start_date: "",
    });

  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    divRef?.current && divRef.current?.scrollTo(0, 0);
    if (Object.keys(appointmentPayload).length) {
      dispatch(getAllAppointmentsThunk(appointmentPayload)).then((response) => {
        if (response.meta.requestStatus === RESPONSE.REJECTED) {
          const erroResponse =
            (response?.payload as ErrorResponse) || ({} as ErrorResponse);
          errorToast("Failed to load data", erroResponse.message);
        }
      });
    }
  }, [appointmentPayload]);

  const handleTestFilter = (values: string[]) => {
    setAppointmentPayload((prev) => ({
      ...prev,
      service_name: values || "",
      page: 1,
    }));
  };

  function convertStartToUTC(date: Date): string {
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

  useEffect(() => {
    if (dateFilter?.length == 2 && dateFilter?.[1]) {
      setAppointmentPayload((prev) => ({
        ...prev,
        start_date: convertStartToUTC(dateFilter[0]) || "",
        end_date: convertEndToUTC(dateFilter[1]) || "",
        page: 1,
      }));
    } else if (dateFilter?.[0]) {
      setAppointmentPayload((prev) => ({
        ...prev,
        start_date: convertStartToUTC(dateFilter[0]),
        end_date: "",
        page: 1,
      }));
    } else {
      setAppointmentPayload((prev) => ({
        ...prev,
        start_date: "",
        end_date: "",
        page: 1,
      }));
    }
  }, [dateFilter]);

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
        className={`text-[16px] font-tertiary capitalize ${styleClass}`}
      >
        {value}
      </div>
    );
  };

  const columns = [
    {
      field: "patientName",
      header: "PATIENT NAME",
      body: (rowData: IAppointmentList) => (
        <button type="button"
          className="text-start"
          onClick={() => {
            handlers.viewAppointment();
            handlers.viewPatient(false, rowData);
          }}
        >
          <ColumnDetails
            styleClass="text-purple-900 hover:underline"
            value={rowData.patientName}
          />
        </button>
      ),
    },
    {
      field: "age",
      header: "AGE",
      body: (rowData: IAppointmentList) => (
        <ColumnDetails value={rowData.age} />
      ),
    },
    {
      field: "gender",
      header: "GENDER",
      body: (rowData: IAppointmentList) => (
        <ColumnDetails value={rowData.gender} />
      ),
    },
    {
      field: "insurance",
      header: "INSURANCE",
      body: (rowData: IAppointmentList) => (
        <ColumnDetails value={rowData.insurance} />
      ),
    },
    {
      field: "insurance",
      header: "DATE & TIME OF TEST",
      body: (rowData: IAppointmentList) => (
        <ColumnDetails value={rowData.dateAndTime} />
      ),
    },
    {
      field: "insurance",
      header: "APPOINTMENT FOR",
      body: (rowData: IAppointmentList) => (
        <ColumnDetails value={rowData?.appointmentFor} />
      ),
    },
    {
      headerClassName:
        "flex justify-center text-sm font-secondary py-1 border-b bg-white",
      field: "",
      header: "VIEW APPOINTMENT",
      body: (rowData: IAppointmentList) => (
        <ViewAppointment appoinement={rowData} handlers={handlers} />
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setAppointmentPayload((prev) => ({
      ...prev,
      patient_name: value,
      page: 1,
    }));
  };

  useEffect(() => {
    if (selectedTab === TABS.SERVICE_HISTORY && patientId) {
      const payload: IServiceHistoryPayload = {
        selectedTab: selectedTab,
        patinetId: patientId,
        searchValue: serviceHistoryPayload.searchValue,
        page: serviceHistoryPayload.page,
        page_size: PAGE_LIMIT,
        service_type: serviceHistoryPayload?.service_type,
      };
      dispatch(getServiceHistoryThunk(payload)).then((respone) => {
        if (respone.meta.requestStatus === RESPONSE.REJECTED) {
          const errorResponse =
            (respone?.payload as ErrorResponse) || ({} as ErrorResponse);
          errorToast("Failed to load data", errorResponse.message);
        }
      });
    }
  }, [serviceHistoryPayload, patientId]);

  const appointmentHeader = () => {
    return (
      <div className="flex justify-between w-full pe-4 items-center">
        <label htmlFor="appointmentDetails">Appointment Details</label>
        <Button
          id="appointmentDetails"
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

  const handleCloseCalendar = () => {
    setTimeout(() => {
      op?.current?.hide();
    }, 0);
  };

  const handleOnCancel = () => {
    setIsOpenCalendar(false);
    handleCloseCalendar();
    setDateFilter([]);
  };

  const handleOnApply = (range: Date[]) => {
    setDateFilter(range);
    setIsOpenCalendar(false);
    handleCloseCalendar();
  };

  const handleServiceFilter = (newService: IItem) => {
    setAppointmentPayload({ ...appointmentPayload, page: 1 });
    if (selectedServices.includes(newService.id)) {
      setSelectedServices(
        selectedServices.filter((id) => id !== newService.id)
      );
    } else {
      setSelectedServices([...selectedServices, newService.id]);
    }
  };

  const handleDateFilter: IDualCalendarReponse = {
    onApply: handleOnApply,
    onCancel: handleOnCancel,
    selectedRange: dateFilter,
  };

  useEffect(() => {
    if (showPatientDetails) {
      setServiceHistoryPayload({
        page: 1,
        page_size: PAGE_LIMIT,
        searchValue: "",
        service_type: "",
      } as IServiceHistoryPayload);
      setSelectedServices([1, 2, 3]);
      setAppointmentPayload({
        page: 1,
        page_size: PAGE_LIMIT,
        patient_name: "",
        start_date: "",
        end_date: "",
        service_name: [],
        appointmentFor: [],
      } as IGetAppointmentPayload);
      setDateFilter([]);
    }
  }, [showPatientDetails]);

  const getServiceLabel = () => {
    if (selectedServices.includes(1) || selectedServices.length === 0) {
      return "All Services";
    } else if (selectedServices.includes(2)) {
      return "Lab Results";
    }
    return "Immunization";
  };

  return (
    <div className="h-[98%] mx-6">
      {isAdmin ? (
        <>
          <div className="flex justify-between">
            {showPatientDetails ? (
              <button type="button"
                onClick={() => {
                  setShowPatientDetails(false);
                  setSelectedAppointment({} as IAppointmentList);
                }}
              >
                <BackButton
                  previousPage="Upcoming"
                  currentPage={
                    selectedAppointment?.patientName + "'s " + "Appointment"
                  }
                  backLink={PATH_NAME.APPOINTMENTS}
                />
              </button>
            ) : (
              <p className="color-primary font-primary text-xl">
                Upcoming
              </p>
            )}
            {!showPatientDetails && (
              <div className="flex gap-2">
                <button type="button"
                  className={`md:w-[20rem] cursor-pointer border-primary max-h-[2.5rem] flex  items-center justify-between px-4 rounded-full ${isOpenCalendar ? "bg-primary text-white" : "color-primary bg-white"}`}
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
                </button>
                <span className="h-full w-[20rem]">
                  <ServiceFilterPanel onApplyFilter={handleTestFilter} />
                </span>
                <SearchInput
                  placeholder="Search patient name"
                  handleSearch={handleSearch}
                />
              </div>
            )}
            {showPatientDetails && selectedTab === TABS.SERVICE_HISTORY && (
              <div className="flex items-center">
                <div className="flex items-center">
                  <button
                    className={`${selectedTab === "Service History" ? "rounded-full px-2  relative flex mx-2 border border-[#2D6D80] w-[20rem] h-[2.5rem] items-center bg-white cursor-pointer" : "hidden"}`}
                    onClick={(event) => {
                      opService.current?.toggle(event);
                      setIsOpen((prev) => !prev);
                    }}
                  >
                    <FilterIcon className="mx-3 color-primary" />
                    <span className="color-primary">
                      {getServiceLabel()}
                    </span>
                    <span
                      className={`text-end color-primary absolute right-3 ${isOpen ? "pi pi-angle-up" : "pi pi-angle-down"}`}
                    />
                  </button>
                  <OverlayPanel
                    unstyled
                    className="bg-white py-2 mt-5 shadow-md rounded-lg"
                    onHide={() => setIsOpen(false)}
                    ref={opService}
                  >
                    <div className="w-[20rem] min-h-[12rem] p-4 pb-1">
                      {!!services?.length &&
                        services.map((option) => {
                          return (
                            <button type="button"
                              key={option.name}
                              className="border-b py-1 cursor-pointer"
                              onClick={() => handleServiceFilter(option)}
                            >
                              <div className="h-[2.5rem] font-tertiary py-1 text-lg flex justify-between items-center">
                                <label className="font-tertiary text-lg">
                                  {option.name}
                                </label>
                                <Checkbox
                                  className="service-box"
                                  checked={selectedServices.includes(option.id)}
                                />
                              </div>
                            </button>
                          );
                        })}
                      <div className="flex justify-end mt-3">
                        <Button
                          className="color-primary bg-white border-2 border-[#2d6d80] py-2 px-6 rounded-lg me-2 shadow-none"
                          label="Cancel"
                          outlined
                          onClick={(event) => {
                            opService.current?.toggle(event);
                            setIsOpen((prev) => !prev);
                          }}
                        />
                        <Button
                          className="text-white bg-primary py-2 px-6 rounded-lg"
                          label="Apply"
                          onClick={(event) => {
                            setTimeout(() => {
                              opService.current?.toggle(event);
                              setIsOpen((prev) => !prev);
                            }, 0);
                          }}
                        />
                      </div>
                    </div>
                  </OverlayPanel>
                </div>
                <SearchInput
                  placeholder="Search for Service"
                  handleSearch={(val) =>
                    setServiceHistoryPayload({
                      ...serviceHistoryPayload,
                      searchValue: val,
                    })
                  }
                />
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl mt-2">
            {!showPatientDetails ? (
              <div ref={divRef} className="h-[calc(100vh-175px)] overflow-auto">
                <DataTable
                  value={appointments}
                  emptyMessage={
                    <div className="flex w-full justify-center">
                      No Appointments to show
                    </div>
                  }
                  tableStyle={{ minWidth: "50rem" }}
                  className="mt-2 px-2 py-3"
                  rowClassName={() => getRowClasses("h-10 border-b")}
                >
                  {columns.map((column) => {
                    return (
                      <Column
                        key={column.header}
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
                {Number(appointmentMeta?.total_pages) > 1 && (
                  <CustomPaginator
                    totalPages={Number(appointmentMeta?.total_pages || 0)}
                    handlePageChange={(val) => {
                      setAppointmentPayload((prev) => ({
                        ...prev,
                        page: val,
                      }));
                    }}
                    currentPage={Number(appointmentMeta.current_page)}
                  />
                )}
              </div>
            ) : (
              <div className="flex h-[calc(100vh-175px)] bg-white flex-col rounded-xl overflow-hidden flex-grow border border-gray-100">
                <VerticalTabView
                  tabs={tabs}
                  changeTab={(tab) => {
                    setSelectedTab(tab);
                  }}
                  hideTabs={false}
                />
              </div>
            )}
          </div>
          {isSidebarOpen && (
            <Sidebar
              onHide={() => {
                setSelectedAppointment({} as IAppointmentList);
                setIsSidebarOpen(false);
              }}
              className="detailed-view w-[35rem]"
              header={appointmentHeader()}
              visible={isSidebarOpen}
              position="right"
            >
              <DetailedAppointmentView
                appointmentId={selectedAppointment?.id}
                patientId={selectedAppointment?.patientId}
              />
            </Sidebar>
          )}
          <OverlayPanel
            ref={op}
            className="w-auto"
            onHide={() => setIsOpenCalendar(false)}
          >
            <DualCalendar dateFilter={handleDateFilter} />
          </OverlayPanel>
        </>
      ) : (
        <Unauthorized />
      )}
      <Toast ref={toast} />
    </div>
  );
};

const ViewAppointment = ({
  appoinement,
  handlers,
}: {
  appoinement: IAppointmentList;
  handlers: IHandlers;
}) => {
  return (
    <div className="flex w-full justify-center gap-4 items-center text-purple-900">
      <button type="button"
        aria-label="View Appointment"
        className="pi pi-calendar-minus"
        title="View Appointment"
        onClick={() => {
          handlers.viewAppointment();
          handlers.viewPatient(false, appoinement);
        }}
      />
      <button type="button"
        aria-label="View User"
        className="pi pi-user"
        title="View Profile"
        onClick={() => handlers.viewPatient(true, appoinement)}
      />
    </div>
  );
};

export default Appointments;
