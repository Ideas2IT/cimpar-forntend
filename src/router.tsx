import { createBrowserRouter } from "react-router-dom";
import AppointmentForm from "./components/appointmentForm/AppointmentForm";
import LabTestResults from "./components/LabTestResults";
import UserProfilePage from "./components/userProfilePage/UserProfilePage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LabTestResults />,
  },
  {
    path: "/appointment",
    element: <AppointmentForm />,
  },
  {
    path: "/profile",
    element: <UserProfilePage />,
  },
]);

export default router;
