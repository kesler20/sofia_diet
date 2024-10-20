import * as React from "react";
import PlotBuilder from "../../models/PlotBuilder";
import AddData from "./components/AddDataComponent";
import ChangePlot from "./components/ChangePlotComponent";
import FilterDataComponent from "./components/FilterDataComponent";
import { useMachine } from "@xstate/react";
import plotBuilderStateMachine, {
  Context,
  Events,
  States,
} from "./plotBuilderStateMachine";
import { StateMachine } from "xstate";
import UploadAFileCardComponent from "./components/UploadAFileCardComponent";

export default function PlotBuilderPage(props: {}) {
  const [plot, setPlot] = React.useState(new PlotBuilder("plotDiv"));
  const [state, send] = useMachine<
    StateMachine<Context, Events, any, any, any, any, any, States, any, any, any>
  >(plotBuilderStateMachine);

  React.useEffect(() => {
    console.log(state.value);
  }, [state]);

  React.useEffect(() => {
    plot.addDarkMode().constructInitialPlot();
  }, [plot]);

  return (
    <div className="w-full h-screen flex flex-col p-6 pt-0">
      {state.matches("Upload a file") && (
        <div className="flex justify-center items-center w-full h-full">
          <UploadAFileCardComponent
            onClick={() => {
              send({ type: "upload file clicked" });
            }}
          />
        </div>
      )}
      {state.matches("No files & No Axis selected") && (
        <>
          <AddData
            onUploadAFileClicked={() => {
              send({ type: "upload file clicked" });
            }}
          />
          <div className="w-full h-[600px]" id="plotDiv"></div>
          <ChangePlot />
          <FilterDataComponent />
        </>
      )}
    </div>
  );
}
