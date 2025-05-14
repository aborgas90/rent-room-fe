import { NextResponse } from "next/server";
import httpAppRequest from "../../../../../../helper/httpAppRequest";

export async function GET(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const payment_method = searchParams.get("payment_method");
    const search = searchParams.get("search");
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const response = await httpAppRequest(
      req,
      `/management/report-money/payment?search=${search}&payment_method=${payment_method}&year=${year}&month=${month}&status=${status}&page=${page}&limit=${limit}`
    );

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: error.code || 500 }
    );
  }
}
