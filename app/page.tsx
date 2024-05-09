"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { ReactFlowProvider } from "@xyflow/react";
import CFG from "./CFG";

const phases = ["pre_ssa", "ssa", "post_ssa"];

const optimizations = ["none", "cp", "cf", "dce", "all"];

export default function Home() {
  const [program, setProgram] = useState<string>("");
  const [selectedOpt, setSelectedOpt] = useState<string[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string>("ssa");

  const selectOpt = (e: any) => {
    const opt = e.target.value;
    let newOpts = [];

    if (e.target.checked) {
      if (opt === "all") {
        newOpts = ["all"];
      } else if (opt === "none") {
        newOpts = ["none"];
      } else {
        newOpts = selectedOpt.filter(
          (o) => o !== "none" && o !== "all" && o !== opt,
        );
        newOpts.push(opt);
      }
    } else {
      newOpts = selectedOpt.filter((o) => o !== opt);
    }

    if (newOpts.length === 0) {
      newOpts = ["none"];
    }
    const optStr = newOpts.join(",");
    setSelectedOpt(newOpts);
  };

  const selectPhase = (e: any) => {
    const phase = e.target.value;
    setSelectedPhase(phase);
  };

  return (
    <main className="flex flex-col h-screen w-screen">
      <div className="h-full w-full flex">
        <div className="w-2/12">
          <div className="flex flex-col space-y-2 p-4">
            {/* <button onClick={onLayout}>hi</button> */}
            <div>Select Phase:</div>
            {phases.map((ph, index) => (
              <div key={"ph" + index}>
                <input
                  type="radio"
                  id={ph}
                  name="phase"
                  value={ph}
                  onChange={selectPhase}
                  checked={selectedPhase === ph}
                />
                <label htmlFor={ph} className="ml-1">
                  {ph}
                </label>
              </div>
            ))}
            <div>Select Optimizations:</div>
            {optimizations.map((opt, index) => (
              <div key={"opt" + index}>
                <input
                  type="checkbox"
                  id={opt}
                  name="optimization"
                  value={opt}
                  onChange={selectOpt}
                  checked={selectedOpt.includes(opt)}
                />
                <label htmlFor={opt} className="ml-1">
                  {opt}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="w-4/12">
          <Editor
            className="w-1/2"
            defaultLanguage="c"
            theme="vs-dark"
            value={program}
            onChange={(text) => setProgram(text ?? "")}
          />
        </div>
        <div className="w-6/12">
          <ReactFlowProvider>
            <CFG
              input={program}
              phase={selectedPhase}
              opt={selectedOpt.join(",")}
            />
          </ReactFlowProvider>
        </div>
      </div>
    </main>
  );
}
