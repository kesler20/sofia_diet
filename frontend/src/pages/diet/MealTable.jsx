import React from "react";
import { Table } from "../../components/table/Table";
import { RiDeleteBin6Line } from "react-icons/ri";

const MealTable = (props) => {
  const handleSelectMeal = (e, mealId) => {
    props.selectMeal(e, mealId);
  };

  return (
    <div className="table__container">
      <form>
        <Table>
          <tbody>
            <tr>
              <th>Meal Name</th>
              <th>Meal Calories (Kcal)</th>
              <th>Meal Protein (g)</th>
              <th>Meal Cost (£)</th>
              <th>Delete</th>
            </tr>
            {props.meals.map((meal, mealId) => {
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
            })}
          </tbody>
        </Table>
      </form>
    </div>
  );
};

export default MealTable;
