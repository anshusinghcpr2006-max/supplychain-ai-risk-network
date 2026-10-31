
import { useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./index.css";

const initialNodes = [
  {
    id: "s1",
    position: { x: 40, y: 100 },
    data: { label: "Supplier A" },
    style: { background: "#dbeafe", padding: 12, borderRadius: 8 },
  },
  {
    id: "w1",
    position: { x: 290, y: 100 },
    data: { label: "Warehouse 1" },
    style: { background: "#dcfce7", padding: 12, borderRadius: 8 },
  },
  {
    id: "w2",
    position: { x: 290, y: 250 },
    data: { label: "Warehouse 2" },
    style: { background: "#dcfce7", padding: 12, borderRadius: 8 },
  },
  {
    id: "st1",
    position: { x: 560, y: 175 },
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

export default function App() {
  const [selected, setSelected] = useState(null);

  return (
    <main className="dashboard">
      <h1>SupplyChain AI</h1>
      <p>Supplier & Warehouse Risk Network</p>

      <div className="cards">
        <div className="card">
          <span>Suppliers</span>
          <h2>12</h2>
        </div>
        <div className="card">
          <span>Warehouses</span>
          <h2>8</h2>
        </div>
        <div className="card">
          <span>At-Risk Shipments</span>
          <h2>3</h2>
        </div>
      </div>

      <h2>Supply Network</h2>
      <div className="network">
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          fitView
          onNodeClick={(_, node) => setSelected(node)}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {selected && (
        <div className="card details">
          <h3>Selected Location</h3>
          <p>{selected.data.label}</p>
          <button onClick={() => setSelected(null)}>
            Close
          </button>
        </div>
      )}
    </main>
  );
}
