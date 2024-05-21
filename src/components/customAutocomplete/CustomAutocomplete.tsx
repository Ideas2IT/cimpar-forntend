import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { IItem } from "../appointmentForm/AppointmentForm";
import { useState } from "react";
import plus from "../../assets/icons/plus.svg";
import "../../components/appointmentForm/AppointmentPage.css";

export const CustomAutoComplete = ({
  selectedItems,
  items,
  handleSelection,
  placeholder,
}: {
  placeholder?: string;
  selectedItems: IItem[];
  items: IItem[];
  handleSelection: (value: IItem[]) => void;
}) => {
  const [suggestions, setSuggestions] = useState<IItem[]>([]);

  const search = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let filteredItems;

      if (!event.query.trim().length) {
        filteredItems = [...items];
      } else {
        filteredItems = items.filter((item) => {
          return item.name.toLowerCase().startsWith(event.query.toLowerCase());
        });
      }
      setSuggestions(filteredItems);
    }, 100);
  };

  const handleValueSelect = (event: AutoCompleteChangeEvent) => {
    if (event.value) {
      handleSelection(event.value);
    } else {
      handleSelection([]);
    }
  };

  return (
    <div className="custom-autocomplete">
      <AutoComplete
        className="w-[90%]"
        field="name"
        multiple
        value={selectedItems}
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
        panelStyle={{ paddingTop: "40px" }}
        inputClassName="w-auto"
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
      {isHovered && <img src={plus} />}
    </div>
  );
};
