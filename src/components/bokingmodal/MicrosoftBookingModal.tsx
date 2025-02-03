import { format, isToday, addDays } from "date-fns";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { useEffect, useState } from "react";
import { DATE_FORMAT, RESPONSE } from "../../utils/AppConstants";
import {
  OutputTimeSlot,
  ServiceTimeSlotsDetail,
  TIME_SLOT_DAYS,
} from "../../utils/BookingSlotUtils";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  getBookedSlotsForHomeServiceThunk,
  getBookedSlotsForServiceCenterThunk,
} from "../../store/slices/appointmentSlice";
import { formatUTCDateToUtcString } from "../../utils/Date";
import TimezoneInfo from "../timezoneinfo/TimeZoneInfo";
import { ITimeSlot } from "../../interfaces/appointment";
import { ErrorResponse } from "../../interfaces/common";
import useToast from "../useToast/UseToast";
import { Toast } from "primereact/toast";

const MicrosoftBookingModal = ({
  selectedSlotTime,
  selectedSlotDate,
  timeSlotDetails,
  handleBookSlot,
  handleCancel,
  bookingId,
  category,
}: {
  selectedSlotTime: OutputTimeSlot;
  selectedSlotDate: Date;
  timeSlotDetails?: ServiceTimeSlotsDetail;
  handleBookSlot: (data: Date, timeSlot: OutputTimeSlot) => void;
  handleCancel: () => void;
  bookingId: string;
  category: string;
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(
    isToday(selectedSlotDate) ? addDays(new Date(), 1) : selectedSlotDate
  );
  const [selectedSlot, setSelectedSlot] = useState(selectedSlotTime);
  const [bookedSlots, setBookedSlots] = useState<ITimeSlot[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const { toast, errorToast } = useToast();

  useEffect(() => {
    selectedDate && fetchBookedSlots(selectedDate);
  }, [selectedDate]);

  const fetchBookedSlots = (date: Date) => {
    if (bookingId) {
      dispatch(
        getBookedSlotsForServiceCenterThunk({
          booking_id: bookingId,
          start_date: formatUTCDateToUtcString(date),
          end_date: formatUTCDateToUtcString(addDays(date, 1)),
          service_category: category,
        })
      ).then((response) => {
        if (response.meta.requestStatus === RESPONSE.FULFILLED) {
          const _response = response.payload.data as ITimeSlot[];
          if (_response?.length) {
            setBookedSlots(_response);
          } else {
            setBookedSlots([]);
          }
        } else if (response.meta.requestStatus === RESPONSE.REJECTED) {
          const errorResponse = response.payload as ErrorResponse;
          errorToast("Failed to load slot details", errorResponse?.message);
        }
      });
    } else {
      dispatch(
        getBookedSlotsForHomeServiceThunk({
          booking_id: "",
          start_date: formatUTCDateToUtcString(date),
          end_date: formatUTCDateToUtcString(addDays(date, 1)),
          service_category: "",
        })
      ).then((response) => {
        if (response.meta.requestStatus === RESPONSE.FULFILLED) {
          const _response = response.payload.data as ITimeSlot[];
          if (_response?.length) {
            setBookedSlots(_response);
          } else {
            setBookedSlots([]);
          }
        } else if (response.meta.requestStatus === RESPONSE.REJECTED) {
          const errorResponse = response.payload as ErrorResponse;
          errorToast("Failed to load slot details", errorResponse?.message);
        }
      });
    }
  };

  const handleDateChange = (date: Date) => {
    if (date) {
      setSelectedDate(date);
      setSelectedSlot({} as OutputTimeSlot);
    }
  };

  const bookSlot = () => {
    if (selectedSlot && selectedDate) {
      handleBookSlot(selectedDate, selectedSlot);
    }
  };

  const compareObjectWithArray = (obj: any) => {
    return bookedSlots.some((item) => {
      const startTime = item.startDateTime.dateTime.split("T")[1].split("Z")[0];
      const endTime = item.endDateTime.dateTime.split("T")[1].split("Z")[0];
      return obj.start == startTime && obj.end == endTime;
    });
  };

  return (
    <div className="w-full py-2">
      <div className="text-center w-full text-gray-800">
        {`${format(selectedDate, DATE_FORMAT.MMMM_DD_YYYY || "")} ${selectedSlot?.displayTime || ""}`}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-2">
        <div>
          <i className=" mb-2 pi pi-calendar text-blue-600 px-2" />
          Date
          <Calendar
            inline
            value={selectedDate}
            minDate={addDays(new Date(), 1)}
            onChange={(event) => {
              handleDateChange(event.value as Date);
            }}
          />
        </div>
        <div>
          <i className=" mb-2 pi pi-clock px-2 text-blue-600" />
          Time
          <div className="px-4 py-1 grid grid-cols-3 gap-3 max-h-[18rem] overflow-auto">
            {timeSlotDetails?.availableTimeSlots?.[
              TIME_SLOT_DAYS[selectedDate.getDay()]
            ]?.slots?.length ? (
              timeSlotDetails?.availableTimeSlots[
                TIME_SLOT_DAYS[selectedDate.getDay()]
              ].slots.map((slot: OutputTimeSlot) => (
                <TimeSlot
                  disabled={compareObjectWithArray(slot)}
                  key={slot.displayTime + slot.start}
                  handleSelectTimeSlot={(timeSlot: OutputTimeSlot) => {
                    setSelectedSlot(timeSlot);
                  }}
                  timeSlot={slot}
                  style={
                    selectedSlot?.displayTime === slot?.displayTime
                      ? "bg-purple-900 text-white border-2 border-gray-500 border-dashed"
                      : "border"
                  }
                />
              ))
            ) : (
              <div className="col-span-3">No Slots Available</div>
            )}
          </div>
        </div>
      </div>
      <TimezoneInfo />
      <div className="w-full flex justify-around px-5 py-3 border-t">
        <Button
          onClick={handleCancel}
          className="text-purple-900 font-bold justify-center px-6 py-2 w-[45%] border border-purple-900 rounded-full"
        >
          <i className="pi pe-3 pi-times" />Cancel
        </Button>
        <Button
          onClick={bookSlot}
          disabled={!selectedDate || !Object?.keys(selectedSlot)?.length}
          className="text-purple-900 font-bold  justify-center px-6 py-2 w-[45%] border border-purple-900 bg-purple-100 rounded-full"
        >
          <i className="pi pe-3 pi-calendar" />Book Now
        </Button>
      </div>
      <Toast ref={toast} />
    </div>
  );
};

const TimeSlot = ({
  timeSlot,
  handleSelectTimeSlot,
  style,
  disabled,
}: {
  timeSlot: OutputTimeSlot;
  handleSelectTimeSlot: (timeSlot: OutputTimeSlot) => void;
  style: string;
  disabled: boolean;
}) => {
  return (
    <Button
      disabled={disabled}
      onClick={() => handleSelectTimeSlot(timeSlot)}
      className={`p-1 rounded justify-center ${style}`}
    >
      {timeSlot.displayTime}
    </Button>
  );
};
export default MicrosoftBookingModal;
