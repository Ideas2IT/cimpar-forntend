import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  IDetailedAppointment,
  IGetAppointmentByIdPayload,
} from "../../interfaces/appointment";
import { obfuscateAccountNumber } from "../../services/commonFunctions";
import { getAppointmentByIdThunk } from "../../store/slices/appointmentSlice";
import { AppDispatch } from "../../store/store";
import { DATE_FORMAT, RESPONSE } from "../../utils/AppConstants";
import { dateFormatter } from "../../utils/Date";
import { LargeDataField } from "../medication/Medication";
import { PatientDetails } from "../userDetails/UserDetails";
import useToast from "../useToast/UseToast";
import TestDetailsTable from "./TestDetailsTable";

const DetailedAppointmentView = ({
  appointmentId,
  patientId,
}: {
  appointmentId: string;
  patientId: string;
}) => {
  const [selectedAppointment, setSelectedAppointment] = useState(
    {} as IDetailedAppointment
  );
  const dispatch = useDispatch<AppDispatch>();
  const { errorToast } = useToast();

  useEffect(() => {
    if (patientId && appointmentId) {
      const payload: IGetAppointmentByIdPayload = {
        patient_id: patientId,
        appointment_id: appointmentId,
      };
      dispatch(getAppointmentByIdThunk(payload)).then((response) => {
        if (response.meta.requestStatus === RESPONSE.FULFILLED) {
          setSelectedAppointment(response.payload as IDetailedAppointment);
        } else if (response.meta.requestStatus === RESPONSE.REJECTED) {
          errorToast("Failed To Load", "Failed to Load Appointment");
        }
      });
    }
  }, []);

  const personalFields = [
    { label: "NAME", value: selectedAppointment?.patientName || "" },
    { label: "GENDER", value: selectedAppointment?.gender || "" },
    {
      label: "DOB (AGE)",
      value: selectedAppointment?.dob
        ? selectedAppointment?.dob + "(" + selectedAppointment?.age + ")"
        : "-",
    },
    {
      label: "CONTACT NUMBER",
      value:
        (selectedAppointment?.contactNumber &&
          "+1-" + selectedAppointment?.contactNumber) ||
        "",
    },
    {
      label: "INSURANCE PROVIDER & NUMBER",
      value: selectedAppointment?.insuranceProvider
        ? selectedAppointment?.insuranceProvider +
          "-" +
          obfuscateAccountNumber(selectedAppointment?.insuraceNumber)
        : "-",
      full: true,
    },
  ];

  const appointmentFields = [
    {
      label: "TOTAL COST",
      value: `$${selectedAppointment?.totalCost ? parseFloat(Number(selectedAppointment?.totalCost)?.toFixed(2)) : "-"}`,
      full: true,
    },
    {
      label: "TEST TO BE TAKEN AT",
      value: selectedAppointment?.takeTestAt || "-",
      full: false,
    },
    {
      label: "PAYMENT STATUS",
      value: selectedAppointment?.paymentStatus || "N/A",
      full: false,
    },
    {
      label: "SERVICE CENTER NAME",
      value: selectedAppointment?.centerLocation || "N/A",
      full: false,
    },
    {
      label: "DATE OF APPOINTMENT FOR TEST",
      value: selectedAppointment?.appointmentDate
        ? dateFormatter(
            selectedAppointment?.appointmentDate,
            DATE_FORMAT.DD_MMM_YYYY
          )
        : "-",
    },
    {
      label: "SCHEDULED TIME",
      value: selectedAppointment?.appointmentTime,
    },
    {
      label: "REASON FOR TEST",
      value: selectedAppointment?.reasonForTest || "",
      full: true,
    },
  ];

  const remarks = [
    {
      Label: "CURRENT MEDICAL CONDITIONS",
      value: selectedAppointment?.currentConditions,
      full: true,
    },
    {
      Label: "OTHER MEDICAL CONDITIONS",
      value: selectedAppointment?.otherConditions,
      full: true,
    },
    {
      Label: "CURRENT ALLERGIES",
      value: selectedAppointment?.currentAllergies,
      full: true,
    },
    {
      Label: "OTHER ALLERGIES",
      value: selectedAppointment?.otherAllergies,
      full: true,
    },
  ];

  return (
    <div className="pt-4">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {personalFields?.map((field, index) => {
          return (
            <div key={index} className={`${field.full && "col-span-2"}`}>
              <LargeDataField
                label={field.label || "-"}
                value={field.value || "-"}
              />
            </div>
          );
        })}
      </div>
      <label className="font-primary text-xl pt-6 pb-3 block">
        Appointment
      </label>
      <TestDetailsTable testDetails={selectedAppointment.testDetails} />
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {appointmentFields?.map((field, index) => {
          return (
            <div key={index} className={`${field.full && "col-span-2"}`}>
              <PatientDetails label={field.label} value={field.value} />
            </div>
          );
        })}
      </div>
      <label className="font-primary text-xl pt-6 block">Remarks</label>
      {remarks?.map((item, index) => {
        return (
          <PatientDetails
            key={index}
            label={item.Label}
            value={item.value || ""}
          />
        );
      })}
    </div>
  );
};
export default DetailedAppointmentView;
