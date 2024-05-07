import { createContext} from "react";
interface IHeader {
    value: string;
    updateValue: (newValue: string) => void;
  }
const HeaderContext = createContext<IHeader>({value:'', updateValue:(value:String)=>{}});
export default HeaderContext;
