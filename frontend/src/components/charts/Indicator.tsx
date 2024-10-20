import { useEffect, useState } from "react";
import PlotBuilder from "../../models/PlotBuilder";
import { DataPointType } from "../../../../lib/src/types";

export default function IndicatorPlotComponent(props: {
  name: string;
  dataSet: DataPointType[];
  reference?: boolean;
  size?: { width: number; height: number };
}) {
  const [currentReference, setCurrentReference] = useState(
    props.dataSet.slice(-1)[0].value
  );

  useEffect(() => {
    if (props.dataSet.length > 10) {
      const average =
        props.dataSet
          .map((d) => d.value)
          .slice(-10)
          .reduce((a, b) => a + b, 0) / 10;
      setCurrentReference(average);
    }
  }, [props.dataSet]);

  useEffect(() => {
    const indicator = new PlotBuilder("indicators" + props.name);
    indicator.addIndicators(
      props.dataSet.slice(-1)[0].value,
      props.reference ? currentReference : undefined,
      props.name,
      props.size
        ? props.size
        : {
            width: 250,
            height: 200,
          }
    );
    indicator.config.displayModeBar = false;
    indicator.addBackgroundColor("#fafafa");
    indicator.constructInitialPlot();
  }, [props.dataSet]);

  return (
    <div
      id={"indicators" + props.name}
      className="flex flex-col items-center justify-center w-full p-4 shadow-lg bg-[#fafafa] mb-8"
    >
      <div className="flex-col items-center justify-center hidden md:flex">
        <h1 className="text-2xl">Time</h1>
        <h1 className="text-[2rem] font-semibold">
          {new Date().getHours()} : {new Date().getMinutes()} :{" "}
          {new Date().getSeconds()}
        </h1>
      </div>
    </div>
  );
}
