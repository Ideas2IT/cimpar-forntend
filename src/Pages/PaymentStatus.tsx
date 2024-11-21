import { useEffect, useState } from "react";
import AppointmentStatus from "../components/appointmentForm/AppointmentStatusModal";
import CustomModal from "../components/customModal/CustomModal";
import Payment from "../components/stripePayment/Payment";
import { TAppointmentStatus } from "../interfaces/appointment";

const PaymentStatus = () => {
  const [paymentStatus, setPaymentStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>("");
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentIntent = params.get("payment_intent");
    const clientSecretKey = params.get("payment_intent_client_secret");
    const redirectStatus = params.get("redirect_status");
    setAmount(Number(params.get("amount")));

    setClientSecret(clientSecretKey);

    // Check if payment was successful
    if (redirectStatus === "succeeded") {
      setPaymentStatus(redirectStatus);
      // Optionally verify with your backend
      // verifyPayment(paymentIntent);
    } else {
      setPaymentStatus("Payment failed or was canceled.");
    }
  }, []);

  return (
    <div className="flex h-full w-full justify-center items-center">
      <AppointmentStatus
        status={paymentStatus as TAppointmentStatus}
        onRetry={() => setOpenPaymentDialog(true)}
      />
      {openPaymentDialog && (
        <CustomModal
          handleClose={() => setOpenPaymentDialog(false)}
          styleClass=""
        >
          <Payment clientSecretKey={clientSecret || ""} />
        </CustomModal>
      )}
    </div>
  );
};

export default PaymentStatus;
