import { useMemo, useRef, useEffect } from "react";
import {
  ReactFlow,
  useReactFlow,
  useNodesState,
  useEdgesState,
  useNodesInitialized,
  Controls,
  Node,
  Edge,
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import Dagre from "@dagrejs/dagre";
import BasicBlock from "./BasicBlock";
import "@xyflow/react/dist/style.css";

export default function CFG({
  input,
  phase,
  opt,
}: {
  input: string;
  phase: string;
  opt: string;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  const isLayouted = useRef(false);

  const nodeTypes = useMemo(() => ({ basicBlock: BasicBlock }), []);
  const nodesInitialized = useNodesInitialized({ includeHiddenNodes: false });

  const { getNodes, getEdges, fitView } = useReactFlow();

  useEffect(() => {
    if (input) genCFG(phase, opt);
  }, [phase, opt]);

  useEffect(() => {
    if (isLayouted.current == false && nodesInitialized) {
      isLayouted.current = true;
      onLayout();
    }
  }, [nodesInitialized]);

  const genCFG = async (phase: string, opt: string) => {
    const result = await fetch("/api/graph", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phase: phase, opt: opt, input }),
    });
    const output = await result.json();

    if (output.error) {
      alert(output.error);
      return;
    }

    const nodes = output.nodes.map((node: any, index: number) => ({
      data: { instructions: node.instructions, label: node.label },
      id: node.label,
      position: { x: 0, y: 0 },
      type: "basicBlock",
    }));

    const edges = output.edges.map((edge: any, index: number) => ({
      id: edge.source + edge.target + index,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      style: { strokeWidth: 5, stroke: edge.color ?? "gray" },
    }));

    isLayouted.current = false;

    setNodes(nodes);
    setEdges(edges);
  };

  const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    g.setGraph({ rankdir: "TB" });

    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    nodes.forEach((node) =>
      g.setNode(node.id, {
        width: node.measured?.width,
        height: node.measured?.height,
      }),
    );

    Dagre.layout(g);

    return {
      nodes: nodes.map((node) => {
        const { x, y } = g.node(node.id);

        return { ...node, hidden: false, position: { x, y } };
      }),
      edges,
    };
  };

  const onLayout = () => {
    const layouted = getLayoutedElements(getNodes(), getEdges());

    setNodes([...layouted.nodes] as any);
    setEdges([...layouted.edges] as any);
  };
  return (
    <ReactFlow
      nodeTypes={nodeTypes}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      minZoom={0.1}
      style={{
        backgroundColor: "#F3E9DC",
      }}
    >
      <Controls />
    </ReactFlow>
  );
}
