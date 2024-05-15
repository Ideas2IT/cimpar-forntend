import { Dialog } from "primereact/dialog";
import { ReactElement } from "react";
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
        headerStyle={{ height: "1rem" }}
        closable={showCloseButton}
        header={header && header}
        visible={true}
        modal
        className={`${styleClass} rounded-2`}
        draggable={false}
        style={{ borderRadius: "20px" }}
        maskClassName="bg-gray-500 bg-opacity-50"
        contentClassName="pb-1"
        headerClassName="p-2"
        onHide={() => handleClose()}
      >
        {children}
      </Dialog>
    </>
  );
};

interface IModalProps {
  handleClose: () => void;
  handleResponse?: (data: any) => void;
  closeButton?: boolean;
  children: ReactElement;
  styleClass: string;
  header?: ReactElement;
  showCloseButton?: boolean;
}
export default CustomModal;
