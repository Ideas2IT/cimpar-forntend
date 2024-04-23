import Header from "./Header";
import "../..//node_modules/primereact/resources/themes/lara-light-cyan/theme.css";
import "../../node_modules/primereact/resources/primereact.min.css";
import "../../node_modules/primeicons/primeicons.css";
import {
  RouterProvider,
} from "react-router-dom";
import router from '../router';

const Main = () => {
  return (
    <div className="flex flex-col flex-grow bg-gray-100 p-8">
      <Header />
      <RouterProvider router={router} />
    </div>
  );
};

export default Main;
