import { Controller, useForm } from "react-hook-form";
import { IUser } from "../../interfaces/User";
import ReactDatePicker from "react-datepicker";
import { useRef } from "react";
import { FaRegCalendarMinus } from "react-icons/fa";
import "./EditUserDetails.css";

const EditUserDetails = ({ user }: { user: IUser }) => {
  const datePickerRef = useRef<ReactDatePicker<never, undefined>>(null);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: user,
  });
  return (
    <div className="p-6">
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
        <div className="pt-4">
          <label className="block input-label" htmlFor="firstName">
            First Name*
          </label>
          <input
            {...register("firstName", {
              required: "First name can not be empty.",
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "Name should only contain letters",
              },
            })}
            name={`firstName`}
            onChange={(event) =>
              setValue("firstName", event?.target?.value || "")
            }
            className="cimpar-input focus:outline-none"
            type="text"
            id="firstName"
            placeholder="First name"
          />
        </div>
        <div className="pt-4">
          <label className="block input-label" htmlFor="middleName">
            Middle Name
          </label>
          <input
            {...register("middleName", {
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "Name should only contain letters",
              },
            })}
            name={`middleName`}
            onChange={(event) =>
              setValue("middleName", event?.target?.value || "")
            }
            className="cimpar-input focus:outline-none"
            type="text"
            id="middleName"
            placeholder="Middle Name"
          />
        </div>
        <div className="pt-4">
          <label className="block input-label" htmlFor="lastName">
            Last Name
          </label>
          <input
            {...register("lastName", {
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "Name should only contain letters",
              },
            })}
            name={`lastName`}
            onChange={(event) =>
              setValue("lastName", event?.target?.value || "")
            }
            className="cimpar-input focus:outline-none"
            type="text"
            id="lastName"
            placeholder="Last name"
          />
        </div>
        <div className="pt-4">
          <label className="block input-label" htmlFor="gender">
            Gender*
          </label>
          <select
            {...register("gender", { required: "Please select gender" })}
            name={`gender`}
            onChange={(event) => setValue("gender", event?.target?.value || "")}
            className="cimpar-input focus:outline-none"
            id="gender"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="pt-4 d-flex relative">
          <label htmlFor="dob" className="block input-label">
            Date of Birth*
          </label>
          <div className="absolute left-0 right-0">
            <Controller
              name="dob"
              control={control}
              defaultValue={user.dob}
              rules={{
                required: "Date of appointment is required",
              }}
              render={({ field }) => (
                <ReactDatePicker
                  placeholderText="Select date of birth"
                  required={true}
                  ref={datePickerRef}
                  wrapperClassName="w-full"
                  calendarIconClassname="right-0 mt-2"
                  id="dob"
                  dateFormat={"dd MMMM, yyyy"}
                  onChange={(date) => setValue("dob", date)}
                  selected={new Date(field.value)}
                  className="h-[2.5rem] ps-2 border border-gray-300 px-1 block w-[100%] mt-1 md:text-sm rounded-md right-0 left-0 focus:outline-none"
                />
              )}
            />
            <span
              className="absolute top-[1rem] right-[1rem]"
              onClick={() => datePickerRef?.current?.setOpen(true)}
            >
              <FaRegCalendarMinus />
            </span>
          </div>
        </div>
        <div className="pt-4  relative">
          <label className="block input-label pb-1" htmlFor="height">
            Height*
          </label>
          <input
            {...register("height")}
            name={`height`}
            onChange={(event) =>
              setValue("height", Number(event?.target?.value) || 0)
            }
            className="cimpar-input focus:outline-none"
            type="number"
            id="height"
            placeholder="height"
          />
          <span className="absolute right-2 top-[3rem] z-100">Lbs</span>
        </div>
      </div>
    </div>
  );
};
export default EditUserDetails;
