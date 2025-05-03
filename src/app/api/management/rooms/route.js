import { NextResponse } from "next/server";
import httpAppRequest from "../../../../../helper/httpAppRequest";

export async function GET(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const response = await httpAppRequest(
      req,
      `/management/rooms?page=${page}&limit=${limit}`
    );
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: error.code || 500 }
    );
  }
}
