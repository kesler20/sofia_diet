import { useState } from "react";
import "../../../node_modules/react-grid-layout/css/styles.css";
import "../../../node_modules/react-grid-layout/css/styles.css";
import GridLayout from "react-grid-layout";
import PlotComponent from "./PlotComponent";

let x = Array.from({ length: 20 }, () => Math.random() * (6 - 3) + 3);
let y = Array.from({ length: 20 }, () => Math.random() * (6 - 3) + 3);

/**
 * The Dashboard container is used to manipulate the data within the Dashboard page
 *
 * State:
 * - dataGrid - this is an object containing {x,y,w,h} used by (RGL) to set the grid dimensions and positions
 * this has to be passed to the GridLayout child component
 * - plotKeys - this is an array of integers which is used to create unique keys and plot ids for plotly
 * - mode - the dashboard can be in one of two modes ['edit','view']
 */
export default function DashboardBuilderPage() {
  const [dataGrid, setDataGrid] = useState([
    { x: 0, y: 0, w: 5, h: 10 },
    { x: 0, y: 0, w: 5, h: 10 },
  ]);
  const [plotKeys, setPlotKeys] = useState([0]);
  const [mode, setMode] = useState("edit");
  const [dashboardStructure, setDashboardStructure] = useState([
    {
      data: { x, y },
      layout: { yAxis: "", xAxis: "", title: "" },
      plotType: "scatter",
    },
    { tools: "filter" },
  ]);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100vh",
        }}
      >
        <GridLayout
          className="layout"
          cols={24}
          rowHeight={30}
          width={2500}
          onLayoutChange={(layout) => setDataGrid(layout)}
          isDraggable={mode === "edit" ? true : false}
        >
          {plotKeys.map((plotKey) => {
            return (
              <PlotComponent
                key={plotKey}
                plotID={plotKey}
                data={dashboardStructure[plotKey].data}
                layout={dashboardStructure[plotKey].layout}
                data-grid={dataGrid[plotKey]}
                viewMode={mode}
              />
            );
          })}
        </GridLayout>
      </div>
    </div>
  );
}
