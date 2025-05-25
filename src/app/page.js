"use client";

import Navbar from "./components/header/Navbar";
import RoomCard from "./components/body/Room";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col scroll-smooth">
      {/* Navigation */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative w-full h-[32rem] bg-black" id="hero">
        <img
          src="/background1.jpeg"
          alt="Background"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Temukan Kamar Kost Terbaik untuk Anda
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl">
            Sewa kamar kost nyaman, bersih, dan terjangkau hanya dengan beberapa
            klik.
          </p>
          <a
            href="#room"
            className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-lg"
          >
            Lihat Kamar
          </a>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 px-6 bg-white text-center" id="why">
        <h2 className="text-3xl font-bold mb-6">Kenapa Memilih Kami?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            [
              "🏠",
              "Fasilitas Lengkap",
              "Dilengkapi fasilitas modern & nyaman.",
            ],
            [
              "💰",
              "Harga Terjangkau",
              "Harga bersahabat sesuai kebutuhan Anda.",
            ],
            [
              "🧹",
              "Bersih & Terawat",
              "Perawatan berkala untuk kenyamanan Anda.",
            ],
          ].map(([icon, title, desc], idx) => (
            <div key={idx}>
              <div className="text-indigo-600 text-4xl mb-2">{icon}</div>
              <h3 className="text-xl font-semibold mb-1">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROOM LISTING */}
      <section id="room" className="bg-gray-100 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Kamar Tersedia</h2>
        <div className="flex justify-center">
          <RoomCard />
        </div>
      </section>

      {/* FACILITY HIGHLIGHT */}
      <section id="fasility" className="py-16 px-6 bg-white border-t">
        <h2 className="text-3xl font-bold text-center mb-8">Fasilitas Kami</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            ["🛏️", "Tempat Tidur", "Kasur dan bantal telah tersedia."],
            ["🚿", "Kamar Mandi Dalam", "Tersedia kamar mandi di dalam kamar."],
            [
              "🚻",
              "Kamar Mandi Luar",
              "Tersedia kamar mandi berada di luar kamar.",
            ],
            ["📶", "WiFi", "Akses internet tersedia di area kost."],
            [
              "🧺",
              "Laundry & Jemuran",
              "Area untuk mencuci dan menjemur pakaian.",
            ],
            ["🅿️", "Parkir Dalam", "Area parkir tersedia di dalam bangunan."],
          ].map(([icon, title, desc], idx) => (
            <div
              key={idx}
              className="border rounded-xl p-6 text-center shadow hover:shadow-md transition"
            >
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section id="testimonial" className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-10">
          Apa Kata Mereka?
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            [
              "Kost ini sangat nyaman dan bersih. Lokasinya juga strategis!",
              "Rina, Mahasiswi",
            ],
            [
              "Pelayanan cepat dan profesional. Kamar sesuai foto!",
              "Budi, Pekerja Kantoran",
            ],
          ].map(([quote, name], idx) => (
            <div key={idx} className="p-6 border rounded-lg shadow-sm">
              <p className="italic mb-2">"{quote}"</p>
              <p className="font-semibold">– {name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SUPPORT & GUARANTEE */}
      <section id="support" className="py-16 px-6 bg-indigo-50 text-center">
        <h2 className="text-3xl font-bold mb-6">Jaminan & Dukungan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            ["🛠️", "Layanan Cepat", "Respons cepat untuk setiap kebutuhan"],
            ["📞", "Kontak Mudah", "Langsung via WhatsApp dengan admin"],
            [
              "🤝",
              "Pelayanan Ramah",
              "Admin dan pengelola siap membantu dengan respons cepat.",
            ],
          ].map(([icon, title, desc], idx) => (
            <div key={idx}>
              <div className="text-indigo-600 text-4xl mb-2">{icon}</div>
              <h3 className="text-lg font-semibold mb-1">{title}</h3>
              <p className="text-gray-700 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT US */}
      <section id="about" className="bg-white py-20 px-6 border-t">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Tentang Kami</h2>
          <p className="text-gray-600 text-lg mb-6">
            Poniran Kost berdiri sejak 2010, menyediakan tempat tinggal nyaman,
            aman, dan terjangkau untuk mahasiswa maupun pekerja.
          </p>
          <p className="text-gray-600">
            Kami percaya bahwa kost bukan sekadar tempat tinggal, tapi tempat
            tumbuh dan berkembang bersama.
          </p>
        </div>
      </section>

      {/* LOCATION MAP */}
      <section className="bg-gray-100 py-16 px-6" id="location">
        <h2 className="text-3xl font-bold text-center mb-6">
          Lokasi Strategis
        </h2>
        <p className="text-center mb-8 text-gray-600 max-w-2xl mx-auto">
          Kost kami terletak di pusat kota, dekat kampus dan perkantoran,
          memudahkan akses transportasi, makanan, dan hiburan.
        </p>
        <div className="flex justify-center">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3997.768888568665!2d109.22724207504832!3d-7.403677992606393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zN8KwMjQnMTMuMiJTIDEwOcKwMTMnNDcuMyJF!5e1!3m2!1sen!2sid!4v1746699520665!5m2!1sen!2sid"
            width="600"
            height="450"
            className="rounded-lg border shadow-lg"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      {/* FLOATING ACTION BUTTON */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/6281328169411?text=Halo%20admin,%20saya%20tertarik%20dengan%20kost%20Anda"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition flex items-center gap-2"
        >
          💬 Booking via WhatsApp
        </a>
      </div>

      {/* FOOTER */}
      <footer className="bg-indigo-700 text-white text-center py-6">
        <p>
          &copy; {new Date().getFullYear()} PonirantKost.id – Semua hak
          dilindungi.
        </p>
      </footer>
    </div>
  );
}
