import { format } from "date-fns";

export const TIME_SLOT_DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

type AzureTimeSlot = {
  startTime: string;
  endTime: string;
};

type AzureDaySchedule = {
  day: string;
  timeSlots: AzureTimeSlot[];
};

export type OutputTimeSlot = {
  start: string;
  end: string;
  displayTime: string;
};

type OutputTimeSlots = {
  [key: string]: {
    day: string;
    slots: OutputTimeSlot[];
  };
};

export type ServiceTimeSlotsDetail = {
  serviceId: string;
  serviceName: string;
  staffMemberIds: unknown[];
  timeSlotInterval: string;
  businessHours: AzureDaySchedule[];
  availableTimeSlots: OutputTimeSlots;
};

function formatTime(timeString: string | undefined): number {
  if (!timeString) {
    console.warn(`Invalid time: ${timeString}. Defaulting to 0 minutes.`);
    return 0;
  }

  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 60 + minutes + (seconds || 0) / 60;
}

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:00.0000000`;
}

function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) {
    console.warn(
      `Invalid duration format: ${duration}. Defaulting to 0 minutes.`
    );
    return 0;
  }
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  return hours * 60 + minutes;
}

const formatDisplayTime = (utcTimeString: string): string => {
  const utcDate = new Date(`1970-01-01T${utcTimeString}Z`);
  return format(utcDate, "hh:mm a");
};

function generateSlotsForDay(
  timeSlots: AzureTimeSlot[],
  intervalMinutes: number
): OutputTimeSlot[] {
  const daySlots: OutputTimeSlot[] = [];

  timeSlots.forEach(({ startTime, endTime }) => {
    if (!startTime || !endTime) {
      console.warn(
        `Invalid time slot range: startTime (${startTime}) or endTime (${endTime}) is missing or invalid. Skipping this slot.`
      );
      return;
    }

    const startMinutes = formatTime(startTime.split(".")[0]);
    const endMinutes = formatTime(endTime.split(".")[0]);

    if (startMinutes >= endMinutes) {
      console.warn(
        `Invalid time slot: startTime (${startTime}) >= endTime (${endTime}). Skipping this slot.`
      );
      return;
    }

    let currentMinutes = startMinutes;
    while (currentMinutes + intervalMinutes <= endMinutes) {
      const slotStart = formatMinutes(currentMinutes);
      const slotEnd = formatMinutes(currentMinutes + intervalMinutes);
      daySlots.push({
        start: slotStart,
        end: slotEnd,
        displayTime: formatDisplayTime(slotStart),
      });
      currentMinutes += intervalMinutes;
    }
  });

  return daySlots;
}

function generateTimeSlotsBasedOnDays(
  schedule: AzureDaySchedule[],
  timeSlotInterval: string
): OutputTimeSlots {
  const intervalMinutes = parseDuration(timeSlotInterval);
  if (intervalMinutes <= 0) {
    console.warn(
      `Invalid time slot interval: ${timeSlotInterval}. No slots will be generated.`
    );
    return {};
  }

  const slots: OutputTimeSlots = {};

  schedule.forEach(({ day, timeSlots }) => {
    if (!timeSlots || timeSlots.length === 0) {
      if (day) {
        slots[day] = { day, slots: [] };
      }
      return;
    }

    slots[day] = {
      day,
      slots:
        intervalMinutes > 0
          ? generateSlotsForDay(timeSlots, intervalMinutes)
          : [],
    };
  });

  return slots;
}

export const transformAzureServiceSlotsResponse = (
  serviceSlotsData: any
): ServiceTimeSlotsDetail | undefined => {
  if (
    !serviceSlotsData?.serviceId ||
    !serviceSlotsData?.timeSlotInterval ||
    !serviceSlotsData?.businessHours
  ) {
    return;
  }

  const serviceSlotsDetail = {
    serviceId: serviceSlotsData.serviceId,
    serviceName: serviceSlotsData.serviceName,
    staffMemberIds: serviceSlotsData.staffMemberIds,
    timeSlotInterval: serviceSlotsData.timeSlotInterval,
    businessHours: serviceSlotsData.businessHours,
    availableTimeSlots: generateTimeSlotsBasedOnDays(
      serviceSlotsData.businessHours,
      serviceSlotsData.timeSlotInterval
    ),
  };

  return serviceSlotsDetail;
};

export const combineDateAndTimeToUTC = (
  appointmentDate: Date,
  scheduleTime: string
) => {
  const datePart = appointmentDate;
  const [hours, minutes, seconds] = scheduleTime.split(":").map(Number);
  datePart.setUTCHours(hours);
  datePart.setUTCMinutes(minutes);
  datePart.setUTCSeconds(seconds || 0);
  datePart.setUTCMilliseconds(0);
  const formattedDate = datePart.toISOString();

  return formattedDate;
};
