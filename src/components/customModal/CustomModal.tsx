
import { Dialog } from 'primereact/dialog';
import { ReactElement } from 'react';
const CustomModal = ({ children, handleClose, styleClass }: IModalProps) => {
    return <>
        <Dialog visible={true} className={`${styleClass} rounded-2`} contentClassName='pb-1' headerClassName='p-2' onHide={() => handleClose()}>
            {children}
        </Dialog>
    </>
};

interface IModalProps {
    handleClose: () => void;
    handleResponse?: (data: any) => void;
    closeButton?: boolean;
    children: ReactElement;
    styleClass: string;
}
export default CustomModal;