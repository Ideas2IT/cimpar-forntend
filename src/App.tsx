import { RouterProvider } from "react-router-dom";
import "./App.scss";
import router from "./router.tsx";
import Spinner from "./components/spinner/Spinner.tsx";
import { useDispatch, useSelector } from "react-redux";
import { selectLoading } from "./store/slices/spinnerSlice.ts";
import { useEffect, useState } from "react";
import { AppDispatch } from "./store/store.ts";
import { logoutThunk } from "./store/slices/loginSlice.ts";
import localStorageService from "./services/localStorageService.ts";
import { LOGOUT, OFFLINE, ONLINE, PATH_NAME } from "./utils/AppConstants.ts";
import packageJson from "../package.json";

function App() {
  const isLoading = useSelector(selectLoading);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    console.log(
      "Application Name:" +
        packageJson.name +
        "\n" +
        "Version:" +
        packageJson.version
    );
    const syncLogout = (event: StorageEvent) => {
      if (event.key === LOGOUT) {
        localStorageService.logout();
        dispatch(logoutThunk());
      } else if (event.key === "role" && event.newValue === null) {
        window.location.href = PATH_NAME.HOME;
      }
    };
    window.addEventListener("storage", syncLogout);
    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, [dispatch]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener(ONLINE, handleOnline);
    window.addEventListener(OFFLINE, handleOffline);
    return () => {
      window.removeEventListener(ONLINE, handleOnline);
      window.removeEventListener(OFFLINE, handleOffline);
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
    <div className="font-secondary text-xl">
      Please check your network settings and try again.
    </div>
  </div>
);
export default App;
