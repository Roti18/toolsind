import { NextRequest, NextResponse } from "next/server";

// Fungsi untuk mengonversi timestamp Unix ke waktu lokal
// Fungsi ini adalah versi yang sudah Anda sediakan sebelumnya.
function convertUnixToLocal(unix: number): string {
  try {
    // Memeriksa apakah input adalah angka yang valid
    if (isNaN(unix)) {
      throw new Error("Invalid timestamp");
    }

    // Mengonversi timestamp (dalam detik) ke milidetik
    const date = new Date(unix * 1000);

    // Mengembalikan tanggal dan waktu dalam format lokal
    return date.toLocaleString();
  } catch {
    // Menangani error jika konversi gagal
    return "Invalid timestamp";
  }
}

/**
 * Handle POST request untuk mengkonversi Unix timestamp.
 * Endpoint ini membaca timestamp dari body request JSON.
 */
export async function POST(req: NextRequest) {
  try {
    // Membaca body request JSON dan mendapatkan nilai 'unix'
    const { unix } = await req.json();

    // Memastikan nilai 'unix' adalah angka yang valid
    if (typeof unix !== "number" || isNaN(unix)) {
      return NextResponse.json({ error: "Invalid timestamp" }, { status: 400 });
    }

    // Memanggil fungsi konversi
    const localTime = convertUnixToLocal(unix);

    // Mengembalikan respons sukses dengan waktu lokal
    return NextResponse.json({ localTime });
  } catch {
    // Menangani error jika parsing JSON atau proses lainnya gagal
    return NextResponse.json(
      { error: "Invalid request body or conversion failed" },
      { status: 400 }
    );
  }
}
