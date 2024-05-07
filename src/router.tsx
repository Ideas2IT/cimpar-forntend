import { createBrowserRouter } from "react-router-dom";
import AppointmentForm from "./components/appointmentForm/AppointmentForm";
import LabTestResults from "./components/LabTestResults";
import UserProfilePage, {
  user,
} from "./components/userProfilePage/UserProfilePage";
import EditUserDetails from "./components/userDetails/EditUserDetails";
import EditMedicationDetails from "./components/medication/EditMedicationDetails";
import Layout from "./components/Layout";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        element: <LabTestResults />,
        index: true,
      },
      {
        path: "/make-appointment",
        element: <AppointmentForm />,
      },
      {
        path: "/profile",
        element: <UserProfilePage />,
      },
      {
        path: "editprofile",
        element: <EditUserDetails user={user} />,
      },
      {
        path: "/editMedications",
        element: <EditMedicationDetails />,
      },
      {
        path: "/health-records",
        element: <EditUserDetails user={user} />,
      },
    ],
  },
]);

export default router;
