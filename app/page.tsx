"use client";

import React, { useState, useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import { ReactFlowProvider } from "@xyflow/react";
import {
  Checkbox,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
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

let programs: Record<string, string> = {};

export default function Home() {
  const [program, setProgram] = useState<string>("");
  const [selectedOpt, setSelectedOpt] = useState<string[]>(["none"]);
  const [selectedPhase, setSelectedPhase] = useState<string>("ssa");
  const [selectedProgram, setSelectedProgram] = useState<string>("fibonacci");
  const [output, setOutput] = useState<string>("");

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

    fetch("/programs.json")
      .then((res) => res.json())
      .then((data) => {
        programs = data;
        setProgram(data[selectedProgram]);
      });
  }, [monaco]);

  useEffect(() => {
    console.log(program);
  }, [program]);

  const runCode = async () => {
    const result = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        target: "exec",
        opt: selectedOpt.join(","),
        input: program,
      }),
    });
    const output = await result.json();

    if (output.error !== undefined) {
      setOutput(output.error);
    } else {
      setOutput("Success!");
    }
  }

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

  const selectProgram = (prog: string) => {
    setSelectedProgram(prog);
    setProgram(programs[prog]);
    setSelectedOpt(["all"]);
    setSelectedPhase("post_ssa");
  };

  return (
    <main className="flex flex-col h-screen w-screen font-mabry">
      <div className="h-12 bg-cafe2">
        <div className="flex align-center h-full text-primary text-xl">
          <div className="flex items-center ml-8 w-2/12">decafe</div>
          <div className="flex justify-between items-center w-4/12">
            <Menu>
              {({ open }) => (
                <>
                  <MenuButton className="flex justify-between border-2 w-48 rounded-lg px-2 text-left">
                    <div>{selectedProgram + ":"}</div>
                    <div className="text-sm"></div>
                  </MenuButton>
                  <MenuItems
                    anchor="bottom start"
                    className="bg-cafe2 text-primary rounded-md pt-2 text-md"
                  >
                    {Object.keys(programs).map((prog, index) => (
                      <MenuItem key={"prog" + index}>
                        <div
                          className="block w-48 data-[focus]:bg-cafe3 px-2 transition-colors py-1"
                          onClick={() => selectProgram(prog)}
                        >
                          {prog}
                        </div>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </>
              )}
            </Menu>
            <button
              className="mr-8 border-2 rounded-md px-2"
              onClick={runCode}
            >
              run code
            </button>
          </div>
          <div className="flex items-center w-6/12">
            <div>intermediate representation:</div>
          </div>
        </div>
      </div>
      <div className="h-full w-full flex bg-primary">
        <div className="w-1/2 flex flex-col">
          <div className="flex h-5/6">
            <div className="w-1/3">
              <div className="flex flex-col space-y-2 px-4 pt-3">
                <div>Select Phase:</div>
                {phases.map((ph, index) => (
                  <div key={"ph" + index} className="flex items-center">
                    <Checkbox
                      id={ph.value}
                      name="phase"
                      checked={selectedPhase === ph.value}
                      onChange={() => selectPhase(ph.value)}
                      className="group form-checkbox p-2 h-9 w-full rounded-md bg-cafe4 text-sm data-[checked]:bg-cafe2 data-[checked]:text-primary"
                    >
                      {ph.name}
                    </Checkbox>
                  </div>
                ))}
                <div>Select Optimizations:</div>
                {optimizations.map((opt, index) => (
                  <div key={"opt" + index} className="flex items-center">
                    <Checkbox
                      id={opt.value}
                      name="optimization"
                      checked={selectedOpt.includes(opt.value)}
                      onChange={(checked) => selectOpt(checked, opt.value)}
                      className="group form-checkbox p-2 h-9 w-full rounded-md bg-cafe4 text-sm data-[checked]:bg-cafe2 data-[checked]:text-primary"
                    >
                      {opt.name}
                    </Checkbox>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-2/3">
              <Editor
                className="w-1/2"
                defaultLanguage="c"
                theme="vs-dark"
                value={program}
                onChange={(text) => setProgram(text ?? "")}
              />
            </div>
          </div>
          <div className="h-1/6 p-2">
            <div className="w-full h-full border-4 border-cafe2 rounded-xl p-2">
              <div className="text-cafe2 text-sm">output</div>
              <div>{"> " + output}</div>
            </div>
          </div>
        </div>

        <div className="w-6/12">
          <ReactFlowProvider>
            <CFG
              input={program}
              phase={selectedPhase}
              opt={selectedOpt.join(",")}
              setOutput={setOutput}
            />
          </ReactFlowProvider>
        </div>
      </div>
    </main>
  );
}
