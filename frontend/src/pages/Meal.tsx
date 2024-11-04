import FoodTable from "../components/table/FoodTable";
import React from "react";
import MainButton from "../components/button/MainButton";
import {
  createResourceInDb,
  deleteResourceInDb,
  readResourceInDb,
} from "../services";
import { FoodType, MealType } from "@lib/types";
import CustomModal from "../components/modal/CustomModal";
import { SectionTitle } from "../components/forms/CustomForm";

const defaultTotalFood: FoodType = {
  name: "Total Selected",
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  sodium: 0,
  sugar: 0,
  cost: 0,
  amount: 0,
  vendor: "",
};

export default function Meal() {
  const [meal, setMeal] = React.useState<MealType>({
    name: "Default Meal Name",
    recipe: [],
    totalFood: defaultTotalFood,
  });
  const [foodsFromDb, setFoodsFromDb] = React.useState<FoodType[]>([]);
  const [createMealModalOpen, setCreateMealModalOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await readResourceInDb<FoodType[]>("Food");
        if (response) {
          setFoodsFromDb(response);
        }
        console.log(response);
      } catch (error) {
        alert("Failed to fetch foods");
        console.error(error);
      }
    };

    fetchFoods();
  }, []);

  React.useEffect(() => {
    const totalFood = { ...defaultTotalFood };

    meal.recipe.forEach((food) => {
      setMeal((prev) => {
        return {
          ...prev,
          totalFood: {
            ...prev.totalFood,
            calories: (totalFood.calories += food.calories),
            protein: (totalFood.protein += food.protein),
            carbs: (totalFood.carbs += food.carbs),
            fat: (totalFood.fat += food.fat),
            sodium: (totalFood.sodium += food.sodium),
            sugar: (totalFood.sugar += food.sugar),
            cost: (totalFood.cost += food.cost),
            amount: (totalFood.amount += food.amount),
          },
        };
      });
    });
  }, [meal]);

  const createMeal = async () => {
    try {
      const response = await createResourceInDb<MealType>(
        "Meal",
        meal.name,
        JSON.stringify(meal)
      );

      if (response) {
        alert("Meal created successfully");
        setMeal({
          name: "",
          recipe: [],
          totalFood: defaultTotalFood,
        });
      }
    } catch (error) {
      alert("Failed to create meal");
      console.error(error);
    }
  };

  const deleteFood = async (foodName: string) => {
    try {
      const response = await deleteResourceInDb("Food", foodName);
      setFoodsFromDb(foodsFromDb.filter((f) => f.name !== foodName));
      if (response) {
        alert("Food deleted successfully");
      }
    } catch (error) {
      alert("Failed to delete food");
      console.error(error);
    }
  };

  const updateFoodAmount = (foodName: string, amount: number) => {
    setFoodsFromDb(
      foodsFromDb.map((f) => {
        if (f.name === foodName) {
          // calculate the new attributes for the selected amount.
          const ratio = amount / f.amount;
          return {
            ...f,
            amount,
            calories: f.calories * ratio,
            protein: f.protein * ratio,
            carbs: f.carbs * ratio,
            fat: f.fat * ratio,
            sodium: f.sodium * ratio,
            sugar: f.sugar * ratio,
            cost: f.cost * ratio,
          };
        }
        return f;
      })
    );
  };

  return (
    <div className="w-full justify-center items-center h-screen">
      <div className="m-10">
        <FoodTable
          selectedFoods={meal.recipe.map((f) => f.name)}
          foods={foodsFromDb}
          toggleFoodSelection={(foodName) => {
            if (meal.recipe.find((f) => f.name === foodName)) {
              setMeal({
                ...meal,
                recipe: meal.recipe.filter((f) => f.name !== foodName),
              });
              return;
            } else {
              setMeal({
                ...meal,
                recipe: [
                  ...meal.recipe,
                  foodsFromDb.find((f) => f.name === foodName) as FoodType,
                ],
              });
            }
          }}
          onDeleteFood={deleteFood}
          onChangeFoodAmount={updateFoodAmount}
          totalFood={meal.totalFood}
        />
      </div>
      <div className="w-full h-0 flex justify-center items-center">
        <MainButton
          onSubmit={() => setCreateMealModalOpen(true)}
          text={"Create Meal"}
        />
      </div>
      <CustomModal
        open={createMealModalOpen}
        sections={[
          {
            name: "Meal Name",
            value: meal.name,
            onChange: (e) =>
              setMeal((prev) => {
                return {
                  ...prev,
                  name: e.target.value,
                };
              }),
          },
          {
            name: "Enter Taste Score",
            value: meal.name,
            onChange: (e) =>
              setMeal((prev) => {
                return {
                  ...prev,
                  tasteScore: Number(e.target.value),
                };
              }),
          },
        ]}
        body={
          <div className="mt-14 mb-4 flex flex-col items-center w-full justify-center">
            <SectionTitle title="Upload an Image" />
            <input type="image" />
          </div>
        }
        onSubmit={async () => await createMeal()}
        handleClose={() => setCreateMealModalOpen(false)}
      />
    </div>
  );
}
