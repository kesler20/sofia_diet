import React from "react";
import MealTable from "../components/table/MealTable";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import {
  createResourceInDb,
  deleteResourceInDb,
  readResourceInDb,
} from "../services";
import { DietType, FoodType, MealType, WeekdayType } from "@lib/types";
import CustomTabComponent from "../components/tabs/CustomTabComponent";
import { Table } from "../components/table/Table";

export default function Diet() {
  const [diet, setDiet] = React.useState<DietType>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  });
  const [mealsFromDB, setMealsFromDB] = React.useState<MealType[]>([]);
  const [weekLongDailyAverage, setWeekLongDailyAverage] = React.useState<FoodType>({
    name: "Weekly Total",
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

  React.useEffect(() => {
    const fetchDiet = async () => {
      try {
        const response = await readResourceInDb<DietType[]>("Diet");
        if (response) {
          setDiet(response[0]);
        }
      } catch (error) {
        alert("Failed to fetch diet");
        console.error(error);
      }
    };

    fetchDiet();
  }, []);

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
    const updateDiet = async () => {
      const response = await createResourceInDb(
        "Diet",
        "Diet",
        JSON.stringify(diet)
      );
      if (!response) {
        alert("Failed to update diet");
      }
    };

    updateDiet();

    // Calculate week long daily average
    // sum all the values of the week
    const weekLongDailyAverage = mealsFromDB.reduce(
      (acc, meal) => {
        acc.calories += meal.total.calories;
        acc.protein += meal.total.protein;
        acc.carbs += meal.total.carbs;
        acc.fat += meal.total.fat;
        acc.sodium += meal.total.sodium;
        acc.sugar += meal.total.sugar;
        acc.cost += meal.total.cost;
        acc.amount += meal.total.amount;
        return acc;
      },
      {
        name: "Weekly Total",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sodium: 0,
        sugar: 0,
        cost: 0,
        amount: 0,
        vendor: "",
      }
    );

    // devide the previous by 7 to get the daily average
    const dailyAverage = {
      name: "Daily Average",
      calories: weekLongDailyAverage.calories / 7,
      protein: weekLongDailyAverage.protein / 7,
      carbs: weekLongDailyAverage.carbs / 7,
      fat: weekLongDailyAverage.fat / 7,
      sodium: weekLongDailyAverage.sodium / 7,
      sugar: weekLongDailyAverage.sugar / 7,
      cost: weekLongDailyAverage.cost / 7,
      amount: weekLongDailyAverage.amount / 7,
      vendor: "",
    };

    setWeekLongDailyAverage(dailyAverage);
  }, [diet]);

  const deleteMeal = async (mealName: string) => {
    try {
      const response = await deleteResourceInDb("Meal", mealName);
      setMealsFromDB(mealsFromDB.filter((m) => m.name !== mealName));
      if (response) {
        alert("Meal deleted successfully");
      }
    } catch (error) {
      alert("Failed to delete meal");
      console.error(error);
    }
  };

  return (
    <div className="w-full justify-center items-center h-screen">
      <div className="m-10 w-full flex items-center justify-center">
        <CustomTabComponent
          tabNames={Array.from(Object.keys(diet))}
          customTabs={Array.from(Object.keys(diet)).map((weekday, index) => {
            const currentWeekday: WeekdayType = weekday as WeekdayType;
            return (
              <MealTable
                key={index}
                meals={mealsFromDB}
                selectedMeals={diet[currentWeekday].map((meal) => meal.name)}
                onDeleteMeal={async (mealName) => {
                  await deleteMeal(mealName);
                }}
                toggleMealSelection={(mealName) => {
                  if (diet[currentWeekday].find((meal) => meal.name === mealName)) {
                    setDiet((prev) => {
                      return {
                        ...prev,
                        [currentWeekday]: prev[currentWeekday].filter(
                          (meal) => meal.name !== mealName
                        ),
                      };
                    });
                  } else {
                    setDiet((prev) => {
                      return {
                        ...prev,
                        [currentWeekday]: [
                          ...prev[currentWeekday],
                          mealsFromDB.find((meal) => meal.name === mealName),
                        ],
                      };
                    });
                  }
                }}
              />
            );
          })}
        />
      </div>

      <div className="mt-4">
        <Table>
          <tbody>
            <tr>
              <th>Week Long Daily Average</th>
              <th>Food Protein (g)</th>
              <th>Food Calories (Kcal)</th>
              <th>Food Cost (£)</th>
            </tr>
            <tr>
              <td>...</td>
              <td>{weekLongDailyAverage.protein}</td>
              <td>{weekLongDailyAverage.calories}</td>
              <td>{weekLongDailyAverage.cost}</td>
            </tr>
          </tbody>
        </Table>
      </div>

      <div className="mt-4 w-full flex justify-center items-center">
        {/* download diet as an excel file and the shopping list */}
        <button className="modal__card__btn--create mb-8">
          <p className="mr-2">Get Diet</p>
          <FaArrowUpRightFromSquare size={"13"} />
        </button>
        <button className="modal__card__btn--create mb-8">
          <p className="mr-2">Create Shopping List</p>
          <FaArrowUpRightFromSquare size={"13"} />
        </button>
      </div>
    </div>
  );
}
