import React from "react";

const CustomModals = (props) => {
  const onCreateButton = () => {
    props.onCreate(props.data);
    props.onClose();
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-1/2 min-w-[320px] h-[500px] md:h-[600px] md:w-[400px] flex flex-col items-center justify-center bg-white rounded-[20px] shadow-2xl">
        {props.items.map((item, itemID) => {
          return (
            <div
              class="m-3 w-full flex justify-center items-center"
              key={itemID}
            >
              {item}
            </div>
          );
        })}
        <button className="btn" onClick={onCreateButton}>
          {props.buttonTitle}
        </button>
      </div>
    </div>
  );
};

export default CustomModals;
