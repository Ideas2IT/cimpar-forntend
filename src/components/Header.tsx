import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { useRef, useState } from "react";
import logoutImage from "../assets/icons/logout.svg";
const Header = () => {
  
  const loggedInUser = {
    name: "Bharani Balamurgan",
    email: "bharaniu@ideas2it.com",
    id: 1,
  };
  const op = useRef<OverlayPanel>(null);
  const [toggleButton, setToggleButton] = useState(false);
  return (
    <div className="flex justify-between items-center mb-7 mx-6">
      <p className="font-bold text-2xl text-gray-700">Health Records</p>
      <Button
        label={loggedInUser.email}
        className="py-2 px-3 rounded-full border border-gray-300 shadow-none"
        severity="info"
        onClick={(event) => {
          op?.current?.toggle(event);
          setToggleButton(true);
        }}
        text
        raised
        outlined={false}
      >
        {toggleButton ? (
          <i className="px-1 pi pi-sort-up-fill px-3" />
        ) : (
          <i className="px-1 pi pi-sort-down-fill px-3" />
        )}
      </Button>
      <OverlayPanel
        unstyled
        className="bg-white py-2 shadow-md"
        onHide={() => setToggleButton(false)}
        ref={op}
      >
        <LogoutPopover />
      </OverlayPanel>
    </div>
  );
};

//TODO: Need to write the password change logic
const handleChangePassword = () => {
  console.log("Hanlde change password");
};

//TODO: Need to write the logic to delete all the credentials from storage
const handleLogout = () => {
  console.log("handle logout");
};

export const LogoutPopover = () => {
  return (
    <ul>
      <li
        className="py-3 cursor-pointer px-8 border-bottom hover:bg-pink-50"
        onClick={() => handleChangePassword()}
      >
        Change password
      </li>
      <li
        className="flex nowrap cursor-pointer px-6 justify-center hover:bg-pink-50"
        onClick={() => handleLogout}
      >
        <img src={logoutImage} className="pe-3 py-3" />
        <Button
          label="Logout"
          className="px-2 my-2 bg-yellow-300"
          severity="warning"
          raised
        />
      </li>
    </ul>
  );
};

export default Header;
