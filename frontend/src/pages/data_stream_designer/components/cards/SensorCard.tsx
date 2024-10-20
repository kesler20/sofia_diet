import React, { memo } from "react";
import { NodeDataType } from "@lib/types";
import { Handle, Position } from "reactflow";
import { AiOutlinePoweroff } from "react-icons/ai";
import { useStateContext } from "../../../../contexts/ReactFlowContextProvider";
import { Paper } from "@mui/material";
import IndicatorPlotComponent from "../../../../components/charts/Indicator";
import { IoMdPulse } from "react-icons/io";
import { MdOutlineShowChart } from "react-icons/md";
import { FaExternalLinkAlt } from "react-icons/fa";

export default memo(({ data }: { data: NodeDataType }) => {
  const { setNodes } = useStateContext();
  const [valueToDisplay, setValueToDisplay] = React.useState(
    data.outputParams[0].values[0] || 0
  );

  React.useEffect(() => {
    let intervalID: NodeJS.Timeout;
    let index = 0;
    intervalID = setInterval(() => {
      index++;
      setValueToDisplay(data.outputParams[0].values[index]);
      if (index >= data.outputParams[0].values.length) {
        index = 0;
      }
    }, 1000 / data.streamRate);

    return () => clearInterval(intervalID);
  }, [data.mode, data.stepSize, data.outputParams.values]);

  return (
    <>
      {/* Handle to the left of the sensor card */}
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

      {/* Sensor card Container */}
      <Paper
        elevation={3}
        className="
        flex flex-col justify-evenly items-center
        w-[250px] h-[285px]
        mt-[10px] bg-white"
      >
        {/* Sensor Name */}
        <p className="text-[#76889a] text-nowrap">{data.cardName}</p>

        {/* Sensor card Indicator */}
        <IndicatorPlotComponent
          name={data.cardName}
          dataSet={[
            {
              value: valueToDisplay,
              timestamp: Math.floor(new Date().getTime() / 1000),
            },
          ]}
          size={{
            width: 140,
            height: 55,
          }}
        />

        {/* Sensor Card Footer */}
        <div className="flex justify-around w-full items-center">
          {/* Check the content of the sensor */}
          <FaExternalLinkAlt
            size={"16"}
            className="ml-2 mr-2 border-0.1 rounded-full border-[rgb(224, 224, 224)] flex items-center justify-center w-[40px]"
          />

          {/* Switch the sensor on or off */}
          <div
            className={
              data.switchedOn
                ? "w-10 h-10 absolute bottom-7 rounded-full flex justify-center items-center text-red-400 bg-gradient-radial hover:shadow-md"
                : "w-10 h-10 absolute bottom-7 rounded-full flex justify-center items-center text-gray-500 bg-gradient-radial-off hover:shadow-md"
            }
            onClick={() => {
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
              });
            }}
          >
            <AiOutlinePoweroff />
          </div>

          {/* Switch between Range and Random mode */}
          {/* Show the mode of the sensor */}
          {data.mode === "range" ? (
            <MdOutlineShowChart
              size={"20"}
              className="ml-2 mr-2 border-0.1 bg-gray-100 rounded-full border-gray-300 border-[rgb(224, 224, 224)] flex items-center justify-center w-[50px] h-[25px]"
            />
          ) : (
            <IoMdPulse
              size={"20"}
              className="ml-2 mr-2 border-0.1 bg-gray-100 rounded-full border-gray-300 border-[rgb(224, 224, 224)] flex items-center justify-center w-[50px] h-[25px]"
            />
          )}
        </div>
      </Paper>
    </>
  );
});
