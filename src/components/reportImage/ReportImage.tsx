import { Image } from "primereact/image";
import CustomModal from "../customModal/CustomModal";
import "./ReportsImage.css";
const ReportImage = ({
  closeModal,
  image_url,
}: {
  closeModal: () => void;
  image_url?: string;
}) => {
  const imageUrl = image_url ?? '';
  const downloadDocument = () => {
    if (image_url) {
      const downloadUrl = image_url;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    }
  };

  return (
    <CustomModal
      styleClass=""
      handleClose={() => {
        closeModal();
      }}
      contentStyle="pb-0"
    >
      <>
        <Image
          indicatorIcon="none"
          src={imageUrl}
          zoomSrc={imageUrl}
          alt={"document"}
        />
        <div className="icon-wrapper">
          <button type="button" className="download-icon outline-none" onClick={downloadDocument}>
            <i className="pi pi-download" title="Download File" />
          </button>
          <button type="button" className="close-icon outline-none" onClick={closeModal}>
            <i className="pi pi-times" title="Close Image" />
          </button>
        </div>
      </>
    </CustomModal>
  );
};
export default ReportImage;
