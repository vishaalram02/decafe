import { useCallback } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";

export default function BasicBlock({
  data,
}: {
  data: { label: string; instructions: any[] };
}) {
  return (
    <div className="bg-cafe2 text-black rounded-lg pb-1">
      <div className="w-full h-8 bg-cafe4 rounded-t-lg px-4 pt-1">
        {data.label}
      </div>
      <Handle id={data.label} type="target" position={Position.Top} />
      <div className="pl-2 pr-6 mt-1 text-primary">
        {data.instructions.map((instruction: any, index: number) => (
          <div className="h-6" key={index}>
            <p className="ml-4">{instruction.text}</p>
            {instruction.label && (
              <Handle
                id={data.label + ":" + index}
                type="source"
                position={Position.Right}
                style={{ right: 5, top: 24 * index + 4 + 12 + 24 }}
              />
            )}
          </div>
        ))}
        <Handle
          id={data.label + ":end"}
          type="source"
          position={Position.Bottom}
        />
      </div>
    </div>
  );
}
