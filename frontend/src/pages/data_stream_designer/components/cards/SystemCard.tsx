import React, { memo } from "react";
import { NodeDataType } from "@lib/types";
import { Handle, Position } from "reactflow";
import { Divider } from "@mui/material";
import { FaDatabase, FaExternalLinkAlt } from "react-icons/fa";
import { MdOutlineSignalWifiStatusbarConnectedNoInternet4 } from "react-icons/md";
import { AiOutlinePoweroff } from "react-icons/ai";
import { TbMathFunction } from "react-icons/tb";
import { GrConnect } from "react-icons/gr";
import { useStateContext } from "../../../../contexts/ReactFlowContextProvider";

export default memo(({ data }: { data: NodeDataType }) => {
  const { setNodes } = useStateContext();
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = React.useState(0);

  React.useLayoutEffect(() => {
    if (cardRef.current) {
      setCardHeight(cardRef.current.offsetHeight);
    }
  }, [data]);

  const handleHeight =
    cardHeight / (Math.max(data.inputParams.length, data.outputParams.length) + 5);

  const renderSystemIcon = () => {
    switch (data.cardDetail) {
      case "Model":
        return (
          <TbMathFunction
            size={"15"}
            className="ml-2 border-0.1 rounded-full border-[rgb(224, 224, 224)] flex items-center justify-center w-[40px]"
          />
        );
      case "Data Set":
        return (
          <FaDatabase
            size={"15"}
            className="ml-2 border-0.1 rounded-full border-[rgb(224, 224, 224)] flex items-center justify-center w-[40px]"
          />
        );
      case "Connector":
        return (
          <GrConnect
            size={"15"}
            className="ml-2 border-0.1 rounded-full border-[rgb(224, 224, 224)] flex items-center justify-center w-[40px]"
          />
        );
      default:
        return (
          <FaDatabase
            size={"15"}
            className="ml-2 border-0.1 rounded-full border-[rgb(224, 224, 224)] flex items-center justify-center w-[40px]"
          />
        );
    }
  };

  return (
    <div ref={cardRef}>
      <div
        className="
      absolute top-[-15px] left-[-15px]
      w-[30px] h-[30px]
      bg-orange-200
      rounded-full
      flex items-center justify-center"
      >
        0
      </div>
      {data.inputParams.map((param, index) => {
        const handleTop = `${handleHeight * (index + 3)}px`;
        return (
          <div key={index}>
            <Handle
              type="target"
              position={Position.Left}
              id={param.name}
              style={{
                background: "#555",
                top: handleTop,
                width: "10px",
                height: "10px",
              }}
            />
            <p
              className="absolute left-[15px] -translate-y-1/2"
              style={{ top: handleTop }}
            >
              {param.name}
            </p>
          </div>
        );
      })}
      {data.outputParams.map((param, index) => {
        const handleTop = `${handleHeight * (index + 3)}px`;
        return (
          <>
            <Handle
              type="source"
              position={Position.Right}
              id={param.name}
              style={{
                background: "#555",
                height: "10px",
                width: "10px",
                top: handleTop,
              }}
            />
            <p
              className="absolute right-[15px] -translate-y-1/2"
              style={{ top: handleTop }}
            >
              {param.name}
            </p>
          </>
        );
      })}
      <div className="bg-white shadow-xl rounded-xl pl-4 pr-4 pb-4 border-0.1 border-gray-300">
        <div className="flex justify-end pt-2">
          <p>{`v${data?.version || 0} `}</p>
        </div>
        <p>{data.cardName}</p>
        <Divider />
        {data.inputParams.length >= data.outputParams.length
          ? data.inputParams.map((_, index) => {
              return <div key={index} className="h-12"></div>;
            })
          : data.outputParams.map((_, index) => {
              return <div key={index} className="h-12"></div>;
            })}
        <div className="flex items-center justify-evenly pt-12">
          <div className="ml-2 mr-2 border-0.1 bg-gray-100 rounded-full border-gray-300 flex items-center justify-center w-[50px]">
            <input
              type="number"
              placeholder={`1/S=${data.streamRate}`}
              className="bg-transparent text-black border-black w-full text-center "
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
          <MdOutlineSignalWifiStatusbarConnectedNoInternet4 className="mr-2 border-0.1 rounded-full border-[rgb(224, 224, 224)] flex items-center justify-center w-[40px]" />
          <div
            className={
              data.switchedOn
                ? "w-10 h-10 rounded-full flex justify-center items-center text-red-400 bg-gradient-radial hover:shadow-md"
                : "w-10 h-10 rounded-full flex justify-center items-center text-gray-500 bg-gradient-radial-off hover:shadow-md"
            }
            onClick={() =>
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
          >
            <AiOutlinePoweroff />
          </div>
          {renderSystemIcon()}
          <FaExternalLinkAlt
            size={"13"}
            className="ml-2 mr-2 border-0.1 rounded-full border-[rgb(224, 224, 224)] flex items-center justify-center w-[40px]"
          />
        </div>
      </div>
    </div>
  );
});
