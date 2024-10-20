import { memo } from "react";
import { NodeDataType } from "@lib/types";
import { Handle, Position } from "reactflow";

export default memo(({ data }: { data: NodeDataType }) => {
  const centralCrossColor = "rgb(110,110,110,)";
  return (
    <div
      className={`
      w-[60px] h-[60px] 
      bg-white 
      rounded-full shadow-xl border-gray-400 border-0.1
      flex items-center justify-center
      `}
    >
      {
        <Handle
          type="target"
          position={Position.Left}
          id={data.inputParams[0].name}
          style={{
            background: centralCrossColor,
            marginLeft: "31%",
            width: "30px",
            height: "30px",
          }}
        />
      }
      <p className="absolute top-[65px]">{data.cardName}</p>
    </div>
  );
});
