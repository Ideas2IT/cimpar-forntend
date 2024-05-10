import { InputText } from "primereact/inputtext";
import { useRef } from "react";

const SearchInput = ({
  handleSearch,
}: {
  handleSearch?: (value: string) => void;
}) => {
  const searchRef = useRef<HTMLInputElement>(null);
  return (
    <span>
      <div className="relative h-[2.5rem] w-[15rem]">
        <InputText
          tooltip="Type text to search"
          tooltipOptions={{ position: "bottom" }}
          onChange={(event) => handleSearch && handleSearch(event.target.value)}
          ref={searchRef}
          placeholder="Search"
          style={{ paddingInlineStart: "1rem" }}
          className="h-full w-full rounded-full border border-gray-300 font-tertiary"
        />
        <i
          className="pi pi-search absolute right-[1rem] top-[.8rem] cursor-pointer h-[1rem] text-purple-900"
          onClick={() => searchRef?.current && searchRef?.current.focus()}
        />
      </div>
    </span>
  );
};

export default SearchInput;
