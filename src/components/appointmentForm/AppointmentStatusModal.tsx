import { useNavigate } from "react-router-dom";
import { TAppointmentStatus } from "../../interfaces/appointment";
import { useContext } from "react";
import {
  APPOINTMENT_STATUS_MESSAGE,
  PATH_NAME,
  TRNASACTION_STATUS,
} from "../../utils/AppConstants";
import AddRecord from "../../assets/icons/addrecord.svg?react";
import checkmark from "../../assets/icons/checkmark.svg";
import crossMark from "../../assets/icons/crossMark.svg";
import HomeIcon from "../../assets/icons/home.svg?react";
import HeaderContext from "../../context/HeaderContext";
import Button from "../Button";

export const AppointmentStatus = ({
  status,
  onRetry,
}: {
  status: TAppointmentStatus;
  onRetry?: () => void;
}) => {
  const navigate = useNavigate();
  const { updateHeaderTitle } = useContext(HeaderContext);

  const handleResponse = () => {
    navigate(PATH_NAME.HEALTH_RECORDS);
    updateHeaderTitle("Health Records");
  };

  return (
    <div className="flex justify-center flex-col">
      <div className="flex justify-center">
        <img
          src={status === TRNASACTION_STATUS.SUCCEEDED ? checkmark : crossMark}
          alt="Appointment status"
        />
      </div>
      <label className="font-primary pt-4 pb-1 text-center">
        {status === TRNASACTION_STATUS.SUCCEEDED
          ? APPOINTMENT_STATUS_MESSAGE.SUCCESS
          : APPOINTMENT_STATUS_MESSAGE.FAILED}
      </label>
      {status === TRNASACTION_STATUS.REJECTED && (
        <label className="text-sm text-center">
          {APPOINTMENT_STATUS_MESSAGE.RETRY}
        </label>
      )}
      <div className="flex justify-center gap-3 text-sm pt-3 w-full">
        {
          status === TRNASACTION_STATUS.SUCCEEDED && (
            <>
              <Button
                setFocus={true}
                onClick={handleResponse}
                className="font-primary w-[13rem] focus:border focus:border-purple-900 "
                style="outline"
              >
                <HomeIcon className="stroke-purple-900 pe-1" />
                Go to Health Records
              </Button>
              <Button
                className="font-primary w-[13rem] bg-white justify-center"
                onClick={() => navigate(PATH_NAME.HOME)}
                style="outline"
              >
                <AddRecord className="stroke-purple-900 pe-1" /> Add New Service
              </Button>
            </>
          )
          // : (
          //   <>
          //     <Button
          //       setFocus={true}
          //       onClick={() => navigate(PATH_NAME.HOME)}
          //       className="font-primary w-[7rem] justify-center focus:border bg-white focus:border-purple-900 "
          //       style="outline"
          //     >
          //       <i className="pi pi-times pe-2" />
          //       Cancel
          //     </Button>
          //     <Button
          //       className="font-primary w-[10rem] bg-purple-100 justify-center"
          //       style="outline"
          //       onClick={() => onRetry && onRetry()}
          //     >
          //       <i className="stroke-purple-900 pe-2 pi pi-sync" />
          //       Retry Payment
          //     </Button>
          //   </>
          // )
        }
      </div>
    </div>
  );
};

export default AppointmentStatus;
