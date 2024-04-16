const SearchInput = () => {
  return (
    <span>
      <input
        type="search"
        id="search"
        className="px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search"
        required
      />
    </span>
  );
};

export default SearchInput;
