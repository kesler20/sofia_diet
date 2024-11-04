import { Table } from "./Table";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FoodType } from "@lib/types";
import { ToggleButton } from "@mui/material";

export default function FoodTable(props: {
  foods: FoodType[];
  selectedFoods: string[];
  totalFood: FoodType;
  onDeleteFood: (foodName: string) => void;
  toggleFoodSelection: (foodName: string) => void;
  onChangeFoodAmount: (foodName: string, amount: number) => void;
}) {
  return (
    <form className="w-full flex flex-col items-center justify-start">
      <div>
        <Table>
          <tbody>
            <tr>
              <th>Food Name</th>
              <th>Select</th>
              <th>Food Amount (g)</th>
              <th>Food Calories (Kcal)</th>
              <th>Food Protein (g)</th>
              <th>Food Cost (£)</th>
              <th>Delete</th>
            </tr>
            {props.foods.map((food, foodId) => {
              return (
                <tr key={foodId} className="pointer-cursor">
                  <td>{food.name}</td>
                  <td>
                    <ToggleButton
                      value="check"
                      selected={props.selectedFoods.includes(food.name)}
                      onChange={() => props.toggleFoodSelection(food.name)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="text-center"
                      value={food.amount}
                      onChange={(e) =>
                        props.onChangeFoodAmount(food.name, Number(e.target.value))
                      }
                    />
                  </td>
                  <td>{food.calories}</td>
                  <td>{food.protein}</td>
                  <td>{food.cost}</td>{" "}
                  <td>
                    <RiDeleteBin6Line
                      onClick={() => props.onDeleteFood(food.name)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tbody>
            <tr>
              <th>Additional Info</th>
              <th>Total Selected</th>
              <th>Total Amount (g)</th>
              <th>Total Calories (Kcal)</th>
              <th>Total Protein (g)</th>
              <th>Total Cost (£)</th>
              <th>Additional Info</th>
            </tr>
            <tr>
              <td>...</td>
              <td>{props.selectedFoods.length}</td>
              <td>{props.totalFood.amount}</td>
              <td>{props.totalFood.calories}</td>
              <td>{props.totalFood.protein}</td>
              <td>{props.totalFood.cost}</td>
              <td>...</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </form>
  );
}
