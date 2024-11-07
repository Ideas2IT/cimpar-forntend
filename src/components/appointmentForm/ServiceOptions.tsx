import { RadioButton } from "primereact/radiobutton";
import { SERVICE_LOCATION } from "../../utils/AppConstants";
import { TServiceLocationType } from "../../interfaces/location";

export default function ({
  onChange,
  value,
}: {
  onChange: (serviceType: TServiceLocationType) => void;
  value: TServiceLocationType;
}) {
  return (
    <div className="font-bold flex h-[2.5rem] items-center">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 items-center">
          <RadioButton
            value={true}
            checked={value === SERVICE_LOCATION.HOME}
            inputId={SERVICE_LOCATION.HOME}
            onChange={() => onChange(SERVICE_LOCATION.HOME)}
          />
          <label
            className={value === SERVICE_LOCATION.HOME ? "active" : "inactive"}
            htmlFor={SERVICE_LOCATION.HOME}
          >
            Home
          </label>
        </div>
        <div className="flex gap-1 items-center justifify-center">
          <RadioButton
            className=" aspect-square !w-5 !h-5"
            checked={value === "service center"}
            onChange={() => onChange("service center")}
            inputId="serviceCenter"
          />
          <label
            className={value === "service center" ? "active" : "inactive"}
            htmlFor="serviceCenter"
          >
            Service Center
          </label>
        </div>
      </div>
    </div>
  );
}
