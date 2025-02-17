import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Tooltip } from "primereact/tooltip";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { IBooking, IOptionValue } from "../../interfaces/common";
import { ILocation } from "../../interfaces/location";
import { PATTERN } from "../../utils/AppConstants";
import ErrorMessage from "../errorMessage/ErrorMessage";

const EditLocation = ({
  selectedLocation,
  states,
  bookingNames,
  onClose,
  handleSubmitForm,
}: {
  selectedLocation?: ILocation;
  states: IOptionValue[];
  bookingNames: IBooking[];
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
      const location = {
        ...selectedLocation,
      };
      reset({ ...location });
    }
  }, [selectedLocation]);

  const onSubmit = (data: any) => {
    handleSubmitForm(data);
  };

  const valueTemplate = (item: string) => {
    return (
      <span className={`${item && "text-black font-normal"}`}>
        {item ?? "State"}
      </span>
    );
  };


  const itemTemplate = (item: IBooking) => {
    return (
      <span
        className="capitalize itemTemplate"
        data-pr-tooltip={item.description ?? ""}
        data-pr-position="top"
      >
        {item.displayName}
        <Tooltip target=".itemTemplate" />
      </span>
    );
  };

  const statusValueTemplate = (value: string) => <span className="capitalize">{value}</span>
  const statusItemTemplate = (value: string) => <span className="capitalize">{value}</span>



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
              required: "Center is required",
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
            <ErrorMessage message={errors.center_name.message} />
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
            <ErrorMessage message={errors.address_line1.message} />
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
              required: "City is required",
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
          {errors.city && <ErrorMessage message={errors.city.message} />}
        </span>
        <span className="relative">
          <label className="input-label block" htmlFor="state">
            State*
          </label>
          <Controller
            control={control}
            name="state"
            rules={{
              required: "State is required",
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
          {errors.state && <ErrorMessage message={errors.state.message} />}
        </span>
        <span className="relative">
          <label className="input-label block" htmlFor="zipCode">
            Zip Code*
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
              required: "Country is required",
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
          {errors.country && <ErrorMessage message={errors.country.message} />}
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
              pattern: {
                value: PATTERN.NAME,
                message: "Only alphanumeric characters are allowed",
              },
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
            <ErrorMessage message={errors.contact_person.message} />
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
            <ErrorMessage message={errors.contact_email.message} />
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
            <ErrorMessage message={errors.contact_phone.message} />
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
              required: "Status is required",
            }}
            render={({ field }) => (
              <Dropdown
                {...field}
                inputId="status"
                itemTemplate={statusItemTemplate}
                valueTemplate={statusValueTemplate}
                panelClassName="capitalize"
                className="input-field w-full test-dropdown"
                options={["active", "inactive"]}
                placeholder="Status"
              />
            )}
          />
          {errors.status && <ErrorMessage message={errors.status.message} />}
        </span>
        <span className="relative">
          <label className="input-label block" htmlFor="booingName">
            Microsoft Calendar Name*
          </label>
          <Controller
            control={control}
            name="azure_booking_id"
            rules={{
              required: "Microsoft Calendar Name is Required",
            }}
            render={({ field }) => (
              <Dropdown
                {...field}
                onChange={(option) => {
                  option?.value && setValue("azure_booking_id", option?.value);
                  trigger("azure_booking_id");
                }}
                inputId="bookingName"
                options={bookingNames}
                optionLabel="displayName"
                optionValue="id"
                itemTemplate={(item: IBooking) => itemTemplate(item)}
                className="input-field test-dropdown"
                placeholder="Microsoft Calendar Name"
              />
            )}
          />
          {errors.azure_booking_id && (
            <ErrorMessage message={errors.azure_booking_id.message} />
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
