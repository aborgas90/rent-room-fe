import { NextResponse } from "next/server";
import httpAppRequest from "../../../../../helper/httpAppRequest";

export async function GET(req, res) {
  try {
    const { searchParams } = req.nextUrl;
    const role = searchParams.get("role");

    const response = await httpAppRequest(req, `/management/user?role=${role}`);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: error.code || 500 }
    );
  }
}
