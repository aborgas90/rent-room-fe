import { NextResponse } from "next/server";
import httpAppRequest from "~helper/httpAppRequest";

export async function POST(req) {
  const { pathname } = req.nextUrl; // Get the current URL path

  const id = pathname.split("/").pop();

  try {
    const response = await httpAppRequest(
      req,
      `/booking-request/reject/${id}`,
      "POST"
    );
    return NextResponse.json(response);
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: e.code || 500 });
  }
}
