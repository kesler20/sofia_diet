import React from "react";
import { FoodType } from "@lib/types";
import { createResourceInDb } from "../services";
import CustomForm from "../components/forms/CustomForm";

export default function Food() {
  const [food, setFood] = React.useState<FoodType>({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    sodium: 0,
    sugar: 0,
    cost: 0,
    amount: 0,
    vendor: "",
  });

  const createFood = async () => {
    try {
      const response = await createResourceInDb<FoodType>(
        "Food",
        food.name,
        JSON.stringify(food)
      );

      if (response) {
        alert("Food created successfully");
        window.location.reload();
      }
    } catch (error) {
      alert("Failed to create food");
      console.error(error);
    }
  };

  return (
    <div className="h-[80vh] overflow-x-hidden w-full pt-8 flex flex-col items-center justify-start text-[0.9rem]">
      <div className="lg:h-[100px]"></div>
      <div className="relative">
        <div
          className={`
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[15deg]
            w-[250px] h-[350px] z-[-100]
            rounded-[15px]
            bg-[rgb(144,80,204)]
            shadow-[20px_20px_20px_rgb(155,155,155)]
          `}
        />
        <CustomForm
          sections={[
            {
              name: "Food Name",
              value: food.name,
              onChange: (e) => setFood({ ...food, name: e.target.value }),
            },
            {
              name: "Calories (Kcal)",
              value: food.calories,
              onChange: (e) =>
                setFood({ ...food, calories: Number(e.target.value) }),
            },
            {
              name: "Protein (g)",
              value: food.protein,
              onChange: (e) => setFood({ ...food, protein: Number(e.target.value) }),
            },
            {
              name: "Carbs (g)",
              value: food.carbs,
              onChange: (e) => setFood({ ...food, carbs: Number(e.target.value) }),
            },
            {
              name: "Fat (g)",
              value: food.fat,
              onChange: (e) => setFood({ ...food, fat: Number(e.target.value) }),
            },
            {
              name: "Sodium (g)",
              value: food.sodium,
              onChange: (e) => setFood({ ...food, sodium: Number(e.target.value) }),
            },
            {
              name: "Sugar (g)",
              value: food.sugar,
              onChange: (e) => setFood({ ...food, sugar: Number(e.target.value) }),
            },
            {
              name: "Cost (£)",
              value: food.cost,
              onChange: (e) => setFood({ ...food, cost: Number(e.target.value) }),
            },
            {
              name: "Amount (g)",
              value: food.amount,
              onChange: (e) => setFood({ ...food, amount: Number(e.target.value) }),
            },
            {
              name: "Vendor Name",
              value: food.vendor,
              onChange: (e) => setFood({ ...food, vendor: e.target.value }),
            },
          ]}
          onSubmit={async () => await createFood()}
        />
      </div>
    </div>
  );
}
