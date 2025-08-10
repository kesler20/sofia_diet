import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Meal from "./Dishes";
import Dish from "./Dish";
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
    name: "Plan Diet",
    link: "/diet",
    pageComponent: <Diet />,
  },
  {
    name: "Edit Dishes",
    link: "/dishes",
    pageComponent: <Meal />,
  },
  {
    name: "Add Dish",
    link: "/",
    pageComponent: <Dish />,
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
