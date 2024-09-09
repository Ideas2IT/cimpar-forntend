import { createBrowserRouter } from "react-router-dom";
import AppointmentForm from "./components/appointmentForm/AppointmentForm";
import Appointments from "./components/appointments/Appointments";
import RoleBasedRoute from "./components/AuthorizeUser";
import ConditionalRoute from "./components/ConditionalRoute";
import ForgotPassword from "./components/forgotPassword/ForgotPassword";
import EditInsurance from "./components/insuranceDetails/EditInsurance";
import LabTestResults from "./components/LabTestResults";
import Layout from "./components/Layout";
import LoginForm from "./components/loginForm/LoginForm";
import SignUpForm from "./components/loginForm/SignUpForm";
import MasterTables from "./components/masterTables/MasterTables";
import TestList from "./components/masterTables/Tests";
import EditMedicalConditions from "./components/MedicalDetails/EditMedicalConditions";
import EditMedicationDetails from "./components/medication/EditMedicationDetails";
import PageNotFound from "./components/PageNotFound";
import ResetPassword from "./components/setPassword/ResetPassowrd";
import SetPassword from "./components/setPassword/SetPassword";
import EditUserDetails from "./components/userDetails/EditUserDetails";
import UserProfilePage from "./components/userProfilePage/UserProfilePage";
import EditVisitHistory from "./components/visitHistory/EditVisitHistory";
import { PATH_NAME, ROLE } from "./utils/AppConstants";
const router = createBrowserRouter([
  {
    path: PATH_NAME.HOME,
    element: <Layout />,
    children: [
      {
        element: <ConditionalRoute />,
        index: true,
      },
      {
        path: PATH_NAME.PROFILE,
        element: (
          <RoleBasedRoute
            requiredRole={ROLE.PATIENT}
            element={<UserProfilePage />}
          />
        ),
      },
      {
        path: PATH_NAME.EDIT_PROFILE,
        element: (
          <RoleBasedRoute
            requiredRole={ROLE.PATIENT}
            element={<EditUserDetails />}
          />
        ),
      },
      {
        path: PATH_NAME.EIDT_MEDICATION,
        element: (
          <RoleBasedRoute
            requiredRole={ROLE.PATIENT}
            element={<EditMedicationDetails />}
          />
        ),
      },
      {
        path: `${PATH_NAME.EDIT_INSURANCE}/:id`,
        element: (
          <RoleBasedRoute
            requiredRole={ROLE.PATIENT}
            element={<EditInsurance />}
          />
        ),
      },
      {
        path: PATH_NAME.EDIT_INSURANCE,
        element: (
          <RoleBasedRoute
            requiredRole={ROLE.PATIENT}
            element={<EditInsurance />}
          />
        ),
      },
      {
        path: PATH_NAME.HEALTH_RECORDS,
        element: (
          <RoleBasedRoute
            requiredRole={ROLE.PATIENT}
            element={<AppointmentForm />}
          />
        ),
      },
      {
        path: PATH_NAME.TEST_RESULT,
        element: (
          <RoleBasedRoute
            element={<LabTestResults />}
            requiredRole={ROLE.PATIENT}
          />
        ),
      },
      {
        path: PATH_NAME.EDIT_MEDICAL_CONDITIONS,
        element: (
          <RoleBasedRoute
            element={<EditMedicalConditions />}
            requiredRole={ROLE.PATIENT}
          />
        ),
      },
      {
        path: `${PATH_NAME.EDIT_VISIT_HISTORY}/:id`,
        element: (
          <RoleBasedRoute
            requiredRole={ROLE.PATIENT}
            element={<EditVisitHistory />}
          />
        ),
      },
      {
        path: PATH_NAME.EDIT_VISIT_HISTORY,
        element: (
          <RoleBasedRoute
            element={<EditVisitHistory />}
            requiredRole={ROLE.PATIENT}
          />
        ),
      },
      {
        path: PATH_NAME.APPOINTMENTS,
        element: (
          <RoleBasedRoute
            element={<Appointments />}
            requiredRole={ROLE.ADMIN}
          />
        ),
      },
      {
        path: PATH_NAME.MASTER_TABLES,
        element: (
          <RoleBasedRoute
            requiredRole={ROLE.ADMIN}
            element={<MasterTables />}
          />
        ),
      },
      {
        path: PATH_NAME.ALL_TESTS,
        element: (
          <RoleBasedRoute requiredRole={ROLE.ADMIN} element={<TestList />} />
        ),
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
    path: `${PATH_NAME.SET_PASSWORD}/:id`,
    element: <SetPassword />,
  },
  {
    path: `${PATH_NAME.RESET_PASSWORD}/:id`,
    element: <ResetPassword />,
  },
  {
    path: PATH_NAME.FORGOT_PASSWORD,
    element: <ForgotPassword />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default router;
