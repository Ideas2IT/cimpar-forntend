import { createBrowserRouter } from "react-router-dom";
import AppointmentForm from "./components/appointmentForm/AppointmentForm";
import LabTestResults from "./components/LabTestResults";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LabTestResults />,
  },
  {
    path: "/appointment",
    element: <AppointmentForm />,
  },
]);

export default router;
