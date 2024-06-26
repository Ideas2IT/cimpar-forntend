import Tab from "../interfaces/Tab";
import VerticalTabView from "./VerticalTabView";
import { useRef, useState } from "react";
import SearchInput from "./SearchInput";
import SlideBack from "../assets/icons/slideback.svg?react";
import SlideOpen from "../assets/icons/slideOpen.svg?react";
import Immunization from "./testResult/Immunization";
import TestResult from "./testResult/TestResult";
import ServiceHistory from "./serviceHistory/ServiceHistory";
import { labResults, services } from "../assets/MockData";
import FilterIcon from "../assets/icons/filter.svg?react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { IItem } from "./appointmentForm/AppointmentForm";
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
  const tabs: Tab[] = [
    {
      key: "pastHealthRecord",
      value: "Service History",
      content: (
        <div className="px-6 py-1 h-full">
          <ServiceHistory />
        </div>
      ),
    },
    {
      key: "labTestResults",
      value: "Lab Results",
      content: (
        <div className="px-6 py-1 h-full">
          <TestResult results={labResults} />
        </div>
      ),
    },
    {
      key: "immunization",
      value: "Immunization",
      content: (
        <div className="px-6 py-1 h-full">
          <Immunization />
        </div>
      ),
    },
  ];

  const [hideTabs, setHideTabs] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Service History");
  const [isOpen, setIsOpen] = useState(false);
  const op = useRef<OverlayPanel>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([1, 2, 3]);

  //TODO: Need to call API with search query
  const handleSearch = (value: string) => {
    console.log(value);
  };

  const handleServiceFilter = (newService: IItem) => {
    if (
      newService.name.toLowerCase() === "all services" &&
      !selectedServices.includes(newService.id)
    ) {
      setSelectedServices(
        services.map((ser) => {
          return ser.id;
        })
      );
      return;
    } else if (newService.name.toLowerCase() === "all services") {
      setSelectedServices([]);
      return;
    }

    if (selectedServices.includes(newService.id)) {
      const servicesCopy = selectedServices.filter((service) => {
        return service !== newService.id && service !== 1;
      });
      setSelectedServices(servicesCopy);
    } else {
      if (selectedServices.length) {
        setSelectedServices(
          services.map((serv) => {
            return serv.id;
          })
        );
      } else {
        setSelectedServices([...selectedServices, newService.id]);
      }
    }
  };

  const handleFilter = () => {};

  const setLabel = () => {
    if (selectedServices.includes(1) || !selectedServices.length) {
      return "All Services";
    } else if (selectedServices.includes(2)) {
      return "Lab Tests";
    } else {
      return "Immunization";
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
            <span className="color-primary">{setLabel()}</span>
            <span
              className={`text-end color-primary absolute right-3 ${isOpen ? "pi pi-angle-up" : "pi pi-angle-down"}`}
            />
          </div>
          <OverlayPanel
            unstyled
            className="bg-white py-2 mt-5 shadow-md rounded-lg"
            onHide={() => setIsOpen(false)}
            ref={op}
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
                    op.current?.toggle(event);
                    setIsOpen((prev) => !prev);
                  }}
                />
                <Button
                  className="text-white bg-primary py-2 px-6 rounded-lg"
                  label="Apply"
                  onClick={(event) => {
                    op.current?.toggle(event);
                    setIsOpen((prev) => !prev);
                    handleFilter();
                  }}
                />
              </div>
            </div>
          </OverlayPanel>
          <SearchInput handleSearch={handleSearch} />
        </div>
      </div>
      <div className="flex flex-col rounded-xl overflow-hidden flex-grow border border-gray-100">
        <VerticalTabView
          tabs={tabs}
          hideTabs={hideTabs}
          changeTab={setSelectedTab}
        />
      </div>
    </div>
  );
};

export default LabTestResults;
