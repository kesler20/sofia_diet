import { PiCloudArrowDownThin } from "react-icons/pi";
import { useState } from "react";
import { ImPause } from "react-icons/im";
import { IoChevronDownOutline } from "react-icons/io5";

type ActiveOption = {
  name: string;
  sideEffect: any;
};

export enum CustomButtonState {
  SIMULATE = "Simulate",
  PAUSE = "Pause",
  UPDATE = "Update",
}

export default function CustomButton(props: {
  activeOptions: ActiveOption[];
  primary: boolean;
  state?: CustomButtonState;
}) {
  const [open, setOpen] = useState(false);
  const [activeOption, setActiveOption] = useState(props.activeOptions[0]);

  const handleChangeActiveOption = (option: ActiveOption) => {
    setActiveOption(option);
    setOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {props.primary ? (
        <button
          className="btn h-[40px] text-[17px] px-4 w-[160px]"
          onClick={(e) =>
            props.activeOptions
              .filter((activeOption) => activeOption.name === props.state)[0]
              .sideEffect(e)
          }
        >
          <div className="flex justify-center items-center w-full">
            {props.state}
            {props.state === CustomButtonState.SIMULATE && (
              <PiCloudArrowDownThin size={25} className="ml-4" />
            )}
            {props.state === CustomButtonState.PAUSE && (
              <ImPause size={25} className="ml-4" />
            )}
          </div>
        </button>
      ) : (
        <span className="inline-flex overflow-hidden rounded-md border bg-gray-50 shadow-lg h-[40px] w-[160px]">
          <button
            className="inline-block border-e px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 focus:relative w-[70%]"
            onClick={(e) => activeOption.sideEffect(e)}
          >
            {activeOption.name}
          </button>
          <button
            className="inline-block px-4 py-2 text-gray-500 hover:bg-gray-100 focus:relative"
            title="View Orders"
            onClick={() => setOpen((prev) => !prev)}
          >
            <IoChevronDownOutline />
          </button>
        </span>
      )}
      {open && (
        <div className="w-[140px] h-auto bg-white border-0.1 flex items-start flex-col justify-start pb-2">
          {props.activeOptions.map((option) => (
            <p
              className="text-gray-500 text-xs p-2 pl-4 hover:bg-gray-100 w-full rounded-lg cursor-pointer"
              onClick={() => handleChangeActiveOption(option)}
            >
              {option.name}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
