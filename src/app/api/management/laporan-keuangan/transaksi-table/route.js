import { NextResponse } from "next/server";
import httpAppRequest from "../../../../../../helper/httpAppRequest";

export async function GET(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const response = await httpAppRequest(
      req,
      `/management/report-money/transaction?type=${type}`
    );

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: error.code || 500 }
    );
  }
}
