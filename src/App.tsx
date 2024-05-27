import { RouterProvider } from "react-router-dom";
import "./App.scss";
import router from "./router.tsx";
import Spinner from "./components/spinner/Spinner.tsx";
import { useSelector } from "react-redux";
import { selectLoading } from "./store/slices/spinnerSlice.ts";

function App() {
  const isLoading = useSelector(selectLoading);
  return (
    <>
      <Spinner isLoading={isLoading} />
      <RouterProvider router={router} />;
    </>
  );
}

export default App;
