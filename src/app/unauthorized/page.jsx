// app/unauthorized/page.jsx
export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold text-red-500">403 - Unauthorized</h1>
      <p className="mt-4 text-gray-600">
        Anda tidak memiliki izin untuk mengakses halaman ini.
      </p>
      <a
        href="/dashboard/"
        className="mt-6 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Kembali ke Beranda
      </a>
    </div>
  );
}
