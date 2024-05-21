import { Image } from "primereact/image";
import CustomModal from "../customModal/CustomModal";
import "./ReportsImage.css";

const ReportImage = ({
  file,
  closeModal,
}: {
  file: File;
  closeModal: () => void;
}) => {
  const imageUrl = URL.createObjectURL(file);

  const downloadDocument = () => {
    if (file) {
      const downloadUrl = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    }
  };
  return (
    // <div className="relative">
    <CustomModal
      styleClass=""
      handleClose={() => {
        closeModal();
      }}
    >
      <>
        <Image src={imageUrl} zoomSrc={imageUrl} alt={file.name} preview />
        <div className="icon-wrapper">
          <div className="download-icon" onClick={downloadDocument}>
            <i className="pi pi-download" title="Download File" />
          </div>
          <div className="close-icon" onClick={closeModal}>
            <i className="pi pi-times" title="Close Image" />
          </div>
        </div>
      </>
    </CustomModal>
    // </div>
  );
};
export default ReportImage;
