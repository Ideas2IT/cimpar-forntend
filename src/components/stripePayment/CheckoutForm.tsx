import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Layout, loadStripe } from "@stripe/stripe-js";
import { TRNASACTION_STATUS } from "../../utils/AppConstants";
import { TAppointmentStatus } from "../../interfaces/appointment";

export default function CheckoutForm({
  showStatusDialog,
}: {
  showStatusDialog: (value: boolean, status: TAppointmentStatus) => void;
}) {
  const dpmCheckerLink = "/home";
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://localhost:5173/payment-status`,
      },
      redirect: "if_required",
    });
    if (result?.error) {
      // showStatusDialog(true, TRNASACTION_STATUS.REJECTED);
      if (
        result.error?.type === "card_error" ||
        result.error?.type === "validation_error"
      ) {
        setMessage(result?.error?.message || "");
      } else {
        setMessage(result?.error?.message || "Unexpected error");
      }

      setIsLoading(false);
    } else {
      showStatusDialog(true, TRNASACTION_STATUS.SUCCEEDED);
    }
  };

  const paymentElementOptions: { layout: Layout } = {
    layout: "tabs",
  };
  return (
    <div className="h-full flex items-center justify-center flex-col">
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <button
          disabled={isLoading || !stripe || !elements}
          className="stripe-pay-button"
          id="submit"
        >
          <span id="button-text">
            {isLoading ? (
              <div className="payment-spinner" id="spinner"></div>
            ) : (
              "Pay now"
            )}
          </span>
        </button>
        {message && <div id="payment-message">{message}</div>}
      </form>
    </div>
  );
}
