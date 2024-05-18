"use client";

import React, { useState, useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { ReactFlowProvider } from "@xyflow/react";
import { Checkbox } from "@headlessui/react";
import CFG from "./CFG";

const phases = [
  {
    name: "pre ssa",
    value: "pre_ssa",
  },
  {
    name: "ssa",
    value: "ssa",
  },
  {
    name: "post ssa",
    value: "post_ssa",
  },
];

const optimizations = [
  {
    name: "no optimizations",
    value: "none",
  },
  {
    name: "copy propagation",
    value: "cp",
  },
  {
    name: "constant folding",
    value: "cf",
  },
  {
    name: "dead code elim",
    value: "dce",
  },
  {
    name: "common subexpr elim",
    value: "cse",
  },
  {
    name: "all optimizations",
    value: "all",
  },
];

export default function Home() {
  const [program, setProgram] = useState<string>("");
  const [selectedOpt, setSelectedOpt] = useState<string[]>(["none"]);
  const [selectedPhase, setSelectedPhase] = useState<string>("ssa");

  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      fetch("/theme.json")
        .then((res) => res.json())
        .then((data) => {
          monaco.editor.defineTheme("decafe", data);
          monaco.editor.setTheme("decafe");
        });
    }
  }, [monaco]);

  const selectOpt = (checked: boolean, opt: string) => {
    let newOpts = [];

    if (checked) {
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
    setSelectedOpt(newOpts);
  };

  const selectPhase = (phase: string) => {
    if (phase == "pre_ssa") {
      setSelectedOpt(["none"]);
    }
    setSelectedPhase(phase);
  };

  return (
    <main className="flex flex-col h-screen w-screen">
      <div className="h-full w-full flex">
        <div className="w-2/12 bg-primary">
          <div className="flex flex-col space-y-2 p-4">
            <div>Select Phase:</div>
            {phases.map((ph, index) => (
              <div key={"ph" + index} className="flex items-center">
                <Checkbox
                  id={ph.value}
                  name="phase"
                  checked={selectedPhase === ph.value}
                  onChange={() => selectPhase(ph.value)}
                  className="group form-checkbox p-2 h-9 w-full rounded-md bg-cafe4 data-[checked]:bg-cafe2 text-sm"
                >
                  {ph.name}
                </Checkbox>
              </div>
            ))}
            <div className="">Select Optimizations:</div>
            {optimizations.map((opt, index) => (
              <div key={"opt" + index} className="flex items-center">
                <Checkbox
                  id={opt.value}
                  name="optimization"
                  checked={selectedOpt.includes(opt.value)}
                  onChange={(checked) => selectOpt(checked, opt.value)}
                  className="group form-checkbox p-2 h-9 w-full rounded-md bg-cafe4 data-[checked]:bg-cafe2 text-sm"
                >
                  {opt.name}
                </Checkbox>
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
