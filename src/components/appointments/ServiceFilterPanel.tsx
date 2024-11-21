import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import ActiveFilterIcon from "../../assets/icons/ServiceFilterIcon.svg?react";
import InactiveFilterIcon from "../../assets/icons/filter.svg?react";
import {
  selectServiceCategories
} from "../../store/slices/masterTableSlice";
import "./Appointments.css";

const serviceStyle = {
  active: "bg-primary text-white ",
  inActive: "color-primary bg-white",
};

const ServiceFilterPanel = ({
  onApplyFilter,
}: {
  onApplyFilter: (values: string[]) => void;
}) => {
  const serviceCategories = useSelector(selectServiceCategories);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const op = useRef<OverlayPanel>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleService = (service: string) => {
    let _selectedServices = [...selectedServices];

    if (_selectedServices.includes(service)) {
      _selectedServices = _selectedServices.filter((s) => s !== service);
    } else {
      _selectedServices.push(service);
    }

    setSelectedServices(_selectedServices);
  };

  const clearSelections = () => {
    op?.current?.hide && op?.current?.hide();
    setSelectedServices([]);
    onApplyFilter([]);
  };

  const applySelections = () => {
    onApplyFilter(selectedServices);
    op?.current?.hide && op?.current?.hide();
  };

  return (
    <div className="h-full !min-h-[2.5rem] w-full relative">
      <div
        onClick={(e) => {
          op?.current?.toggle(e);
          setIsOpen(true);
        }}
        className={`relative rounded-full h-full cursor-pointer ${isOpen ? serviceStyle.active : serviceStyle.inActive}`}
      >
        <Button
          type="button"
          label="All Services"
          icon={
            isOpen ? (
              <ActiveFilterIcon className="me-3" />
            ) : (
              <InactiveFilterIcon className="me-3" />
            )
          }
          className={`rounded-full font-primary border-primary focus:shadow-none shodow-none w-full h-full text-start px-5 ${isOpen ? serviceStyle.active : serviceStyle.inActive}`}
        />
        <span
          className={`absolute right-[1rem] top-[.7rem] pi ${isOpen ? "pi-chevron-up" : "pi-chevron-down"}`}
        />
      </div>
      <OverlayPanel
        ref={op}
        className="w-[20rem] max-h-[25rem] relative overflow-auto custom-overlay"
        onHide={() => setIsOpen(false)}
      >
        <div className="h-[20rem] relative">
          <div className="h-[90%] overflow-scroll">
            {!!serviceCategories?.length &&
              serviceCategories.map((service) => (
                <div
                  key={service}
                  onClick={() => toggleService(service)}
                  className="w-full flex justify-between min-h-[2.5rem] pe-1 border-b items-center cursor-pointer"
                >
                  <label className="cursor-pointer">{service}</label>
                  <Checkbox
                    inputId={service}
                    value={service}
                    checked={selectedServices.includes(service)}
                  />
                </div>
              ))}
            <Divider />
          </div>
          <div className="flex gap-4 py-1 bg-white justify-end  w-full right-2 absolute bottom-0">
            <Button
              type="button"
              label="Cancel"
              className="color-primary rounded-md bg-white px-6 py-2 border border-blue-900"
              onClick={clearSelections}
            />
            <Button
              type="button"
              label="Apply"
              className="bg-primary text-white px-6 py-2 rounded-md"
              onClick={applySelections}
            />
          </div>
        </div>
      </OverlayPanel>
    </div>
  );
};

export default ServiceFilterPanel;
