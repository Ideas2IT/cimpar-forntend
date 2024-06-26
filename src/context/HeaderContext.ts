import { createContext } from "react";
interface IHeader {
  username: string;
  updateHeaderTitle: (newValue: string) => void;
}
const HeaderContext = createContext<IHeader>({
  username: "",
  updateHeaderTitle: (value: string) => {
    return value;
  },
});
export default HeaderContext;
