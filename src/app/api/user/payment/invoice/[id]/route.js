import { NextResponse } from "next/server";
import httpAppRequest from "~helper/httpAppRequest";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const order_id = url.pathname.split("/").pop(); // Ambil order_id dari URL (misal: /booking-info/2)

    // Forward ke backend API
    const response = await httpAppRequest(req, `/payment/invoice/${order_id}`);

    return NextResponse.json(response);
  } catch (e) {
    return NextResponse.json(
      { message: e.message || "Internal server error" },
      { status: e.code || 500 }
    );
  }
}
