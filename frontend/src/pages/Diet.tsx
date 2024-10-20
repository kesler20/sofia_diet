import React, { useState, useEffect } from "react";
import CustomizedSlider from "../components/slider/Slider";
import MealTable from "../components/table/MealTable";
import BasicSelect from "../components/select/Select";

export default function Diet() {
  const [meals, setMeals] = useState([]);
  const [weekDay, setWeekDay] = useState("");
  const [mealsFromDB, setMealsFromDB] = useState([]);
  const [rowToDelete, setRowToDelete] = useState([]);

  return (
    <div className="w-full justify-center items-center h-screen">
      <div className="m-10">
        <MealTable
          selectMeal={() => {}}
          meals={mealsFromDB}
          handleDeleteMeal={() => {}}
        />
      </div>
      <div className="w-full flex justify-center items-center">
        {/* <ModalButton
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
        /> */}
        <a
          href={`${process.env.REACT_APP_BACKEND_URL_PROD}/sofia-diet/diet/READ`}
          className="btn m-3"
        >
          Get Diet
        </a>
      </div>
    </div>
  );
}
