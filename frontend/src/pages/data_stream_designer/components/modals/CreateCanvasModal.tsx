import { IoIosArrowForward } from "react-icons/io";
import BasicModal from "./BasicModal";
import { CanvasType } from "../../../../../../lib/src/types";
import React from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { FaMinus, FaPlus } from "react-icons/fa";

function CreateCanvasComponent(props: {
  canvas: CanvasType;
  onSubmit: (currentCanvas: CanvasType, selectedNodes: string[]) => void;
}) {
  const [currentCanvas, setCurrentCanvas] = React.useState(props.canvas);
  const [selectedNodes, setSelectedNodes] = React.useState<string[]>([]);

  return (
    <div
      className={`
    flex items-center justify-center
    w-[400px] h-[600px]
    border-0.1 border-gray-200
    bg-white
    rounded-2xl shadow-xl`}
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
              setCurrentCanvas((prevCanvas: CanvasType) => ({
                ...prevCanvas,
                name: e.target.value,
              }));
            }}
          />
        </div>

        <div className="mt-8 flex flex-col items-center justify-start mb-2">
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
            <p>Select Card Inputs ?</p>
          </div>
          <div className="flex flex-col w-full items-center justify-center m-2">
            {currentCanvas.nodes
              .filter((node) => node.data.inputParams.length === 0) // Filter for only the input nodes
              .map((node) => {
                return (
                  <div className="flex w-full items-center justify-start m-2">
                    {selectedNodes.includes(node.id) ? (
                      <div
                        className={`
    flex justify-center items-center
    w-[38px] h-[38px]
    bg-green-600 hover:bg-red-600
    rounded-full text-gray-200
    ml-2 mr-6 cursor-pointer`}
                        key={node.id}
                        onClick={() => {
                          setSelectedNodes((prevNodes) =>
                            prevNodes.filter((id) => id !== node.id)
                          );
                        }}
                      >
                        <FaMinus size={15} />
                      </div>
                    ) : (
                      <div
                        className={`
    flex justify-center items-center
    w-[38px] h-[38px]
    bg-gray-600 hover:bg-gray-400
    rounded-full text-gray-200
    ml-2 mr-6 cursor-pointer`}
                        key={node.id}
                        onClick={() => {
                          setSelectedNodes((prevNodes) => [...prevNodes, node.id]);
                        }}
                      >
                        <FaPlus size={15} />
                      </div>
                    )}
                    <p>{node.data.cardName}</p>
                  </div>
                );
              })}
          </div>
        </div>

        <button
          className="modal__card__btn--create mb-8"
          onClick={() => props.onSubmit(currentCanvas, selectedNodes)}
        >
          <p className="mr-2">Create Canvas</p>
          <FaArrowUpRightFromSquare size={"13"} />
        </button>
      </form>
    </div>
  );
}

export default function SaveCanvasModal(props: {
  open: boolean;
  currentCanvas: CanvasType;
  onSubmit: (currentCanvas: CanvasType, selectedNodes: string[]) => void;
  onClose: () => void;
}) {
  return (
    <BasicModal
      open={props.open}
      customModal={
        <CreateCanvasComponent
          canvas={props.currentCanvas}
          onSubmit={props.onSubmit}
        />
      }
      handleClose={props.onClose}
    />
  );
}
