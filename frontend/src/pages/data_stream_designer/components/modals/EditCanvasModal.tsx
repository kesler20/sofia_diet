import { IoIosArrowForward } from "react-icons/io";
import BasicModal from "./BasicModal";
import { CanvasType } from "../../../../../../lib/src/types";
import React from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

function EditCanvasComponent(props: {
  canvas: CanvasType;
  onSubmit: (currentCanvas: CanvasType) => void;
}) {
  const [currentCanvas, setCurrentCanvas] = React.useState(props.canvas);

  return (
    <div
      className="
    flex items-center justify-center
    w-[400px] h-[600px]
    border-0.1 border-gray-200
    bg-white
    rounded-2xl shadow-xl"
    >
      <svg
        className="w-[100px] h-[100px] absolute top-[-7px] left-[-15px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="25" cy="25" r="5" fill="rgba(200, 200, 200,0.4)" />
        <circle cx="50" cy="25" r="10" fill="rgba(200, 200, 200,0.4)" />
        <circle cx="75" cy="25" r="15" fill="rgba(200, 200, 200,0.4)" />
        <circle cx="37.5" cy="50" r="7.5" fill="rgba(200, 200, 200,0.4)" />
        <circle cx="62.5" cy="50" r="12.5" fill="rgba(200, 200, 200,0.4)" />
        <circle cx="50" cy="75" r="10" fill="rgba(200, 200, 200,0.4)" />
      </svg>

      <form className="flex items-center justify-center flex-col h-full">
        {/* Change the name of the canvas */}
        <div className="mt-14">
          <div className="flex w-full justify-start items-center text-gray-500">
            <div
              className="
              flex justify-center items-center
              w-[38px] h-[38px]
              bg-gray-600
              rounded-full text-gray-200
              ml-2 mr-6
            "
            >
              <IoIosArrowForward size={20} />
            </div>
            <p>Canvas Name ?</p>
          </div>
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
            placeholder={currentCanvas.name}
            onChange={(e) => {
              console.log(e.target.value);
              setCurrentCanvas((prevCanvas: CanvasType) => ({
                ...prevCanvas,
                name: e.target.value,
              }));
            }}
          />
        </div>

        {/* Change the simulation start point */}
        <div className="mt-8">
          <div className="flex w-full justify-start items-center text-gray-500">
            <div
              className="
                flex justify-center items-center
                w-[38px] h-[38px]
                bg-gray-600
                rounded-full text-gray-200
                ml-2 mr-6
              "
            >
              <IoIosArrowForward size={20} />
            </div>
            <p>Start Point ?</p>
          </div>
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
            type="number"
            placeholder={currentCanvas.simulationStart.toString()}
            onChange={(e) =>
              setCurrentCanvas((prevCanvas: CanvasType) => ({
                ...prevCanvas,
                simulationStart: parseInt(e.target.value),
              }))
            }
          />
        </div>

        <div className="mt-8">
          <div className="flex w-full justify-start items-center text-gray-500">
            <div
              className="
                flex justify-center items-center
                w-[38px] h-[38px]
                bg-gray-600
                rounded-full text-gray-200
                ml-2 mr-6
              "
            >
              <IoIosArrowForward size={20} />
            </div>
            <p>Last Point ?</p>
          </div>
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
            type="number"
            placeholder={currentCanvas.simulationEnd.toString()}
            onChange={(e) =>
              setCurrentCanvas((prevCanvas: CanvasType) => ({
                ...prevCanvas,
                simulationEnd: parseInt(e.target.value),
              }))
            }
          />
        </div>

        <button
          className="modal__card__btn--create mb-8"
          onClick={() => props.onSubmit(currentCanvas)}
        >
          <p className="mr-2">Edit Canvas</p>
          <FaArrowUpRightFromSquare size={"13"} />
        </button>
      </form>
    </div>
  );
}

export default function EditCanvasModal(props: {
  open: boolean;
  currentCanvas: CanvasType;
  onSubmit: (currentCanvas: CanvasType) => void;
  onClose: () => void;
}) {
  return (
    <BasicModal
      open={props.open}
      customModal={
        <EditCanvasComponent
          canvas={props.currentCanvas}
          onSubmit={props.onSubmit}
        />
      }
      handleClose={props.onClose}
    />
  );
}
