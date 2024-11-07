import { Suspense, useEffect, useState } from "react";
import CustomModal from "../customModal/CustomModal";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  IAllTestspayload,
  ILabService,
  ILabTestService,
} from "../../interfaces/common";
import { TabPanel, TabView } from "primereact/tabview";
import DollarSign from "../../assets/icons/dollar-sign.svg?react";
import {
  LAB_SERVICES,
  PRICING_INDEX,
  RESPONSE,
  TABLE,
} from "../../utils/AppConstants";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { getLabTestsForAdminThunk } from "../../store/slices/masterTableSlice";
interface IPricingTableProps {
  tableHeader: string;
  selectedIndex?: number;
  serviceHeader?: string;
  values?: ILabService[];
}

const PricingModal = (props: IPricingTableProps) => {
  const tabs = [
    {
      header: "Clinical Laboratory",
      key: "clinicalLaboratory",
      serviceHeader: "Test Name",
    },
    {
      header: "X Ray Studies",
      key: "xrayStudies",
      serviceHeader: "X-Ray Study",
    },
    {
      header: "Ultrasound Study",
      key: "ultrasoundStudy",
      serviceHeader: "Ultrasound Study",
    },
    {
      header: "EKG Services",
      key: "ekgServices",
      serviceHeader: "EKG Test",
    },
  ];

  const { tableHeader, selectedIndex } = props;
  const [isOpenPricingModal, setIsOpenPricingModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(
    selectedIndex ? selectedIndex : 0
  );
  const [services, setServices] = useState<ILabService[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    onTabChange(selectedIndex || 0);
  }, []);

  const getServiceType = (tabIndex: number | undefined) => {
    switch (tabIndex) {
      case PRICING_INDEX.CLINICAL_LABORATORY:
        return LAB_SERVICES.CLINICAL_LABORATORY;
      case PRICING_INDEX.XRAY_STUDIES:
        return LAB_SERVICES.XRAY_STUDIES;
      case PRICING_INDEX.ULTRASOUND_STUDIES:
        return LAB_SERVICES.ULTRASOUND_STUDIES;
      case PRICING_INDEX.EKG_SERVICES:
        return LAB_SERVICES.EKG_SERVICES;
      default:
        return LAB_SERVICES.CLINICAL_LABORATORY;
    }
  };

  const onTabChange = (tabIndex: number) => {
    setActiveIndex(tabIndex);
    const load: IAllTestspayload = {
      tableName: TABLE.LAB_TEST,
      page_size: 10,
      service_type: getServiceType(tabIndex),
      page: 1,
      display: "",
      all_records: true,
    };
    dispatch(getLabTestsForAdminThunk(load)).then((response) => {
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
      <span
        className="text-[16px] flex items-center font-primary text-purple-900 ms-3 cursor-pointer hover:border-b hover:border-purple-900"
        onClick={() => setIsOpenPricingModal(true)}
      >
        <DollarSign className="inline h-[16px] me-2 underline" />

        {tableHeader}
      </span>
      {isOpenPricingModal && (
        <CustomModal
          header={<span className="bg-white ps-4">Test Pricing</span>}
          handleClose={() => setIsOpenPricingModal(false)}
          styleClass="lg:w-[70%] w-[90%] h-[90vh]"
          showCloseButton={true}
        >
          <>
            <TabView
              activeIndex={activeIndex}
              onTabChange={(e) => onTabChange(e.index)}
            >
              {tabs.map((tab) => (
                <TabPanel
                  header={tab.header}
                  key={tab.key}
                  className="border-b w-full text-center text-sm"
                  headerClassName="border-b"
                >
                  <PricingTable
                    tableHeader={tab.header}
                    values={services}
                    serviceHeader={tab.serviceHeader}
                  />
                </TabPanel>
              ))}
            </TabView>
          </>
        </CustomModal>
      )}
    </>
  );
};

const PricingTable = ({
  tableHeader,
  values,
  serviceHeader,
}: IPricingTableProps) => {
  const columns = [
    {
      header: serviceHeader,
      field: "serviceName",
      headerClassName: "uppercase border-b py-0",
      bodyClassName: " max-w-[15rem] text-wrap",
    },
    {
      header: "code",
      field: "code",
      bodyClassName: " max-w-[5rem] break-all px-1",
    },
    {
      header: "service center",
      bodyClassName: " max-w-[5rem]",
      body: (row: ILabService) => (
        <> {row?.currency_symbol + row?.centerPricing || "-"}</>
      ),
    },
    {
      header: "at home",
      bodyClassName: " max-w-[5rem]",
      body: (row: ILabService) => (
        <>{row?.currency_symbol + row?.homePricing || "-"}</>
      ),
    },
  ];
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
                ${
                  column?.headerClassName
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
