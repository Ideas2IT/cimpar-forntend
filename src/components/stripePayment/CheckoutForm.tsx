import { PaymentElement, useElements, useStripe, } from "@stripe/react-stripe-js";
import { Layout } from "@stripe/stripe-js";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { TAppointmentStatus } from "../../interfaces/appointment";
import { getPaymentStatusThunk } from "../../store/slices/paymentSlice";
import { AppDispatch } from "../../store/store";
import { ERROR_CODES, PAYMENT_RETURN_URL, PAYMENT_STATUS, RESPONSE, TRNASACTION_STATUS } from "../../utils/AppConstants";

const CheckoutForm = ({
  showStatusDialog,
  clientSecret,
}: {
  showStatusDialog: (value: boolean, status: TAppointmentStatus) => void;
  clientSecret: string;
}) => {


  const dispatch = useDispatch<AppDispatch>();

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  

  const checkStatus = (count: number) => {
    dispatch(getPaymentStatusThunk(clientSecret)).then((response) => {
      if (response.meta.requestStatus === RESPONSE.FULFILLED) {
        const status = response.payload.status as string;
        switch (true) {
          case status?.toLocaleLowerCase() === PAYMENT_STATUS.PAID: {
            setIsLoading(false);
            showStatusDialog(true, TRNASACTION_STATUS.SUCCEEDED);
            break;
          }
          case status?.toLocaleLowerCase() === PAYMENT_STATUS.PENDING &&
            count <= 3: {
              setTimeout(() => {
                checkStatus(count + 1);
              }, count * 4000);
              break;
            }
          case status?.toLocaleLowerCase() === PAYMENT_STATUS.PENDING &&
            count >= 3: {
              setIsLoading(false);
              showStatusDialog(true, TRNASACTION_STATUS.PENDING);
              break;
            }
          case status?.toLocaleLowerCase() === PAYMENT_STATUS.FAILED:
            setIsLoading(false);
            showStatusDialog(true, TRNASACTION_STATUS.REJECTED);
            break;
          default:
            showStatusDialog(true, TRNASACTION_STATUS.REJECTED);
        }
      }
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: PAYMENT_RETURN_URL,
      },
      redirect: "if_required",
    });

    if (result?.error) {
      if (
        result.error?.type === ERROR_CODES.CARD_ERROR ||
        result.error?.type === ERROR_CODES.STRIPE_VALIDATION_ERROR
      ) {
        setMessage(result?.error?.message ?? "");
      } else {
        setMessage(result?.error?.message ?? "Unexpected error");
      }
      setIsLoading(false);
    } else {
      checkStatus(1);
    }
  };

  const paymentElementOptions: { layout: Layout } = {
    layout: "tabs",
  };

  return (
    <div className="h-full flex relative items-center justify-center flex-col">
      <form id="payment-form" onSubmit={handleSubmit}>
        <div
          style={{ zIndex: 9999 }}
          className={`${isLoading ? "fixed flex items-center justify-center bg-gray-100/50 left-0 top-0 bottom-0 right-0" : "hidden"}`}
        />
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

export default CheckoutForm;
