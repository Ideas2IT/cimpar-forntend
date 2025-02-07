import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { OverlayPanel } from "primereact/overlaypanel";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FilterIcon from "../assets/icons/filter.svg?react";
import SlideBack from "../assets/icons/slideback.svg?react";
import SlideOpen from "../assets/icons/slideOpen.svg?react";
import { IServiceHistoryPayload } from "../interfaces/immunization";
import Tab from "../interfaces/Tab";
import { selectSelectedPatient } from "../store/slices/PatientSlice";
import { getServiceHistoryThunk } from "../store/slices/serviceHistorySlice";
import { AppDispatch } from "../store/store";
import {
  LAB_SERVICES,
  MESSAGE,
  PAGE_LIMIT,
  RESPONSE,
  TABS,
} from "../utils/AppConstants";
import { IItem } from "./appointmentForm/AppointmentForm";
import SearchInput, { SearchInputHandle } from "./SearchInput";
import ServiceHistory from "./serviceHistory/ServiceHistory";
import Immunization from "./testResult/Immunization";
import TestResult from "./testResult/TestResult";
import useToast from "./useToast/UseToast";
import VerticalTabView from "./VerticalTabView";
export interface LabTestResult {
  testName: string;
  testedAt: string;
  status: string;
  dateOfTest: string;
  data: {
    specimenUsed: string;
    dateTimeCollected: string;
    physicianName: string;
    physicianPhone: string;
    dateTimeReported?: string;
  };
  orderId: string;
}

const LabTestResults = () => {
  const patient = useSelector(selectSelectedPatient);
  const dispatch = useDispatch<AppDispatch>();
  const { errorToast, toast } = useToast();
  const handlePageChange = (val: number) => {
    setPageNumber(val);
  };

  const tabs: Tab[] = [
    {
      key: "HealthRecord",
      value: "Service History",
      content: (
        <div className="py-1 ps-3 h-full">
          <ServiceHistory handlePageChange={handlePageChange} />
        </div>
      ),
    },
    {
      key: "labTestResults",
      value: "Clinical Laboratory",
      content: (
        <div className="py-1 ps-3 h-full">
          <TestResult handlePageChange={handlePageChange} />
        </div>
      ),
    },
    {
      key: "imaging",
      value: "Imaging",
      content: (
        <div className="py-1 ps-3 h-full">
          <TestResult handlePageChange={handlePageChange} />
        </div>
      ),
    },
    {
      key: "home care",
      value: "Home Care",
      content: (
        <div className="py-1 ps-3 h-full">
          <TestResult handlePageChange={handlePageChange} />
        </div>
      ),
    },
    {
      key: "immunization",
      value: "Immunization",
      content: (
        <div className="py-1 ps-3 h-full">
          <Immunization handlePageChange={handlePageChange} />
        </div>
      ),
    },
  ];
  const services = [
    { id: 1, name: "Clinical Laboratory", value: "Clinical Laboratory" },
    { id: 3, name: "Imaging", value: "Imaging" },
    { id: 4, name: "Home Care", value: "Home_care" },
    { id: 2, name: "Immunization", value: "Immunization" },
  ];

  const [hideTabs, setHideTabs] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Service History");
  const [isOpen, setIsOpen] = useState(false);
  const op = useRef<OverlayPanel>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<SearchInputHandle>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setPageNumber(1);
  };

  const handleTabChange = (tab: string) => {
    setSearchValue("");
    setPageNumber(1);
    if (searchInputRef.current) {
      searchInputRef.current.clearInput();
    }
    setSelectedServices([]);
    setSelectedTab(tab);
  };

  const getServiceType = () => {
    switch (selectedTab) {
      case TABS.CLINICAL_LABORATORY:
        return LAB_SERVICES.CLINICAL_LABORATORY;
      case TABS.IMMUNIZATION:
        return TABS.IMMUNIZATION;
      case TABS.IMAGING:
        return TABS.IMAGING;
      case TABS.HOME_CARE:
        return "Home_care";
      default:
        return "";
    }
  };

  const callResource = () => {
    if (!patient?.basicDetails?.id) {
      return;
    }
    if (selectedTab === TABS.SERVICE_HISTORY) {
      const payload: IServiceHistoryPayload = {
        selectedTab: selectedTab,
        patinetId: patient?.basicDetails?.id,
        searchValue: searchValue,
        page: pageNumber,
        page_size: PAGE_LIMIT,
        service_type: services
          .filter((obj) => selectedServices.includes(obj.id))
          .map((obj) => obj.value)
          .join(","),
      };
      dispatch(getServiceHistoryThunk(payload)).then(({ meta }) => {
        if (meta.requestStatus === RESPONSE.REJECTED) {
          errorToast(MESSAGE.UNABLE_TO_FETCH, "Failed to load service history");
        }
      });
    } else {
      const payload: IServiceHistoryPayload = {
        selectedTab: selectedTab,
        patinetId: patient?.basicDetails?.id,
        searchValue: searchValue,
        page: pageNumber,
        page_size: PAGE_LIMIT,
        service_type: getServiceType(),
      };
      dispatch(getServiceHistoryThunk(payload)).then(({ meta }) => {
        if (meta.requestStatus === RESPONSE.REJECTED) {
          errorToast(MESSAGE.UNABLE_TO_FETCH, "Failed to load Srvice History");
        }
      });
    }
  };

  useEffect(() => {
    callResource();
  }, [
    selectedTab,
    searchValue,
    patient?.basicDetails?.id,
    pageNumber,
    selectedServices,
  ]);

  const handleServiceFilter = (newService: IItem) => {
    setPageNumber(1);
    if (selectedServices.includes(newService.id)) {
      setSelectedServices(
        selectedServices.filter((id) => id !== newService.id)
      );
    } else {
      setSelectedServices([...selectedServices, newService.id]);
    }
  };

  const getByPlaceholderText = () => {
    switch (selectedTab) {
      case TABS.SERVICE_HISTORY:
        return "Search For Service";
      case TABS.LAB_RESULT:
      case TABS.IMAGING:
      case TABS.HOME_CARE:
        return "Search For Test";
      case TABS.IMMUNIZATION:
        return "Search For Vaccine";
      default:
        return "Search";
    }
  };

  return (
    <div className="flex flex-col flex-grow px-6">
      <div className="flex justify-between items-center mb-3">
        <div>
          <button
            className={`p-2 rounded-lg mr-3 ${hideTabs ? "bg-white" : "bg-cyan-700"}`}
            onClick={() => setHideTabs((hideTabs) => !hideTabs)}
          >
            {hideTabs ? <SlideOpen fill="clear" /> : <SlideBack fill="white" />}
          </button>
          <span className="font-primary text-xl text-cyan-800">
            {selectedTab}
          </span>
        </div>
        <div className="flex items-center">
          <div
            className={`${selectedTab === "Service History" ? "rounded-full px-2  relative flex mx-2 border border-[#2D6D80] w-[20rem] h-[2.5rem] items-center bg-white cursor-pointer" : "hidden"}`}
            onClick={(event) => {
              op.current?.toggle(event);
              setIsOpen((prev) => !prev);
            }}
          >
            <FilterIcon className="mx-3 color-primary" />
            <span className="color-primary">All Services</span>
            <span
              className={`text-end color-primary absolute right-3 ${isOpen ? "pi pi-angle-up" : "pi pi-angle-down"}`}
            />
          </div>
          <OverlayPanel
            ref={op}
            unstyled
            closeOnEscape
            dismissable={true}
            className="bg-white py-2 mt-5 shadow-md rounded-lg"
            onHide={() => {
              setIsOpen(false);
            }}
          >
            <div className="w-[20rem] min-h-[12rem] p-4 pb-1">
              {services.map((option, index) => {
                return (
                  <div
                    key={index}
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
                  </div>
                );
              })}
              <div className="flex justify-end mt-3">
                <Button
                  className="color-primary bg-white border-2 border-[#2d6d80] py-2 px-6 rounded-lg me-2 shadow-none"
                  label="Cancel"
                  outlined
                  onClick={(event) => {
                    setTimeout(() => {
                      op.current?.toggle(event);
                    }, 0);
                    setIsOpen(false);
                    setSelectedServices([]);
                  }}
                />
                <Button
                  className="text-white bg-primary py-2 px-6 rounded-lg"
                  label="Apply"
                  onClick={(event) => {
                    setTimeout(() => {
                      op?.current?.toggle(event);
                    }, 0);
                    setIsOpen(false);
                  }}
                />
              </div>
            </div>
          </OverlayPanel>
          <SearchInput
            placeholder={getByPlaceholderText()}
            ref={searchInputRef}
            handleSearch={handleSearch}
          />
        </div>
      </div>
      <div className="flex flex-col rounded-xl overflow-hidden flex-grow border border-gray-100">
        <VerticalTabView
          tabs={tabs}
          hideTabs={hideTabs}
          changeTab={handleTabChange}
        />
      </div>
      <Toast ref={toast} />
    </div>
  );
};

export default LabTestResults;
