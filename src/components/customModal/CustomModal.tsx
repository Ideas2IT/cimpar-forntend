import { Dialog } from "primereact/dialog";
import { ReactElement } from "react";
import "./CustomModal.css";
import { Button } from "primereact/button";

const CustomModal = ({
  children,
  handleClose,
  styleClass,
  header,
  showCloseButton,
  closeButtonTitle,
  isDismissable,
  contentStyle,
  maximize,
}: IModalProps) => {
  return (

    <Dialog
      closeIcon={
        <Button
          className="pi pi-times p-2"
          title={closeButtonTitle ?? "close"}
        />
      }
      dismissableMask={isDismissable !== "no"}
      headerStyle={{ borderRadius: "16px 16px 0 0" }}
      closable={showCloseButton}
      header={header ?? ''}
      visible={true}
      modal
      className={`!rounded-xl !z-1 ${styleClass}`}
      draggable={false}
      style={{ borderRadius: "20px", zIndex: "999" }}
      maskClassName="bg-gray-500 bg-opacity-50"
      contentClassName={`${contentStyle ?? "pb-1 bg-white"}`}
      headerClassName={`p-2 ${header ? "border-b" : "border-none"}`}
      onHide={() => handleClose()}
      maximizable={maximize || false}
    >
      {children}
    </Dialog>
  );
};

interface IModalProps {
  handleClose: () => void;
  children: ReactElement;
  styleClass: string;
  header?: ReactElement;
  showCloseButton?: boolean;
  closeButtonTitle?: string;
  isDismissable?: "yes" | "no";
  contentStyle?: string;
  maximize?: boolean;
}
export default CustomModal;
