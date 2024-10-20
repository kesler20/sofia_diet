import { IoIosArrowForward } from "react-icons/io";
import { FaArrowUpRightFromSquare, FaPlugCircleXmark } from "react-icons/fa6";
import React from "react";
import {
  MdModeEdit,
  MdOutlineDeleteForever,
  MdOutlineSignalWifiStatusbarConnectedNoInternet4,
} from "react-icons/md";
import { PiCloudArrowDownThin } from "react-icons/pi";
import DatabaseInterface from "../../../models/DatabaseInterface";
import { CanvasType } from "@lib/types";
import { RxContainer } from "react-icons/rx";

function CustomButton(props: {
  buttonType: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  if (props.buttonType === "Select") {
    return (
      <button className="edit-btn w-[140px] h-[40px] mr-4" onClick={props.onClick}>
        <p className="mr-2">{props.buttonType}</p>
        <FaArrowUpRightFromSquare size={"13"} />
      </button>
    );
  } else if (props.buttonType === "Delete") {
    return (
      <button className="delete-btn w-[140px] h-[40px]" onClick={props.onClick}>
        <p className="mr-2">{props.buttonType}</p>
        <MdOutlineDeleteForever size={"23"} />
      </button>
    );
  } else if (props.buttonType === "Create") {
    return (
      <button
        className="btn h-[40px] text-[17px] px-4 w-[160px]"
        onClick={props.onClick}
      >
        <div className="flex justify-center items-center w-full">
          {props.buttonType}
          <PiCloudArrowDownThin size={25} className="ml-4" />
        </div>
      </button>
    );
  } else {
    return null;
  }
}

function SectionTitle(props: { title: string }) {
  return (
    <div className="flex w-full justify-start items-center text-gray-500">
      <div
        className={`
              flex justify-center items-center
              w-[40px] h-[40px]
              bg-gray-600
              rounded-full text-gray-200
              ml-2 mr-4`}
      >
        <IoIosArrowForward size={20} />
      </div>
      <p className="text-2xl">{props.title}</p>
    </div>
  );
}

export default function SelectCanvasModal() {
  const [canvas, setCanvas] = React.useState<CanvasType[]>([]);

  React.useEffect(() => {
    const getCanvasFromDB = async () => {
      const db = new DatabaseInterface();
      const canvasFromDB = await db.READ<CanvasType[]>("files", "Canvas");
      if (canvasFromDB) {
        setCanvas(canvasFromDB);
      } else {
        console.log("No Canvas found in the database");
      }
    };

    getCanvasFromDB();
  }, []);
  return (
    <div className="w-screen h-screen bg-white flex items-start justify-center">
      <div
        className={`
      flex items-center justify-center flex-col
      max-w-[60%] h-auto w-full mt-11
      bg-white`}
      >
        {/* Select Canvas Title */}
        <div className="flex items-center w-full">
          <SectionTitle title="Select a Canvas" />
          <CustomButton
            buttonType="Create"
            onClick={(e) => {
              e.preventDefault();
            }}
          />
        </div>
        <div className="m-4 w-full border-solid border-gray-200 border-0.1" />

        {/* List of Canvases that you can select */}
        <div className="flex justify-center items-center flex-col w-full">
          {canvas.map((canvas, index) => {
            return (
              <div
                className="flex items-center justify-between border-solid border-gray-200 border-0.1 rounded-2xl h-[60px] w-full hover:bg-gray-100 cursor-pointer"
                key={index}
              >
                <div className="flex">
                  <p className="mr-2">{canvas.name}</p>
                  <p>v{canvas.version}</p>
                </div>
                <div className="flex">
                  <MdOutlineSignalWifiStatusbarConnectedNoInternet4 className="mr-2 border-0.1 rounded-full border-[rgb(224, 224, 224)] flex items-center justify-center w-[40px]" />
                  <RxContainer />
                </div>
                <div className="flex">
                  <button
                    className="border-e px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 focus:relative w-[120px] border-0.1 rounded-2xl flex justify-between items-center"
                    title="View Orders"
                    onClick={() => {
                      console.log(canvas.name);
                    }}
                  >
                    <p>Rollback</p>
                    <FaPlugCircleXmark />
                    {/* <FaPlugCircleCheck /> */}
                  </button>
                  <button
                    className="border-e px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 focus:relative w-[100px] border-0.1 rounded-2xl flex justify-between items-center"
                    title="View Orders"
                    onClick={() => {
                      console.log(canvas.name);
                    }}
                  >
                    <p>Select</p>
                    <MdModeEdit />
                  </button>
                  <button
                    className="border-e px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 focus:relative w-[100px] border-0.1 rounded-2xl flex justify-between items-center"
                    title="View Orders"
                    onClick={() => {
                      console.log(canvas.name);
                    }}
                  >
                    <p>Delete</p>
                    <MdOutlineDeleteForever />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
