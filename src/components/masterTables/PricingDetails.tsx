import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import HeaderContext from "../../context/HeaderContext";
import {
  ErrorResponse,
  IAllTestspayload,
  ILabTestService,
} from "../../interfaces/common";
import { IPagination } from "../../interfaces/immunization";
import { IUpdatePricingPayload } from "../../interfaces/masterTable";
import { getRowClasses, handleKeyPress } from "../../services/commonFunctions";
import {
  getLabTestsForAdminThunk,
  selectServiceCategories,
  updatePricingThunk,
} from "../../store/slices/masterTableSlice";
import { AppDispatch } from "../../store/store";
import {
  HEADER_TITLE,
  PAGE_LIMIT,
  PATH_NAME,
  RESPONSE,
  TABLE,
} from "../../utils/AppConstants";
import BackButton from "../backButton/BackButton";
import CustomPaginator from "../customPagenator/CustomPaginator";
import ErrorMessage from "../errorMessage/ErrorMessage";
import SearchInput from "../SearchInput";
import CustomServiceDropDown from "../serviceFilter/CustomServiceDropdown";
import useToast from "../useToast/UseToast";

export default function PricingDetails() {
  const serviceCategories = useSelector(selectServiceCategories);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTest, setSelectedTest] = useState({} as ILabTestService);
  const editService = (value: boolean, service = {} as ILabTestService) => {
    setSelectedTest(service);
    setIsEditing(value);
  };
  const [fetchPayload, setFetchPayload] = useState<IAllTestspayload>({
    tableName: TABLE.LAB_TEST,
    page: 1,
    page_size: PAGE_LIMIT,
    current_page: 1,
    display: "",
  } as IAllTestspayload);
  const [labServices, setLabServices] = useState<ILabTestService[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    page_size: PAGE_LIMIT,
    total_items: 1,
    total_pages: 1,
  } as IPagination);
  const { toast, successToast, errorToast } = useToast();
  const { updateHeaderTitle } = useContext(HeaderContext);

  useEffect(() => {
    updateHeaderTitle(HEADER_TITLE.PRICING);
  }, []);

  useEffect(() => {
    fetchTests();
  }, [fetchPayload]);

  const dispatch = useDispatch<AppDispatch>();

  const updatePricing = (data: ILabTestService) => {
    const payload: IUpdatePricingPayload = {
      center_price: Number(data.center_price)?.toFixed(2),
      home_price: Number(data.home_price)?.toFixed(2),
      resource_id: data.id,
      tableName: TABLE.LAB_TEST,
    };
    dispatch(updatePricingThunk(payload)).then((response) => {
      if (response.meta.requestStatus === RESPONSE.FULFILLED) {
        successToast(
          "Updated successfully",
          "Pricing details have been updated successfully"
        );
        setLabServices((prevTests) =>
          prevTests?.map((service) =>
            data.id === service.id
              ? {
                  ...service,
                  center_price: Number(data.center_price)?.toFixed(2),
                  home_price: Number(data.home_price)?.toFixed(2),
                }
              : service
          )
        );
        setIsEditing(false);
      } else {
        const errorResponse = response.payload as ErrorResponse;
        errorToast("Pricing Update Failed", errorResponse.message);
      }
    });
  };

  const handlePaging = (value: number) => {
    setFetchPayload({ ...fetchPayload, page: value });
  };

  const fetchTests = () => {
    dispatch(getLabTestsForAdminThunk(fetchPayload)).then((response) => {
      if (response.meta.requestStatus === RESPONSE.FULFILLED) {
        const payload = response.payload.data as ILabTestService[];
        if (payload?.length > 0) {
          setLabServices(payload);
        } else {
          setLabServices([]);
        }
        const pagingDetails = response.payload.pagination as IPagination;
        setPagination(pagingDetails);
      } else if (response.meta.requestStatus === RESPONSE.REJECTED) {
        const errorResponse = response.payload as ErrorResponse;
        errorToast("Failed to fetch", errorResponse.message);
        setLabServices([]);
      }
    });
  };

  const handleSearch = (value: string) => {
    fetchPayload.display !== value &&
      setFetchPayload({
        ...fetchPayload,
        display: value,
        page: 1,
      });
  };

  return (
    <>
      {!isEditing ? (
        <>
          <div className="flex justify-between">
            <BackButton
              backLink={PATH_NAME.MASTER_TABLES}
              currentPage="Pricing"
              previousPage="Masters"
            />
            <div className="flex w-[40%] justify-end gap-3">
              <div className="w-[50%]">
                <CustomServiceDropDown
                  onApplyFilter={(value) => {
                    setFetchPayload({
                      ...fetchPayload,
                      page: 1,
                      service_type: value.join(","),
                    });
                  }}
                  options={serviceCategories}
                  label="Service Types"
                />
              </div>
              <SearchInput
                handleSearch={handleSearch}
                placeholder="Search for Test"
              />
            </div>
          </div>
          <PricingData
            onEdit={editService}
            tests={labServices}
            pagingDetails={pagination}
            handlePaging={handlePaging}
          />
        </>
      ) : (
        <EditPricing
          editService={editService}
          selectedService={selectedTest}
          handleUpdatePricing={updatePricing}
        />
      )}
      <Toast ref={toast} />
    </>
  );
}
const PricingData = ({
  onEdit,
  tests,
  handlePaging,
  pagingDetails,
}: {
  onEdit: (val: boolean, labtest: ILabTestService) => void;
  tests: ILabTestService[];
  handlePaging: (value: number) => void;
  pagingDetails: IPagination;
}) => {
  const tableRef = useRef<DataTable<ILabTestService[]>>(null);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const handlePagination = (page: number) => {
    handlePaging(page);
    tableRef?.current && tableRef.current?.resetScroll();
  };

  const columns = [
    {
      header: "S.No",
      field: "id",
      body: (_: ILabTestService, options: { rowIndex: number }) => (
        <>
          {(pagingDetails.current_page - 1) * PAGE_LIMIT + options.rowIndex + 1}
        </>
      ),
    },
    {
      header: "test name",
      field: "display",
    },
    {
      header: "service type",
      field: "service_type",
    },
    {
      header: "service center",
      field: "center_price",
      body: (row: ILabTestService) => (
        <>{row.center_price ? formatCurrency(Number(row.center_price)) : "-"}</>
      ),
    },
    {
      header: "at home",
      field: "atHome",
      body: (row: ILabTestService) => (
        <>{row.home_price ? formatCurrency(Number(row.home_price)) : "-"}</>
      ),
    },
    {
      header: "code",
      field: "code",
    },
    {
      header: "action",
      field: "",
      headerClassName: "justify-items-center custom-header",
      body: (rowData: ILabTestService) => (
        <i
          className="pi pi-pen-to-square w-full text-center text-purple-800"
          onClick={() => onEdit(true, rowData)}
        />
      ),
    },
  ];

  return (
    <>
      <div className="rounded-lg mt-4 flex-grow bg-white  px-2 pe-1">
        <DataTable
          ref={tableRef}
          className="rounded-lg min-w-[50rem]"
          value={tests}
          scrollable
          scrollHeight="calc(100vh - 210px)"
          rowClassName={() => getRowClasses("h-[3.5rem]")}
          emptyMessage={
            <div className="w-full text-center">No Data Available</div>
          }
        >
          {columns.map((column) => {
            return (
              <Column
                key={"key" + column.header}
                header={column.header}
                field={column.field}
                headerClassName={`uppercase border-b font-secondary px-2 ${column.headerClassName}`}
                bodyClassName="font-tertiary border-b px-2 test-wrap max-w-[10rem]"
                body={column.body}
              />
            );
          })}
        </DataTable>
      </div>
      {pagingDetails?.total_pages > 1 && (
        <CustomPaginator
          currentPage={pagingDetails?.current_page}
          handlePageChange={handlePagination}
          totalPages={pagingDetails?.total_pages}
        />
      )}
    </>
  );
};

const EditPricing = ({
  editService,
  selectedService,
  handleUpdatePricing,
}: {
  editService: (val: boolean, service: ILabTestService) => void;
  selectedService: ILabTestService;
  handleUpdatePricing: (service: ILabTestService) => void;
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: {} as ILabTestService });

  const inputs = [
    {
      name: "display" as const,
      disabled: true,
      element: <InputText />,
      colspan: 2,
      styleClasses: "cursor-not-allowed opacity-60",
      label: "test name",
    },
    {
      name: "code" as const,
      disabled: true,
      element: <InputText />,
      styleClasses: "cursor-not-allowed opacity-60",
      label: "code",
    },
    {
      name: "service_type" as const,
      disabled: true,
      element: <InputText />,
      styleClasses: "cursor-not-allowed opacity-60",
      colspan: 1,
      label: "service Type",
    },
    {
      name: "center_price" as const,
      disabled: false,
      element: <InputText keyfilter="pnum" />,
      styleClasses: "",
      label: "service center($)",
      validationRules: { validate: (value: string) => validatePrice(value) },
    },
    {
      name: "home_price" as const,
      disabled: false,
      element: <InputText keyfilter="pnum" />,
      styleClasses: "",
      label: "at homes($)",
      validationRules: { validate: (value: string) => validatePrice(value) },
    },
  ];

  useEffect(() => {
    reset({ ...selectedService });
  }, [selectedService]);

  const validatePrice = (value: string) => {
    const price = parseFloat(value);
    if (isNaN(price) || price <= 0) {
      return "Price should be greate than 0.";
    }
    return true;
  };
  return (
    <>
      <form
        className="flex-grow flex-col flex"
        onSubmit={handleSubmit((data) => {
          handleUpdatePricing(data);
        })}
        onKeyDown={(event) => handleKeyPress(event)}
      >
        <div className="flex justify-between w-full">
          <span onClick={() => editService(false, {} as ILabTestService)}>
            <BackButton
              backLink={PATH_NAME.PRICING}
              currentPage="Edit Pricing Details"
              previousPage="Pricing Details"
            />
          </span>
          <div className="flex gap-3 font-primary text-purple-900">
            <Button
              className="items-center border-none shadow-none px-3 py-2"
              icon="pi pi-times pe-2"
              type="button"
              onClick={() => {
                editService(false, {} as ILabTestService);
              }}
            >
              Cancel
            </Button>
            <Button
              title="submit"
              icon="pi pi-check pe-2"
              type="submit"
              className="ml-3 submit-button items-center"
            >
              Submit
            </Button>
          </div>
        </div>
        <div className="flex-grow bg-white rounded-lg p-6 mt-6">
          <label className="font-primary capitalize text-xl pb-2 block">
            Pricing details
          </label>
          <div className="grid md:grid-cols-4 gap-3">
            {inputs.map((input, index) => (
              <div
                key={index}
                className={`${input.styleClasses} col-span-${input.colspan ? input.colspan : "1"} relative`}
              >
                <label className="input-label capitalize">{input.label}*</label>
                <Controller
                  name={input.name}
                  control={control}
                  rules={input.validationRules}
                  render={({ field }) =>
                    React.cloneElement(input.element, {
                      ...field,
                      disabled: input.disabled,
                      className: `form-control ${input.styleClasses} border rounded-lg w-full h-[2.5rem]`,
                    })
                  }
                />
                {errors[input.name] && (
                  <ErrorMessage message={errors[input.name]?.message} />
                )}
              </div>
            ))}
          </div>
        </div>
      </form>
    </>
  );
};
