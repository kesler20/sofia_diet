import * as ReactDOM from "react-dom/client";
import { ReactFlowContextProvider } from "./contexts/ReactFlowContextProvider";
import App from "./App";
import { StyleContextProvider } from "./contexts/StyleContextProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ReactFlowContextProvider>
    <StyleContextProvider>
      <App />
    </StyleContextProvider>
  </ReactFlowContextProvider>
);
