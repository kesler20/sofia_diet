import React, { useState, useEffect } from "react";
import CustomizedSlider from "../../components/slider/Slider";
import ModalButton from "../../components/modal/ModalButton";
import MealTable from "./MealTable";
import BasicSelect from "../../components/select/Select";

const Diet = () => {
  const [meals, setMeals] = useState([]);
  const [weekDay, setWeekDay] = useState("");
  const [mealsFromDB, setMealsFromDB] = useState([]);
  const [rowToDelete, setRowToDelete] = useState([]);

  useEffect(() => {
    const response = fetch(
      `${process.env.REACT_APP_BACKEND_URL_PROD}/sofia-diet/meal/READ`
    );

    response
      .then((res) => {
        if (res.ok) {
          res.json().then((res) => {
            setMealsFromDB(convert_df_to_objects(res));
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleCreateDiet = (data) => {
    let dataToPush = data;
    dataToPush.meals = data.meals.map((meal) => {
      meal.amount = meal.amount === undefined ? 100 : meal.amount;
      return meal;
    });
    console.log(dataToPush);
    const response = fetch(
      `${process.env.REACT_APP_BACKEND_URL_PROD}/sofia-diet/diet/CREATE`,
      { method: "POST", body: JSON.stringify(dataToPush) }
    );
    processPromise(response, console.log);
  };

  const handleChangeAmount = (e, mealId) => {
    setMeals(
      meals.map((ingredient) => {
        if (meals.indexOf(ingredient) === mealId) {
          ingredient["amount"] = e.target.value;
        }
        return ingredient;
      })
    );
  };

  const handleSelectMeal = (e, id) => {
    console.log(meals);
    let selected = true;
    Array.from(e.target.parentNode.classList).forEach((classItem) => {
      if (classItem === "selected") {
        selected = false;
      }
    });

    e.target.parentNode.classList.toggle("my", selected);
    e.target.parentNode.classList.toggle("selected", selected);
    e.target.parentNode.classList.toggle("feature", selected);
    for (let meal of mealsFromDB) {
      if (mealsFromDB.indexOf(meal) === id) {
        if (meals.filter((ingredient) => ingredient === meal).length === 0) {
          meals.push(meal);
          setMeals(
            meals.map((ingredient) => {
              return ingredient;
            })
          );
        } else {
          setMeals(meals.filter((ingredient) => ingredient !== meal));
        }
      }
    }
  };

  const deleteMeal = (mealID) => {
    const response = fetch(
      `${process.env.REACT_APP_BACKEND_URL_PROD}/sofia-diet/meal/DELETE`,
      { method: "DELETE", body: JSON.stringify(mealID) }
    );
    processPromise(response, console.log);
  };

  const handleDeleteMeal = (mealID) => {
    if (mealID == rowToDelete) {
      setMealsFromDB(
        mealsFromDB.filter((meal) => mealsFromDB.indexOf(meal) !== mealID)
      );
      deleteMeal(mealID);
    } else {
      alert("if you click again the meal will be deleted!!");
      setRowToDelete(mealID);
    }
  };

  return (
    <div className="w-full justify-center items-center h-screen">
      <div className="m-10">
        <MealTable
          selectMeal={handleSelectMeal}
          meals={mealsFromDB}
          handleDeleteMeal={handleDeleteMeal}
        />
      </div>
      <div className="w-full flex justify-center items-center">
        <ModalButton
          items={meals.map((ingredient, id) => {
            if (id === 0) {
              console.log(id);
              return (
                <div className="flex flex-col justify-center items-center">
                  <div class="m-8">
                    <BasicSelect onSelect={(e) => setWeekDay(e.target.value)} />
                  </div>
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
          buttonTitle={"Create Diet"}
          modalButtonTitle={`Create Diet`}
          data={{ weekDay, meals }} // pass in the meal object
          onCreate={handleCreateDiet}
        />
        <a
          href={`${process.env.REACT_APP_BACKEND_URL_PROD}/sofia-diet/diet/READ`}
          className="btn m-3"
        >
          Get Diet
        </a>
      </div>
    </div>
  );
};

export default Diet;

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
