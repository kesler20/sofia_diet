import React, { memo } from "react";
import { NodeDataType } from "@lib/types";
import { Handle, Position } from "reactflow";
import Knobs from "../knob/Knob";
import "../knob/ChannelCommand.css";
import { Paper } from "@mui/material";
import { useStateContext } from "../../../../contexts/ReactFlowContextProvider";
import { HiVariable } from "react-icons/hi2";

export default memo(({ data }: { data: NodeDataType }) => {
  const { canvas, setNodes } = useStateContext();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      event.stopPropagation();
    }
  };

  return (
    <div onKeyDown={handleKeyDown}>
      {/* Handle to the left of the variable card */}
      {data.outputParams.map((param, index) => {
        return (
          <Handle
            key={index}
            type="source"
            position={Position.Right}
            id={param.name}
            style={{
              background: "#555",
              height: "10px",
              width: "10px",
            }}
          />
        );
      })}

      {/* The Variable card container */}
      <Paper
        elevation={3}
        className="
        flex flex-col justify-evenly items-center
        w-[250px] h-[300px]
        mt-[10px] bg-white
        glow
        "
      >
        {/* The card header */}
        <div className="flex items-center justify-between w-full">
          {/* Change the min value */}
          <div className="ml-2 mr-2 mt-1 border-0.1 bg-gray-100 rounded-full border-gray-300 flex items-center justify-center w-[50px]">
            <input
              type="number"
              placeholder={`min=${data.minValue}`}
              className="bg-transparent text-black border-black w-full text-xs text-center"
              onChange={(e) =>
                setNodes((prevNodes) => {
                  return prevNodes.map((node) => {
                    if (node.data.cardName === data.cardName) {
                      return {
                        ...node,
                        data: {
                          ...node.data,
                          minValue: parseFloat(e.target.value),
                        },
                      };
                    } else {
                      return node;
                    }
                  });
                })
              }
            />
          </div>

          {/* Sensor Name */}
          <p className="text-[#76889a] text-nowrap">{data.cardName}</p>

          {/* Change the maximum value */}
          <div className="ml-2 mr-2 mt-1 border-0.1 bg-gray-100 rounded-full border-gray-300 flex items-center justify-center w-[50px]">
            <input
              type="number"
              placeholder={`max=${data.maxValue}`}
              className="bg-transparent text-black border-black w-full text-center text-xs"
              onChange={(e) =>
                setNodes((prevNodes) => {
                  return prevNodes.map((node) => {
                    if (node.data.cardName === data.cardName) {
                      return {
                        ...node,
                        data: {
                          ...node.data,
                          maxValue: parseFloat(e.target.value),
                        },
                      };
                    } else {
                      return node;
                    }
                  });
                })
              }
            />
          </div>
        </div>

        {/* The Knob */}
        <Paper
          className="flex justify-center items-center w-[210px] h-[190px]"
          style={{ backgroundColor: "rgb(250, 250, 250)" }}
        >
          <Knobs
            powerOff={!data.switchedOn}
            value={
              data.outputParams[0]?.values.length
                ? data.outputParams[0].values[0]
                : 0
            }
            stepSize={data.stepSize}
            onPowerBtnClicked={() =>
              setNodes((prevNodes) => {
                return prevNodes.map((node) => {
                  if (node.data.cardName === data.cardName) {
                    return {
                      ...node,
                      data: { ...node.data, switchedOn: !node.data.switchedOn },
                    };
                  } else {
                    return node;
                  }
                });
              })
            }
            onValueChange={(value: number) => {
              setNodes((prevNodes) => {
                return prevNodes.map((node) => {
                  if (node.data.cardName === data.cardName) {
                    return {
                      ...node,
                      data: {
                        ...node.data,
                        outputParams: [
                          {
                            ...node.data.outputParams[0],
                            values: Array.from(
                              {
                                length: Math.floor(
                                  (canvas.simulationEnd - canvas.simulationStart) /
                                    (data?.stepSize || 1)
                                ),
                              },
                              () => value
                            ),
                          },
                        ],
                      },
                    };
                  } else {
                    return node;
                  }
                });
              });
            }}
            min={data.minValue || 0}
            max={data.maxValue || 100}
          />
        </Paper>

        {/* The Footer */}
        <div className="flex justify-around w-full items-center">
          {/* Change the stream rate of the variable */}
          <div className="ml-2 mr-2 border-0.1 bg-gray-100 rounded-full border-gray-300 flex items-center justify-center w-[50px]">
            <input
              type="number"
              placeholder={`1/S=${data.streamRate}`}
              className="bg-transparent text-black border-black w-full text-center text-xs"
              onChange={(e) =>
                setNodes((prevNodes) => {
                  return prevNodes.map((node) => {
                    if (node.data.cardName === data.cardName) {
                      return {
                        ...node,
                        data: {
                          ...node.data,
                          streamRate: parseFloat(e.target.value),
                        },
                      };
                    } else {
                      return node;
                    }
                  });
                })
              }
            />
          </div>

          {/* Change the step size of the variable */}
          <div className="ml-2 mr-2 border-0.1 bg-gray-100 rounded-full border-gray-300 flex items-center justify-center w-[50px]">
            <input
              type="number"
              placeholder={`stp=${data.stepSize}`}
              className="bg-transparent text-black border-black w-full text-center text-xs"
              onChange={(e) =>
                setNodes((prevNodes) => {
                  return prevNodes.map((node) => {
                    if (node.data.cardName === data.cardName) {
                      return {
                        ...node,
                        data: {
                          ...node.data,
                          stepSize: parseFloat(e.target.value),
                          outputParams: [
                            {
                              ...node.data.outputParams[0],
                              values: Array.from(
                                {
                                  length:
                                    Math.floor(
                                      (canvas.simulationEnd -
                                        canvas.simulationStart) /
                                        parseFloat(e.target.value)
                                    ) + 1,
                                },
                                () => data.outputParams[0]?.values?.[0] || 0
                              ),
                            },
                          ],
                        },
                      };
                    } else {
                      return node;
                    }
                  });
                })
              }
            />
          </div>

          {/* Change the value of the variable */}
          <div className="ml-2 mr-2 border-0.1 bg-gray-100 rounded-full border-gray-300 flex items-center justify-center w-[50px]">
            <input
              type="number"
              placeholder={`val=${data.outputParams[0]?.values?.[0]}`}
              className="bg-transparent text-black border-black w-full text-center text-xs"
              onChange={(e) => {
                setNodes((prevNodes) => {
                  return prevNodes.map((node) => {
                    if (node.data.cardName === data.cardName) {
                      return {
                        ...node,
                        data: {
                          ...node.data,
                          outputParams: [
                            {
                              ...node.data.outputParams[0],
                              values: Array.from(
                                {
                                  length:
                                    Math.floor(
                                      (canvas.simulationEnd -
                                        canvas.simulationStart) /
                                        (data?.stepSize || 1)
                                    ) + 1,
                                },
                                () => parseFloat(e.target.value)
                              ),
                            },
                          ],
                        },
                      };
                    } else {
                      return node;
                    }
                  });
                });
              }}
            />
          </div>

          {/* Variable Icon */}
          <HiVariable
            size={"20"}
            className="ml-2 mr-1 border-0.1 bg-gray-100 rounded-full border-gray-300 flex items-center justify-center w-[50px] h-[25px]"
          />
        </div>
      </Paper>
    </div>
  );
});
