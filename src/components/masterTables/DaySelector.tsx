import React, { useEffect, useState } from "react";
import { Checkbox } from "primereact/checkbox";

interface DaysSelectorProps {
  workingDays: string[];
  onDaysChange: (selectedDays: string[]) => void;
}

const DaysSelector: React.FC<DaysSelectorProps> = ({
  workingDays,
  onDaysChange,
}) => {
  const days = [
    { label: "sun", fullLabel: "sunday" },
    { label: "mon", fullLabel: "monday" },
    { label: "tue", fullLabel: "tuesday" },
    { label: "wed", fullLabel: "wednesday" },
    { label: "thu", fullLabel: "thursday" },
    { label: "fri", fullLabel: "friday" },
    { label: "sat", fullLabel: "saturday" },
  ];

  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  useEffect(() => {
    workingDays?.length && setSelectedDays(workingDays);
  }, [workingDays]);

  const handleDayChange = (day: string, checked: boolean) => {
    const updatedDays = checked
      ? [...selectedDays, day]
      : selectedDays.filter((d) => d !== day);
    setSelectedDays(updatedDays);
    onDaysChange(updatedDays);
  };

  return (
    <div className="flex gap-4 font-secondary">
      {days.map(({ label, fullLabel }) => (
        <div key={fullLabel} className="field-checkbox items-center flex">
          <Checkbox
            className="me-2"
            inputId={label}
            checked={selectedDays.includes(label)}
            onChange={(e) => handleDayChange(label, e.checked || false)}
          />
          <label htmlFor={label} className="capitalize">
            {fullLabel}
          </label>
        </div>
      ))}
    </div>
  );
};

export default DaysSelector;
