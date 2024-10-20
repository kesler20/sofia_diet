import React from "react";
import { Table } from "../../components/table/Table";
import { Heading } from "../../components/heading/Heading";
import { Badge } from "../../components/heading/Badge";
import { RiDeleteBin6Line } from "react-icons/ri";

const FoodTable = (props) => {
  const handleSelectFood = (e, foodId) => {
    props.selectFood(e, foodId);
  };

  return (
    <div className="table__container">
      <form>
        <Heading>
          <Badge>
            <img
              src="https://uploads-ssl.webflow.com/612b579592e3bf93283444b6/612b69f61d22d5ca878550af_chevron-right.svg"
              loading="lazy"
              alt=""
              className="image-2-copy-copy"
            />
          </Badge>
          <p>Meal Name?</p>
          <input
            name="dietName"
            type="text"
            onChange={props.changeMealName}
            required
          />
        </Heading>
        <Table>
          <tbody>
            <tr>
              <th>Food Name</th>
              <th>Food Calories (Kcal)</th>
              <th>Food Protein (g)</th>
              <th>Food Cost (£)</th>
              <th>Delete</th>
            </tr>
            {props.foods.map((food, foodId) => {
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
            })}
          </tbody>
        </Table>
      </form>
    </div>
  );
};

export default FoodTable;
