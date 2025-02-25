import React from "react";
import CustomModal from "../components/modal/CustomModal";
import { MenuItem, Select } from "@mui/material";
import { createResourceInDb, readResourceInDb } from "../services";
import { DietType, DishType } from "@lib/types";
import { IoIosAdd, IoIosRemove } from "react-icons/io";

function Card(props: {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  style?: any;
}) {
  return (
    <div
      style={props.style}
      onClick={props.onClick}
      className={`
    border border-gray-200 rounded-2xl shadow-md
    px-4
    w-full
    ${props.className}`}
    >
      {props.children}
    </div>
  );
}

export function CardTitle(props: { title: string; onClick?: () => void }) {
  return (
    <div className="flex w-full justify-start items-center text-gray-500">
      <div
        className={`
              flex justify-center items-center
              w-[38px] h-[38px]
              bg-gray-600
              rounded-full text-gray-200
              cursor-pointer
              ml-2 mr-6`}
      >
        <IoIosAdd size={20} onClick={props.onClick} />
      </div>
      <p className="hidden md:block">{props.title}</p>
    </div>
  );
}

export function CardSectionDivider(props: { title: string }) {
  return (
    <>
      <h2 className="font-bold text-gray-600 mt-4">{props.title}</h2>
      <div className="w-full border"></div>
    </>
  );
}

const defaultDietPlan: DietType = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

type WeekDayType =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

type DietData = { calories: number; protein: number; cost: number };

export default function Diet() {
  const [selectDishModalOpen, setSelectDishModalOpen] = React.useState(false);
  const [dietPlan, setDietPlan] = React.useState<DietType>(defaultDietPlan);
  const [currentDay, setCurrentDay] = React.useState<WeekDayType>("Monday");
  const [foodsFromDb, setFoodsFromDb] = React.useState<DishType[]>([]);
  const [currentDayTotal, setCurrentDayTotal] = React.useState<DietData>({
    calories: 0,
    protein: 0,
    cost: 0,
  });
  const [weeklyTotal, setWeeklyTotal] = React.useState<DietData>({
    calories: 0,
    protein: 0,
    cost: 0,
  });
  const [selectedFoods, setSelectedFoods] = React.useState<DishType[]>([]);

  React.useEffect(() => {
    calculateTotal();
    getDietPlan();
    getFoods();
  }, []);

  React.useEffect(() => {
    calculateTotal();
  }, [currentDay]);

  React.useEffect(() => {
    if (dietPlan !== defaultDietPlan) {
      calculateTotal();
      saveDietPlan();
    }
  }, [dietPlan]);

  // listen to the copy and paste events
  React.useEffect(() => {
    document.addEventListener("copy", copySelectedFoodsToClipboard);
    document.addEventListener("paste", pasteSelectedFoodsFromClipboard);

    return () => {
      document.removeEventListener("copy", copySelectedFoodsToClipboard);
      document.removeEventListener("paste", pasteSelectedFoodsFromClipboard);
    };
  }, [selectedFoods]);

  const copySelectedFoodsToClipboard = () => {
    const text = selectedFoods.map((food) => food.name).join(", ");
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  const pasteSelectedFoodsFromClipboard = async () => {
    const text = await navigator.clipboard.readText();
    const foodNamesCopiedToClipboard = text.split(", ");
    setDietPlan((prev: DietType) => {
      return {
        ...prev,
        [currentDay]: [
          ...prev[currentDay],
          ...foodNamesCopiedToClipboard.map((foodName) => {
            if (prev[currentDay].some((item) => item.name === foodName)) {
              return;
            }

            return foodsFromDb.find((f) => f.name === foodName);
          }),
        ],
      };
    });
  };

  const getFoods = async () => {
    const foods = await readResourceInDb<DishType>("Dish");

    if (!foods) {
      return;
    }
    setFoodsFromDb(foods);
  };

  const getDietPlan = async () => {
    const dietPlan = await readResourceInDb<DietType>("Diet");

    if (!dietPlan) {
      return;
    }
    setDietPlan(dietPlan[0]);
  };

  const calculateTotal = () => {
    let dailyTotal = {
      calories: 0,
      protein: 0,
      cost: 0,
    };
    dietPlan[currentDay].forEach((food: DishType) => {
      dailyTotal.calories += food.calories;
      dailyTotal.protein += food.protein;
      dailyTotal.cost += food.cost;
    });

    setCurrentDayTotal(dailyTotal);

    let weekTotal = {
      calories: 0,
      protein: 0,
      cost: 0,
    };
    Object.keys(dietPlan).forEach((day) => {
      dietPlan[day].forEach((food: DishType) => {
        weekTotal.calories += food.calories;
        weekTotal.protein += food.protein;
        weekTotal.cost += food.cost;
      });
    });
    setWeeklyTotal(weekTotal);
  };

  const saveDietPlan = async () => {
    // Save the diet plan to the database
    const response = await createResourceInDb<DietType>(
      "Diet",
      "username",
      JSON.stringify(dietPlan)
    );

    if (!response) {
      alert("Failed to save diet plan");
      console.log("Failed to save diet plan");
    }
  };

  const addFoodToDiet = (food: DishType) => {
    setDietPlan((prev: DietType) => {
      if (prev[currentDay].some((item: DishType) => item.name === food.name)) {
        return prev; // Return the previous state if the food already exists
      }
      return {
        ...prev,
        [currentDay]: [...prev[currentDay], food],
      };
    });
  };

  const removedFoodFromDiet = (food: DishType) => {
    setDietPlan((prev: DietType) => {
      return {
        ...prev,
        [currentDay]: prev[currentDay].filter(
          (item: DishType) => item.name !== food.name
        ),
      };
    });
  };

  const toggleFoodSelection = (food: DishType) => {
    setSelectedFoods((prev) => {
      if (prev.some((item) => item.name === food.name)) {
        return prev.filter((item) => item.name !== food.name);
      } else {
        return [...prev, food];
      }
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-start h-screen">
      {/* Main Card */}
      <Card className="min-w-[300px] w-[70%] mt-4 bg-white p-2">
        {/* Card Header with the button and the Dropdown */}
        <div className="w-full flex justify-evenly items-center">
          <CardTitle
            title={`Add Meals for ${currentDay}`}
            onClick={() => setSelectDishModalOpen(true)}
          />

          {/* Top select menu */}
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={currentDay}
            onChange={(event) => {
              setCurrentDay(event.target.value as WeekDayType);
            }}
          >
            {Object.keys(dietPlan).map((day, index) => (
              <MenuItem key={index} value={day}>
                {day}
              </MenuItem>
            ))}
          </Select>
        </div>

        {/* Card Body with the selected dishes */}
        <CardSectionDivider title="Selected Dishes" />
        <div className="w-full max-h-[400px] my-8 flex flex-col justify-center overflow-y-scroll custom-scrollbar overflow-x-hidden">
          {dietPlan[currentDay].map((food: DishType) => {
            return (
              <Card
                className="text-gray-500 p-2 pl-8 hover:glow"
                onClick={() => toggleFoodSelection(food)}
                style={{
                  borderColor: selectedFoods.some((item) => item.name === food.name)
                    ? "#fdf3f8"
                    : "white",
                }}
              >
                <div className="w-full flex justify-between">
                  <p className="text-gray-600 font-bold">{food.name}</p>
                  <IoIosRemove
                    size={30}
                    className="cursor-pointer"
                    onClick={() => removedFoodFromDiet(food)}
                  />
                </div>
                <p>Calories: {food.calories} (kcal)</p>
                <p>Protein: {food.protein} (g)</p>
                <p>Cost: {food.cost} (£)</p>
                <p>{food.vendor}</p>
              </Card>
            );
          })}
        </div>

        {/* Card Footer with the total */}
        <CardSectionDivider title="Daily Total" />
        <Card className="mt-4 p-2">
          <div className="flex md:flex-row flex-col w-full justify-evenly">
            <p>Calories: {currentDayTotal.calories} (kcal)</p>
            <p>Protein: {currentDayTotal.protein} (g)</p>
            <p>Cost: {currentDayTotal.cost} (£)</p>
          </div>
        </Card>
      </Card>

      {/* Weekly Total */}
      <Card className="min-w-[300px] w-[70%] mt-4 bg-white p-2">
        <p className="text-gray-600 font-bold">Weekly Total:</p>
        <div className="flex md:flex-row flex-col w-full justify-evenly">
          <p>Calories: {weeklyTotal.calories} (kcal)</p>
          <p>Protein: {weeklyTotal.protein} (g)</p>
          <p>Cost: {weeklyTotal.cost} (£)</p>
        </div>
      </Card>

      <CustomModal
        open={selectDishModalOpen}
        sections={[
          {
            name: "Search Meal",
            value: "default",
            onChange: (e) => console.log(e.target.value),
          },
        ]}
        body={
          <div className="flex h-[150px] w-[210px] flex-col justify-between items-center overflow-x-hidden overflow-y-scroll custom-scrollbar">
            {foodsFromDb.map((food) => {
              return (
                <Card className="text-gray-500 mb-2 mx-2 p-2 pl-8">
                  <div className="w-full flex justify-between">
                    <p className="text-gray-600 font-bold">{food.name}</p>
                    <IoIosAdd
                      size={30}
                      className="cursor-pointer"
                      onClick={() => addFoodToDiet(food)}
                    />
                  </div>
                  <p>Calories: {food.calories} (kcal)</p>
                  <p>Protein: {food.protein} (g)</p>
                  <p>Cost: {food.cost} (£)</p>
                  <p>{food.vendor}</p>
                </Card>
              );
            })}
          </div>
        }
        onSubmit={() => console.log("submit")}
        handleClose={() => setSelectDishModalOpen(false)}
      />
    </div>
  );
}
