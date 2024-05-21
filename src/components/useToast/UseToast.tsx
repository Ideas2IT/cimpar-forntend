import { useRef } from "react";
import { Toast } from "primereact/toast";
import { ReactNode } from "@tanstack/react-router";
import bluetick from "../../assets/icons/bluetick.svg";
import "./UseToast.css";
import ErrorIcon from "../../assets/icons/errorIcon.svg?react";

const useToast = () => {
  const toast = useRef<Toast>(null);
  const successToast = (title: string, message: string) => {
    const customContentSuccess: ReactNode = (
      <div className="w-full p-3">
        <div className="flex flex-row justify-start w-full">
          <img src={bluetick} />
          <label className="color-success font-primary px-4">{title}</label>
        </div>
        <div className="text-start ps-[2.3rem] w-full text-sm py-2 text-gray-500">
          {message}
        </div>
      </div>
    );
    toast?.current?.show({
      severity: "error",
      summary: "error",
      life: 2000,
      content: customContentSuccess,
    });
  };

  const errorToast = (title: string, message: string) => {
    const customContentError: ReactNode = (
      <div className="w-full p-3">
        <div className="flex flex-row justify-start items-center w-full ">
          <ErrorIcon />
          <label className="text-red-500 font-primary px-4">{title}</label>
        </div>
        <div className="text-start ps-[2.3rem] w-full text-sm py-2 text-gray-500">
          {message}
        </div>
      </div>
    );
    toast?.current?.show({
      severity: "error",
      summary: "error",
      life: 2000,
      content: customContentError,
    });
  };
  return { successToast, errorToast, toast };
};

export default useToast;
