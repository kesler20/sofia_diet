import React from "react";
import MealTable from "../components/table/MealTable";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { readResourceInDb } from "../services";
import { MealType } from "@lib/types";

export default function Diet() {
  const [mealsFromDB, setMealsFromDB] = React.useState<MealType[]>([]);

  React.useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await readResourceInDb<MealType[]>("Meal");
        if (response) {
          setMealsFromDB(response);
        }
      } catch (error) {
        alert("Failed to fetch meals");
        console.error(error);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div className="w-full justify-center items-center h-screen">
      <div className="m-10">
        <MealTable
          selectMeal={() => {}}
          meals={mealsFromDB}
          handleDeleteMeal={() => {}}
        />
      </div>
      <div className="w-full flex justify-center items-center">
        <button className="modal__card__btn--create mb-8">
          <p className="mr-2">Get Diet</p>
          <FaArrowUpRightFromSquare size={"13"} />
        </button>
      </div>
    </div>
  );
}
