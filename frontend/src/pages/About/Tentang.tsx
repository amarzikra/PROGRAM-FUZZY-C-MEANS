import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Stethoscope, ArrowLeft, BrainCircuit, Network, Microscope, ScatterChart, Fingerprint, Crosshair } from "lucide-react";

export default function Tentang() {
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
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 mb-6 border border-indigo-200 shadow-sm">
            <Network className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-6 tracking-tight">Kecerdasan Fuzzy C-Means</h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Menyelami kehebatan algoritma pengelompokan (<em>clustering</em>) di balik kecerdasan sistem kita dalam mendeteksi dan memisahkan jaringan luka secara otomatis.
          </p>
        </div>

        {/* Introduction Section */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200/60 shadow-sm mb-16 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-150">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-200 rounded-full blur-[50px] opacity-50" />
                <BrainCircuit className="w-32 h-32 text-indigo-500 relative z-10" />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-3xl font-display font-bold text-slate-800 mb-4">Mengenal Logika Fuzzy</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                Dalam dunia medis, sangat sulit menemukan batasan warna yang tegas (hitam atau putih) antara sel sehat, jaringan luka (granulasi), dan jaringan mati (nekrotik). Transisinya seringkali <strong>samar atau abu-abu (<em>fuzzy</em>)</strong>.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed">
                Di sinilah <strong>Fuzzy C-Means (FCM)</strong> bersinar. Berbeda dengan logika klasik yang memaksa sebuah piksel mutlak menjadi "luka" atau "bukan luka", FCM memberikan <strong>derajat keanggotaan (<em>membership degree</em>)</strong> dari 0 hingga 1. Hal ini memungkinkan segmentasi jaringan medis yang jauh lebih natural dan sangat akurat secara klinis.
              </p>
            </div>
          </div>
        </div>

        {/* Kenapa FCM Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold text-center text-slate-800 mb-10">Keunggulan Pendekatan Ini</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100 hover:bg-blue-50 transition-colors">
              <Microscope className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-3">Toleransi Ambiguitas</h3>
              <p className="text-slate-600">Piksel pada tepi luka yang bercampur dengan kulit sehat tidak akan diabaikan, melainkan dibobotkan secara proporsional berkat matriks derajat keanggotaan.</p>
            </div>
            <div className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100 hover:bg-indigo-50 transition-colors">
              <Crosshair className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-3">Minim Evaluasi Subjektif</h3>
              <p className="text-slate-600">Menghilangkan bias visual yang sering terjadi saat dokter atau perawat mencoba mengukur panjang dan lebar luka secara manual menggunakan penggaris mika.</p>
            </div>
            <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100 hover:bg-emerald-50 transition-colors">
              <ScatterChart className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-800 mb-3">Optimalisasi Matematis</h3>
              <p className="text-slate-600">Pusat klaster (<em>centroid</em>) diperbarui secara berulang (iteratif) melalui rumus optimasi matematis hingga konvergen pada kelompok piksel luka sesungguhnya.</p>
            </div>
          </div>
        </div>

        {/* Pipeline Diagram */}
        <h2 className="text-3xl font-display font-bold text-center text-slate-800 mb-12">Anatomi Proses Algoritma</h2>

        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-blue-200 before:to-indigo-200">
          
          {/* Step 1 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-white bg-slate-100 text-slate-600 shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <Fingerprint className="w-7 h-7" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-1 block">Fase 1</span>
              <h3 className="font-display font-bold text-xl text-slate-800 mb-3">Pra-Pemrosesan (Ekstraksi Ciri)</h3>
              <p className="text-slate-600 leading-relaxed">
                Gambar asli dipotong (<em>crop</em>) untuk memfokuskan area observasi (Region of Interest / ROI). Kemudian warna RGB diubah menjadi model matriks tunggal seperti Grayscale, HSV (S-Channel), atau CIELab (A-Channel) untuk menyoroti pigmen kemerahan atau kehitaman dari luka.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-sm font-bold tracking-wider text-blue-400 uppercase mb-1 block">Fase 2</span>
              <h3 className="font-display font-bold text-xl text-slate-800 mb-3">Klasterisasi Fuzzy Iteratif</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Sistem menginisialisasi parameter krusial:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 mb-4 text-sm">
                <li><strong>Klaster (c):</strong> Biasanya 3 (Luka, Kulit, Background).</li>
                <li><strong>Fuzziness (m):</strong> Tingkat kesamaran (biasanya = 2).</li>
                <li><strong>Max Iteration & Epsilon:</strong> Batas perulangan optimasi (biasanya 100 iterasi atau epsilon 0.00001).</li>
              </ul>
              <p className="text-slate-600 leading-relaxed text-sm">
                Matriks keanggotaan dan nilai pusat klaster dihitung ulang terus-menerus. Proses berhenti saat letak pusat klaster stabil dan tidak bergeser lagi.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-white bg-indigo-100 text-indigo-600 shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <ScatterChart className="w-7 h-7" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-sm font-bold tracking-wider text-indigo-400 uppercase mb-1 block">Fase 3</span>
              <h3 className="font-display font-bold text-xl text-slate-800 mb-3">Rekonstruksi & Masking</h3>
              <p className="text-slate-600 leading-relaxed">
                Piksel dengan nilai keanggotaan tertinggi pada "Klaster Luka" diubah menjadi warna putih pekat (nilai biner 1), sedangkan sisanya menjadi hitam pekat (nilai biner 0). Ini menghasilkan gambar masker (<em>mask image</em>) yang sangat kontras.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-white bg-emerald-100 text-emerald-600 shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <Microscope className="w-7 h-7" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-sm font-bold tracking-wider text-emerald-400 uppercase mb-1 block">Fase 4</span>
              <h3 className="font-display font-bold text-xl text-slate-800 mb-3">Estimasi Luas Definitif</h3>
              <p className="text-slate-600 leading-relaxed">
                Algoritma menghitung jumlah total piksel berwarna putih pada gambar masker. Menggunakan nilai kalibrasi dari stiker 1x1 cm (piksel_per_cm²), total piksel putih dibagi dengan nilai kalibrasi untuk menghasilkan angka luasan luka akhir dalam satuan sentimeter persegi (cm²).
              </p>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
