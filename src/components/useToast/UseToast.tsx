import { useRef } from "react";
import { Toast } from "primereact/toast";
import { ReactNode } from "@tanstack/react-router";
import bluetick from "../../assets/icons/bluetick.svg";

const useToast = () => {
  const toast = useRef<Toast>(null);
  const successToast = (title: string, message: string) => {
    const customContent: ReactNode = (
      <div className="w-full bg-white p-3">
        <div className="flex flex-row justify-start w-full">
          <img src={bluetick} />
          <label className="text-[#3C9F66] font-primary px-4">{title}</label>
        </div>
        <div className="text-center w-full text-sm py-2 text-gray-500">
          {message}
        </div>
      </div>
    );
    toast?.current?.show({
      severity: "success",
      summary: "Success",
      life: 300000,
      content: customContent,
    });
  };

  const errorToast = (message: string) => {
    toast?.current?.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 3000,
    });
  };
  return { successToast, errorToast, toast };
};

export default useToast;
