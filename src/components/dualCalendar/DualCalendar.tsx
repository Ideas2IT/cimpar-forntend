import { SyntheticEvent, useState } from "react";
import { Calendar, CalendarViewChangeEvent } from "primereact/calendar";
import { addMonths, format } from "date-fns";
import { Button } from "primereact/button";
import "./DualCalendar.css";
import { IDualCalendarReponse } from "../appointments/Appointments";
import { FormEvent } from "primereact/ts-helpers";

const DualCalendar = ({ dateFilter }: { dateFilter: IDualCalendarReponse }) => {
  const [range, setRange] = useState<Date[]>([new Date()]);
  const [firstMonthViewDate, setFirstMonthViewDate] = useState<Date>(
    new Date()
  );
  const [secondMonthViewDate, setSecondMonthViewDate] = useState<Date>(
    addMonths(new Date(), 1)
  );

  const handleRangeChange = (
    e: FormEvent<Date[], SyntheticEvent<Element, Event>>
  ): void => {
    e?.value && setRange(e.value);
  };

  const handleFirstMonthViewDateChange = (e: CalendarViewChangeEvent) => {
    setFirstMonthViewDate(e.value);
  };

  const handleSecondMonthViewDateChange = (e: CalendarViewChangeEvent) => {
    setSecondMonthViewDate(e.value);
  };

  const handleOnApply = () => {
    dateFilter.onApply(range);
  };

  const handleOnCancel = () => {
    dateFilter.onCancel();
  };

  // const monthNavigatorTemplate = (options: any): ReactNode => {
  //   const month = options.options[options.value];
  //   return (
  //     <span className="flex w-full text-lg justify-between items-center color-primary">
  //       <i
  //         className="pi pi-angle-left"
  //         onClick={() => {
  //           const date = firstMonthViewDate;
  //           date.setMonth(date.getMonth() - 1);
  //           setFirstMonthViewDate(new Date(date));
  //         }}
  //       />
  //       {month.label} {options.props.value[0].getFullYear()}{" "}
  //       <i
  //         className="pi pi-angle-right"
  //         onClick={() => {
  //           const date = firstMonthViewDate;
  //           date.setMonth(date.getMonth() + 1);
  //           setFirstMonthViewDate(new Date(date));
  //         }}
  //       />
  //     </span>
  //   );
  // };

  return (
    <div className="grid grid-cols-2 relative bg-white">
      <div>
        <Calendar
          // monthNavigator={false}
          // yearNavigator={false}
          // monthNavigatorTemplate={(date) => monthNavigatorTemplate(date)}
          todayButtonClassName="bg-red-500 rounded-md"
          value={range}
          onChange={handleRangeChange}
          // onChange={(e) => console.log(e)}
          viewDate={firstMonthViewDate}
          onViewDateChange={handleFirstMonthViewDateChange}
          selectionMode="range"
          numberOfMonths={1}
          inline
        />
      </div>
      <div className="">
        <Calendar
          value={range}
          onChange={handleRangeChange}
          viewDate={secondMonthViewDate}
          onViewDateChange={handleSecondMonthViewDateChange}
          selectionMode="range"
          numberOfMonths={1}
          inline
        />
      </div>
      <div className="absolute left-1/2 w-[2px] h-[75%] bg-gray-300"></div>
      <div className="col-span-2 flex border-t-2">
        <div className="flex justify-start w-full gap-4 p-3">
          {range.length > 0 && range[0] !== null && (
            <span className="border p-2 color-primary rounded-md">
              {format(range[0], "dd/MM/yyyy")}
            </span>
          )}
          {range?.length > 1 && range[1] !== null && (
            <span className="border p-2 color-primary rounded-md">
              {format(range[1], "dd/MM/yyyy")}
            </span>
          )}
        </div>
        <div className="flex w-[50%] justify-end gap-4 p-3">
          <Button
            type="button"
            name="Cancel"
            label="Cancel"
            className="color-primary rounded-md bg-white px-6 py-2 border border-blue-900"
            onClick={handleOnCancel}
          />
          <Button
            onClick={handleOnApply}
            type="button"
            label="Apply"
            name="Apply"
            className="bg-primary text-white px-6 py-2 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default DualCalendar;
