import { RouterProvider } from "react-router-dom";
import "./App.scss";
import router from "./router.tsx";
import Spinner from "./components/spinner/Spinner.tsx";
import { useSelector } from "react-redux";
import { selectLoading } from "./store/slices/spinnerSlice.ts";
import { useEffect, useState } from "react";

function App() {
  const isLoading = useSelector(selectLoading);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      <Spinner isLoading={isLoading} />
      {isOnline ? <RouterProvider router={router} /> : <NoNetwork />}
    </>
  );
}

const NoNetwork = () => (
  <div className="flex items-center flex-col h-full align-center justify-center">
    <h1 className="font-primary text-2xl">No Internet Connection</h1>
    <i className="pi pi-exclamation-triangle text-red-500 text-2xl" />
    <div  className="font-secondary text-xl">Please check your network settings and try again.</div>
  </div>
);
export default App;
