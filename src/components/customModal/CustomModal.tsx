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
}: IModalProps) => {
  return (
    <>
      <Dialog
        closeIcon={
          <Button
            className="pi pi-times p-2"
            title={closeButtonTitle ? closeButtonTitle : "close"}
          />
        }
        dismissableMask={isDismissable === "no" ? false : true}
        headerStyle={{ borderRadius: "16px 16px 0 0" }}
        closable={showCloseButton}
        header={header && header}
        visible={true}
        modal
        className={`!rounded-xl ${styleClass}`}
        draggable={false}
        style={{ borderRadius: "20px" }}
        maskClassName="bg-gray-500 bg-opacity-50"
        contentClassName={`${contentStyle ? contentStyle : "pb-1 bg-white"}`}
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
  closeButtonTitle?: string;
  isDismissable?: "yes" | "no";
  contentStyle?: string;
}
export default CustomModal;
