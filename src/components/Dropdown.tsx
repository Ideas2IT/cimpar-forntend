import Select, { SingleValue } from "react-select";

const options = [
  { label: "apple", value: 1 },
  { label: "orange", value: 2 },
  { label: "kiwi", value: 3 },
];

const Dropdown = () => {
  const handleChange = (
    selected: SingleValue<{ label: string; value: number }>
  ) => {
    console.log(selected);
  };

  return (
    <Select
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          borderRadius: "9999px",
        }),
      }}
      options={options}
      onChange={handleChange}
      components={{
        IndicatorSeparator: () => null,
      }}
    />
  );
};

export default Dropdown;
