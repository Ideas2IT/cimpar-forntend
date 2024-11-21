import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { ILocation } from "../../interfaces/location";
import { PATTERN } from "../../utils/AppConstants";
import ErrorMessage from "../errorMessage/ErrorMessage";
import { useEffect } from "react";
import DaysSelector from "./DaySelector";
import { IOptionValue } from "../../interfaces/common";

const EditLocation = ({
  selectedLocation,
  states,
  onClose,
  handleSubmitForm,
}: {
  selectedLocation?: ILocation;
  states: IOptionValue[];
  onClose: () => void;
  handleSubmitForm: (data: any) => void;
}) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {} as ILocation,
  });

  useEffect(() => {
    if (selectedLocation && Object?.keys(selectedLocation)?.length) {
      const [openingHours, openingMinutes, openingSeconds] =
        selectedLocation.opening_time.split(":")?.map(Number);
      const [closingHours, closingMinutes, closingSeconds] =
        selectedLocation.closing_time.split(":")?.map(Number);
      const opening_time = new Date();
      opening_time.setHours(openingHours, openingMinutes, openingSeconds, 0);
      const closing_time = new Date();
      closing_time.setHours(closingHours, closingMinutes, closingSeconds, 0);
      const location = {
        ...selectedLocation,
        opening_time: opening_time.toString(),
        closing_time: closing_time.toString(),
      };
      reset({ ...location });
    }
  }, [selectedLocation]);

  const onSubmit = (data: any) => {
    handleSubmitForm(data);
  };

  const validateWorkingDays = (workingDays: string[]) => {
    return workingDays?.length
      ? true
      : "A Location must have at least one working day";
  };

  const valueTemplate = (item: string) => {
    return (
      <span className={`${item && "text-black font-normal"}`}>
        {item ? item : "State"}
      </span>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="py-6">
      <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-3">
        <span className="relative">
          <label className="input-label block" htmlFor="centerName">
            Center Name*
          </label>
          <Controller
            control={control}
            name="center_name"
            rules={{
              required: "Center Name is required",
            }}
            render={({ field }) => (
              <InputText
                {...field}
                id="centerName"
                className="input-field w-full"
                placeholder="Center Name"
              />
            )}
          />
          {errors.center_name && (
            <ErrorMessage message={errors.center_name.message}></ErrorMessage>
          )}
        </span>
        <span className="relative">
          <label className="input-label block" htmlFor="addressI">
            Address line I*
          </label>
          <Controller
            control={control}
            name="address_line1"
            rules={{
              required: "Address Line I is required",
            }}
            render={({ field }) => (
              <InputText
                {...field}
                id="addressI"
                className="input-field w-full"
                placeholder="Address Line I"
              />
            )}
          />
          {errors.address_line1 && (
            <ErrorMessage message={errors.address_line1.message}></ErrorMessage>
          )}
        </span>
        <span className="relative">
          <label className="input-label block" htmlFor="addressII">
            Address line II
          </label>
          <Controller
            control={control}
            name="address_line2"
            render={({ field }) => (
              <InputText
                {...field}
                id="addressII"
                className="input-field w-full"
                placeholder="Address Line II"
              />
            )}
          />
          {errors.address_line2 && (
            <ErrorMessage message={errors.address_line2.message} />
          )}
        </span>
        <span className="relative">
          <label className="input-label block" htmlFor="city">
            City*
          </label>
          <Controller
            control={control}
            name="city"
            rules={{
              required: "City Name is required",
            }}
            render={({ field }) => (
              <InputText
                {...field}
                id="city"
                className="input-field w-full"
                placeholder="City"
              />
            )}
          />
          {errors.city && (
            <ErrorMessage message={errors.city.message}></ErrorMessage>
          )}
        </span>
        <span className="relative">
          <label className="input-label block" htmlFor="state">
            State*
          </label>
          <Controller
            control={control}
            name="state"
            rules={{
              required: "State Name is required",
            }}
            render={({ field }) => (
              <Dropdown
                {...field}
                onChange={(option) => {
                  option?.value?.display &&
                    setValue("state", option?.value?.display);
                  trigger("state");
                }}
                inputId="state"
                options={states}
                valueTemplate={() => valueTemplate(field.value)}
                optionLabel="display"
                className="input-field test-dropdown"
                placeholder="State"
              />
            )}
          />
          {errors.state && (
            <ErrorMessage message={errors.state.message}></ErrorMessage>
          )}
        </span>
        <span className="relative">
          <label className="input-label block" htmlFor="zipCode">
            Zip_Code
          </label>
          <Controller
            control={control}
            name="zip_code"
            rules={{
              required: "Zip Code is required",
              minLength: {
                value: 5,
                message: "Zip Code must be 5 digits",
              },
              maxLength: {
                value: 5,
                message: "Zip Code must be 5 digits",
              },
            }}
            render={({ field }) => (
              <InputText
                {...field}
                id="zipCode"
                keyfilter="int"
                className="input-field w-full"
                placeholder="Zip Code"
              />
            )}
          />
          {errors.zip_code && (
            <ErrorMessage message={errors.zip_code.message} />
          )}
        </span>
        <span className="relative">
          <label className="input-label block" htmlFor="country">
            Country*
          </label>
          <Controller
            control={control}
            name="country"
            rules={{
              required: "Country Name is required",
            }}
            render={({ field }) => (
              <Dropdown
                {...field}
                inputId="country"
                className="input-field w-full test-dropdown"
                placeholder="Country"
                options={["USA"]}
              />
            )}
          />
          {errors.country && (
            <ErrorMessage message={errors.country.message}></ErrorMessage>
          )}
        </span>
        <span className="relative">
          <label className="input-label block" htmlFor="contactPerson">
            Contact Person*
          </label>
          <Controller
            control={control}
            name="contact_person"
            rules={{
              required: "Contact Person is required",
            }}
            render={({ field }) => (
              <InputText
                {...field}
                id="contactPerson"
                className="input-field w-full"
                placeholder="Contact Person"
              />
            )}
          />
          {errors.contact_person && (
            <ErrorMessage
              message={errors.contact_person.message}
            ></ErrorMessage>
          )}
        </span>
        <span className="relative">
          <label className="input-label block" htmlFor="email">
            Email*
          </label>
          <Controller
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: PATTERN.EMAIL,
                message: "Invalid Email Address",
              },
            }}
            name="contact_email"
            render={({ field }) => (
              <InputText
                {...field}
                keyfilter="email"
                id="email"
                className="input-field w-full"
                placeholder="Email Address"
              />
            )}
          />
          {errors.contact_email && (
            <ErrorMessage message={errors.contact_email.message}></ErrorMessage>
          )}
        </span>
        <span className="relative">
          <label className="input-label block" htmlFor="phone">
            Phone Number*
          </label>
          <Controller
            control={control}
            rules={{
              required: "Phone Number is required",
              pattern: {
                value: PATTERN.PHONE,
                message: "Invalid Phone Number",
              },
            }}
            name="contact_phone"
            render={({ field }) => (
              <InputText
                {...field}
                id="phone"
                keyfilter="pint"
                className="input-field w-full"
                placeholder="Phone Number"
              />
            )}
          />
          {errors.contact_phone && (
            <ErrorMessage message={errors.contact_phone.message}></ErrorMessage>
          )}
        </span>
        <span className="relative">
          <label className="input-label block" htmlFor="status">
            Status*
          </label>
          <Controller
            control={control}
            name="status"
            rules={{
              required: "Status Name is required",
            }}
            render={({ field }) => (
              <Dropdown
                {...field}
                inputId="status"
                className="input-field w-full test-dropdown"
                options={["active", "inactive"]}
                placeholder="Status"
              />
            )}
          />
          {errors.status && (
            <ErrorMessage message={errors.status.message}></ErrorMessage>
          )}
        </span>
        <span className="relative">
          <label className="input-label block" htmlFor="openingTime">
            Opening Time*
          </label>
          <Controller
            control={control}
            name="opening_time"
            rules={{
              required: "Opening Time is required",
            }}
            defaultValue={new Date().toString()}
            render={({ field }) => (
              <Calendar
                {...field}
                inputId="openingTime"
                onChange={(e) => {
                  if (e.target?.value) {
                    const h = e.target.value.getHours();
                    const m = e.target.value.getMinutes();
                    if (!isNaN(h) && !isNaN(m)) {
                      const newDate = new Date();
                      newDate.setHours(h, m, 0, 0);
                      setValue("opening_time", newDate.toString());
                    }
                  }
                }}
                className="input-field w-full p-1"
                value={field.value ? new Date(field.value) : new Date()}
                timeOnly
                showTime
                showIcon
                hourFormat="24"
                panelClassName="!min-w-[15rem]"
                icon="pi pi-clock"
              />
            )}
          />
          {errors.opening_time && (
            <ErrorMessage message={errors.opening_time.message}></ErrorMessage>
          )}
        </span>
        <span className="relative">
          <label className="input-label block" htmlFor="closingTime">
            Closing Time*
          </label>
          <Controller
            control={control}
            defaultValue={new Date().toString()}
            name="closing_time"
            rules={{
              required: "Closing Time is required",
            }}
            render={({ field }) => (
              <Calendar
                {...field}
                inputId="closingTime"
                value={field.value ? new Date(field.value) : new Date()}
                className="input-field w-full p-1"
                onChange={(e) => {
                  e.target?.value &&
                    setValue("closing_time", e?.target.value?.toString());
                }}
                timeOnly
                hourFormat="24"
                showIcon
                icon="pi pi-clock"
              />
            )}
          />
          {errors.closing_time && (
            <ErrorMessage message={errors.closing_time.message}></ErrorMessage>
          )}
        </span>
        <span className="col-span-2 relative">
          <label className="input-label block py-1">Working Days</label>
          <Controller
            name="working_days"
            control={control}
            rules={{
              validate: (days) => validateWorkingDays(days),
            }}
            render={({ field }) => (
              <DaysSelector
                {...field}
                workingDays={field.value}
                onDaysChange={(days) => {
                  days?.length
                    ? setValue("working_days", days)
                    : setValue("working_days", [] as string[]);
                }}
              />
            )}
          />
          {errors.working_days && (
            <ErrorMessage message={errors?.working_days?.message} />
          )}
        </span>
        <span className="lg:col-span-2 text-right font-primary relative">
          <Button
            title="Cancel"
            className="px-4 py-2 border border-purple-900 text-purple-900 rounded-full"
            type="button"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            title="Create Location"
            className="px-4 w-[5rem] justify-center ms-4 border border-purple-900 py-2 bg-purple-100 text-purple-900 rounded-full"
            type="submit"
          >
            Save
          </Button>
        </span>
      </div>
    </form>
  );
};

export default EditLocation;
