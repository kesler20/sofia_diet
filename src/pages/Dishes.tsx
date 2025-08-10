import React from "react";
import MainButton from "../components/button/MainButton";
import {
  createResourceInDb,
  deleteResourceInDb,
  readResourceInDb,
} from "../services";
import { DishAttributeType, DishType } from "@lib/types";
import DishesTable from "../components/table/FoodTable";

export default function Meal() {
  const [foodsFromDb, setFoodsFromDb] = React.useState<DishType[]>([]);

  // this state is required to allow the user to edit multiple foods at once and then update
  const [foodsChanged, setFoodsChanged] = React.useState<DishType[]>([]);

  React.useEffect(() => {
    const getFoods = async () => {
      const foods = await readResourceInDb<DishType[]>("Dish");

      if (!foods) {
        return;
      }
      setFoodsFromDb(foods);
    };

    getFoods();
  }, []);

  const deleteFood = async (foodName: string) => {
    try {
      const response = await deleteResourceInDb("Food", foodName);
      if (response) {
        setFoodsFromDb(foodsFromDb.filter((f) => f.name !== foodName));
        alert("Food deleted successfully");
      }
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
    const foodToUpdate = foodsFromDb.find((f) => f.name === foodName);
    if (!foodToUpdate) {
      return;
    }

    (foodToUpdate[foodAttribute as keyof DishType] as typeof value) = value;

    setFoodsFromDb(
      foodsFromDb.map((food) => {
        if (food.name === foodName) {
          return foodToUpdate;
        }
        return food;
      })
    );

    setFoodsChanged([...foodsChanged, foodToUpdate]);
  };

  const saveChanges = async () => {
    foodsChanged.forEach(async (food) => {
      try {
        const response = await createResourceInDb<DishType>(
          "Dish",
          food.name,
          JSON.stringify(food)
        );
        if (response) {
          alert(`${food.name} updated successfully`);
        }
      } catch (error) {
        alert(`Failed to update dish ${food.name}`);
        console.error(error);
      }
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
