import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { TabPanel, TabView } from "primereact/tabview";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DollarSign from "../../assets/icons/dollar-sign.svg?react";
import { IGetPatientServicesPayload, ILabService, ILabTestService } from "../../interfaces/common";
import { getLabTestsForPatientThunk, selectServiceCategories } from "../../store/slices/masterTableSlice";
import { AppDispatch } from "../../store/store";
import { LAB_SERVICES, RESPONSE, SERVICE_MENU, TABLE, } from "../../utils/AppConstants";
import CustomModal from "../customModal/CustomModal"

interface IPricingTableProps {
  tableHeader: string;
  selectedTab?: string;
  values?: ILabService[];
}

const PricingModal = (props: IPricingTableProps) => {
  const { tableHeader, selectedTab } = props;

  const dispatch = useDispatch<AppDispatch>();

  const [services, setServices] = useState<ILabService[]>([]);
  const serviceCategories = useSelector(selectServiceCategories);
  const [isOpenPricingModal, setIsOpenPricingModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(getIndex() ?? 0);

  useEffect(() => {
    isOpenPricingModal && handleTabChange(getIndex() ?? 0);
  }, [isOpenPricingModal]);

  function getIndex() {
    switch (selectedTab) {
      case SERVICE_MENU.LABORATORY:
        return serviceCategories.indexOf(LAB_SERVICES.CLINICAL_LABORATORY);
      case SERVICE_MENU.HOME_CARE:
        return serviceCategories.indexOf(LAB_SERVICES.HOME_CARE);
      case SERVICE_MENU.IMAGING:
        return serviceCategories.indexOf(LAB_SERVICES.IMAGING);
    }
  }

  const getServiceType = (tabIndex: number | undefined) => {
    if (tabIndex) {
      return serviceCategories[tabIndex];
    } else return serviceCategories[0];
  };

  const handleTabChange = (tabIndex: number) => {
    setActiveIndex(tabIndex);
    const payload: IGetPatientServicesPayload = {
      tableName: TABLE.LAB_TEST,
      service_type: getServiceType(tabIndex),
      is_active: true,
    };
    isOpenPricingModal &&
      dispatch(getLabTestsForPatientThunk(payload)).then((response) => {
        if (response.meta.requestStatus === RESPONSE.FULFILLED) {
          const payload = response.payload?.data as ILabTestService[];
          if (payload?.length) {
            const testServices: ILabService[] = payload.map((test) => {
              return {
                centerPricing: test.center_price,
                homePricing: test.home_price,
                serviceName: test.display,
                code: test.code,
                id: test.id,
                currency_symbol: test.currency_symbol,
              } as ILabService;
            });
            setServices(testServices);
          } else setServices([]);
        }
      });
  };

  return (
    <>
      <button
        type="button"
        className="text-[16px] flex items-center font-primary text-purple-900 ms-3 cursor-pointer hover:border-b hover:border-purple-900"
        onClick={() => {
          setIsOpenPricingModal(true);
        }}
      >
        <DollarSign className="inline h-[16px] me-2 underline" />

        {tableHeader}
      </button>
      {isOpenPricingModal && (
        <CustomModal
          header={<span className="bg-white ps-4">Test Pricing</span>}
          handleClose={() => setIsOpenPricingModal(false)}
          styleClass="lg:w-[70%] w-[90%] h-[90vh]"
          showCloseButton={true}
        >

          <TabView
            activeIndex={activeIndex}
            onTabChange={(e) => handleTabChange(e.index)}
          >
            {!!serviceCategories?.length &&
              serviceCategories.map((tab) => (
                <TabPanel
                  header={tab}
                  key={tab}
                  className="border-b w-full text-center text-sm"
                  headerClassName="border-b"
                >
                  <PricingTable tableHeader={tab} values={services} />
                </TabPanel>
              ))}
          </TabView>
        </CustomModal>
      )}
    </>
  );
};

const PricingTable = ({ tableHeader, values }: IPricingTableProps) => {
  const columns = [
    {
      header: "Test Name",
      field: "serviceName",
      headerClassName: "uppercase border-b py-0",
      bodyClassName: " max-w-[15rem] text-wrap",
    },
    {
      header: "code",
      field: "code",
      bodyClassName: " max-w-[5rem] break-all",
    },
    {
      header: "service center",
      bodyClassName: " max-w-[5rem]",
      body: (row: ILabService) => (testPricing(row?.currency_symbol ?? '', row.centerPricing ?? '')),
    },
    {
      header: "at home",
      bodyClassName: " max-w-[5rem]",
      body: (row: ILabService) => (
        testPricing(row?.currency_symbol ?? '', row?.homePricing ?? '')
      ),
    },
  ];

  const testPricing = (currencySymbol: string = '$', price: string = '0') => {
    return <>
      {currencySymbol + Number(price)?.toFixed(2) || "-"}
    </>
  }

  return (
    <div className="border border-gray-300 rounded-lg mt-3 h-[95%] overflow-auto">
      <div className="cimpar-background h-10 rounded-t-lg uppercase justify-center w-full flex items-center">
        {tableHeader}
      </div>
      <DataTable
        value={values}
        tableClassName="border-b"
        className="mt-2 font-tertiary"
        emptyMessage={
          <div className="w-full text-center">No Service Available</div>
        }
        selectionMode={undefined}
        scrollable
        scrollHeight="calc(90vh - 210px)"
        loading={!values}
      >
        {columns.map((column) => {
          return (
            <Column
              key={column.header}
              field={column.field}
              header={column.header}
              headerClassName={`
                ${column?.headerClassName
                  ? column.headerClassName
                  : "uppercase border-b"
                } font-secondary`}
              bodyClassName={`border-b text-[16px] ${column?.bodyClassName}`}
              body={column.body}
            />
          );
        })}
      </DataTable>
    </div>
  );
};

export default PricingModal;
