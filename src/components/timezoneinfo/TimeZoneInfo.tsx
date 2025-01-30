import React from "react";

const TimezoneInfo: React.FC = () => {
  const offsetMinutes = new Date().getTimezoneOffset();
  const isPositiveOffset = offsetMinutes < 0;
  const absoluteOffsetMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absoluteOffsetMinutes / 60);
  const minutes = absoluteOffsetMinutes % 60;
  const formattedOffset = `${isPositiveOffset ? "+" : "-"}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <div className="text-center">
      <p>
        <i className="pi pi-globe" /> All times are in UTC ({formattedOffset}){" "}
        {timezoneName}
      </p>
    </div>
  );
};

export default TimezoneInfo;
