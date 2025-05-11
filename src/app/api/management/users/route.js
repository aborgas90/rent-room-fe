import { NextResponse } from "next/server";
import httpAppRequest from "../../../../../helper/httpAppRequest";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const role = searchParams.get("role") || "";
    const search = searchParams.get("search") || "";
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    // Buat query string yang lengkap
    const queryString = new URLSearchParams({
      role,
      search,
      page,
      limit,
    }).toString();

    const response = await httpAppRequest(
      req,
      `/management/user?${queryString}`
    );
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: error.code || 500 }
    );
  }
}
