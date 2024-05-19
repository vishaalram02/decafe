import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const req = await request.json();
  if (!req || !req.input) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const target = req.target;
  const input = req.input;
  const opt = req.opt;

  let data = {};

  if (target == "ir") {
    const phase = req.phase;
    const result = await fetch("http://coffee.vishy.lol/ir", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa("username:password")}`,
      },

      body: JSON.stringify({ target, input, opt, phase }),
    });

    data = await result.json();
  } else if (target == "exec") {
    const result = await fetch("http://coffee.vishy.lol/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa("username:password")}`,
      },

      body: JSON.stringify({ target, input, opt }),
    });
    data = await result.json();
  }

  return NextResponse.json(data);
}
