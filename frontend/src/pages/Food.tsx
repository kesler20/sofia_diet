import { FoodType } from "@lib/types";
import CustomModal from "../components/modal/CustomModal";
import React from "react";

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
  return (
    <div className="overflow-x-hidden w-full pt-8 flex flex-col items-center justify-start text-[0.9rem]">
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
        <CustomModal
          sections={[
            {
              name: "Food",
              value: food.name,
              onChange: (e) => setFood({ ...food, name: e.target.value }),
            },
            {
              name: "Calories",
              value: food.calories,
              onChange: (e) => setFood({ ...food, calories: Number(e.target.value) }),
            },
            {
              name: "Protein",
              value: food.protein,
              onChange: (e) => setFood({ ...food, protein: Number(e.target.value) }),
            },
            {
              name: "Carbs",
              value: food.carbs,
              onChange: (e) => setFood({ ...food, carbs: Number(e.target.value) }),
            },
            {
              name: "Fat",
              value: food.fat,
              onChange: (e) => setFood({ ...food, fat: Number(e.target.value) }),
            },
            {
              name: "Sodium",
              value: food.sodium,
              onChange: (e) => setFood({ ...food, sodium: Number(e.target.value) }),
            },
            {
              name: "Sugar",
              value: food.sugar,
              onChange: (e) => setFood({ ...food, sugar: Number(e.target.value) }),
            },
            {
              name: "Cost",
              value: food.cost,
              onChange: (e) => setFood({ ...food, cost: Number(e.target.value) }),
            },
            {
              name: "Amount",
              value: food.amount,
              onChange: (e) => setFood({ ...food, amount: Number(e.target.value) }),
            },
            {
              name: "Vendor",
              value: food.vendor,
              onChange: (e) => setFood({ ...food, vendor: e.target.value }),
            },
          ]}
          onSubmit={() => console.log(food)}
        />
      </div>
    </div>
  );
}
