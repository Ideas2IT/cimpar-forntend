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
            className=" aspect-square !w-7 !h-7 flex  items-center"
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
        <div className="flex gap-1 items-center">
          <RadioButton
            className=" aspect-square !w-7 !h-7 flex  items-center"
            checked={value === "service_center"}
            onChange={() => onChange(SERVICE_LOCATION.CENTER)}
            inputId="serviceCenter"
          />
          <label
            className={
              value === SERVICE_LOCATION.CENTER ? "active" : "inactive"
            }
            htmlFor="serviceCenter"
          >
            Service Center
          </label>
        </div>
      </div>
    </div>
  );
}
