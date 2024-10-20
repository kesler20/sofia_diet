import { IoIosArrowForward } from "react-icons/io";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import BasicModal from "./BasicModal";
import { MdOutlineDeleteForever } from "react-icons/md";
import { ModeType, NodeType } from "../../../../../../lib/src/types";
import { useState } from "react";
import { CardDetail } from "../../DataStreamDesignerPage";
import {
  parseExcelFileContent,
  parseFileContent,
  parseFileName,
  parseModelInputsFromFileUpload,
} from "../../../../services";
import { getColumnWithFewestRows } from "../../../../../../lib/src/utils";
import { useStateContext } from "../../../../contexts/ReactFlowContextProvider";
import { MenuItem, Select } from "@mui/material";
import UploadAFileCardComponent from "../../../../components/upload/UploadAFileCardComponent";

function EditCard(props: {
  onEditButtonClicked: (modifiedCard: NodeType) => void;
  onDeleteButtonClicked: (cardData: NodeType) => void;
  cardSelectedToBeEdited: NodeType;
}) {
  const [currentNode, setCurrentNode] = useState<NodeType>(
    props.cardSelectedToBeEdited
  );
  const { canvas, setCanvas } = useStateContext();

  const updateModelCardMetadata = async (e: File) => {
    // Update the input and output parameters of the card
    parseModelInputsFromFileUpload(e)
      .then((params) => {
        setCurrentNode((prevNode) => {
          return {
            ...prevNode,
            data: {
              ...prevNode.data,
              inputParams: params.inputs.map((input) => {
                return {
                  name: input,
                  values: [],
                };
              }),
              outputParams: params.outputs.map((output) => {
                return {
                  name: output,
                  values: [],
                };
              }),
            },
          };
        });
      })
      .catch((e) => {
        console.error(e);
      });

    // Update the name of the card
    parseFileName(e)
      .then((fileName) => {
        setCurrentNode((prevNode) => {
          return {
            ...prevNode,
            data: {
              ...prevNode.data,
              cardName: fileName,
            },
          };
        });
      })
      .catch((e) => {
        console.error(e);
      });

    // Update the content of the card
    parseFileContent(e).then((content) => {
      setCurrentNode((prevNode) => {
        return {
          ...prevNode,
          data: {
            ...prevNode.data,
            content: content as string,
          },
        };
      });
    });
  };

  const updateDataSetCardMetadata = async (e: File) => {
    // Update the outputs of the data set card.
    parseExcelFileContent(e).then((params) => {
      // Adjust the size of the simulation window
      const shortestColumnInDataSet = getColumnWithFewestRows(params);
      const numberOfRowsInShortestColOfDataSet =
        params[shortestColumnInDataSet].length;
      if (
        numberOfRowsInShortestColOfDataSet >
        Math.round(canvas.simulationEnd - canvas.simulationStart)
      ) {
        setCanvas((prevCanvas) => {
          return {
            ...prevCanvas,
            simulationEnd:
              canvas.simulationStart + numberOfRowsInShortestColOfDataSet,
          };
        });
      }

      setCurrentNode((prevNode) => {
        return {
          ...prevNode,
          data: {
            ...prevNode.data,
            outputParams: Object.keys(params).map((col) => {
              return {
                name: col,
                values: params[col],
              };
            }),
          },
        };
      });
    });

    // Update the name of the card
    parseFileName(e).then((fileName) => {
      setCurrentNode((prevNode) => {
        return {
          ...prevNode,
          data: {
            ...prevNode.data,
            cardName: fileName,
          },
        };
      });
    });
  };

  return (
    <div
      className="
    flex items-center justify-center
    w-[400px] h-auto
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
            <p>{`${props.cardSelectedToBeEdited.data.cardDetail} Name ?`}</p>
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
            placeholder={props.cardSelectedToBeEdited.data.cardName}
            required
            onChange={(e) =>
              setCurrentNode((prevNode) => {
                return {
                  ...prevNode,
                  data: { ...prevNode.data, cardName: e.target.value },
                };
              })
            }
          />
        </div>

        {/* If the edit card modal is editing a model or a data set display an upload file component */}
        {currentNode.data.cardDetail === CardDetail.Model ||
          (currentNode.data.cardDetail === CardDetail.DataSet && (
            <UploadAFileCardComponent
              onClick={(file) => {
                if (file) {
                  if (currentNode.data.cardDetail === CardDetail.Model) {
                    updateModelCardMetadata(file);
                  } else {
                    updateDataSetCardMetadata(file);
                  }
                }
              }}
            />
          ))}

        {/* If the edit card modal is editing a sensor in noise mode display:
        the mean and range of the sensor. */}
        {currentNode.data.cardDetail === CardDetail.Sensor && (
          <div className="flex items-center justify-center w-full">
            {currentNode.data.mode === ModeType.RANDOM ? (
              <>
                <input
                  type="number"
                  placeholder={`μ=${currentNode.data.outputParams[0].values[0]}`}
                  className="bg-transparent text-black border-black w-full text-center"
                  onChange={(e) => {
                    setCurrentNode((prevNode) => {
                      return {
                        ...prevNode,
                        data: {
                          ...prevNode.data,
                          outputParams: [
                            {
                              ...prevNode.data.outputParams[0],
                              values: Array.from(
                                {
                                  length:
                                    Math.floor(
                                      (canvas.simulationEnd -
                                        canvas.simulationStart) /
                                        (prevNode.data.stepSize || 1)
                                    ) + 1,
                                },
                                () =>
                                  parseFloat(e.target.value) +
                                  (Math.random() * 2 - 1) *
                                    (prevNode.data.stepSize || 1)
                              ),
                            },
                          ],
                        },
                      };
                    });
                  }}
                />

                <input
                  type="number"
                  placeholder={`stp=${currentNode.data.stepSize}`}
                  className="bg-transparent text-black border-black w-full text-center"
                  onChange={(e) => {
                    setCurrentNode((prevNode) => {
                      return {
                        ...prevNode,
                        data: {
                          ...prevNode.data,
                          outputParams: [
                            {
                              ...prevNode.data.outputParams[0],
                              values: Array.from(
                                {
                                  length:
                                    Math.floor(
                                      (canvas.simulationEnd -
                                        canvas.simulationStart) /
                                        (parseFloat(e.target.value) || 1)
                                    ) + 1,
                                },
                                () =>
                                  (prevNode.data.outputParams[0].values[0] || 0) +
                                  (Math.random() * 2 - 1) *
                                    (parseFloat(e.target.value) || 1)
                              ),
                            },
                          ],
                        },
                      };
                    });
                  }}
                />
              </>
            ) : (
              <input
                type="number"
                placeholder={`stp=${currentNode.data.stepSize}`}
                className="bg-transparent text-black border-black w-full text-center"
                onChange={(e) => {
                  setCurrentNode((prevNode) => {
                    return {
                      ...prevNode,
                      data: {
                        ...prevNode.data,
                        outputParams: [
                          {
                            ...prevNode.data.outputParams[0],
                            values: Array.from(
                              {
                                length: Math.floor(
                                  (canvas.simulationEnd - canvas.simulationStart) /
                                    parseFloat(e.target.value)
                                ),
                              },
                              (_, index) =>
                                canvas.simulationStart +
                                index * parseFloat(e.target.value)
                            ),
                            stepSize: parseFloat(e.target.value),
                          },
                        ],
                      },
                    };
                  });
                }}
              />
            )}
          </div>
        )}

        {/* If the edit card modal is editing a sensor, change the offset */}
        {currentNode.data.cardDetail === CardDetail.Sensor && (
          <div className="flex items-center justify-center w-full">
            <input
              type="number"
              placeholder={`Offset=${currentNode.data.offset}`}
              className="bg-transparent text-black border-black w-full text-center"
              onChange={(e) => {
                setCurrentNode((prevNode) => {
                  return {
                    ...prevNode,
                    data: {
                      ...prevNode.data,
                      offset: parseFloat(e.target.value),
                      outputParams: prevNode.data.outputParams.map((param) => {
                        return {
                          ...param,
                          values: param.values.map(
                            (value) => value + parseFloat(e.target.value)
                          ),
                        };
                      }),
                    },
                  };
                });
              }}
            />
          </div>
        )}

        {/* If the edit card modal is editing a sensor display the mode of the sensor. */}
        {currentNode.data.cardDetail === CardDetail.Sensor && (
          <div className="mt-8 flex flex-col items-center justify-between h-[120px]">
            <Select
              label="Select the type of the Sensor"
              defaultValue={currentNode.data.mode}
              onChange={(e) => {
                setCurrentNode((prevNode) => {
                  return {
                    ...prevNode,
                    data: {
                      ...prevNode.data,
                      mode: e.target.value as ModeType,
                      outputParams:
                        e.target.value === ModeType.RANDOM
                          ? [
                              {
                                ...prevNode.data.outputParams[0],
                                values: Array.from(
                                  {
                                    length:
                                      Math.floor(
                                        (canvas.simulationEnd -
                                          canvas.simulationStart) /
                                          (prevNode.data.stepSize || 1)
                                      ) + 1,
                                  },
                                  () =>
                                    prevNode.data.outputParams[0].values[0] +
                                    (Math.random() * 2 - 1) *
                                      (prevNode.data.stepSize || 1)
                                ),
                              },
                            ]
                          : [
                              {
                                ...prevNode.data.outputParams[0],
                                values: Array.from(
                                  {
                                    length:
                                      Math.floor(
                                        (canvas.simulationEnd -
                                          canvas.simulationStart) /
                                          (prevNode.data.stepSize || 1)
                                      ) + 1,
                                  },
                                  (_, index) =>
                                    canvas.simulationStart +
                                    index * (prevNode.data.stepSize || 1)
                                ),
                              },
                            ],
                    },
                  };
                });
              }}
            >
              <MenuItem value={ModeType.RANDOM}>Random</MenuItem>
              <MenuItem value={ModeType.RANGE}>Range</MenuItem>
            </Select>
          </div>
        )}

        {/* Display the input and output parameters of the card */}
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-center justify-center">
            {currentNode.data.inputParams.map((input, index) => {
              return (
                <div key={index} className="flex items-center justify-center w-full">
                  <div className="flex items-center justify-center w-[50px]">
                    <input
                      type="text"
                      placeholder={input.name}
                      className="bg-transparent text-black border-black w-full text-center"
                      onChange={(e) => {
                        setCurrentNode((prevNode) => {
                          return {
                            ...prevNode,
                            data: {
                              ...prevNode.data,
                              inputParams: prevNode.data.inputParams.map((param) => {
                                if (param.name === input.name) {
                                  return {
                                    ...param,
                                    name: e.target.value,
                                  };
                                } else {
                                  return param;
                                }
                              }),
                            },
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
            {currentNode.data.outputParams.map((output, index) => {
              return (
                <div key={index} className="flex items-center justify-center w-full">
                  <div className="flex items-center justify-center w-[50px]">
                    <input
                      type="text"
                      placeholder={output.name}
                      className="bg-transparent text-black border-black w-full text-center"
                      onChange={(e) => {
                        setCurrentNode((prevNode) => {
                          return {
                            ...prevNode,
                            data: {
                              ...prevNode.data,
                              outputParams: prevNode.data.outputParams.map(
                                (param) => {
                                  if (param.name === output.name) {
                                    return {
                                      ...param,
                                      name: e.target.value,
                                    };
                                  } else {
                                    return param;
                                  }
                                }
                              ),
                            },
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

        <button
          className="modal__card__btn--create"
          onClick={() => props.onEditButtonClicked({ ...currentNode })}
        >
          <p className="mr-2">Edit Card</p>
          <FaArrowUpRightFromSquare size={"13"} />
        </button>
        <button
          className="modal__card__btn--delete mb-8"
          onClick={() => props.onDeleteButtonClicked({ ...currentNode })}
        >
          <p className="mr-2">Delete Card</p>
          <MdOutlineDeleteForever size={"23"} />
        </button>
      </form>
    </div>
  );
}

export default function EditCardModal(props: {
  open: boolean;
  onEditButtonClicked: (modifiedCard: NodeType) => void;
  onDeleteButtonClicked: (cardToDelete: NodeType) => void;
  cardSelectedToBeEdited: NodeType;
  onClose: () => void;
}) {
  return (
    <BasicModal
      open={props.open}
      customModal={
        <EditCard
          onDeleteButtonClicked={props.onDeleteButtonClicked}
          onEditButtonClicked={props.onEditButtonClicked}
          cardSelectedToBeEdited={props.cardSelectedToBeEdited}
        />
      }
      handleClose={props.onClose}
    />
  );
}
