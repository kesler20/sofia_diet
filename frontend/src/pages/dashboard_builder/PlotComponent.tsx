import React, { forwardRef, useEffect } from "react";
import PlotBuilder from "../../models/PlotBuilder";

/**
 * This component represents the Plotly graph which is resizable and draggable
 * @see https://github.com/react-grid-layout/react-grid-layout
 *
 * Props:
 *
 * - forwardRef takes a component as an argument and it references it to a DOM Element
 * - this is used to integrate the Plotly graph as a react grid layout grid item child
 * - therefore we need to pass style, className, ref and the other props to the div with the plot ID
 * @see section on custom components from  https://github.com/react-grid-layout/react-grid-layout
 **/
type PlotComponentProps = {
  style?: React.CSSProperties;
  className?: string;
  layout?: any;
  viewMode: string;
  data: any;
  plotID: number;
  children?: React.ReactNode;
};

const PlotComponent = forwardRef<HTMLDivElement, PlotComponentProps>(
  (
    { style, className, layout, viewMode, data, plotID, children, ...props },
    ref
  ) => {
    useEffect(() => {
      const plotBuilder = new PlotBuilder(`plot-${plotID}`);
      plotBuilder
        .addPlotTitle("Test title")
        .addTrace("marker", "sensor")
        .addAxisDimension("x", data.x, "Time", 0)
        .addAxisDimension("y", data.y, "Value", 0)
        .addDarkMode()
        .addBarChart(0)
        .addTrace("marker", "sensor2")
        .addAxisDimension("x", data.x, "Time", 1)
        .addAxisDimension("y", data.y, "Value", 1)
        .addLinePlot(1)
        .addColorToLine("rgb(128,252,254)", 1)
        .removeModeBar()
        .buildPlot();
    }, [plotID]);

    return (
      <div
        style={{ ...style }}
        className={className}
        ref={ref}
        id={`plot-${plotID}`}
        {...props}
      >
        {viewMode === "edit" && children ? (
          <React.Fragment>{children}</React.Fragment>
        ) : (
          <React.Fragment />
        )}
      </div>
    );
  }
);

export default PlotComponent;
