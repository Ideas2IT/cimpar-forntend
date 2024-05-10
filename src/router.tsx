import { createBrowserRouter } from "react-router-dom";
import AppointmentForm from "./components/appointmentForm/AppointmentForm";
import LabTestResults from "./components/LabTestResults";
import UserProfilePage, {
  user,
} from "./components/userProfilePage/UserProfilePage";
import EditUserDetails from "./components/userDetails/EditUserDetails";
import EditMedicationDetails from "./components/medication/EditMedicationDetails";
import Layout from "./components/Layout";
import EditInsurance from "./components/insuranceDetails/EditInsurance";
import HomePage from "./components/homePage/HomePage";
import TestResult from "./components/testResult/TestResult";
import EditMedicalConditions from "./components/MedicalDetails/EditMedicalConditions";
import EditVisitHistory from "./components/visitHistory/EditVisitHistory";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        element: <HomePage />,
        index: true,
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
        path: "/edit-insurance/:id",
        element: <EditInsurance />,
      },
      {
        path: "/edit-insurance",
        element: <EditInsurance />,
      },
      {
        path: "/health-records",
        element: <AppointmentForm />,
      },
      {
        path: "/test-result",
        element: <LabTestResults />,
      },
      {
        path: "/edit-medical-conditons",
        element: <EditMedicalConditions />,
      },
      {
        path: "/edit-visit-history/:id",
        element: <EditVisitHistory />,
      },
      {
        path: "/edit-visit-history",
        element: <EditVisitHistory />,
      },
    ],
  },
]);

export default router;
