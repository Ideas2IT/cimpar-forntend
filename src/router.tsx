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
import EditMedicalConditions from "./components/MedicalDetails/EditMedicalConditions";
import EditVisitHistory from "./components/visitHistory/EditVisitHistory";
import { PATH_NAME } from "./utils/AppConstants";
import SignUpForm from "./components/loginForm/SignUpForm";
import SetPassword from "./components/setPassword/SetPassword";
import LoginForm from "./components/loginForm/LoginForm";
import ForgotPassword from "./components/forgotPassword/ForgotPassword";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        element: <HomePage />,
        index: true,
      },
      // {
      //   path: "login",
      //   element: <LoginForm />,
      // },
      // {
      //   path: "/signup",
      //   element: <SignUpForm />,
      // },
      // {
      //   path: "/set-password",
      //   element: <SetPassword />,
      // },
      {
        path: PATH_NAME.PROFILE,
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
  {
    path: "login",
    element: <LoginForm />,
  },
  {
    path: "/signup",
    element: <SignUpForm />,
  },
  {
    path: "/set-password",
    element: <SetPassword />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
]);

export default router;
