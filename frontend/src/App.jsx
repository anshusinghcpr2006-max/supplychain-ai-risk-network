
import { useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import "./index.css";

const initialNodes = [
  {
    id: "s1",
    position: { x: 50, y: 100 },
    data: { label: "Supplier A" },
    style: { background: "#dbeafe", padding: 12, borderRadius: 8 },
  },
  {
    id: "w1",
    position: { x: 300, y: 50 },
    data: { label: "Warehouse 1" },
    style: { background: "#dcfce7", padding: 12, borderRadius: 8 },
  },
  {
    id: "w2",
    position: { x: 300, y: 230 },
    data: { label: "Warehouse 2" },
    style: { background: "#dcfce7", padding: 12, borderRadius: 8 },
  },
  {
    id: "st1",
    position: { x: 560, y: 140 },
    data: { label: "Retail Store" },
    style: { background: "#fef3c7", padding: 12, borderRadius: 8 },
  },
];

const initialEdges = [
  { id: "e1", source: "s1", target: "w1", label: "Shipment A" },
  { id: "e2", source: "s1", target: "w2", label: "Shipment B" },
  { id: "e3", source: "w1", target: "st1" },
  { id: "e4", source: "w2", target: "st1" },
];

function findAffectedNodes(startId, edges) {
  const visited = new Set([startId]);
  const queue = [startId];

  while (queue.length > 0) {
    const current = queue.shift();

    for (const edge of edges) {
      if (
        edge.source === current &&
        !visited.has(edge.target)
      ) {
        visited.add(edge.target);
        queue.push(edge.target);
      }
    }
  }

  return visited;
}

export default function App() {
  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  const [selectedId, setSelectedId] = useState(null);

  const affected = selectedId
    ? findAffectedNodes(selectedId, edges)
    : new Set();

  const displayNodes = nodes.map((node) => ({
    ...node,
    style: {
      ...node.style,
      opacity:
        selectedId && !affected.has(node.id) ? 0.3 : 1,
      border:
        node.id === selectedId
          ? "2px solid #2563eb"
          : node.style?.border,
    },
  }));

  const displayEdges = edges.map((edge) => ({
    ...edge,
    animated:
      selectedId !== null &&
      affected.has(edge.source) &&
      affected.has(edge.target),
    style: {
      ...edge.style,
      stroke:
        selectedId !== null &&
        affected.has(edge.source) &&
        affected.has(edge.target)
          ? "#2563eb"
          : "#94a3b8",
      strokeWidth:
        selectedId !== null &&
        affected.has(edge.source) &&
        affected.has(edge.target)
          ? 3
          : 1.5,
    },
  }));

  return (
    <main className="dashboard">
      <h1>SupplyChain AI</h1>
      <p>Supplier & Warehouse Risk Network</p>

      <div className="cards">
        <div className="card">
          <span>Suppliers</span>
          <h2>1</h2>
        </div>

        <div className="card">
          <span>Warehouses</span>
          <h2>2</h2>
        </div>

        <div className="card">
          <span>Retail Stores</span>
          <h2>1</h2>
        </div>
      </div>

      <h2>Interactive Supply Network</h2>
      <p>Click a node to explore downstream locations.</p>

      <div className="network">
        <ReactFlow
          nodes={displayNodes}
          edges={displayEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => setSelectedId(node.id)}
          onPaneClick={() => setSelectedId(null)}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      <div className="card details">
        {selectedId ? (
          <>
            <h3>Network Impact</h3>
            <p>
              Selected:{" "}
              {nodes.find((n) => n.id === selectedId)?.data.label}
            </p>
            <p>
              Reachable locations: {affected.size - 1}
            </p>
            <button onClick={() => setSelectedId(null)}>
              Clear Selection
            </button>
          </>
        ) : (
          <p>Select a supplier or warehouse to see its impact.</p>
        )}
      </div>
    </main>
  );
}
