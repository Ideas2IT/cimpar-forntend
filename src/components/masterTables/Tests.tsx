import { Button, Button as PrimeButton } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import HeaderContext from "../../context/HeaderContext";
import {
  ErrorResponse,
  IAddMasterRecordPayload,
  IAllTestspayload,
  IToggleRecordStatusPayload,
  IUpdateMasterRecordPayload,
} from "../../interfaces/common";
import { cleanString, getRowClasses } from "../../services/commonFunctions";
import {
  addMasterRecordThunk,
  getLabTestsForAdminThunk,
  toggleRecordStatusThunk,
  updateMasterRecordThunk,
} from "../../store/slices/masterTableSlice";
import { AppDispatch } from "../../store/store";
import { HEADER_TITLE, RESPONSE, TABLE } from "../../utils/AppConstants";
import SearchInput, { SearchInputHandle } from "../SearchInput";
import BackButton from "../backButton/BackButton";
import CustomModal from "../customModal/CustomModal";
import CustomPaginator from "../customPagenator/CustomPaginator";
import ErrorMessage from "../errorMessage/ErrorMessage";
import useToast from "../useToast/UseToast";
import "./Masters.css";

interface ILabTest {
  serial: string;
  code: string;
  display: string;
  is_active: boolean;
  id: string;
}
interface IPagging {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}
const TestList = () => {
  const { updateHeaderTitle } = useContext(HeaderContext);
  const [isOpenModal, setIsOpendModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState({} as ILabTest);
  const dispatch = useDispatch<AppDispatch>();
  const [tests, setTests] = useState<ILabTest[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_items: 0,
    total_pages: 0,
    page_size: 20,
  } as IPagging);
  const { toast, errorToast, successToast } = useToast();
  const searchInputRef = useRef<SearchInputHandle>(null);
  const [fetchPayload, setFetchPayload] = useState({
    tableName: TABLE.LAB_TEST,
    page: 1,
    page_size: 20,
    current_page: 1,
    display: "",
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
        const payload = response.payload.data as ILabTest[];
        const pagingDetails = response.payload.pagination as IPagging;
        setPagination(pagingDetails);
        payload?.length ? addTestSerials(payload) : setTests([]);
      } else if (response.meta.requestStatus === RESPONSE.REJECTED) {
        const errorResponse = response.payload as ErrorResponse;
        errorToast("Failed to fetch", errorResponse.message);
        setTests([]);
      }
    });
  };

  const addTestSerials = (allTests: ILabTest[]) => {
    if (allTests?.length) {
      const updatedTests = allTests.map((test, index) => {
        return {
          ...test,
          serial: String(
            (fetchPayload.page - 1) * fetchPayload.page_size + (index + 1)
          ),
        };
      });
      setTests(updatedTests);
    } else {
      setTests([]);
    }
  };

  const handleSubmit = (data: ILabTest) => {
    if (data?.id) {
      const payload: IUpdateMasterRecordPayload = {
        tableName: TABLE.LAB_TEST,
        resourceId: data.id,
        display: data.display,
        code: data.code,
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
        }
      });
    } else {
      const payload: IAddMasterRecordPayload = {
        tableName: TABLE.LAB_TEST,
        display: data.display,
        code: data.code,
        is_active: true,
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
    { field: "serial", header: "ID" },
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
      field: "is_active",
      header: "ACTIVE",
      body: (row: ILabTest) => (
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
      body: (row: ILabTest) => (
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
    setSelectedTest({} as ILabTest);
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
      <div className="w-full h-[calc(100vh-240px)] bg-white rounded-lg">
        <DataTable
          value={tests}
          tableClassName="border-b"
          className="mt-2 tests-wrapper font-tertiary mx-2"
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
                headerClassName="border-b font-primary uppercase"
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
          styleClass="min-w-[35%]"
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
  handleSubmitForm: (updatedItem: ILabTest) => void;
  selectedItem?: ILabTest;
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: selectedItem,
  });
  const handleUpdate = (data: ILabTest) => {
    const cleanInput: ILabTest = {
      ...data,
      display: cleanString(data.display),
      code: cleanString(data.code),
    };
    handleSubmitForm(cleanInput);
    onCancel();
  };

  const validateField = (value: string) => {
    if (!value?.trim()) {
      return "This field is required";
    }
    return true;
  };
  return (
    <form onSubmit={handleSubmit((data) => handleUpdate(data))}>
      <div className="flex flex-col gap-5 p-6">
        <div className="w-full font-primary text-xl">
          {heading ? heading : "Add Data"}
        </div>
        <div className="relative">
          <label className="input-label font-secondary" htmlFor="code">
            Code*
          </label>
          <Controller
            control={control}
            name="code"
            rules={{ validate: (value) => validateField(value) }}
            render={({ field }) => (
              <InputText id="code" {...field} className="w-full cimpar-input" />
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
              validate: (value) => validateField(value),
            }}
            render={({ field }) => (
              <InputTextarea
                {...field}
                id="display"
                className="w-full cimpar-input"
              />
            )}
          />
          {errors?.display && (
            <ErrorMessage message={errors.display?.message} />
          )}
        </div>
        <div className="w-full text-end">
          <PrimeButton
            onClick={() => {
              onCancel();
            }}
            className="font-primary px-3 py-2 rounded-full"
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
