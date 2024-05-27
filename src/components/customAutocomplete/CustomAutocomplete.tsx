import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { IItem } from "../appointmentForm/AppointmentForm";
import { useRef, useState } from "react";
import plus from "../../assets/icons/plus.svg";
import "../../components/appointmentForm/AppointmentPage.css";

export const CustomAutoComplete = ({
  selectedItems,
  items,
  handleSelection,
  placeholder,
  inputId,
}: {
  placeholder?: string;
  selectedItems: IItem[];
  items: IItem[];
  handleSelection: (value: IItem[]) => void;
  inputId: string;
}) => {
  const [suggestions, setSuggestions] = useState<IItem[]>([]);

  const search = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let filteredItems: IItem[];
      if (event.query.trim().length) {
        filteredItems = items.filter((item) => {
          return item.name.toLowerCase().includes(event.query.toLowerCase());
        });
        const _filt = filteredItems.filter((item) => {
          return !selectedItems.some((otherItem) => otherItem.id === item.id);
        });
        filteredItems = _filt;
      } else {
        filteredItems = [];
      }
      setSuggestions(filteredItems);
    }, 300);
  };

  const handleValueSelect = (event: AutoCompleteChangeEvent) => {
    if (event.value) {
      handleSelection(event.value);
    } else {
      handleSelection([]);
    }
  };
  const autoRef = useRef<AutoComplete>(null);

  // const handleInputClick = () => {
  //   autoRef?.current?.show();
  // };

  return (
    <div className="custom-autocomplete">
      <AutoComplete
        inputId={inputId}
        delay={750}
        ref={autoRef}
        className="w-[90%] min-h-[2.3rem]"
        field="name"
        multiple
        value={selectedItems}
        onClick={() => {
          setSuggestions([...items]);
          // handleInputClick();
        }}
        suggestions={suggestions}
        onChange={(event) => handleValueSelect(event)}
        completeMethod={search}
        itemTemplate={(option) => <ItemTemplate item={option} />}
        placeholder={!selectedItems.length && placeholder ? placeholder : ""}
        emptyMessage="No result found"
        showEmptyMessage={true}
        itemProp="py-0"
        removeTokenIcon={"pi pi-times"}
        panelClassName={`custom-autocomplete-panel ${suggestions.length && "panel-header"}`}
        panelStyle={{ paddingTop: "40px"}}
        inputClassName="w-auto"
        appendTo="self"
      />
      {Boolean(selectedItems.length) && (
        <span
          className="px-2 text-red-500 text-sm font-tertiary cursor-pointer min-w-[5rem]"
          onClick={() =>
            handleValueSelect({ value: [] } as AutoCompleteChangeEvent)
          }
        >
          Clear all
        </span>
      )}
    </div>
  );
};

const ItemTemplate = ({ item }: { item: IItem }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      key={item.id}
      className="flex align-items-center hover:text-cyan-800 w-full h-full py-4 justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="capitalize font-secondary">{item.name}</div>
      {isHovered && <img className="pe-1" src={plus} />}
    </div>
  );
};
