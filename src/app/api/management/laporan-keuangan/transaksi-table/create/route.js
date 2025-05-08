import { NextResponse } from "next/server";
import httpAppRequest from "../../../../../../../helper/httpAppRequest";

export async function POST(req, res) {
  try {
    const body = await req.json();

    const response = await httpAppRequest(
      req,
      `/management/report-money/create`,
      "POST",
      body
    );
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: error.code || 500 }
    );
  }
}
