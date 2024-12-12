import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import "./payment.css";
import CustomModal from "../customModal/CustomModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH_NAME, TRNASACTION_STATUS } from "../../utils/AppConstants";
import { TAppointmentStatus } from "../../interfaces/appointment";
import AppointmentStatus from "../appointmentForm/AppointmentStatusModal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { retryPaymentThunk } from "../../store/slices/appointmentSlice";
const stripePromise = loadStripe(
  import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY
);

const Payment = ({
  clientSecretKey,
  paymentId,
}: {
  clientSecretKey: string;
  paymentId?: string;
}) => {
  const navigate = useNavigate();
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<TAppointmentStatus>(
    TRNASACTION_STATUS.REJECTED
  );
  const dispatch = useDispatch<AppDispatch>();
  const [clientSecret, setClientSecret] = useState(clientSecretKey);

  const onRetry = () => {
    dispatch(
      retryPaymentThunk({
        appointmentId: "76cf76bc-cd69-4a62-86be-344f48d6e87c",
        email: "searchforgm@gmail.com",
      })
    );
  };

  const handleDialog = (value: boolean, status: TAppointmentStatus) => {
    setPaymentStatus(status);
    setShowStatusDialog(value);
  };
  const appearance: { theme: "stripe" } = {
    theme: "stripe",
  };
  const loader = "auto";

  return (
    <>
      {clientSecret && stripePromise && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret, appearance, loader }}
        >
          <CheckoutForm showStatusDialog={handleDialog} />
        </Elements>
      )}
      {showStatusDialog && (
        <CustomModal
          showCloseButton={true}
          styleClass="w-[30rem] h-[15rem] bg-white"
          handleClose={() => {
            setShowStatusDialog(false);
            navigate(PATH_NAME.HOME);
          }}
        >
          <AppointmentStatus
            status={paymentStatus}
            onRetry={() => {
              setShowStatusDialog(false);
              onRetry();
            }}
          />
        </CustomModal>
      )}
    </>
  );
};

export default Payment;
