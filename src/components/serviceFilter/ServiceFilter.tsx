import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef, useState } from "react";
import ActiveFilterIcon from "../../assets/icons/ServiceFilterIcon.svg?react";
import InactiveFilterIcon from "../../assets/icons/filter.svg?react";
import { tests } from "../../assets/MockData";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";

const ServiceFilter = ({
  onApplyFilter,
}: {
  onApplyFilter: (services: string[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const op = useRef<OverlayPanel>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const serviceStyle = {
    active: "bg-primary text-white ",
    inActive: "color-primary bg-white",
  };

  const toggleService = (service: string) => {
    let _selectedServices = [...selectedServices];

    if (_selectedServices.includes(service)) {
      _selectedServices = _selectedServices.filter((s) => s !== service);
    } else {
      _selectedServices.push(service);
    }

    setSelectedServices(_selectedServices);
  };

  const applySelections = () => {
    onApplyFilter(selectedServices);
    op?.current?.hide && op?.current?.hide();
  };

  const clearSelections = () => {
    op?.current?.hide && op?.current?.hide();
    setSelectedServices([]);
    onApplyFilter([]);
  };

  return (
    <div className="h-full !min-h-[2.5rem] w-full relative">
      <button type="button"
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
      </button>
      <OverlayPanel
        ref={op}
        className="w-[20rem] max-h-[25rem] relative overflow-auto custom-overlay"
        onHide={() => setIsOpen(false)}
      >
        <div className="flex flex-col max-h-[20rem] relative">
          <div className="flex-1 overflow-y-scroll">
            {tests?.map((service) => (
              <button
                type="button"
                key={service.display}
                onClick={() => toggleService(service.display)}
                className="w-full flex justify-between min-h-[2.5rem] pe-1 border-b items-center cursor-pointer"
              >
                <label className="cursor-pointer">{service.display}</label>
                <Checkbox
                  inputId={service.display}
                  value={service}
                  checked={selectedServices.includes(service.display)}
                />
              </button>
            ))}
            <Divider />
          </div>
          <div className="flex gap-4 h-[50px] py-1 bg-white justify-end  w-full right-2 relative bottom-0">
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
export default ServiceFilter;
