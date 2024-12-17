import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Toast } from "primereact/toast";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TAppointmentStatus } from "../../interfaces/appointment";
import { retryPaymentThunk } from "../../store/slices/paymentSlice";
import { AppDispatch } from "../../store/store";
import {
  PATH_NAME,
  RESPONSE,
  TRNASACTION_STATUS,
} from "../../utils/AppConstants";
import AppointmentStatus from "../appointmentForm/AppointmentStatusModal";
import CustomModal from "../customModal/CustomModal";
import useToast from "../useToast/UseToast";
import CheckoutForm from "./CheckoutForm";
import "./payment.css";

const stripePromise = loadStripe(
  import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY
);

const Payment = ({
  clientSecretKey,
  appointmentId,
  handleClose,
}: {
  clientSecretKey: string;
  appointmentId?: string;
  handleClose: () => void;
}) => {
  const navigate = useNavigate();
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<TAppointmentStatus>(
    TRNASACTION_STATUS.REJECTED
  );
  const { toast, errorToast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const [clientSecret, setClientSecret] = useState(clientSecretKey);

  const onRetry = () => {
    appointmentId &&
      dispatch(retryPaymentThunk(appointmentId)).then((response) => {
        if (response.meta.requestStatus === RESPONSE.FULFILLED) {
          const _response = response.payload.client_secret as string;
          setClientSecret(_response);
        } else if (response.meta.requestStatus === RESPONSE.REJECTED) {
          errorToast(
            "Payment Retry Failed",
            " We were unable to process your payment. Please try again later"
          );
          setTimeout(() => {
            handleClose();
            navigate(PATH_NAME.HOME);
          }, 3000);
        }
      });
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
          <CheckoutForm
            showStatusDialog={handleDialog}
            clientSecret={clientSecret}
          />
        </Elements>
      )}
      {showStatusDialog && (
        <CustomModal
          showCloseButton={true}
          styleClass="w-[30rem] h-[17rem] bg-white"
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
      <Toast ref={toast} />
    </>
  );
};

export default Payment;
