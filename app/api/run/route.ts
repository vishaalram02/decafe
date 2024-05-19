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
  const auth = btoa(
    `${process.env.BACKEND_USERNAME}:${process.env.BACKEND_PASSWORD}`,
  );

  if (target == "ir") {
    const phase = req.phase;
    const result = await fetch(`${process.env.BACKEND_URL}/ir`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },

      body: JSON.stringify({ target, input, opt, phase }),
    });

    data = await result.json();
  } else if (target == "exec") {
    const result = await fetch(`${process.env.BACKEND_URL}/exec`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },

      body: JSON.stringify({ target, input, opt }),
    });
    data = await result.json();
  }

  return NextResponse.json(data);
}
