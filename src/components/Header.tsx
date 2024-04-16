import Dropdown from "./Dropdown";

const Header = () => {
  return (
    <div className="flex justify-between items-center mb-7">
      <p className="font-bold text-2xl text-gray-700">Health Records</p>
      <Dropdown />
    </div>
  );
};

export default Header;
