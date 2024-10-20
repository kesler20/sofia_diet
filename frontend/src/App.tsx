import React from "react";
import Sidebar from "./components/sidebar/Sidebar";
import NavbarComponent from "./components/navbar/NavbarComponent";
import Pages from "./pages/Pages";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { createResourceInCache, getResourceFromCache } from "./customHooks";

export default function App() {
  // when the page loads initially check that the version of the app is correct
  React.useEffect(() => {
    const version = getResourceFromCache("version");
    const currentVersion = "0.3.2.2";
    if (!version || version !== currentVersion) {
      localStorage.clear();
      createResourceInCache("version", currentVersion);
    }
  }, []);

  return (
    <div className="bg-[rgb(29,38,68)] w-full h-screen overflow-hidden">
      <BrowserRouter>
        <NavbarComponent />
        <div className="flex w-full">
          <Sidebar />
          <div className={`w-full flex-grow overflow-x-hidden`}>
            <Pages />
          </div>
        </div>
      </BrowserRouter>
      <ToastContainer position="top-right" />
    </div>
  );
}
