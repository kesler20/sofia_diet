import { useEffect, useState } from "react";
import LineChartPlotComponent from "../../../components/charts/LineChart";
import IndicatorPlotComponent from "../../../components/charts/Indicator";
import { MdOutlineCloseFullscreen, MdOutlineOpenInFull } from "react-icons/md";
import { CanvasType, SimulationResultsType } from "../../../../../lib/src/types";
import { useStateContext } from "../../../contexts/ReactFlowContextProvider";
import AirbnbSliderComponent from "../../../components/slider/AirbnbSlizer";
import LoadingSpinner from "../../../components/animated_components/LoadingSpinner";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";

type Panel = "real time plot" | "indicator";

export default function SimulationResults(props: {
  open: boolean;
  onClose: any;
  simulationResults: SimulationResultsType;
}) {
  const [open, setOpen] = useState(props.open);
  const [panel, setPanel] = useState<Panel>("real time plot");
  const [simulationResultsAreEmpty, setSimulationResultsAreEmpty] = useState(false);
  const [maxWindowSize, setMaxWindowSize] = useState(50);
  const [hideSettings, setHideSettings] = useState(true);

  const { canvas, setCanvas } = useStateContext();

  useEffect(() => {
    const simulationResultsKeys = Object.keys(props.simulationResults);
    if (simulationResultsKeys.length === 0) {
      setSimulationResultsAreEmpty(true);
    } else {
      setSimulationResultsAreEmpty(false);
    }
    simulationResultsKeys.forEach((key) => {
      Object.keys(props.simulationResults[key]).forEach(
        (simulationResultOutputKey) => {
          if (props.simulationResults[key][simulationResultOutputKey].length === 0) {
            setSimulationResultsAreEmpty(true);
          }
        }
      );
    });
  }, [props.simulationResults]);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const handleCloseSimulationResults = () => {
    props.onClose();
    setOpen((prev) => !prev);
  };

  const renderPanel = (panel: "real time plot" | "indicator") => {
    switch (panel) {
      case "real time plot":
        return Object.keys(props.simulationResults).map((outputName, index) => {
          return (
            <LineChartPlotComponent
              key={index}
              dataSet={props.simulationResults[outputName]}
              maxWindowSize={maxWindowSize}
            />
          );
        });
      case "indicator":
        return (
          <>
            {Object.keys(props.simulationResults).map((outputName, index) => {
              const simulationResultName = Object.keys(
                props.simulationResults[outputName]
              )[0];
              return (
                <IndicatorPlotComponent
                  key={index}
                  name={simulationResultName}
                  dataSet={props.simulationResults[outputName][simulationResultName]}
                />
              );
            })}
          </>
        );
      default:
        return Object.keys(props.simulationResults).map((outputName, index) => {
          return (
            <LineChartPlotComponent
              key={index}
              dataSet={props.simulationResults[outputName]}
              maxWindowSize={maxWindowSize}
            />
          );
        });
    }
  };

  return (
    <>
      {/* The simulation results top bar */}
      <div
        className={`w-[40%] max-w-[650px] mb-8 min-h-[70px] absolute top-0 right-0 bg-[rgb(250,252,255)] border-gray-200 border-0.1 shadow-md z-50
      flex flex-col items-center justify-evenly`}
      >
        {/* The plot and indicator toggle */}
        <div className="flex items-center justify-center m-2">
          <span className="inline-flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm">
            <button
              className="inline-block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 focus:relative"
              style={{
                backgroundColor:
                  panel === "real time plot" ? "rgb(243 244 246)" : "white",
              }}
              onClick={() => setPanel("real time plot")}
            >
              Line Plot
            </button>
            <button
              className="inline-block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 focus:relative"
              style={{
                backgroundColor:
                  panel === "indicator" ? "rgb(243 244 246)" : "white",
              }}
              onClick={() => setPanel("indicator")}
            >
              Indicator
            </button>
            <button
              className="inline-block px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 focus:relative"
              onClick={handleCloseSimulationResults}
            >
              {open ? <MdOutlineOpenInFull /> : <MdOutlineCloseFullscreen />}
            </button>
          </span>

          {hideSettings ? (
            <div
              className={`w-[40px] h-[40px] rounded-full ml-6
      flex items-center justify-center hover:cursor-pointer bg-fourth-color bg-[rgb(250,252,255)] border-0.1 border-gray-400
      `}
              onClick={() => setHideSettings((prevSetting) => !prevSetting)}
            >
              <AiOutlineArrowDown className="text-gray-800 rotate-arrow" size={20} />
            </div>
          ) : (
            <div
              className={`w-[40px] h-[40px] rounded-full ml-6
      flex items-center justify-center hover:cursor-pointer bg-fourth-color bg-[rgb(250,252,255)] border-0.1 border-gray-400
      `}
              onClick={() => setHideSettings((prevSetting) => !prevSetting)}
            >
              <AiOutlineArrowUp className="text-gray-800 rotate-arrow" size={20} />
            </div>
          )}
        </div>

        <div
          className={`${
            hideSettings
              ? "hidden"
              : "flex flex-col items-center justify-center m-2 w-full mr-12"
          }`}
        >
          <div className="w-1/2 m-2">
            <p className="text-sm font-medium text-gray-500">
              Number of Values to Display
            </p>
            <div className="ml-2">
              <AirbnbSliderComponent
                minValue={Math.round(canvas.simulationEnd - canvas.simulationStart)}
                maxValue={1000}
                step={10}
                defaultValue={Math.round(
                  canvas.simulationEnd - canvas.simulationStart
                )}
                onChange={(value) => setMaxWindowSize(value)}
              />
            </div>
          </div>
          <div className="w-1/2 m-2">
            <p className="text-sm font-medium text-gray-500">
              Total Number of Iterations
            </p>
            <div className="ml-2">
              <AirbnbSliderComponent
                maxValue={100_000}
                minValue={10}
                defaultValue={canvas.numberOfIterations}
                step={100}
                onChange={(value) => {
                  setCanvas((prevCanvas: CanvasType) => ({
                    ...prevCanvas,
                    numberOfIterations: value as number,
                  }));
                }}
              />
            </div>
          </div>
          <div className="w-1/2 m-2">
            <p className="text-sm font-medium text-gray-500">
              Number of Iterations per Seconds
            </p>
            <div className="ml-2">
              <AirbnbSliderComponent
                maxValue={10}
                minValue={0.25}
                defaultValue={canvas.numberOfIterationsPerSecond}
                step={0.25}
                onChange={(value) => {
                  setCanvas((prevCanvas: CanvasType) => ({
                    ...prevCanvas,
                    numberOfIterationsPerSecond: value as number,
                  }));
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* The simulation results dropdown panel */}
      <div
        className={`
      w-[39%] max-w-[640px] absolute top-0 right-0
        bg-[rgb(248,250,253)] border-gray-200 border-0.1 shadow-md
      flex flex-col items-center justify-evenly overflow-y-scroll pt-24
      transition-all ease-in-out duration-700
      `}
        style={{
          height: open ? "100vh" : "0px",
          paddingTop: open ? (hideSettings ? "6rem" : "310px") : "0px",
        }}
      >
        {simulationResultsAreEmpty ? (
          <LoadingSpinner size={100} />
        ) : (
          open && <>{renderPanel(panel)}</>
        )}
      </div>
    </>
  );
}
