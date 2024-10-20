import FoodTable from "../components/table/FoodTable";
import React from "react";
import CustomizedSlider from "../components/slider/Slider";

export default function Meal() {
  const [recipe, setRecipe] = React.useState([]);
  const [mealName, setMealName] = React.useState("");
  const [FoodsFromDb, setFoodsFromDb] = React.useState([]);
  const [rowToDelete, setRowToDelete] = React.useState([]);

  return (
    <div className="w-full justify-center items-center h-screen">
      <div className="m-10">
        <FoodTable
          selectFood={() => {}}
          foods={FoodsFromDb}
          changeMealName={(e) => setMealName(e.target.value)}
          handleDeleteFood={() => {}}
        />
      </div>
      <div className="w-full flex justify-center items-center">
        {/* <ModalButton
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
        /> */}
      </div>
    </div>
  );
}
