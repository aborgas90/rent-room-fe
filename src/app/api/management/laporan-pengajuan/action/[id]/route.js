import { NextResponse } from "next/server";
import httpAppRequest from "../../../../../../../helper/httpAppRequest";

export async function PUT(req) {
  const { pathname } = req.nextUrl; // Get the current URL path

  const id = pathname.split("/").pop();

  try {
    const response = await httpAppRequest(
      req,
      `/management/report-problem/${id}`,
      "PUT"
    );

    return NextResponse.json(response);
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: e.code || 500 });
  }
}
