import FoodTable from "./FoodTable";
import React, { useState, useEffect } from "react";
import CustomizedSlider from "../../components/slider/Slider";
import ModalButton from "../../components/modal/ModalButton";

const Meal = () => {
  const [recipe, setRecipe] = useState([]);
  const [mealName, setMealName] = useState("");
  const [FoodsFromDb, setFoodsFromDb] = useState([]);
  const [rowToDelete, setRowToDelete] = useState([]);

  useEffect(() => {
    const response = fetch(
      `${process.env.REACT_APP_BACKEND_URL_PROD}/sofia-diet/food/READ`
    );

    response
      .then((res) => {
        if (res.ok) {
          res.json().then((res) => {
            setFoodsFromDb(convert_df_to_objects(res));
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleCreateMeal = (data) => {
    let dataToPush = data;
    dataToPush.recipe = data.recipe.map((food) => {
      food.amount = food.amount === undefined ? 100 : food.amount;
      return food;
    });
    console.log(dataToPush);
    const response = fetch(
      `${process.env.REACT_APP_BACKEND_URL_PROD}/sofia-diet/meal/CREATE`,
      { method: "POST", body: JSON.stringify(dataToPush) }
    );
    processPromise(response, console.log);
  };

  const handleChangeAmount = (e, foodId) => {
    setRecipe(
      recipe.map((ingredient) => {
        if (recipe.indexOf(ingredient) === foodId) {
          ingredient["amount"] = e.target.value;
        }
        return ingredient;
      })
    );
  };

  const handleSelectFood = (e, id) => {
    console.log(recipe);
    console.log(e, id);
    let selected = true;
    Array.from(e.target.parentNode.classList).forEach((classItem) => {
      if (classItem === "selected") {
        selected = false;
      }
    });

    e.target.parentNode.classList.toggle("my", selected);
    e.target.parentNode.classList.toggle("selected", selected);
    e.target.parentNode.classList.toggle("feature", selected);
    for (let food of FoodsFromDb) {
      if (FoodsFromDb.indexOf(food) === id) {
        if (recipe.filter((ingredient) => ingredient === food).length === 0) {
          recipe.push(food);
          setRecipe(
            recipe.map((ingredient) => {
              return ingredient;
            })
          );
        } else {
          setRecipe(recipe.filter((ingredient) => ingredient !== food));
        }
      }
    }
  };

  const deleteFood = (foodID) => {
    const response = fetch(
      `${process.env.REACT_APP_BACKEND_URL_PROD}/sofia-diet/food/DELETE`,
      { method: "DELETE", body: JSON.stringify(foodID) }
    );
    processPromise(response, console.log);
  };

  const handleDeleteFood = (foodID) => {
    if (foodID == rowToDelete) {
      setFoodsFromDb(
        FoodsFromDb.filter((food) => FoodsFromDb.indexOf(food) !== foodID)
      );
      deleteFood(foodID);
    } else {
      alert("if you click again the food will be deleted!!");
      setRowToDelete(foodID);
    }
  };

  return (
    <div className="w-full justify-center items-center h-screen">
      <div className="m-10">
        <FoodTable
          selectFood={handleSelectFood}
          foods={FoodsFromDb}
          changeMealName={(e) => setMealName(e.target.value)}
          handleDeleteFood={handleDeleteFood}
        />
      </div>
      <div className="w-full flex justify-center items-center">
        <ModalButton
          items={recipe.map((ingredient, id) => {
            if (id === 0) {
              console.log(id);
              return (
                <div className="flex flex-col justify-center items-center">
                  <h1 className="m-5 font-bold">{mealName.toUpperCase()}</h1>
                  <CustomizedSlider
                    key={id}
                    name={`Amount of ${ingredient.name} (g)`}
                    onChangeValue={handleChangeAmount}
                    id={id}
                  />
                </div>
              );
            } else {
              return (
                <CustomizedSlider
                  key={id}
                  name={`Amount of ${ingredient.name} (g)`}
                  onChangeValue={handleChangeAmount}
                  id={id}
                />
              );
            }
          })}
          buttonTitle={"Create Meal"}
          modalTitle={`name ${mealName}`}
          modalButtonTitle={`Create Meal`}
          data={{ mealName, recipe }} // pass in the meal object
          onCreate={handleCreateMeal}
        />
      </div>
    </div>
  );
};

export default Meal;

const processPromise = (promise, callBack) => {
  promise
    .then((res) => {
      if (res.ok) {
        res.json().then((res) => {
          callBack(res);
        });
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

/**
 * This function converts the data from a pd.DataFrame.to_json() format to the following form
 * [ { col:[values, ...]}, .... ]
 *
 * @param {*} backendData - parsed objects from pd.DataFrame.to_json()
 * @returns data - an array which is a collection of objects
 * containing the column as keys and the rows as values
 */
const convert_df_to_objects = (dataFromBackend) => {
  let backendData = JSON.parse(dataFromBackend);
  const columns = Object.keys(backendData);
  const rows = Object.keys(backendData[columns[0]]);
  // data should contain a list of object which with the columns and the row
  // [{ col : row, col : row },{ col : row, col : row } ]
  const data = [];
  rows.forEach((r) => {
    let row = {};
    columns.forEach((c) => {
      row[c] = backendData[c][r];
    });
    data.push(row);
  });

  return data;
};
