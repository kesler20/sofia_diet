import NavbarComponent from "./components/navbar/NavbarComponent";
import Pages from "./pages/Pages";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./styles/index.css"

<<<<<<< HEAD

=======
>>>>>>> parent of 78d61c7 (chore: make it better🪴)
export default function App() {
  return (
    <div className="min-h-screen w-full">
      <BrowserRouter>
        <NavbarComponent />
        <Pages />
      </BrowserRouter>
      <ToastContainer position="top-right" />
    </div>
  );
}
