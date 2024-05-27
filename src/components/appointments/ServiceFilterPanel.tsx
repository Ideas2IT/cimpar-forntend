import { useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

const services: string[] = [
  "Blood count",
  "Thyroid test",
  "MRI",
  "Urine analysis",
  "X Ray",
  "USG abdomen scan",
  "Prenatal test",
  "Blood test",
];

const serviceStyle = {
  active: "bg-primary text-white ",
  inActive: "color-primary bg-white",
};

const ServiceFilterPanel = () => {
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
    setSelectedServices([]);
  };

  const applySelections = () => {
    op?.current?.hide && op?.current?.hide();
  };

  return (
    <div className="h-full max-h-[2.5rem] w-full">
      <div
        className={`relative rounded-full h-full ${isOpen ? serviceStyle.active : serviceStyle.inActive}`}
      >
        <Button
          type="button"
          label="All Services"
          icon="pi pi-filter"
          onClick={(e) => {
            op?.current?.toggle(e);
            setIsOpen(true);
          }}
          className={`rounded-full font-primary border-primary focus:shadow-none shodow-none w-full h-full text-start px-5 ${isOpen ? serviceStyle.active : serviceStyle.inActive}`}
        />
        <span
          className={`absolute right-[1rem] top-[.7rem] pi ${isOpen ? "pi-chevron-up" : "pi-chevron-down"}`}
        ></span>
      </div>
      <OverlayPanel
        ref={op}
        className="w-[20rem]"
        onHide={() => setIsOpen(false)}
      >
        <div className="fluid">
          {services.map((service) => (
            <div
              key={service}
              onClick={() => toggleService(service)}
              className="w-full flex justify-between h-[2.5rem] border-b items-center cursor-pointer"
            >
              <label className="cursor-pointer">{service}</label>
              <Checkbox
                inputId={service}
                value={service}
                // onChange={(e) => toggleService(e.value)}
                checked={selectedServices.includes(service)}
              />
            </div>
          ))}
          <Divider />
          <div className="flex justify-end gap-4">
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
