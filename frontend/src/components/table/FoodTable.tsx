import React from "react";
import { Table } from "./Table";
import { RiDeleteBin6Line } from "react-icons/ri";
import { SectionTitle } from "../modal/CustomModal";

export default function FoodTable(props: {
  selectFood: (arg0: any, arg1: any) => void;
  changeMealName: React.ChangeEventHandler<HTMLInputElement> | undefined;
  foods: any[];
  handleDeleteFood: (arg0: any) => void;
}) {
  const [mealName, setMealName] = React.useState("");
  const handleSelectFood = (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    foodId: any
  ) => {
    props.selectFood(e, foodId);
  };

  return (
    <div className="table__container">
      <form>
        <div className="mt-14">
          <SectionTitle title="Meal Name ?" />
          <input
            className="
            text-center
            bg-transparent
            text-black
            ml-2"
            style={{
              border: "none",
              outline: "none",
              borderBottom: "1px solid rgb(193, 197, 204)",
            }}
            title="write-topic"
            type="text"
            placeholder={mealName}
            required
            onChange={(e) => setMealName(e.target.value)}
          />
        </div>

        <Table>
          <tbody>
            <tr>
              <th>Food Name</th>
              <th>Food Calories (Kcal)</th>
              <th>Food Protein (g)</th>
              <th>Food Cost (£)</th>
              <th>Delete</th>
            </tr>
            {props.foods.map(
              (
                food: {
                  name:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | null
                    | undefined;
                  calories:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | null
                    | undefined;
                  protein:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | null
                    | undefined;
                  cost:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | null
                    | undefined;
                },
                foodId: React.Key | null | undefined
              ) => {
                return (
                  <tr key={foodId} onClick={(e) => handleSelectFood(e, foodId)}>
                    <td>{food.name}</td>
                    <td>{food.calories}</td>
                    <td>{food.protein}</td>
                    <td>{food.cost}</td>{" "}
                    <td>
                      <RiDeleteBin6Line
                        onClick={() => props.handleDeleteFood(foodId)}
                      />
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </Table>
      </form>
    </div>
  );
}
