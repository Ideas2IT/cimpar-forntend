import { AutoComplete, AutoCompleteChangeEvent, AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { useRef } from "react";
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

  const autoRef = useRef<AutoComplete>(null);
  const inputReferences = useRef<HTMLInputElement>(null);

  const getTitle = () => {
    if (selectedItems?.length) {
      const title = selectedItems?.map((item) => item.display).join(", ");
      return title;
    }
    return "";
  };

  const handleValueSelect = (event: AutoCompleteChangeEvent) => {
    if (event.value) {
      handleSelection(event.value);
    } else {
      handleSelection([]);
    }
  };

  const itemTemplate = (item: IMedicine) => {
    return (
      <div className="group flex items-center h-full py-4 justify-between hover:text-cyan-800">
        <button key={item.display} className="flex items-center text-start capitalize font-secondary text-wrap">
          {item.display}
        </button>
        <img className="pe-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" src={plus} alt="Add" />
      </div>
    );
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
        itemTemplate={(option) => itemTemplate(option)}
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
        inputClassName="w-full outline-none"
        loadingIcon={<></>}
      />
      {Boolean(selectedItems?.length) && (
        <button type="button"
          className="px-2 text-red-500 text-sm font-tertiary cursor-pointer min-w-[5rem]"
          onClick={() => {
            handleValueSelect({ value: [] } as AutoCompleteChangeEvent);
            if (inputReferences.current) {
              inputReferences.current.value = "";
            }
          }}
        >
          Clear all
        </button>
      )}
    </div>
  );
};


