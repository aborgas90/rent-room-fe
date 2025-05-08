import { NextResponse } from "next/server";
import httpAppRequest from "../../../../../../helper/httpAppRequest";

export async function POST(req) {
  try {
    const formData = await req.formData();

    // Validasi field wajib
    const requiredFields = ["title", "description", "category"];
    const missingFields = requiredFields.filter(
      (field) => !formData.get(field)
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: `Field berikut wajib diisi: ${missingFields.join(", ")}`,
          code: 400,
        },
        { status: 400 }
      );
    }

    // Kirim ke backend service (termasuk file jika ada)
    const response = await httpAppRequest(
      req,
      "/report-problem/create",
      "POST",
      formData,
      true,
      true // Kirim FormData langsung termasuk file
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in API endpoint:", error);
    return NextResponse.json(
      {
        message: error.message || "Terjadi kesalahan pada server",
        code: error.code || 500,
      },
      { status: error.code || 500 }
    );
  }
}
