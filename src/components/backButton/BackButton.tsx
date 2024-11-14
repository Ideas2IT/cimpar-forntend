import { Button as PrimeButton } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { useNavigate } from "react-router-dom";

const BackButton = ({
  previousPage,
  currentPage,
  backLink,
  showConfirmDialog,
  popupText,
}: {
  previousPage: string | undefined;
  currentPage: string;
  backLink: string;
  showConfirmDialog?: boolean;
  popupText?: string;
}) => {
  const navigate = useNavigate();
  const handleBackLink = () => {
    if (showConfirmDialog) {
      showBackDialog();
    } else {
      navigate(backLink);
    }
  };

  const showBackDialog = () => {
    confirmDialog({
      header: "Confirmation",
      className: "max-w-[50vw]",
      message: popupText ? popupText : "Are you sure you want to go back?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      rejectClassName: "hidden",
      acceptClassName: "py-2 px-5 bg-purple-900 text-white rounded-lg",
      acceptLabel: "Continue",
      accept,
    });
  };

  const accept = () => {
    navigate(backLink);
  };

  return (
    <div className="flex justify-between items-center lg:flex-row md:flex-col sm:flex-col">
      <div
        onClick={handleBackLink}
        className="flex align-items-center item-center"
      >
        <PrimeButton
          type="button"
          className="p-2 bg-white shadow-none rounded-md"
          text
          raised
        >
          <i className="pi pi-arrow-left color-primary" />
        </PrimeButton>
        <label className="text-blue-200 items-center flex font-primary lg:text-xl md:text-md sm:text-sm cursor-pointer capitalize px-1">
          {previousPage || "back"}
        </label>
      </div>
      <label className="color-primary font-primary md:block px-1 lg:text-xl md:text-md sm:text-sm capitalize">
        /{currentPage || ""}
      </label>
    </div>
  );
};
export default BackButton;
