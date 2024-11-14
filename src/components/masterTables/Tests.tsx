import { Button, Button as PrimeButton } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { Toast } from "primereact/toast";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import HeaderContext from "../../context/HeaderContext";
import {
  ErrorResponse,
  IAllTestspayload,
  ILabTestService,
  IToggleRecordStatusPayload,
  IUpdateMasterRecordPayload,
} from "../../interfaces/common";
import { ICreateLabTest } from "../../interfaces/masterTable";
import { cleanString, getRowClasses } from "../../services/commonFunctions";
import {
  addMasterRecordThunk,
  getLabTestsForAdminThunk,
  toggleRecordStatusThunk,
  updateMasterRecordThunk,
} from "../../store/slices/masterTableSlice";
import { AppDispatch } from "../../store/store";
import {
  HEADER_TITLE,
  PAGE_LIMIT,
  RESPONSE,
  SERVICE_CATEGORIES,
  TABLE,
} from "../../utils/AppConstants";
import SearchInput, { SearchInputHandle } from "../SearchInput";
import BackButton from "../backButton/BackButton";
import CustomModal from "../customModal/CustomModal";
import CustomPaginator from "../customPagenator/CustomPaginator";
import ErrorMessage from "../errorMessage/ErrorMessage";
import useToast from "../useToast/UseToast";
import "./Masters.css";

interface IPagging {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

const TestList = () => {
  const { updateHeaderTitle } = useContext(HeaderContext);
  const [isOpenModal, setIsOpendModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState({} as ILabTestService);
  const dispatch = useDispatch<AppDispatch>();
  const [tests, setTests] = useState<ILabTestService[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_items: 0,
    total_pages: 0,
    page_size: PAGE_LIMIT,
  } as IPagging);
  const { toast, errorToast, successToast } = useToast();
  const searchInputRef = useRef<SearchInputHandle>(null);
  const [fetchPayload, setFetchPayload] = useState<IAllTestspayload>({
    tableName: TABLE.LAB_TEST,
    page: 1,
    page_size: PAGE_LIMIT,
    current_page: 1,
    display: "",
    service_type: "",
  } as IAllTestspayload);

  useEffect(() => {
    updateHeaderTitle(HEADER_TITLE.LAB_TESTS);
  }, []);

  const handlePageChange = useCallback(
    (value: number) => {
      setFetchPayload({ ...fetchPayload, page: value });
    },
    [fetchPayload]
  );

  useEffect(() => {
    if (Object.keys(fetchPayload).length) {
      fetchTests();
    }
  }, [fetchPayload]);

  const fetchTests = () => {
    dispatch(getLabTestsForAdminThunk(fetchPayload)).then((response) => {
      if (response.meta.requestStatus === RESPONSE.FULFILLED) {
        const payload = response.payload.data as ILabTestService[];
        const pagingDetails = response.payload.pagination as IPagging;
        setPagination(pagingDetails);
        setTests(payload);
      } else if (response.meta.requestStatus === RESPONSE.REJECTED) {
        const errorResponse = response.payload as ErrorResponse;
        errorToast("Failed to fetch", errorResponse.message);
        setTests([]);
      }
    });
  };

  const handleSubmit = (data: ILabTestService) => {
    if (data?.id) {
      const payload: IUpdateMasterRecordPayload = {
        tableName: TABLE.LAB_TEST,
        resourceId: data.id,
        display: data.display,
        code: data.code,
        is_active: data.is_active,
        is_lab: true,
        is_telehealth_required: data.is_telehealth_required,
        center_price: data.center_price,
        home_price: data.home_price,
        service_type: data.service_type,
      };
      dispatch(updateMasterRecordThunk(payload)).then((response) => {
        if (response.meta.requestStatus === RESPONSE.FULFILLED) {
          successToast(
            "Updated successfully",
            "Test has been updated successfully"
          );
          setIsOpendModal(false);
          setTests((prevItems) =>
            prevItems.map((item) =>
              item.id === data.id ? { ...item, ...data } : item
            )
          );
        } else {
          const errorResponse = response.payload as ErrorResponse;
          errorToast("Failed to update", errorResponse.message);
        }
      });
    } else {
      const payload: ICreateLabTest = {
        tableName: TABLE.LAB_TEST,
        display: data.display,
        code: data.code,
        is_active: true,
        center_price: Number(data.center_price),
        home_price: Number(data.home_price),
        currency_symbol: "$",
        is_lab: true,
        is_telehealth_required: data.is_telehealth_required,
        service_type: data.service_type,
      };
      dispatch(addMasterRecordThunk(payload)).then((response) => {
        if (response.meta.requestStatus === RESPONSE.FULFILLED) {
          successToast(
            "Created successfully",
            "Test has been created successfully"
          );
          setFetchPayload({ ...fetchPayload, page: 1 });
          if (searchInputRef?.current) {
            searchInputRef.current.clearInput();
          }
          setIsOpendModal(false);
        } else if (response.meta.requestStatus === RESPONSE.REJECTED) {
          const errorResponse = response.payload as ErrorResponse;
          errorToast("Failed to create", errorResponse.message);
        }
      });
    }
  };

  const showModal = () => {
    setIsOpendModal(true);
  };
  const handleToggleStatus = (status: boolean, id: string) => {
    const payload: IToggleRecordStatusPayload = {
      tableName: TABLE.LAB_TEST,
      resourceId: id,
      is_active: status,
    };
    dispatch(toggleRecordStatusThunk(payload)).then((response) => {
      if (response.meta.requestStatus === RESPONSE.FULFILLED) {
        const _tests = tests.map((test) => {
          if (test.id === id) {
            return { ...test, is_active: status };
          } else {
            return test;
          }
        });
        setTests(_tests);
      }
    });
  };

  const columns = [
    {
      field: "serial",
      header: "ID",
      body: (_: ILabTestService, options: { rowIndex: number }) => (
        <>
          {(pagination?.current_page - 1) * PAGE_LIMIT + options.rowIndex + 1}
        </>
      ),
    },
    {
      field: "display",
      header: "test description",
      bodyClassName: "max-w-[15rem] break-all",
    },
    {
      field: "code",
      header: "CODE",
      bodyClassName: "max-w-[10rem] break-all",
    },
    {
      header: "telehealth required",
      headerClassName: "justify-items-center",
      body: (row: ILabTestService) => (
        <div className="font-tertiary text-center">
          {row.is_telehealth_required ? "Yes" : "No"}
        </div>
      ),
    },
    {
      field: "is_active",
      header: "ACTIVE",
      body: (row: ILabTestService) => (
        <div className="font-tertiary">
          <label className="block ps-2">{row.is_active ? "Yes" : "No"}</label>
          <InputSwitch
            checked={row.is_active}
            onChange={(e) => handleToggleStatus(e.value, row.id)}
          />
        </div>
      ),
    },
    {
      field: "",
      headerClassName: "border-b font-primary",
      header: "ACTION",
      body: (row: ILabTestService) => (
        <div className="font-primary text-purple-800">
          <span
            className="cursor-pointer pi pi-pen-to-square text-xl"
            onClick={() => {
              showModal();
              setSelectedTest(row);
            }}
          ></span>
        </div>
      ),
    },
  ];

  const handleCloseModal = () => {
    setIsOpendModal(false);
    setSelectedTest({} as ILabTestService);
  };

  const handleSearch = (value: string) => {
    setFetchPayload({ ...fetchPayload, display: value, page: 1 });
  };

  return (
    <div className="px-6">
      <div className="flex w-full justify-between">
        <BackButton
          backLink="/master-tabs"
          currentPage="lab Tests"
          previousPage="Masters"
        />
        <SearchInput
          ref={searchInputRef}
          handleSearch={(value) => handleSearch(value)}
          placeholder="Search for Test"
        />
      </div>
      <div className="flex w-full py-2 box-content h-[2.5rem] justify-end">
        <Button
          onClick={showModal}
          title="Add new record"
          label="Add New"
          icon="pi pi-plus"
          className="bg-purple-800 rounded-lg px-2 text-white font-bold"
        />
      </div>
      <div
        className={`w-full bg-white rounded-lg ${pagination && pagination.total_pages > 1 ? "h-[calc(100vh-240px)]" : "h-[calc(100vh-220px)]"}`}
      >
        <DataTable
          value={tests}
          tableClassName="border-b"
          className="mt-2 tests-wrapper font-tertiary"
          emptyMessage={
            <div className="flex w-full justify-center">
              No lab tests available
            </div>
          }
          selectionMode={undefined}
          scrollable
          scrollHeight="flex"
          rowClassName={() => getRowClasses("h-10 border-b")}
        >
          {columns.map((column) => {
            return (
              <Column
                key={column.header}
                field={column.field}
                header={column.header}
                bodyClassName={column.bodyClassName}
                body={column.body}
                headerClassName={`border-b font-tertiary uppercase ${column.headerClassName}`}
              />
            );
          })}
        </DataTable>
        {pagination != undefined && pagination.total_pages > 1 && (
          <CustomPaginator
            currentPage={Number(pagination?.current_page)}
            handlePageChange={(value) => {
              handlePageChange(value);
            }}
            totalPages={Number(pagination?.total_pages)}
          />
        )}
      </div>
      {isOpenModal && (
        <CustomModal
          isDismissable="yes"
          handleClose={handleCloseModal}
          styleClass="min-w-[70%]"
          showCloseButton={true}
        >
          <AddMasterModal
            onCancel={handleCloseModal}
            heading={
              Object?.keys(selectedTest)?.length > 0
                ? "Edit Lab Test"
                : "Add Lab Test"
            }
            selectedItem={selectedTest}
            handleSubmitForm={handleSubmit}
          />
        </CustomModal>
      )}
      <Toast ref={toast} />
    </div>
  );
};

export const AddMasterModal = ({
  heading,
  onCancel,
  handleSubmitForm,
  selectedItem,
}: {
  heading?: string;
  onCancel: () => void;
  handleSubmitForm: (updatedItem: ILabTestService) => void;
  selectedItem?: ILabTestService;
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: selectedItem,
  });
  const handleUpdate = (data: ILabTestService) => {
    const cleanInput: ILabTestService = {
      ...data,
      display: cleanString(data.display),
      code: cleanString(data.code),
    };
    handleSubmitForm(cleanInput);
    onCancel();
  };

  const validateField = (value: string, field: string) => {
    if (!value?.trim()) {
      return field + " is required";
    }
    return true;
  };

  const validatePrice = (price: number | string, field: string) => {
    if (isNaN(Number(price))) {
      return `${field} should be a number`;
    }
    if (Number(price) <= 0) {
      return `${field} should be greater than 0`;
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit((data) => handleUpdate(data))}>
      <div className="flex flex-col gap-5 p-6">
        <div className="w-full font-primary text-xl">
          {heading ? heading : "Add Data"}
        </div>
        <div className=" grid lg:grid-cols-2 grid-cols-1 gap-4">
          <div className="relative">
            <label className="input-label font-secondary" htmlFor="code">
              Code*
            </label>
            <Controller
              control={control}
              name="code"
              rules={{ validate: (value) => validateField(value, "Code") }}
              render={({ field }) => (
                <InputText
                  id="code"
                  {...field}
                  placeholder="Code"
                  className="w-full cimpar-input"
                />
              )}
            />
            {errors.code && <ErrorMessage message={errors.code.message} />}
          </div>
          <div className="relative">
            <label className="input-label font-secondary" htmlFor="display">
              Description*
            </label>
            <Controller
              name="display"
              control={control}
              rules={{
                validate: (value) => validateField(value, "Description"),
              }}
              render={({ field }) => (
                <InputTextarea
                  {...field}
                  id="display"
                  placeholder="Description"
                  className="w-full cimpar-input h-[2.5rem]"
                />
              )}
            />
            {errors?.display && (
              <ErrorMessage message={errors.display?.message} />
            )}
          </div>
          <div className="relative">
            <label
              className="input-label block font-secondary"
              htmlFor="serviceType"
            >
              Service Category*
            </label>
            <Controller
              name="service_type"
              control={control}
              rules={{
                validate: (value) => validateField(value, "Service Category"),
              }}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  options={SERVICE_CATEGORIES}
                  inputId="serviceType"
                  placeholder="Service Category"
                  className="w-full cimpar-input px-0 h-[2.5rem] test-dropdown"
                />
              )}
            />
            {errors?.service_type && (
              <ErrorMessage message={errors.service_type?.message} />
            )}
          </div>
          <div
            className={`relative ${selectedItem && !!Object.keys(selectedItem)?.length && "opacity-60 cursor-not-allowed"}`}
          >
            <label className="capitalize block input-label" htmlFor="athome">
              at home price($)*
            </label>
            <Controller
              name="home_price"
              rules={{
                validate: (value) => validatePrice(value, "At Home Price"),
                required: "Home Price is required",
              }}
              control={control}
              defaultValue={selectedItem?.home_price}
              render={({ field }) => (
                <InputText
                  {...field}
                  placeholder="Home Price"
                  disabled={selectedItem && !!Object.keys(selectedItem)?.length}
                  onChange={(e) =>
                    setValue("home_price", String(e?.target?.value))
                  }
                  id="athome"
                  className="cimpar-input"
                />
              )}
            />
            {errors.home_price && (
              <ErrorMessage message={errors?.home_price?.message} />
            )}
          </div>
          <div
            className={`realtive ${selectedItem && !!Object.keys(selectedItem)?.length && "cursor-not-allowed opacity-60"}`}
          >
            <label className="capitalize block input-label" htmlFor="atCenter">
              Service center price($)*
            </label>
            <Controller
              name="center_price"
              control={control}
              rules={{
                validate: (value) => validatePrice(value, "Service Center Price"),
                required: "Service Center Price  is required",
              }}
              defaultValue={selectedItem?.center_price}
              render={({ field }) => (
                <InputText
                  {...field}
                  disabled={selectedItem && !!Object.keys(selectedItem)?.length}
                  onChange={(e) => {
                    setValue("center_price", e.target?.value);
                  }}
                  id="atCenter"
                  placeholder="Center Price"
                  className="cimpar-input"
                />
              )}
            />
            {errors.center_price && (
              <ErrorMessage message={errors?.center_price?.message} />
            )}
          </div>
          <div className="relative">
            <label className="input-label block pb-2">
              TeleHealth Required
            </label>
            <Controller
              name="is_telehealth_required"
              control={control}
              defaultValue={selectedItem?.is_telehealth_required ? true : false}
              render={({ field }) => (
                <div className="w-full gap-6 flex font-primary">
                  <div className="align-center items-center">
                    <RadioButton
                      className="w-6 h-6"
                      inputId="teleHealthRequired"
                      checked={field.value}
                      onChange={() => setValue("is_telehealth_required", true)}
                    />
                    <label htmlFor="teleHealthRequired" className="px-2">
                      Yes
                    </label>
                  </div>
                  <div className="items-center flex">
                    <RadioButton
                      inputId="teleHealthNotRequired"
                      checked={!field.value}
                      onChange={() => setValue("is_telehealth_required", false)}
                    />
                    <label htmlFor="teleHealthNotRequired" className="px-2">
                      No
                    </label>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
        <div className="w-full text-end">
          <PrimeButton
            onClick={() => {
              onCancel();
            }}
            className="font-primary px-3 py-2 rounded-full text-purple-900"
            size="large"
            type="button"
          >
            <i className="pi pi-times me-2" />
            Cancel
          </PrimeButton>
          <PrimeButton
            className="font-primary border px-3 py-2 rounded-full ms-3 border border-purple-800 text-purple-800"
            size="large"
            type="submit"
          >
            <i className="pi pi-check me-2" />
            Save
          </PrimeButton>
        </div>
      </div>
    </form>
  );
};
export default TestList;
