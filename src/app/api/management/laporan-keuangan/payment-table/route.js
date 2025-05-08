import { NextResponse } from "next/server";
import httpAppRequest from "../../../../../../helper/httpAppRequest";

export async function GET(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const response = await httpAppRequest(
      req,
      `/management/list-payment?status=${status}`
    );

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: error.code || 500 }
    );
  }
}
