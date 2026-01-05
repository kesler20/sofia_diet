import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useStoredValue } from "../../customHooks";
import { GiHamburgerMenu } from "react-icons/gi";
import { pages, ValidViews, validViewsValues } from "../../pages/Pages";
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { IoMdLogOut } from "react-icons/io";
import { MenuItem, Select } from "@mui/material";
import { ToastContainer } from "react-toastify";

const Link = styled(NavLink)`
  text-decoration: none;
  outline: none;
  margin-right: 20px;
  color: rgb(104, 104, 104);
`;

export default function NavbarComponent() {
  const { logout, user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const [open, setOpen] = useStoredValue(true, "navbar/state");
  const [currentView, setCurrentView] = useStoredValue<ValidViews>(
    "inbox",
    "currentView"
  );

  React.useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect();
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  return (
    // The first line contains the seperation between the navbar and the links drop down
    <div className="flex flex-col items-center justify-center w-full h-18 pt-4">
      {/* Alert messages */}
      <ToastContainer position="top-right" />
      {/* The second line contains the logo, title and the hamburger menu */}
      <div className="w-full flex items-center justify-evenly">
        <div className="flex gap-4">
          {/* This is the hamburger menu */}
          <div
            className={`
          border-0.1 rounded-xl w-12 h-8
          flex items-center justify-center
          hover:shadow-[1px_1px_1px_10px_rgb(245,255,229)]
          md:border-[0.1px] md:mr-0 md:rounded-[5px] md:flex md:justify-evenly md:flex-col md:items-center
            `}
            onClick={() => setOpen(!open)}
            style={{
              borderColor: "rgb(186, 202, 183)",
            }}
          >
            <GiHamburgerMenu />
          </div>
          <Select
            className="h-8"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={currentView}
            onChange={(event) => setCurrentView(event.target.value as ValidViews)}
          >
            {validViewsValues.map((view, index) => (
              <MenuItem key={index} value={view}>
                {view}
              </MenuItem>
            ))}
          </Select>
        </div>

        {/* This is the title and the logo */}
        <h1 className="text-[30px] font-bold site-title">sofiaPlan</h1>

        {/* This is the user profile */}
        <div className="flex items-center justify-center">
          <p className="hidden md:block text-gray-400 mr-2">Hi {user?.name} ✨</p>
          <button title={"log out"} onClick={() => logout()}>
            <IoMdLogOut className="text-gray-400 cursor-pointer" />
          </button>
        </div>
      </div>

      {/* This is the links drop down */}
      <div className="flex flex-row items-center h-8 justify-evenly w-full">
        {open &&
          pages[currentView].map((pageMetaData, index) => {
            return (
              <Link key={index} to={pageMetaData.link}>
                {pageMetaData.name}
              </Link>
            );
          })}
      </div>
    </div>
  );
}
