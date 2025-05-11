import { NextResponse } from "next/server";
import httpAppRequest from "~helper/httpAppRequest";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Ambil ID dari URL (misal: /booking-info/2)

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid ID parameter" },
        { status: 400 }
      );
    }

    // Forward ke backend API
    const response = await httpAppRequest(
      req,
      `/request-book/booking-info/${id}`
    );

    return NextResponse.json(response);
  } catch (e) {
    return NextResponse.json(
      { message: e.message || "Internal server error" },
      { status: e.code || 500 }
    );
  }
}
