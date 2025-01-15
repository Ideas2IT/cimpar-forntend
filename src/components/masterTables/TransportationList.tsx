import { InputText } from "primereact/inputtext";
import BackButton from "../backButton/BackButton";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { PATH_NAME, RESPONSE, URL_CATEGORIES } from "../../utils/AppConstants";
import { Controller, useForm } from "react-hook-form";
import ErrorMessage from "../errorMessage/ErrorMessage";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  getUrlByCategoryThunk,
  updateUrlByIdThunk,
} from "../../store/slices/masterTableSlice";
import { IMasterUrl } from "../../interfaces/masterTable";
import useToast from "../useToast/UseToast";
import { Toast } from "primereact/toast";
import { ErrorResponse } from "../../interfaces/common";
import { Navigate, useNavigate } from "react-router-dom";
const TransportationList = () => {
  return (
    <div className="h-full w-full">
      <div className="flex w-full justify-start">
        <BackButton
          backLink={PATH_NAME.SERVICE_MASTER}
          currentPage="Partner Services"
          previousPage="Service Master"
        />
      </div>
      <div className="bg-white rounded-lg w-full h-[calc(100vh-170px)] overflow-auto mt-4 py-4 px-6">
        <TransportationForm />
      </div>
    </div>
  );
};

const TransportationForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast, successToast, errorToast } = useToast();
  const [selectedUrl, setSelectedUrl] = useState({} as IMasterUrl);
  const [selectedCategory, setSelectedCategory] = useState(
    URL_CATEGORIES.TRANSPORTATION
  );
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: selectedUrl as IMasterUrl,
  });

  const navigate = useNavigate();

  const handleFormSubmit = (data: any) => {
    dispatch(updateUrlByIdThunk(data)).then((response) => {
      if (response.meta.requestStatus === RESPONSE.FULFILLED) {
        successToast("Updated successfully", "URL updated successfully");
        setTimeout(() => {
          navigate(PATH_NAME.SERVICE_MASTER);
        }, 2000);
      } else if (response.meta.requestStatus === RESPONSE.REJECTED) {
        const errorResponse = response.payload as ErrorResponse;
        errorToast("Update Failed", errorResponse.message);
      }
    });
  };

  useEffect(() => {
    dispatch(getUrlByCategoryThunk(selectedCategory)).then((response) => {
      if (response.meta.requestStatus === RESPONSE.FULFILLED) {
        const _response = response.payload.data[0] as IMasterUrl;
        setSelectedUrl(_response);
      } else {
        errorToast("Failed to load", "Failed to Load data");
      }
    });
  }, [selectedCategory]);

  useEffect(() => {
    reset({ ...selectedUrl });
  }, [selectedUrl]);

  return (
    <>
      <form
        className="w-full"
        onSubmit={handleSubmit((data) => handleFormSubmit(data))}
      >
        <div className="grid lg:grid-cols-2 w-full gap-x-10 gap-y-2">
          <div className="relative col-span-2 lg:col-span-1">
            <label className="font-primary capitalize input-label pb-2 block">
              Service Category*
            </label>
            <Controller
              name="category"
              control={control}
              rules={{
                required: "Service Category is required",
              }}
              defaultValue={selectedCategory}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  onChange={(event) => {
                    setValue("category", event.value);
                    setSelectedCategory(event.value);
                  }}
                  className="input-field w-full"
                  itemTemplate={(item) => (
                    <span className="capitalize">{item}</span>
                  )}
                  valueTemplate={(selectedItem) => (
                    <span className="capitalize">{selectedItem}</span>
                  )}
                  options={["Vaccination", "Transportation"]}
                />
              )}
            />
            {errors.category && (
              <ErrorMessage message={errors.category.message} />
            )}
          </div>
          <div className="relative col-span-2 lg:col-span-1">
            <label className="font-primary capitalize input-label pb-2 block">
              Hyperlink Text*
            </label>
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Name is required",
              }}
              render={({ field }) => (
                <InputText {...field} className="input-field w-full" />
              )}
            />
            {errors.name && <ErrorMessage message={errors.name.message} />}
          </div>

          <span className="col-span-2 relative">
            <label className="font-primary capitalize input-label pb-2 block">
              Description*
            </label>
            <Controller
              name="description"
              control={control}
              rules={{
                required: "Description is required",
              }}
              render={({ field }) => (
                <InputTextarea
                  {...field}
                  maxLength={1000}
                  className="rounded-lg w-full min-h-[4rem] border"
                />
              )}
            />
            {errors.description && (
              <ErrorMessage message={errors.description.message} />
            )}
          </span>

          <span className="col-span-2">
            <label className="font-primary capitalize input-label pb-2 block">
              Landing Page URL*
            </label>
            <Controller
              name="url"
              control={control}
              rules={{
                required: "Landing Page URL is required",
              }}
              render={({ field }) => (
                <InputText {...field} className="input-field w-full" />
              )}
            />
            {errors.url && <ErrorMessage message={errors.url.message} />}
          </span>

          <Button
            type="submit"
            className="bg-purple-100 border border-purple-900 py-2 px-3 justify-self-end col-span-2 rounded-lg text-purple-900"
          >
            Update
          </Button>
        </div>
      </form>
      <Toast ref={toast} />
    </>
  );
};
export default TransportationList;
