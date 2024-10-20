import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Meal from "./Meal";
import Food from "./Food";
import Diet from "./Diet";

export type PageMetaData = {
  name: string;
  link: string;
  pageComponent: React.ReactNode;
};

/**
 * a list containing the metadata of the pages, including { name, pageIcon and link, pageComponent }
 */
export const pages: PageMetaData[] = [
  {
    name: "Diets",
    link: "/diet",
    pageComponent: <Diet />,
  },
  {
    name: "Meals",
    link: "/meal",
    pageComponent: <Meal />,
  },
  {
    name: "Foods",
    link: "/",
    pageComponent: <Food />,
  },
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
    </Routes>
  );
}
