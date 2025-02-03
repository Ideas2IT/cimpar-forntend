import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import BackButton from "../components/backButton/BackButton";
import { IMasterUrl } from "../interfaces/masterTable";
import { getUrlByCategoryThunk } from "../store/slices/masterTableSlice";
import { AppDispatch } from "../store/store";
import { PATH_NAME, RESPONSE, URL_CATEGORIES } from "../utils/AppConstants";
import CustomModal from "../components/customModal/CustomModal";

const Transportation = () => {
  const [transportationUrl, setTransportationUrl] = useState({} as IMasterUrl);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getUrlByCategoryThunk(URL_CATEGORIES.TRANSPORTATION)).then(
      (response) => {
        if (response.meta.requestStatus === RESPONSE.FULFILLED) {
          const _response = response?.payload.data as IMasterUrl[];
          if (_response?.length > 0) {
            setTransportationUrl(_response[0]);
          } else {
            setTransportationUrl({} as IMasterUrl);
          }
        }
      }
    );
  }, []);
  return (
    <>
      <div className="flex mb-2 w-full justify-start">
        <BackButton
          backLink={PATH_NAME.HOME}
          currentPage="Transportation"
          previousPage="Home"
        />
      </div>
      <div className="w-full bg-white h-full py-4 px-6 rounded-lg">
        {Object.keys(transportationUrl).length ? (
          <UrlTile link={transportationUrl} />
        ) : (
          <div className="text-center bg-gray-300">
            Transportation link is not available
          </div>
        )}
      </div>
    </>
  );
};

export const UrlTile = ({ link }: { link: IMasterUrl }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  return (
    <>
      <button type="button"
        onClick={() => setIsOpenModal(true)}
        title={link.description}
        className="flex w-full items-center gap-2 cursor-pointer"
      >
        <div className="flex group items-center text-purple-900 gap-2 bg-purple-100 h-[8rem] w-[15rem] rounded-lg p-4">
          <i className="pi pi-external-link" />
          <div className="text-xl font-primary text-purple-900 group-hover:underline">
            {link.name || 'Click Here to book your servie'}
          </div>
        </div>
      </button>
      {isOpenModal && (
        <CustomModal
          maximize={true}
          showCloseButton={true}
          handleClose={() => setIsOpenModal(false)}
          styleClass="lg:w-[90vw] w-full h-full"
        >
          <iframe className="w-full h-full" title={link.description} src={link.url} />
        </CustomModal>
      )}
    </>
  );
};
export default Transportation;
