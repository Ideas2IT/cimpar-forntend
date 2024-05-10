import { createContext} from "react";
interface IHeader {
    value: string;
    updateHeaderTitle: (newValue: string) => void;
  }
const HeaderContext = createContext<IHeader>({value:'', updateHeaderTitle:(value:String)=>{}});
export default HeaderContext;
