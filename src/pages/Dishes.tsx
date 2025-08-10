import React from "react";
import MainButton from "../components/button/MainButton";
import { DishAttributeType, DishType } from "../types";
import DishesTable from "../components/table/FoodTable";
import {
  createResourceInCache,
  readResourceInCache,
  removeResourceInCache,
} from "../customHooks";

export default function Meal() {
  const [foodsFromDb, setFoodsFromDb] = React.useState<DishType[]>([]);

  // this state is required to allow the user to edit multiple foods at once and then update
  const [foodsChanged, setFoodsChanged] = React.useState<DishType[]>([]);

  React.useEffect(() => {
    const getFoods = () => {
      const foods = readResourceInCache<DishType>("Dish");

      if (!foods) {
        return;
      }
      setFoodsFromDb(foods);
    };

    getFoods();
  }, []);

  const deleteFood = (foodName: string) => {
    try {
      removeResourceInCache<DishType>("Dish", "name", foodName);
      setFoodsFromDb((prev: DishType[]) =>
        prev.filter((f: DishType) => f.name !== foodName)
      );
      alert("Food deleted successfully");
    } catch (error) {
      alert("Failed to delete food");
      console.error(error);
    }
  };

  const editFood = (
    foodName: string,
    foodAttribute: DishAttributeType,
    value: number | string
  ) => {
    const foodToUpdate = foodsFromDb.find((f: DishType) => f.name === foodName);
    if (!foodToUpdate) {
      return;
    }

    (foodToUpdate[foodAttribute as keyof DishType] as typeof value) = value;

    setFoodsFromDb(
      foodsFromDb.map((food: DishType) => {
        if (food.name === foodName) {
          return foodToUpdate;
        }
        return food;
      })
    );

    setFoodsChanged([...foodsChanged, foodToUpdate]);
  };

  const saveChanges = () => {
    foodsChanged.forEach((food: DishType) => {
      createResourceInCache<DishType>("Dish", food, "name");
    });
  };

  return (
    <div className="w-full flex flex-col justify-start items-center h-screen">
      <div className="min-w-[300px] w-[60%] max-w-[1100px] overflow-x-scroll">
        <DishesTable
          dishes={foodsFromDb}
          onDeleteFood={deleteFood}
          onChangeFood={editFood}
        />
      </div>
      <div className="w-full flex items-center justify-center">
        <MainButton text={"Save Changes"} onSubmit={saveChanges} />
      </div>
    </div>
  );
}
