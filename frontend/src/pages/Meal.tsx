import FoodTable from "../components/table/FoodTable";
import React from "react";
import CustomizedSlider from "../components/slider/Slider";
import CustomModal from "../components/modal/CustomModal";
import BasicModal from "../components/modal/BasicModal";
import MainButton from "../components/button/MainButton";

export default function Meal() {
  const [recipe, setRecipe] = React.useState([]);
  const [mealName, setMealName] = React.useState("");
  const [FoodsFromDb, setFoodsFromDb] = React.useState([]);
  const [rowToDelete, setRowToDelete] = React.useState([]);
  const [createMealModalOpen, setCreateMealModalOpen] = React.useState(false);

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
        <MainButton
          onSubmit={() => setCreateMealModalOpen(true)}
          text={"Create Meal"}
        />
        <BasicModal
          open={createMealModalOpen}
          handleClose={() => setCreateMealModalOpen(false)}
          customModal={
            <CustomModal
              sections={[
                {
                  name: mealName.toUpperCase(),
                  value: mealName.toUpperCase(),
                  onChange: () => {},
                },
              ]}
              body={
                <div className="flex flex-col justify-center items-center">
                  {recipe.map((ingredient, id) => {
                    return (
                      <>
                        <CustomizedSlider
                          key={id}
                          name={`Amount of ${ingredient} (g)`}
                          onChangeValue={(e) => console.log(e)}
                          id={id}
                        />
                      </>
                    );
                  })}
                </div>
              }
              onSubmit={(meal) => console.log(meal)}
            />
          }
        />
      </div>
    </div>
  );
}
