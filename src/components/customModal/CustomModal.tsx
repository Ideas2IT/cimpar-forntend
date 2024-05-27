import { Dialog } from "primereact/dialog";
import { ReactElement } from "react";
import "./CustomModal.css";

const CustomModal = ({
  children,
  handleClose,
  styleClass,
  header,
  showCloseButton,
}: IModalProps) => {
  return (
    <>
      <Dialog
        dismissableMask={true}
        headerStyle={{ borderRadius: "16px 16px 0 0" }}
        closable={showCloseButton}
        header={header && header}
        visible={true}
        modal
        className={`!rounded-xl ${styleClass}`}
        draggable={false}
        style={{ borderRadius: "20px" }}
        maskClassName="bg-gray-500 bg-opacity-50"
        contentClassName="pb-1"
        headerClassName={`p-2 ${header ? "border-b" : "border-none"}`}
        onHide={() => handleClose()}
      >
        {children}
      </Dialog>
    </>
  );
};

interface IModalProps {
  handleClose: () => void;
  handleResponse?: (data: boolean) => void;
  closeButton?: boolean;
  children: ReactElement;
  styleClass: string;
  header?: ReactElement;
  showCloseButton?: boolean;
}
export default CustomModal;
