import { NextResponse } from "next/server";
import httpAppRequest from "../../../../../../../../helper/httpAppRequest";

export async function PUT(req) {
  try {
    // Get the dynamic parameter 'id' from the request URL
    const id = req.nextUrl.pathname.split("/").pop(); // This assumes the URL is structured like `/management/rooms/update/[id]`

    // Parse the request body
    const body = await req.json();

    // Call the helper function to send the PUT request
    const response = await httpAppRequest(
      req,
      `/management/report-money/update/${id}`,
      "PUT",
      body
    );

    // Return the response
    return NextResponse.json(response);
  } catch (e) {
    // Catch and handle errors
    return NextResponse.json({ message: e.message }, { status: e.code || 500 });
  }
}
