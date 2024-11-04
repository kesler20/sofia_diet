import { Table } from "./Table";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ToggleButton } from "@mui/material";
import { MealType } from "@lib/types";

export default function MealTable(props: {
  meals: MealType[];
  selectedMeals: string[];
  onDeleteMeal: (mealName: string) => void;
  toggleMealSelection: (mealName: string) => void;
}) {
  return (
    <form className="w-full flex flex-col items-center justify-start">
      <div>
        <Table>
          <tbody>
            <tr>
              <th>Meal Name</th>
              <th>Select</th>
              <th>Meal Image</th>
              <th>Meal Calories (Kcal)</th>
              <th>Meal Protein (g)</th>
              <th>Meal Cost (£)</th>
              <th>Delete</th>
            </tr>
            {props.meals.map((meal, mealId) => {
              return (
                <tr key={mealId} className="pointer-cursor">
                  <td>{meal.name}</td>
                  <td>
                    <ToggleButton
                      value="check"
                      selected={props.selectedMeals.includes(meal.name)}
                      onChange={() => props.toggleMealSelection(meal.name)}
                    />
                  </td>
                  <td>{meal.image}</td>
                  <td>{meal.totalFood.calories}</td>
                  <td>{meal.totalFood.protein}</td>
                  <td>{meal.totalFood.cost}</td>{" "}
                  <td>
                    <RiDeleteBin6Line
                      onClick={() => props.onDeleteMeal(meal.name)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </form>
  );
}
