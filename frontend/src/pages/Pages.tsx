import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { SiPlotly } from "react-icons/si";
import { RiNodeTree } from "react-icons/ri";
import { AiOutlineMonitor } from "react-icons/ai";
import MonitoringPage from "./monitoring/MonitoringPage";
import SingleStreamPage from "./monitoring/SingleStreamPage";
import { MdDashboardCustomize } from "react-icons/md";
import DataStreamDesignerPage from "./data_stream_designer/DataStreamDesignerPage";
import DashboardBuilderPage from "./dashboard_builder/DashboardBuilderPage";
import PlotBuilderPage from "./plot_builder/PlotBuilderPage";
import SelectCanvasModal from "./data_stream_designer/containers/SelectCanvasContainer";

type PageCategory = "home page" | "tools" | "feedback";

export type PageMetaData = {
  name: string;
  pageIcon: React.ReactNode;
  link: string;
  pageComponent: React.ReactNode;
  category: PageCategory;
};

/**
 * a list containing the metadata of the pages, including { name, pageIcon and link, pageComponent }
 */
export const pages: PageMetaData[] = [
  // {
  //   name: "Dashboard",
  //   pageIcon: <MdDashboardCustomize size={"20"} />,
  //   link: "/",
  //   pageComponent: <DashboardBuilderPage />,
  //   category: "home page",
  // },
  // {
  //   name: "Monitoring",
  //   pageIcon: <AiOutlineMonitor size={"20"} />,
  //   link: "/uns",
  //   pageComponent: <MonitoringPage />,
  //   category: "home page",
  // },
  {
    name: "Application Builder",
    pageIcon: <AiOutlineMonitor size={"20"} />,
    link: "/app",
    pageComponent: <SelectCanvasModal />,
    category: "tools",
  },
  {
    name: "Data Stream Designer",
    pageIcon: <RiNodeTree size={"20"} />,
    link: "/",
    pageComponent: <DataStreamDesignerPage />,
    category: "tools",
  },
  // {
  //   name: "Plot Builder",
  //   pageIcon: <SiPlotly  />,
  //   link: "/plot-builder",
  //   pageComponent: <PlotBuilderPage />,
  //   category: "tools",
  // },
  // {
  //   name: "Data Page",
  //   pageIcon: <SiPlotly  />,
  //   link: "/plot-builder",
  //   pageComponent: <PlotBuilderPage />,
  //   category: "tools",
  // },
  // {
  //   name: "Account Page",
  //   pageIcon: <SiPlotly  />,
  //   link: "/plot-builder",
  //   pageComponent: <PlotBuilderPage />,
  //   category: "tools",
  // },
];

export default function Pages() {
  return (
    <Routes>
      {pages.map((pageMetaData, index) => {
        return (
          <Route
            key={index}
            path={pageMetaData.link}
            element={pageMetaData.pageComponent}
          />
        );
      })}
      <Route path="/stream/:sensorTopic" element={<SingleStreamPage />} />
    </Routes>
  );
}
