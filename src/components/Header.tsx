import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { useContext, useRef, useState } from "react";
import LogoutImage from "../assets/icons/logout.svg?react";
import HeaderContext from "../context/HeaderContext";
import localStorageService from "../services/localStorageService";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store/store";
import CustomModal from "./customModal/CustomModal";
import ChangePassword from "./changePassword/ChangePassword";
import { logoutThunk, signOut } from "../store/slices/loginSlice";
import { selectUserProfile } from "../store/slices/UserSlice";
const Header = () => {
  const { username } = useContext(HeaderContext);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const selectedUserProfile = useSelector(selectUserProfile);

  const op = useRef<OverlayPanel>(null);
  const [toggleButton, setToggleButton] = useState(false);

  const handleChangePassword = () => {
    setIsChangePasswordOpen(true);
  };
  return (
    <div className="flex text-black justify-between items-center mb-6 mx-6">
      <p className="font-bold text-2xl font-primary text-gray-700">
        {username}
      </p>
      <div
        onClick={(event) => {
          op?.current?.toggle(event);
          setToggleButton(true);
        }}
        className="max-w-[20rem] py-2 px-3 rounded-full border border-gray-300 shadow-none justify-between flex items-center"
      >
        <Button
          unstyled
          title={selectedUserProfile.email}
          label={selectedUserProfile.email}
          className=" max-w-[90%] truncate"
          severity="info"
          text
          raised
          outlined={false}
        />

        <i
          className={`px-1 pi px-3 ${toggleButton ? "pi-sort-up-fill" : "pi-sort-down-fill"}`}
        />
      </div>
      <OverlayPanel
        unstyled
        className="bg-white py-2 mt-3 shadow-md rounded-lg"
        onHide={() => setToggleButton(false)}
        ref={op}
      >
        <LogoutPopover handleChangePassword={handleChangePassword} />
      </OverlayPanel>
      {isChangePasswordOpen && (
        <CustomModal
          styleClass="h-[25rem] w-[30rem] rounded-lg"
          handleClose={() => setIsChangePasswordOpen(false)}
        >
          <ChangePassword handleClose={() => setIsChangePasswordOpen(false)} />
        </CustomModal>
      )}
    </div>
  );
};

//TODO: Need to write the password change logic

export const LogoutPopover = ({
  handleChangePassword,
}: {
  handleChangePassword: () => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  //TODO: Need to write the logic to delete all the credentials from storage
  const handleLogout = () => {
    localStorageService.logout();
    location.pathname = "/";
    dispatch(signOut());
    dispatch(logoutThunk());
  };
  return (
    <ul>
      <li
        className="py-3 cursor-pointer px-8 border-bottom hover:bg-[#EEF1F4] hover:text-[#2D6D80]"
        onClick={() => handleChangePassword()}
      >
        Change Password
      </li>
      <li
        className="flex nowrap cursor-pointer px-6 justify-center items-center text-red-500 hover:bg-pink-50 py-3"
        onClick={handleLogout}
      >
        <LogoutImage className="me-3" />
        <span>Logout</span>
      </li>
    </ul>
  );
};

export default Header;
