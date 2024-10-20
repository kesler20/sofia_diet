import { IoIosArrowForward } from "react-icons/io";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { NodeDataType } from "../../../../lib/src/types";
import React, { useState } from "react";
import { MenuItem, Select } from "@mui/material";
import { FaPlus } from "react-icons/fa";

function CardButton(props: {
  buttonType: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  if (props.buttonType === "Sketch Card") {
    return (
      <button className="modal__card__btn--create mb-8" onClick={props.onClick}>
        <p className="mr-2">{props.buttonType}</p>
        <FaArrowUpRightFromSquare size={"13"} />
      </button>
    );
  } else if (props.buttonType === "Disabled") {
    return (
      <button className="modal__card__btn--disable mb-8">
        <p className="mr-2">Sketch Card</p>
        <FaArrowUpRightFromSquare size={"13"} />
      </button>
    );
  } else if (props.buttonType === "Add Param") {
    return (
      <button
        title="Add Param"
        type="button"
        className="
              flex justify-center items-center
              w-[38px] h-[38px]
              bg-gray-600
              rounded-full text-gray-200
              ml-2 mr-6
            "
        onClick={(event) => {
          if (event) {
            event.preventDefault();
            props.onClick(event);
          }
        }}
      >
        <FaPlus size={20} />
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
              w-[38px] h-[38px]
              bg-gray-600
              rounded-full text-gray-200
              ml-2 mr-6`}
      >
        <IoIosArrowForward size={20} />
      </div>
      <p>{props.title}</p>
    </div>
  );
}

function SVGBackground() {
  return (
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
  );
}

export default function CustomModal(props: { onSubmit: (sketch: NodeDataType) => void }) {

  return (
    <div
      className="
    flex items-center justify-center
    w-[400px] h-auto
    border-0.1 border-gray-200
    bg-white
    rounded-2xl shadow-xl"
    >
      <SVGBackground />
      <form className="flex items-center justify-center flex-col h-full">
        {/* Get The Type of Cart */}
        <div className="mt-14">
          <Select
            autoFocus
            label="Select the type of Card"
            defaultValue={currentSketch.cardDetail}
            onChange={(e) => {
              setCurrentSketch((prevSketch) => {
                return {
                  ...prevSketch,
                  cardDetail: e.target.value,
                };
              });
            }}
          >
            <MenuItem value={CardDetail.Model}>Model</MenuItem>
            <MenuItem value={CardDetail.DataSet}>DataSet</MenuItem>
            <MenuItem value={CardDetail.Connector}>Connector</MenuItem>
          </Select>
        </div>

        {/* Get Card Name */}
        <div className="mt-14">
          <SectionTitle title={`${currentSketch.cardDetail} Name ?`} />
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
            placeholder={currentSketch.cardName}
            required
            onChange={(e) =>
              setCurrentSketch((prevSketch) => {
                return {
                  ...prevSketch,
                  cardName: e.target.value,
                };
              })
            }
          />
        </div>

        {/* Add Stream Button */}
        <div className="mt-4">
          <SectionTitle title="Add Input/Output" />
        </div>

        {/* Display the input and output parameters of the card */}
        <div className="flex items-center justify-between w-full mt-2">
          <div className="flex flex-col items-center justify-center">
            {currentSketch.inputParams.map((input, index) => {
              return (
                <div key={index} className="flex items-center justify-center w-full">
                  <div className="flex items-center justify-center w-1/2">
                    <input
                      type="text"
                      placeholder={input.name}
                      className="bg-transparent text-black border-black w-full text-center"
                      onChange={(e) => {
                        setCurrentSketch((prevSketch) => {
                          return {
                            ...prevSketch,
                            inputParams: prevSketch.inputParams.map((param) => {
                              if (param.name === input.name) {
                                return {
                                  ...param,
                                  name: e.target.value,
                                };
                              } else {
                                return param;
                              }
                            }),
                          };
                        });
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col items-center justify-center">
            {currentSketch.outputParams.map((output, index) => {
              return (
                <div key={index} className="flex items-center justify-center w-full">
                  <div className="flex items-center justify-center w-1/2">
                    <input
                      type="text"
                      placeholder={output.name}
                      className="bg-transparent text-black border-black w-full text-center"
                      onChange={(e) => {
                        setCurrentSketch((prevSketch) => {
                          return {
                            ...prevSketch,
                            outputParams: prevSketch.outputParams.map((param) => {
                              if (param.name === output.name) {
                                return {
                                  ...param,
                                  name: e.target.value,
                                };
                              } else {
                                return param;
                              }
                            }),
                          };
                        });
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Display the buttons for adding more input and output parameters */}
        <div className="flex justify-evenly items-center m-4 w-full">
          <CardButton
            buttonType="Add Param"
            onClick={() => {
              setCurrentSketch((prevSketch) => {
                return {
                  ...prevSketch,
                  inputParams: [
                    ...prevSketch.inputParams,
                    {
                      name: `Input ${prevSketch.inputParams.length + 1}`,
                      values: [],
                    },
                  ],
                };
              });
            }}
          />
          <CardButton
            buttonType="Add Param"
            onClick={() => {
              setCurrentSketch((prevSketch) => {
                return {
                  ...prevSketch,
                  outputParams: [
                    ...prevSketch.outputParams,
                    {
                      name: `Output ${prevSketch.outputParams.length + 1}`,
                      values: [],
                    },
                  ],
                };
              });
            }}
          />
        </div>

        {/* Sketch Card Button */}
        {isCurrentSketchValid ? (
          <CardButton
            buttonType="Sketch Card"
            onClick={() => props.onSubmit(currentSketch)}
          />
        ) : (
          <CardButton buttonType="Disabled" onClick={() => {}} />
        )}
      </form>
    </div>
  );
}

