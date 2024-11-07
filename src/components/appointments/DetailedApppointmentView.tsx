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

const DetailedAppointmentView = ({
  appointmentId,
  patientId,
}: {
  appointmentId: string;
  patientId: string;
}) => {
  const [selectedAppoinement, setSelectedAppointment] = useState(
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
    { label: "NAME", value: selectedAppoinement?.patientName || "" },
    { label: "GENDER", value: selectedAppoinement?.gender || "" },
    {
      label: "DOB (AGE)",
      value: selectedAppoinement?.dob
        ? selectedAppoinement?.dob + "(" + selectedAppoinement?.age + ")"
        : "-",
    },
    {
      label: "CONTACT NUMBER",
      value:
        (selectedAppoinement?.contactNumber &&
          "+1-" + selectedAppoinement?.contactNumber) ||
        "",
    },
    {
      label: "INSURANCE PROVIDER & NUMBER",
      value: selectedAppoinement?.insuranceProvider
        ? selectedAppoinement?.insuranceProvider +
          "-" +
          obfuscateAccountNumber(selectedAppoinement?.insuraceNumber)
        : "-",
      full: true,
    },
  ];

  const appointmentFields = [
    {
      label: "APPOINTMENT FOR",
      value: selectedAppoinement?.appointmentFor || "",
      full: true,
    },
    {
      label: "DATE OF APPOINTMENT FOR TEST",
      value: selectedAppoinement?.appointmentDate
        ? dateFormatter(
            selectedAppoinement?.appointmentDate,
            DATE_FORMAT.DD_MMM_YYYY
          )
        : "-",
    },
    {
      label: "SCHEDULED TIME",
      value: selectedAppoinement?.appointmentTime,
    },
    {
      label: "REASON FOR TEST",
      value: selectedAppoinement?.reasonForTest || "",
      full: true,
    },
  ];

  const remarks = [
    {
      Label: "CURRENT MEDICAL CONDITIONS",
      value: selectedAppoinement?.currentConditions,
      full: true,
    },
    {
      Label: "OTHER MEDICAL CONDITIONS",
      value: selectedAppoinement?.otherConditions,
      full: true,
    },
    {
      Label: "CURRENT ALLERGIES",
      value: selectedAppoinement?.currentAllergies,
      full: true,
    },
    {
      Label: "OTHER ALLERGIES",
      value: selectedAppoinement?.otherAllergies,
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
