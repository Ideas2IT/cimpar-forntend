import { useDebounce } from "primereact/hooks";
import { InputText } from "primereact/inputtext";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

interface SearchInputProps {
  placeholder?: string;
  handleSearch?: (value: string) => void;
}
export interface SearchInputHandle {
  clearInput: () => void;
}

const SearchInput = forwardRef<SearchInputHandle, SearchInputProps>(
  ({ placeholder, handleSearch }, ref) => {
    const [inputValue, debouncedValue, setInputValue] = useDebounce("", 500);
    const searchRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => ({
      clearInput() {
        setInputValue("");
      },
    }));

    const setFocus = () => {
      searchRef?.current && searchRef?.current.focus();
    };

    useEffect(() => {
      handleSearch && handleSearch(debouncedValue);
    }, [debouncedValue]);

    return (
      <button
        className="relative h-[2.5rem] min-w-[15rem] rounded-full border bg-white border-gray-300 font-tertiary text-start cursor-pointer"
        onClick={setFocus}
      >
        <InputText
          value={inputValue}
          aria-label={placeholder}
          title="Type to search"
          onChange={(event) => setInputValue(event?.target?.value)}
          ref={searchRef}
          placeholder={placeholder ?? "Search"}
          style={{ paddingInlineStart: "1rem" }}
          className="h-full w-[calc(100%-40px)] rounded rounded-full outline-none"
        />
        <i className="pi pi-search absolute right-[1rem] top-[.8rem] h-[1rem] text-purple-900" />
      </button>
    );
  }
);

export default SearchInput;
