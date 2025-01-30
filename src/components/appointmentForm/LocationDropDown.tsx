import { Dropdown } from "primereact/dropdown";
import { useRef } from "react";
import { Fragment } from "react/jsx-runtime";
import { ILocation } from "../../interfaces/location";
import "./AppointmentPage.css";

interface LocationProps {
  options: ILocation[];
  onChange: (selectedItem: ILocation) => void;
  value: ILocation;
  disabled?: boolean;
}
export default function LocationDropDown(props: LocationProps) {
  const { options, onChange, value } = props;
  const dropdownRef = useRef<Dropdown>(null);
  const setFocus = () => {
    dropdownRef?.current && dropdownRef.current?.show();
  };

  const itemTemplate = (value: ILocation) => {
    return (
      <div
        title={value.center_name + value.address_line1 + value.city}
        className="!max-w-[20rem] px-1 text-wrap text-ellipsis"
      >
        {`${value.center_name}, ${value.address_line1}, ${value.city} ${value.state}`}
      </div>
    );
  };

  const valueTemplate = (item: ILocation | null) => {
    if (!item) return <span className="text-gray-400">Select Location</span>;
    return <span>{`${item.center_name}, ${item.city}, ${item.state}`}</span>;
  };
  return (
    <Fragment>
      <label className="input-label block" htmlFor="location">
        Select your preferred service center*
      </label>
      <div
        className={`relative w-full flex items-center rounded-lg border border-gray-300 ${props.disabled && "cursor-not-allowed opacity-50"}`}
      >
        <i
          onClick={() => !props.disabled && setFocus()}
          className="pi pi-map-marker text-gray-400 text-md text-lg absolute top-[0.4rem] z-10 left-1"
        />
        <Dropdown
          ref={dropdownRef}
          disabled={props.disabled}
          value={value && value}
          onChange={(e) => onChange(e?.target?.value)}
          id="location"
          optionLabel="center_name"
          valueTemplate={valueTemplate}
          dropdownIcon="pi pi-angle-down text-lg"
          itemTemplate={(value) => itemTemplate(value)}
          className={`rounded-lg shadow-none ps-4 max-w-[100%] focus:outline-none focus:border-none h-[2.5rem] test-dropdown`}
          options={options}
          placeholder="Select Location"
        />
      </div>
    </Fragment>
  );
}
