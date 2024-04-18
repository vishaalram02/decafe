import { useCallback } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

export default function BasicBlock({ data } : NodeProps ) {

    return (
        <div className="bg-black text-white px-4 py-1 rounded-lg">
            <div className="h-6">{data.label}</div>
            <Handle id={data.label} type="target" position={Position.Top} />
            {data.instructions.map((instruction : any, index: number) => (
                <div className="h-6" key={index}>
                    <p className="ml-4">{instruction.text}</p>
                    {instruction.label && 
                        <Handle id={data.label + ':' + index} type="source" position={Position.Right} style={{right: 5, top: 24 * index + 4 + 12 + 24 }} />
                    }
                </div>
                
            ))}
        <Handle id={data.label + ':end'} type="source" position={Position.Bottom} />
        </div>
    )
}   