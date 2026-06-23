import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Stethoscope, ArrowLeft, ScanLine, SunDim, Focus, Ruler, CheckCircle2, XCircle, FileImage, ShieldAlert } from "lucide-react";

export default function Panduan() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200">
      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg shadow-md shadow-blue-500/20">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-display font-bold text-xl text-slate-800 tracking-tight">
              Diabetic<span className="text-blue-600">Care</span>
            </h1>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" className="rounded-xl text-slate-600 hover:bg-slate-100 font-medium">
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
        <div className="mb-16 text-center animate-in slide-in-from-bottom-4 fade-in duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 mb-6 border border-blue-200 shadow-sm transform -rotate-3">
            <ScanLine className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-6 tracking-tight">Protokol Pengambilan Citra</h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Kualitas analisis kecerdasan buatan sangat bergantung pada kualitas data masukan. Ikuti <strong>Standar Operasional Prosedur (SOP)</strong> berikut agar algoritma Fuzzy C-Means dapat bekerja dengan presisi maksimal.
          </p>
        </div>

        {/* 4 Main Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-150">
          
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-6">
              <SunDim className="w-7 h-7 text-amber-600" />
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-800 mb-4">1. Intensitas Cahaya</h2>
            <p className="text-slate-600 leading-relaxed">
              Gunakan pencahayaan ruangan yang terang dan netral (putih). Hindari pantulan kilat (<em>flash</em>) langsung dari kamera karena akan memantul pada jaringan luka yang basah/eksudat, mengelabui sistem menjadi menganggapnya sebagai jaringan sehat (kulit).
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6">
              <Ruler className="w-7 h-7 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-800 mb-4">2. Kalibrasi Skala (Wajib)</h2>
            <p className="text-slate-600 leading-relaxed">
              Untuk mengonversi piksel menjadi satuan sentimeter persegi (cm²), Anda <strong>wajib menempelkan stiker medis berukuran 1x1 cm</strong> di permukaan kulit sehat sedekat mungkin dengan batas luka. Sistem akan menggunakan area kotak ini sebagai acuan perhitungan skala dunia nyata.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6">
              <Focus className="w-7 h-7 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-800 mb-4">3. Sudut dan Jarak</h2>
            <p className="text-slate-600 leading-relaxed">
              Posisikan lensa kamera tepat <strong>tegak lurus (90 derajat)</strong> di atas luka pada jarak sekitar 15-20 cm. Jangan memotret dari sudut miring, karena akan menimbulkan distorsi perspektif yang membuat estimasi luas menjadi lebih kecil atau memanjang.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500" />
            <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mb-6">
              <ShieldAlert className="w-7 h-7 text-rose-600" />
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-800 mb-4">4. Kebersihan Objek</h2>
            <p className="text-slate-600 leading-relaxed">
              Sebelum difoto, pastikan tidak ada objek asing yang menutupi luka seperti perban, pinset, kapas, atau jari tangan. Gunakan latar belakang solid (misal: underpad medis biru/hijau polos) agar algoritma tidak bingung membedakan tekstur luar dengan luka.
            </p>
          </div>

        </div>

        {/* Dos and Don'ts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300">
          <div className="bg-green-50/50 border border-green-200 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center">
              <CheckCircle2 className="w-6 h-6 mr-2 text-green-600" /> Yang Dianjurkan (Do's)
            </h3>
            <ul className="space-y-4 text-green-900/80">
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3 shrink-0" />
                <p>Membersihkan area luka dari darah atau nanah berlebih sebelum difoto.</p>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3 shrink-0" />
                <p>Mengetuk layar layar kamera (<em>tap to focus</em>) tepat pada jaringan luka.</p>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3 shrink-0" />
                <p>Menempelkan stiker referensi 1x1 cm di atas kulit rata, sejajar dengan luka.</p>
              </li>
            </ul>
          </div>

          <div className="bg-red-50/50 border border-red-200 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-red-800 mb-6 flex items-center">
              <XCircle className="w-6 h-6 mr-2 text-red-600" /> Yang Dihindari (Don'ts)
            </h3>
            <ul className="space-y-4 text-red-900/80">
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 mr-3 shrink-0" />
                <p>Menggunakan filter percantik wajah (<em>beauty camera</em>) yang memudarkan detail batas luka.</p>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 mr-3 shrink-0" />
                <p>Kondisi tangan bergetar (<em>motion blur</em>) saat mengambil foto.</p>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 mr-3 shrink-0" />
                <p>Melipat atau memotong stiker referensi hingga ukurannya tidak lagi persis 1x1 cm.</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Action */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 flex flex-col items-center text-center text-white shadow-xl">
          <FileImage className="w-12 h-12 text-white/80 mb-4" />
          <h3 className="text-2xl font-bold mb-3">Siap Untuk Memulai?</h3>
          <p className="text-blue-100 mb-8 max-w-xl">
            Sistem mendukung format <strong>JPEG, JPG, dan PNG</strong> dengan ukuran optimal di bawah 5MB. Proses analisis biasanya memakan waktu sekitar 3-5 detik per gambar.
          </p>
          <Link to="/login">
            <Button size="lg" className="rounded-xl bg-white text-blue-600 hover:bg-slate-50 font-bold px-8 h-14">
              Masuk ke Ruang Analisis
            </Button>
          </Link>
        </div>

      </main>
    </div>
  );
}
