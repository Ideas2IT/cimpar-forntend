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
    path: PATH_NAME.HOME,
    element: <Layout />,
    children: [
      {
        element: <HomePage />,
        index: true,
      },
      {
        path: PATH_NAME.PROFILE,
        element: <UserProfilePage />,
      },
      {
        path: PATH_NAME.EDIT_PROFILE,
        element: <EditUserDetails user={user} />,
      },
      {
        path: PATH_NAME.EIDT_MEDICATION,
        element: <EditMedicationDetails />,
      },
      {
        path: `${PATH_NAME.EDIT_INSURANCE}/:id`,
        element: <EditInsurance />,
      },
      {
        path: PATH_NAME.EDIT_INSURANCE,
        element: <EditInsurance />,
      },
      {
        path: PATH_NAME.HEALTH_RECORDS,
        element: <AppointmentForm />,
      },
      {
        path: PATH_NAME.TEST_RESULT,
        element: <LabTestResults />,
      },
      {
        path: PATH_NAME.EDIT_MEDICAL_CONDITIONS,
        element: <EditMedicalConditions />,
      },
      {
        path: `/${PATH_NAME.EDIT_VISIT_HISTORY}/:id`,
        element: <EditVisitHistory />,
      },
      {
        path: PATH_NAME.EDIT_VISIT_HISTORY,
        element: <EditVisitHistory />,
      },
    ],
  },
  {
    path: PATH_NAME.LOGIN,
    element: <LoginForm />,
  },
  {
    path: PATH_NAME.SIGNUP,
    element: <SignUpForm />,
  },
  {
    path: PATH_NAME.SET_PASSWORD,
    element: <SetPassword />,
  },
  {
    path: PATH_NAME.FORGOT_PASSWORD,
    element: <ForgotPassword />,
  },
]);

export default router;
