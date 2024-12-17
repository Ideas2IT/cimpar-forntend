import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AddRecord from "../../assets/icons/addrecord.svg?react";
import checkmark from "../../assets/icons/checkmark.svg";
import crossMark from "../../assets/icons/crossMark.svg";
import HomeIcon from "../../assets/icons/home.svg?react";
import HeaderContext from "../../context/HeaderContext";
import { TAppointmentStatus } from "../../interfaces/appointment";
import {
  APPOINTMENT_STATUS_MESSAGE,
  PATH_NAME,
  TRNASACTION_STATUS,
} from "../../utils/AppConstants";
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

  const statusMessageMap = {
    [TRNASACTION_STATUS.SUCCEEDED]: APPOINTMENT_STATUS_MESSAGE.SUCCESS,
    [TRNASACTION_STATUS.REJECTED]: APPOINTMENT_STATUS_MESSAGE.FAILED,
  };
  return (
    <div className="flex justify-center flex-col">
      <div className="flex justify-center">
        {status === TRNASACTION_STATUS.SUCCEEDED && (
          <img src={checkmark} alt="Appointment status" />
        )}
        {status === TRNASACTION_STATUS.REJECTED && (
          <img src={crossMark} alt="Appointment status" />
        )}
        {status === TRNASACTION_STATUS.PENDING && (
          <div className="h-[4rem] flex justify-center items-center text-4xl w-[4rem] rounded-full bg-purple-900 text-white font-bold">
            !
          </div>
        )}
      </div>
      <label className="font-primary pt-4 pb-1 text-center">
        {statusMessageMap[status] || APPOINTMENT_STATUS_MESSAGE.PENDING}
      </label>
      {status === TRNASACTION_STATUS.REJECTED && (
        <label className="text-sm text-center">
          {APPOINTMENT_STATUS_MESSAGE.RETRY}
        </label>
      )}
      {status === TRNASACTION_STATUS.PENDING && (
        <label className="text-sm text-center">
          {APPOINTMENT_STATUS_MESSAGE.WAIT}
        </label>
      )}
      <div className="flex justify-center gap-3 text-sm pt-3 w-full">
        {status === TRNASACTION_STATUS.SUCCEEDED && (
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
        )}
        {status === TRNASACTION_STATUS.REJECTED && (
          <>
            <Button
              setFocus={true}
              onClick={() => navigate(PATH_NAME.HOME)}
              className="font-primary w-[7rem] justify-center focus:border bg-white focus:border-purple-900 "
              style="outline"
            >
              <i className="pi pi-times pe-2" />
              Cancel
            </Button>

            <Button
              className="font-primary w-[10rem] bg-purple-100 justify-center"
              style="outline"
              onClick={() => onRetry && onRetry()}
            >
              <i className="stroke-purple-900 pe-2 pi pi-sync" />
              Retry Payment
            </Button>
          </>
        )}
        {status === TRNASACTION_STATUS.PENDING && (
          <>
            <Button
              setFocus={true}
              onClick={() => navigate(PATH_NAME.HEALTH_RECORDS)}
              className="font-primary w-full h-[2.5rem] justify-center focus:border bg-white focus:border-purple-900 "
              style="outline"
            >
              <i className="pi pi-home pe-2" />
              Go to Health Records
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentStatus;
