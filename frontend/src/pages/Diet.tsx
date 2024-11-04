import React from "react";
import MealTable from "../components/table/MealTable";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { readResourceInDb } from "../services";
import { DietType, MealType, Weekday } from "@lib/types";

export default function Diet() {
  const [diet, setDiet] = React.useState<DietType>({
    name: "",
    meals: [],
    weekday: Weekday.MONDAY,
  });
  const [mealsFromDB, setMealsFromDB] = React.useState<MealType[]>([]);
  const [createMealModalOpen, setCreateMealModalOpen] = React.useState(false);

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
        <MealTable meals={mealsFromDB} selectedMeals handleDeleteMeal={() => {}} />
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
