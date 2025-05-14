import { NextResponse } from "next/server";
import httpAppRequest from "~helper/httpAppRequest";

export async function GET(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const pageSize = searchParams.get("pageSize") || "10";
    const response = await httpAppRequest(
      req,
      `/booking-request/list?page=${page}&pageSize=${pageSize}`
    );

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: error.code || 500 }
    );
  }
}
