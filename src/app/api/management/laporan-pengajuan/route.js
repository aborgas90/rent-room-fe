import { NextResponse } from "next/server";
import httpAppRequest from "../../../../../helper/httpAppRequest";

export async function GET(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = searchParams.get("page"); // Fixed: was getting "status" instead of "page"
    const limit = searchParams.get("limit");
    const response = await httpAppRequest(
      req,
      `/management/report-problem?status=${status}&page=${page}&limit=${limit}`
    );

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: error.code || 500 }
    );
  }
}
