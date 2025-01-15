import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { useRef, useState } from "react";
import plus from "../../assets/icons/plus.svg";
import "../../components/appointmentForm/AppointmentPage.css";
import { IMedicine } from "../../interfaces/medication";

export const CustomAutoComplete = ({
  selectedItems,
  items,
  handleSelection,
  inputId,
  handleSearch,
}: {
  selectedItems: IMedicine[];
  items: IMedicine[];
  handleSelection: (value: IMedicine[]) => void;
  inputId: string;
  handleSearch: (event: AutoCompleteCompleteEvent) => void;
}) => {
  const handleValueSelect = (event: AutoCompleteChangeEvent) => {
    if (event.value) {
      handleSelection(event.value);
    } else {
      handleSelection([]);
    }
  };
  const autoRef = useRef<AutoComplete>(null);
  const inputReferences = useRef<HTMLInputElement>(null);
  const getTitle = () => {
    if (selectedItems?.length) {
      const title = selectedItems?.map((item) => item.display).join(", ");
      return title;
    }
    return "";
  };
  return (
    <div className="custom-autocomplete" title={getTitle()}>
      <AutoComplete
        inputId={inputId}
        delay={750}
        ref={autoRef}
        inputRef={inputReferences}
        className="!w-[90%] min-h-[2.3rem]"
        multiple
        value={selectedItems}
        field="display"
        suggestions={items}
        onChange={(event) => handleValueSelect(event)}
        completeMethod={handleSearch}
        itemTemplate={(option) => <ItemTemplate item={option} />}
        placeholder={
          !selectedItems?.length ? "Enter at least 3 characters" : ""
        }
        emptyMessage="No result found"
        showEmptyMessage={true}
        itemProp="py-0"
        removeTokenIcon={"pi pi-times"}
        panelClassName={`${items?.length && "panel-header"}`}
        panelStyle={{
          paddingTop: "40px",
        }}
        inputClassName="w-full"
        loadingIcon={<></>}
      />
      {Boolean(selectedItems?.length) && (
        <span
          className="px-2 text-red-500 text-sm font-tertiary cursor-pointer min-w-[5rem]"
          onClick={() => {
            handleValueSelect({ value: [] } as AutoCompleteChangeEvent);
            if (inputReferences.current) {
              inputReferences.current.value = "";
            }
          }}
        >
          Clear all
        </span>
      )}
    </div>
  );
};

const ItemTemplate = ({ item }: { item: IMedicine }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      key={item.display}
      className="flex align-items-center hover:text-cyan-800 h-full py-4 justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="capitalize font-secondary text-wrap">{item.display}</div>
      {isHovered && <img className="pe-1" src={plus} />}
    </div>
  );
};
