import { NextResponse } from "next/server";
import httpAppRequest from "../../../../../../../helper/httpAppRequest";

export async function PUT(req) {
  const { pathname } = req.nextUrl;
  const body = await req.json(); // Get the current URL path

  // Extract the room ID from the URL parameter (pathname is "/management/rooms/delete/[id]")
  const id = pathname.split("/").pop(); // The last part of the path should be the ID

  try {
    const response = await httpAppRequest(
      req,
      `/management/user/reset-password/${id}`,
      "PUT",
      body
    );

    return NextResponse.json(response);
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: e.code || 500 });
  }
}
