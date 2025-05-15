import { NextResponse } from "next/server";
import httpAppRequest from "~helper/httpAppRequest";

export async function GET(req, res) {
  try {
    const response = await httpAppRequest(req, `/dashboard/report/monthly`);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: error.code || 500 }
    );
  }
}

// /booking-request/create
