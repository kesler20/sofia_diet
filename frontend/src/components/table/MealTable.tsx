import React from "react";
import { Table } from "./Table";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function MealTable(props: {
  selectMeal: (arg0: any, arg1: any) => void;
  meals: any[];
  handleDeleteMeal: (arg0: any) => void;
}) {
  const handleSelectMeal = (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    mealId: any
  ) => {
    props.selectMeal(e, mealId);
  };

  return (
    <form className="w-full flex flex-col items-center justify-start">
      <div>
        <Table>
          <tbody>
            <tr>
              <th>Meal Name</th>
              <th>Meal Calories (Kcal)</th>
              <th>Meal Protein (g)</th>
              <th>Meal Cost (£)</th>
              <th>Delete</th>
            </tr>
            {props.meals.map(
              (
                meal: {
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
                mealId: React.Key | null | undefined
              ) => {
                return (
                  <tr key={mealId} onClick={(e) => handleSelectMeal(e, mealId)}>
                    <td>{meal.name}</td>
                    <td>{meal.calories}</td>
                    <td>{meal.protein}</td>
                    <td>{meal.cost}</td>
                    <td>
                      <RiDeleteBin6Line
                        onClick={() => props.handleDeleteMeal(mealId)}
                      />
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </Table>
      </div>
    </form>
  );
}
