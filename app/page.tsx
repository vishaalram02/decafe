'use client'

import React, { useCallback, useMemo, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import ReactFlow, { 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Controls,
  Edge,
  Node,
  MarkerType
} from 'reactflow';
import BasicBlock from './BasicBlock';

export default function Home() {
  const nodeTypes = useMemo(() => ({ basicBlock: BasicBlock }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [program, setProgram] = React.useState('');


  const onConnect = useCallback(
    (connection : any) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const genCFG = async () => {
    const result = await fetch('/api/graph', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'cfg', input: program }),      
    });
    const output = await result.json();

    if(output.error){
      alert(output.error);
      return;
    }

    const nodes = output.nodes;
    const edges = output.edges;
    setNodes(nodes.map((node : any, index : number) => ({ 
      data: { instructions: node.instructions, label: node.label },
      id: node.label,
      position: { x: 400 * index, y: 0 * index },
      type: 'basicBlock',
    })));
    setEdges(edges.map((edge : any) => ({
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      style: { strokeWidth: 5, stroke: edge.type ?? 'gray'},
    })));
  }

  return (
    <main className="flex flex-col h-screen w-screen">
      <div className="h-full w-full flex">
        <div className="w-1/3">
          <Editor className="w-1/2" defaultLanguage='c' theme="vs-dark" value={program} onChange={(text) => setProgram(text ?? '')}/>
        </div>
        <div className="w-2/3">
          <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            minZoom={0.001}
          >
            <Controls />
          </ReactFlow>
        </div>
      </div>
      <div className="h-32 p-5">
        <button className="bg-black text-white text-3xl px-4 py-2 rounded-lg" onClick={genCFG}>
          submit
        </button>
      </div>
     

    </main>
  );
}
