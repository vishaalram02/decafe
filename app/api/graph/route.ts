import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ message: 'Hello World' });
}

export async function POST(request: NextRequest) {
    const req = await request.json();
    if(!req || !req.input){
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const input = req.input;
    const result = await fetch('http://localhost:5001/graph', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Basic ${btoa('username:password')}`
        },

        body: JSON.stringify({ type: 'cfg', input: input }),
    });

    const data = await result.json();
    return NextResponse.json(data);
}

