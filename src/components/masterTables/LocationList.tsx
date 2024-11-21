import { useContext, useEffect, useRef, useState } from "react";
import BackButton from "../backButton/BackButton";
import SearchInput, { SearchInputHandle } from "../SearchInput";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { cleanString, getRowClasses } from "../../services/commonFunctions";
import { Sidebar } from "primereact/sidebar";
import CustomModal from "../customModal/CustomModal";
import EditLocation from "./EditLocation";
import {
  ICreateLocationPayload,
  IGetLocationPayload,
  ILocation,
  ILocationResponse,
  IToggleLocationStatusPayload,
} from "../../interfaces/location";
import { InputSwitch } from "primereact/inputswitch";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  createLocationThunk,
  getLocationsThunk,
  getOptionValuesThunk,
  getServiceRegionsThunk,
  toggleLocationStatusThunk,
  updateLocationThunk,
} from "../../store/slices/masterTableSlice";
import {
  DATE_FORMAT,
  HEADER_TITLE,
  PAGE_LIMIT,
  RESPONSE,
  TABLE,
} from "../../utils/AppConstants";
import useToast from "../useToast/UseToast";
import { Toast } from "primereact/toast";
import { ErrorResponse, IOptionValue } from "../../interfaces/common";
import CustomPaginator from "../customPagenator/CustomPaginator";
import { dateFormatter } from "../../utils/Date";
import CustomServiceDropDown from "../serviceFilter/CustomServiceDropdown";
import HeaderContext from "../../context/HeaderContext";

interface IRegion {
  state: string[];
  city: string[];
}
const LocationList = () => {
  const searchInputRef = useRef<SearchInputHandle>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [locations, setLocations] = useState<ILocationResponse>(
    {} as ILocationResponse
  );
  const [initLoad, setInitLoad] = useState(true);
  const [regions, setReagons] = useState<IRegion>({} as IRegion);

  const [locationPayload, setLocationPayload] = useState<IGetLocationPayload>({
    page: 1,
    page_size: PAGE_LIMIT,
    active: false,
    cities: [],
    states: [],
    searchValue: "",
  } as IGetLocationPayload);
  const [states, setStates] = useState<IOptionValue[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<ILocation>(
    {} as ILocation
  );

  const { toast, errorToast, successToast } = useToast();
  const { updateHeaderTitle } = useContext(HeaderContext);

  const dispatch = useDispatch<AppDispatch>();

  const showModal = () => {
    setIsOpenModal(true);
  };

  const showDetailedLocation = (location: ILocation) => {
    setSelectedLocation(location);
    setIsOpenSidebar(true);
  };

  const SidebarHeader = () => {
    return (
      <div className="flex w-full justify-between py-2">
        <h3 className="text-lg font-semibold">Location Details</h3>
      </div>
    );
  };

  const handleSearch = (value: string) => {
    setLocationPayload({ ...locationPayload, searchValue: value, page: 1 });
  };

  useEffect(() => {
    fetchStates();
    getCitiesAndStatesForDropdown();
    updateHeaderTitle(HEADER_TITLE.CENTER_LOCATION);
  }, []);

  useEffect(() => {
    if (!initLoad) {
      fetchAllLocations();
    }
    setInitLoad(false);
  }, [locationPayload]);

  const fetchAllLocations = () => {
    dispatch(getLocationsThunk(locationPayload)).then((response) => {
      const locations = response.payload as ILocationResponse;
      setLocations(locations);
    });
  };

  const getCitiesAndStatesForDropdown = () => {
    dispatch(getServiceRegionsThunk()).then((response) => {
      const regions = response.payload.data as any;
      setReagons(regions[0]);
    });
  };

  const fetchStates = () => {
    dispatch(getOptionValuesThunk(TABLE.STATE)).then((response) => {
      if (response?.meta?.requestStatus === RESPONSE.FULFILLED) {
        const _response = response.payload as IOptionValue[];
        setStates(_response);
      }
    });
  };

  const editLocation = (location: ILocation) => {
    setSelectedLocation(location);
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setSelectedLocation({} as ILocation);
  };

  const handleToggleStatus = (value: boolean, id: string) => {
    const payload: IToggleLocationStatusPayload = {
      resourceId: id,
      status: value ? "active" : "inactive",
    };
    dispatch(toggleLocationStatusThunk(payload)).then((response) => {
      if (response?.meta.requestStatus === RESPONSE.FULFILLED) {
        const _locations: ILocation[] = locations.data.map((loc: ILocation) => {
          if (loc.id === id) {
            return { ...loc, status: value ? "active" : "inactive" };
          } else {
            return loc;
          }
        });
        setLocations({ ...locations, data: _locations });
      } else {
        const _response = response.payload as ErrorResponse;
        errorToast("Failed to change status", _response?.message);
      }
    });
  };

  const locationColumns = [
    {
      header: "ID",
      body: (_: ILocation, options: { rowIndex: number }) => (
        <>
          {(locations?.pagination?.current_page - 1) * PAGE_LIMIT +
            options.rowIndex +
            1}
        </>
      ),
    },
    {
      field: "center_name",
      header: "Center Name",
    },
    {
      header: "Address",
      body: (rowData: ILocation) => (
        <div>{`${rowData?.address_line1 || ""}, ${rowData?.address_line2 && rowData?.address_line2 + "," || ""} ${rowData?.city || ""}, ${rowData?.state || ""}, ${rowData?.zip_code || ""}`}</div>
      ),
    },
    { header: "Contact", field: "contact_phone" },
    {
      field: "is_active",
      header: "ACTIVE",
      body: (rowData: ILocation) => (
        <div className="font-tertiary">
          <label className="block ps-2">
            {rowData?.status === "active" ? "Yes" : "No"}
          </label>
          <InputSwitch
            checked={rowData?.status === "active"}
            onChange={(e) => handleToggleStatus(e.value, rowData.id)}
          />
        </div>
      ),
    },
    {
      header: "Action",
      body: (rowData: ILocation) => (
        <div className="flex">
          <i
            className="pi pi-eye min-w-[2rem] text-purple-900 cursor-pointer text-xl font-bold"
            onClick={() => showDetailedLocation(rowData)}
          />
          <i
            className="pi pi-pen-to-square min-w-[2rem] text-purple-900 cursor-pointer text-xl font-bold"
            onClick={() => editLocation(rowData)}
          />
        </div>
      ),
    },
  ];

  const handleSubmitForm = (data: ILocation) => {
    const payload: ICreateLocationPayload = {
      address_line1: cleanString(data.address_line1) || "",
      address_line2: cleanString(data.address_line2),
      city: cleanString(data.city),
      zip_code: cleanString(data.zip_code),
      center_name: cleanString(data.center_name),
      state: data.state,
      closing_time: dateFormatter(data.closing_time, DATE_FORMAT.HH_MM_SS),
      contact_email: data.contact_email,
      contact_person: data.contact_person,
      contact_phone: data.contact_phone,
      country: data.country,
      opening_time: dateFormatter(data.opening_time, DATE_FORMAT.HH_MM_SS),
      status: data.status,
      working_days: data.working_days,
      holiday: "",
    };
    if (!Object.keys(selectedLocation)?.length) {
      dispatch(createLocationThunk(payload)).then((response) => {
        if (response.meta.requestStatus === RESPONSE.FULFILLED) {
          successToast("Location Created", "New Location added successfully");
          setIsOpenModal(false);
          getCitiesAndStatesForDropdown();
          setLocationPayload({ ...locationPayload, page: 1 });
        } else {
          const _response = response.payload as ErrorResponse;
          errorToast("Failed to create location", _response?.message);
        }
      });
    } else {
      const updatePayload: ILocation = {
        ...payload,
        id: selectedLocation.id,
      };
      dispatch(updateLocationThunk(updatePayload)).then((response) => {
        if (response.meta.requestStatus === RESPONSE.FULFILLED) {
          successToast("Location Updated", "Location updated successfully");
          setIsOpenModal(false);
          setSelectedLocation({} as ILocation);
          updateLocationList(updatePayload);
        } else {
          const _response = response.payload as ErrorResponse;
          errorToast("Failed to update location", _response?.message);
        }
      });
    }
  };

  const updateLocationList = (updatedLocation: ILocation) => {
    const _locations = locations.data.map((locations) => {
      if (locations.id === updatedLocation.id) {
        return updatedLocation;
      }
      return locations;
    });
    setLocations({ ...locations, data: _locations });
  };

  const ModalHeader = () => {
    return (
      <div className="flex w-full justify-between py-2 ps-4">
        <h3 className="text-lg font-semibold">
          {Object.keys(selectedLocation).length
            ? "Edit Location"
            : "Add Location"}
        </h3>
      </div>
    );
  };

  return (
    <div className="px-6">
      <div className="flex w-full justify-between">
        <BackButton
          backLink="/master-tabs"
          currentPage="Locations"
          previousPage="Masters"
        />
        <div className="grid grid-cols-3 min-w-[68%] justify-items-end gap-3">
          <CustomServiceDropDown
            key="cities"
            onApplyFilter={(newCities) =>
              setLocationPayload({
                ...locationPayload,
                cities: newCities,
                page: 1,
              })
            }
            label="All Cities"
            options={regions?.city}
          />
          <CustomServiceDropDown
            key="states"
            onApplyFilter={(newStates) => {
              setLocationPayload({
                ...locationPayload,
                states: newStates,
                page: 1,
              });
            }}
            label="All States"
            options={regions?.state}
          />
          <SearchInput
            ref={searchInputRef}
            handleSearch={(value) => handleSearch(value)}
            placeholder="Search for Center"
          />
        </div>
      </div>
      <div className="flex w-full py-2 box-content h-[2.5rem] justify-end">
        <Button
          onClick={showModal}
          title="Add new Location"
          label="Add New"
          icon="pi pi-plus"
          className="bg-purple-800 rounded-lg px-2 text-white font-bold"
        />
      </div>
      <div
        className={`bg-white p-1 rounded-lg overflow-auto ${locations?.pagination?.total_pages > 1 ? "h-[calc(100vh-257px)]" : "h-[calc(100vh-200px)]"}`}
      >
        <DataTable
          scrollable
          scrollHeight="flex"
          value={locations?.data || []}
          rowClassName={() => getRowClasses("border-b")}
          emptyMessage={
            <div className="flex w-full justify-center">
              No Locations available
            </div>
          }
        >
          {locationColumns.map((column, index) => (
            <Column
              key={index}
              header={column?.header}
              field={column?.field}
              body={column?.body}
              bodyClassName="font-tertiary"
              headerClassName="border-b font-secondary uppercase text-sm"
            />
          ))}
        </DataTable>
        {!!Object.keys(selectedLocation)?.length && isOpenSidebar && (
          <Sidebar
            className="detailed-view w-[30rem]"
            header={<SidebarHeader />}
            visible={isOpenSidebar}
            position="right"
            onHide={() => {
              setSelectedLocation({} as ILocation);
              setIsOpenSidebar(false);
            }}
          >
            <DetailedLocationView location={selectedLocation} />
          </Sidebar>
        )}
      </div>
      {isOpenModal && (
        <CustomModal
          closeButton={true}
          header={<ModalHeader />}
          handleClose={handleCloseModal}
          showCloseButton={true}
          styleClass="h-[90vh] lg:w-[80vw] w-[100vw]"
        >
          <EditLocation
            states={states}
            selectedLocation={selectedLocation}
            onClose={handleCloseModal}
            handleSubmitForm={(value) => handleSubmitForm(value)}
          />
        </CustomModal>
      )}
      {locations?.pagination?.total_pages > 1 && (
        <CustomPaginator
          currentPage={locations?.pagination?.current_page}
          handlePageChange={(value) =>
            setLocationPayload({ ...locationPayload, page: value })
          }
          totalPages={locations?.pagination?.total_pages}
        />
      )}
      <Toast ref={toast} />
    </div>
  );
};

const DetailedLocationView = ({ location }: { location: ILocation }) => {
  const locationsFields = [
    {
      header: "Id",
      value: location?.id || "-",
    },
    {
      header: "Service Center Name",
      value: location?.center_name || "-",
      styleClasses: "col-span-2",
    },
    {
      header: "Address Line I",
      value: location?.address_line1 || "-",
      styleClasses: "col-span-2",
    },
    {
      header: "Address Line II",
      value: location?.address_line2 || "-",
      styleClasses: "col-span-2",
    },
    {
      header: "City",
      value: location?.city || "-",
    },
    {
      header: "Zip Code",
      value: location?.zip_code || "-",
    },
    {
      header: "State",
      value: location?.state || "-",
    },

    {
      header: "Country",
      value: location?.country || "-",
    },
    {
      header: "Status",
      value: location?.status || "-",
    },
    {
      header: "Opening Time",
      value: location?.opening_time || "-",
    },
    {
      header: "Closing Time",
      value: location?.closing_time || "-",
    },

    {
      header: "Contact person",
      value: location?.contact_person || "-",
      styleClasses: "col-span-2",
    },
    {
      header: "Phone Number",
      value: "+1-" + location?.contact_phone || "-",
    },
    {
      header: "Email",
      value: location?.contact_email || "-",
      styleClasses: "col-span-2",
    },
    {
      header: "Working Days",
      value: location.working_days?.length
        ? location?.working_days.join(", ")
        : "-",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-3 grid-cols-1">
      {locationsFields.map((field, index) => (
        <FieldDetails
          key={index}
          label={field.header}
          value={field.value}
          styleClasses={field.styleClasses}
        />
      ))}
    </div>
  );
};

export const FieldDetails = ({
  label,
  value,
  styleClasses,
}: {
  value: string;
  label: string;
  styleClasses?: string;
}) => {
  return (
    <div className={`border-b border-gray-100 ${styleClasses}`}>
      <div className="font-secondary text-sm text-[#283956] opacity-65 py-2 max-w-[100%] text-ellipsis overflow-hidden">
        {label ? label : "-"}
      </div>
      <div
        title={value}
        className="font-primary pb-2 text-[#283956] truncate max-w-[90%]"
      >
        {value ? value : "-"}
      </div>
    </div>
  );
};

export default LocationList;
