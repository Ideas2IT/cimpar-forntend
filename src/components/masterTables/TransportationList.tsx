import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ErrorResponse } from "../../interfaces/common";
import { IMasterUrl } from "../../interfaces/masterTable";
import { getUrlByCategoryThunk, updateUrlByIdThunk, } from "../../store/slices/masterTableSlice";
import { AppDispatch } from "../../store/store";
import { PATH_NAME, RESPONSE, URL_CATEGORIES } from "../../utils/AppConstants";
import BackButton from "../backButton/BackButton";
import ErrorMessage from "../errorMessage/ErrorMessage";
import useToast from "../useToast/UseToast";
import { cleanString } from "../../services/commonFunctions";


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
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: selectedUrl,
  });

  const navigate = useNavigate();

  const description = watch('description')



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

  const handleFormSubmit = (data: IMasterUrl) => {
    const payload: IMasterUrl = {
      ...data,
      description: cleanString(data.description),
      url: cleanString(data.url),
      name: cleanString(data.name)
    };

    dispatch(updateUrlByIdThunk(payload)).then((response) => {
      if (response.meta.requestStatus === RESPONSE.FULFILLED) {
        successToast("Updated successfully", "Data updated successfully");
        setTimeout(() => {
          navigate(PATH_NAME.SERVICE_MASTER);
        }, 2000);
      } else if (response.meta.requestStatus === RESPONSE.REJECTED) {
        const errorResponse = response.payload as ErrorResponse;
        errorToast("Unable To Update", errorResponse.message);
      }
    });
  };

  const validateRequiredField = (value: string, field: string) => {
    if (value?.trim()) {
      return true;
    } else {
      return `${field} is required`;
    }
  };

  const itemTemplate = (item: string) => {
    return <span className="capitalize">{item}</span>
  }

  const valueTemplate = (selectedCategory: string) => {
    return < span className="capitalize">{selectedCategory}</span>
  }

  return (
    <>
      <form
        className="w-full"
        onSubmit={handleSubmit((data) => handleFormSubmit(data))}
      >
        <div className="grid lg:grid-cols-2 w-full gap-x-10 gap-y-2">
          <div className="relative col-span-2 lg:col-span-1">
            <label htmlFor="category" className="font-primary capitalize input-label pb-2 block">
              Service Category*
            </label>
            <Controller
              name="category"
              control={control}
              rules={{
                validate: (value) => validateRequiredField(value, "Service Category"),
              }}
              defaultValue={selectedCategory}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  id="category"
                  onChange={(event) => {
                    setValue("category", event.value);
                    setSelectedCategory(event.value);
                  }}
                  className="input-field w-full"
                  itemTemplate={(item) => itemTemplate(item)}
                  valueTemplate={(selectedCategory) => valueTemplate(selectedCategory)}
                  options={["Vaccination", "Transportation"]}
                />
              )}
            />
            {errors.category && (
              <ErrorMessage message={errors.category.message} />
            )}
          </div>
          <div className="relative col-span-2 lg:col-span-1">
            <label htmlFor="linkText" className="font-primary capitalize input-label pb-2 block">
              Hyperlink Text*
            </label>
            <Controller
              name="name"
              control={control}
              rules={{ validate: (value) => validateRequiredField(value, 'Hyperlink Text') }}
              render={({ field }) => (
                <InputText {...field} id="linkText" className="input-field w-full" />
              )}
            />
            {errors.name && <ErrorMessage message={errors.name.message} />}
          </div>

          <span className="col-span-2 relative">
            <label htmlFor="description" className="font-primary capitalize input-label pb-2 block">
              Description*
            </label>
            <Controller
              name="description"
              control={control}
              rules={{
                validate: (value) => validateRequiredField(value, "Description"),
              }}
              render={({ field }) => (
                <InputTextarea
                  {...field}
                  id="description"
                  maxLength={1000}
                  className="rounded-lg w-full min-h-[4rem] border"
                />
              )}
            />
            <span className="absolute input-label -bottom-3 right-0">{description?.length || 0}/1000</span>
            {errors.description && (
              <ErrorMessage message={errors.description.message} />
            )}
          </span>

          <span className="col-span-2">
            <label htmlFor="url" className="font-primary capitalize input-label pb-2 block">
              Landing Page URL*
            </label>
            <Controller
              name="url"
              control={control}
              rules={{ validate: (value) => validateRequiredField(value, "Landing Page URL"), }}
              render={({ field }) => (
                <InputText {...field} id='url' className="input-field w-full" />
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
