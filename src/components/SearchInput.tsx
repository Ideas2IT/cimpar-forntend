import { InputText } from "primereact/inputtext";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

interface SearchInputProps {
  placeholder?: string;
  handleSearch?: (value: string) => void;
}
export interface SearchInputHandle {
  clearInput: () => void;
}

const SearchInput = forwardRef<SearchInputHandle, SearchInputProps>(
  ({ placeholder, handleSearch }, ref) => {
    const searchRef = useRef<HTMLInputElement>(null);
    const [searchValue, setSearchValue] = useState<string>("");

    useImperativeHandle(ref, () => ({
      clearInput() {
        if (searchRef.current) {
          searchRef.current.value = "";
        }
      },
    }));

    return (
      <div className="relative h-[2.5rem] w-[15rem] rounded-full border bg-white border-gray-300 font-tertiary">
        <InputText
          aria-label={placeholder}
          title="Type to search"
          onChange={(event) => setSearchValue(event?.target?.value)}
          onBlur={() => handleSearch && handleSearch(searchValue?.trim())}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            handleSearch &&
            handleSearch(searchValue?.trim())
          }
          ref={searchRef}
          placeholder={placeholder ? placeholder : "Search"}
          style={{ paddingInlineStart: "1rem" }}
          className="h-full rounded- rounded-full"
        />
        <i
          className="pi pi-search absolute right-[1rem] top-[.8rem] cursor-pointer h-[1rem] text-purple-900"
          onClick={() => searchRef?.current && searchRef?.current.focus()}
        />
      </div>
    );
  }
);

export default SearchInput;
