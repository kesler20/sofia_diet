import NavbarComponent from "./components/navbar/NavbarComponent";
import Pages from "./pages/Pages";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { createResourceInCache, getResourceFromCache } from "./customHooks";

export default function App() {

  return (
    <div className="w-full flex justify-center items-center">
      <BrowserRouter>
        <NavbarComponent />
        <div className="flex w-full">
          <div className={`w-full flex-grow overflow-x-hidden`}>
            <Pages />
          </div>
        </div>
      </BrowserRouter>
      <ToastContainer position="top-right" />
    </div>
  );
}
