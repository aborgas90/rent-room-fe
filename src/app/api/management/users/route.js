import { NextResponse } from "next/server";
import httpAppRequest from "../../../../../helper/httpAppRequest";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url); // ini penting: ambil dari URL
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
