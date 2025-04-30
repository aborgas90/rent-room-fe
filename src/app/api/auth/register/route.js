// src/app/api/auth/register/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: error.code || 500 }
    );
  }
}
