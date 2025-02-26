import NavbarComponent from "./components/navbar/NavbarComponent";
import Pages from "./pages/Pages";
import { BrowserRouter } from "react-router-dom";
import "./styles/index.css"

export default function App() {
  return (
    <div className="min-h-screen w-full">
      <BrowserRouter>
        <NavbarComponent />
        <Pages />
      </BrowserRouter>
    </div>
  );
}
