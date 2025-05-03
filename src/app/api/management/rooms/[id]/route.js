import { NextResponse } from "next/server";
import httpAppRequest from "../../../../../../../helper/httpAppRequest";

export async function GET(req) {
  const { pathname } = req.nextUrl; // Get the current URL path

  // Extract the room ID from the URL parameter (pathname is "/management/rooms/delete/[id]")
  const id = pathname.split("/").pop(); // The last part of the path should be the ID

  try {
    // Send the DELETE request to your API (Make sure the URL structure is correct)
    const response = await httpAppRequest(
      req,
      `/management/rooms/delete/${id}`
    );

    return NextResponse.json(response);
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: e.code || 500 });
  }
}
