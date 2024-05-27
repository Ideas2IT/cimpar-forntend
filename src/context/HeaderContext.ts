import { createContext } from "react";
interface IHeader {
  value: string;
  updateHeaderTitle: (newValue: string) => void;
}
const HeaderContext = createContext<IHeader>({
  value: "",
  updateHeaderTitle: (value: string) => {
    return value;
  },
});
export default HeaderContext;
