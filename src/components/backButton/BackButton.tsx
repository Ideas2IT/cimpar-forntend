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
      message: popupText ?? "Are you sure you want to go back?",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      rejectClassName: "hidden",
      acceptClassName: "py-2 px-5 bg-purple-900 text-white rounded-lg",
      acceptLabel: "Continue",
      draggable: false,
      accept,
    });
  };

  const accept = () => {
    navigate(backLink);
  };

  return (
    <div className="flex justify-between items-center lg:flex-row whitespace-nowrap overflow-hidden text-ellipsis">
      <button type="button"
        onClick={handleBackLink}
        className="flex align-items-center items-center"
      >
        <span
          className="px-2 py-1 bg-white shadow-none rounded-md align-middle"
        >
          <i className="pi pi-arrow-left align-middle color-primary" />
        </span>
        <label className="text-blue-200 items-center flex font-primary lg:text-xl md:text-md sm:text-sm cursor-pointer capitalize ps-1">
          {previousPage ?? "back"}
        </label>
      </button>
      <label
        title={currentPage}
        className="lg:show hidden color-primary font-primary md:block lg:text-xl md:text-md sm:text-sm capitalize"
      >
        /{currentPage || ""}
      </label>
    </div>
  );
};
export default BackButton;
