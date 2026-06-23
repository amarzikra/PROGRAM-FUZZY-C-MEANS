import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { motion, type Variants } from "framer-motion";
import { articlesData } from "../../data/articles";
import {
  Stethoscope, Activity, ArrowRight, ScanLine,
  BrainCircuit, ClipboardCheck, Phone, MapPin, Mail,
  Menu, X, UploadCloud, Crop, Focus, Layers, BarChart3,
  SunDim, Ruler, ShieldAlert, CheckCircle2, XCircle, FileImage,
  Network, Microscope, ScatterChart, Fingerprint, Crosshair
} from "lucide-react";

// --- Framer Motion Variants ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

// --- Custom CountUp Component ---
function Counter({ from = 0, to, duration = 2 }: { from?: number, to: number, duration?: number }) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let start = performance.now();
    let rAF: number;

    const update = (time: number) => {
      const progress = Math.min((time - start) / (duration * 1000), 1);
      setCount(Math.floor(progress * (to - from) + from));
      if (progress < 1) {
        rAF = requestAnimationFrame(update);
      }
    };
    rAF = requestAnimationFrame(update);

    return () => cancelAnimationFrame(rAF);
  }, [to, from, duration]);

  return <span>{count}</span>;
}

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Smooth scroll handler
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Height of the fixed header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-200">

      {/* HEADER / NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#beranda" onClick={(e) => scrollToSection(e, 'beranda')} className="flex items-center gap-3 hover:opacity-80 transition-opacity" aria-label="Beranda DiabeticCare">
            <div className="bg-gradient-to-br from-teal-600 to-indigo-600 p-2 rounded-lg shadow-md shadow-teal-500/20">
              <Stethoscope className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <h1 className="font-display font-bold text-xl text-slate-800 tracking-tight">
              Diabetic<span className="text-teal-600">Care</span>
            </h1>
          </a>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#beranda" onClick={(e) => scrollToSection(e, 'beranda')} className="text-slate-600 hover:text-teal-600 font-medium transition-colors">Beranda</a>
            <a href="#panduan" onClick={(e) => scrollToSection(e, 'panduan')} className="text-slate-600 hover:text-teal-600 font-medium transition-colors">Panduan</a>
            <a href="#tentang" onClick={(e) => scrollToSection(e, 'tentang')} className="text-slate-600 hover:text-teal-600 font-medium transition-colors">Metode FCM</a>
            <a href="#artikel" onClick={(e) => scrollToSection(e, 'artikel')} className="text-slate-600 hover:text-teal-600 font-medium transition-colors">Artikel</a>
          </nav>

          {/* Action Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50">
                Masuk
              </Button>
            </Link>
            <Link to="/login">
              <Button className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20">
                Daftar Akun
              </Button>
            </Link>
          </div>

          {/* Toggle Menu Mobile */}
          <button
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu Mobile"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Dropdown Menu Mobile */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-4 shadow-lg absolute w-full"
          >
            <a href="#beranda" onClick={(e) => scrollToSection(e, 'beranda')} className="block text-slate-600 hover:text-teal-600 font-medium py-2">Beranda</a>
            <a href="#panduan" onClick={(e) => scrollToSection(e, 'panduan')} className="block text-slate-600 hover:text-teal-600 font-medium py-2">Panduan</a>
            <a href="#tentang" onClick={(e) => scrollToSection(e, 'tentang')} className="block text-slate-600 hover:text-teal-600 font-medium py-2">Metode FCM</a>
            <a href="#artikel" onClick={(e) => scrollToSection(e, 'artikel')} className="block text-slate-600 hover:text-teal-600 font-medium py-2">Artikel</a>
            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full justify-center rounded-xl border-slate-300 text-slate-700">Masuk</Button>
              </Link>
              <Link to="/login" className="w-full">
                <Button className="w-full justify-center rounded-xl bg-teal-600 text-white">Daftar Akun</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="beranda" className="pt-36 px-6 relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-teal-400/10 blur-[100px] rounded-full pointer-events-none" />

        <motion.div
          className="max-w-4xl mx-auto w-full flex flex-col items-center z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-semibold mb-8 shadow-sm">
            <Activity className="w-4 h-4" aria-hidden="true" /> Riset & Implementasi Klinis
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
            Sistem Presisi Evaluasi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600">Ulkus Diabetikum</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
            Pengukuran objektif dan <strong>non-kontak</strong> untuk meminimalisir risiko infeksi silang. Dapatkan estimasi luas luka secara akurat dalam hitungan detik.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link to="/login" className="w-full sm:w-auto">
              <Button className="w-full h-14 px-8 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-lg font-medium shadow-xl shadow-teal-500/25 transition-transform hover:-translate-y-1">
                Mulai Analisis <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
              </Button>
            </Link>
            <a href="#panduan" onClick={(e) => scrollToSection(e, 'panduan')} className="w-full sm:w-auto block">
              <Button variant="outline" className="w-full h-14 px-8 rounded-xl border-slate-300 text-slate-700 text-lg font-medium hover:bg-slate-100 transition-transform hover:-translate-y-1">
                Pelajari Panduan
              </Button>
            </a>
          </motion.div>
        </motion.div>

        {/* FEATURE CARDS */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 mb-24 max-w-6xl w-full text-left relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mb-6 border border-teal-100">
              <ScanLine className="w-7 h-7 text-teal-600" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-800 mb-3">Segmentasi Otomatis</h3>
            <p className="text-slate-600 leading-relaxed">Pemisahan visual cerdas antara area luka aktif, jaringan nekrotik, dan kulit sehat di sekitarnya.</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 border border-indigo-100">
              <BrainCircuit className="w-7 h-7 text-indigo-600" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-800 mb-3">Mesin Fuzzy C-Means</h3>
            <p className="text-slate-600 leading-relaxed">Memecahkan batas tepi luka yang samar menggunakan pendekatan klasterisasi probabilitas tingkat lanjut.</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 border border-emerald-100">
              <ClipboardCheck className="w-7 h-7 text-emerald-600" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-800 mb-3">Evaluasi Objektif</h3>
            <p className="text-slate-600 leading-relaxed">Mengkonversi piksel menjadi satuan baku sentimeter persegi (cm²) yang valid untuk rekam medis terstandar.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* MENGAPA SISTEM INI SECTION */}
      <motion.section
        className="py-24 bg-white relative border-t border-slate-200/60"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div variants={fadeInUp} className="w-full lg:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-800 leading-tight">
                Tinggalkan Penggaris Medis Konvensional
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Pengukuran manual dengan menempelkan penggaris mika pada luka tidak hanya <strong>bersifat subjektif</strong> antar perawat, tetapi juga sangat berisiko memicu <strong>infeksi silang</strong>.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Sistem DiabeticCare mengubah foto luka dari smartphone Anda menjadi data kuantitatif yang solid tanpa perlu kontak fisik berlebih.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-teal-50/50 border border-teal-100 p-8 rounded-3xl text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-teal-600 mb-2">
                  &ge;<Counter to={80} />%
                </div>
                <p className="text-slate-700 font-bold mb-1">Akurasi Segmentasi</p>
                <p className="text-sm text-slate-500">Skor IoU & DSC</p>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100 p-8 rounded-3xl text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-emerald-600 mb-2">
                  100%
                </div>
                <p className="text-slate-700 font-bold mb-1">Non-Kontak</p>
                <p className="text-sm text-slate-500">Steril & Higienis</p>
              </div>
              <div className="bg-indigo-50/50 border border-indigo-100 p-8 rounded-3xl text-center sm:col-span-2">
                <div className="text-4xl md:text-5xl font-display font-bold text-indigo-600 mb-2 flex justify-center items-baseline gap-2">
                  &lt;<Counter to={5} /> <span className="text-2xl text-indigo-500 font-medium">detik</span>
                </div>
                <p className="text-slate-700 font-bold">Waktu Proses Analisis</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CARA KERJA (5 Langkah) SECTION */}
      <motion.section
        className="py-24 bg-slate-50 relative border-t border-slate-200/60"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-800 mb-4">Cara Kerja Sistem</h2>
            <p className="text-slate-600 text-lg">Alur kerja sistematis untuk mendapatkan hasil estimasi luka.</p>
          </motion.div>

          <div className="relative flex flex-col lg:flex-row justify-between gap-12 lg:gap-4 before:hidden lg:before:block before:absolute before:top-12 before:left-[10%] before:right-[10%] before:h-[2px] before:bg-slate-200">
            {[
              { icon: UploadCloud, title: "Unggah Citra", desc: "Upload foto klinis luka format JPG/PNG" },
              { icon: Crop, title: "Kalibrasi Referensi", desc: "Tandai area stiker 1x1 cm pada gambar" },
              { icon: Focus, title: "Segmentasi FCM", desc: "Pemisahan cerdas area jaringan luka" },
              { icon: Layers, title: "Estimasi Luas", desc: "Kalkulasi otomatis dalam cm²" },
              { icon: BarChart3, title: "Evaluasi Hasil", desc: "Review visualisasi masking dan metrik" },
            ].map((step, index) => (
              <motion.div key={index} variants={fadeInUp} className="relative flex flex-row lg:flex-col items-center gap-6 lg:gap-5 flex-1 z-10">
                <div className="w-24 h-24 shrink-0 bg-white rounded-full border-4 border-slate-50 shadow-md flex items-center justify-center relative">
                  <step.icon className="w-10 h-10 text-teal-600" aria-hidden="true" />
                  <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {index + 1}
                  </div>
                </div>
                <div className="lg:text-center text-left">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-[200px] lg:mx-auto">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION PANDUAN PENGAMBILAN CITRA */}
      <motion.section
        id="panduan"
        className="py-24 bg-white relative border-t border-slate-200/60 scroll-mt-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-5xl mx-auto px-6">
          <motion.div variants={fadeInUp} className="mb-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-100 to-teal-50 mb-6 border border-teal-200 shadow-sm transform -rotate-3">
              <ScanLine className="w-10 h-10 text-teal-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">Protokol Pengambilan Citra</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Ikuti <strong>Standar Operasional Prosedur (SOP)</strong> berikut agar algoritma Fuzzy C-Means dapat bekerja dengan presisi maksimal.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <motion.div variants={fadeInUp} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-6">
                <SunDim className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-800 mb-4">1. Intensitas Cahaya</h3>
              <p className="text-slate-600 leading-relaxed">
                Gunakan pencahayaan ruangan yang terang dan netral (putih). Hindari pantulan kilat (<em>flash</em>) langsung dari kamera karena akan memantul pada jaringan eksudat.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6">
                <Ruler className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-800 mb-4">2. Kalibrasi Skala (Wajib)</h3>
              <p className="text-slate-600 leading-relaxed">
                Anda <strong>wajib menempelkan stiker 1x1 cm</strong> di kulit sehat sedekat mungkin dengan batas luka. Ini menjadi acuan konversi piksel ke dunia nyata (cm²).
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-6">
                <Focus className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-800 mb-4">3. Sudut dan Jarak</h3>
              <p className="text-slate-600 leading-relaxed">
                Posisikan lensa kamera tepat <strong>tegak lurus (90 derajat)</strong> di atas luka pada jarak sekitar 15-20 cm untuk menghindari distorsi perspektif.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mb-6">
                <ShieldAlert className="w-7 h-7 text-rose-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-800 mb-4">4. Kebersihan Objek</h3>
              <p className="text-slate-600 leading-relaxed">
                Pastikan tidak ada objek asing yang menutupi luka. Gunakan latar belakang solid (misal: underpad medis biru polos) agar algoritma tidak bingung.
              </p>
            </motion.div>
          </div>

          {/* Dos and Don'ts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <motion.div variants={fadeInUp} className="bg-green-50/50 border border-green-200 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center">
                <CheckCircle2 className="w-6 h-6 mr-2 text-green-600" /> Yang Dianjurkan (Do's)
              </h3>
              <ul className="space-y-4 text-green-900/80">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3 shrink-0" />
                  <p>Membersihkan luka dari darah/nanah berlebih sebelum difoto.</p>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3 shrink-0" />
                  <p>Mengetuk layar (<em>tap to focus</em>) tepat pada jaringan luka.</p>
                </li>
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-red-50/50 border border-red-200 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-red-800 mb-6 flex items-center">
                <XCircle className="w-6 h-6 mr-2 text-red-600" /> Yang Dihindari (Don'ts)
              </h3>
              <ul className="space-y-4 text-red-900/80">
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 mr-3 shrink-0" />
                  <p>Menggunakan filter percantik wajah (<em>beauty camera</em>).</p>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 mr-3 shrink-0" />
                  <p>Kondisi tangan bergetar (<em>motion blur</em>) saat mengambil foto.</p>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* SECTION TENTANG FCM */}
      <motion.section
        id="tentang"
        className="py-24 bg-slate-50 relative border-t border-slate-200/60 scroll-mt-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-5xl mx-auto px-6">
          <motion.div variants={fadeInUp} className="mb-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 mb-6 border border-indigo-200 shadow-sm">
              <Network className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">Kecerdasan Fuzzy C-Means</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Menyelami algoritma klasterisasi (<em>clustering</em>) di balik kecerdasan sistem kita.
            </p>
          </motion.div>

          <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200/60 shadow-sm mb-16">
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <motion.div variants={fadeInUp} className="w-full md:w-1/3 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-200 rounded-full blur-[50px] opacity-50" />
                  <BrainCircuit className="w-32 h-32 text-indigo-500 relative z-10" />
                </div>
              </motion.div>
              <motion.div variants={fadeInUp} className="w-full md:w-2/3">
                <h3 className="text-3xl font-display font-bold text-slate-800 mb-4">Mengenal Logika Fuzzy</h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-4">
                  Dalam dunia medis, batasan warna antara sel sehat, luka, dan jaringan mati seringkali <strong>samar (<em>fuzzy</em>)</strong>.
                </p>
                <p className="text-slate-600 text-lg leading-relaxed">
                  <strong>Fuzzy C-Means (FCM)</strong> memberikan <em>derajat keanggotaan</em> dari 0 hingga 1 untuk setiap piksel, memungkinkan segmentasi yang jauh lebih natural dan akurat secara klinis daripada logika absolut konvensional.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Anatomi FCM */}
          <motion.div variants={fadeInUp} className="space-y-6 relative before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-teal-200 before:to-indigo-200">
            {[
              { icon: Fingerprint, color: "text-slate-600", bg: "bg-slate-100", title: "Pra-Pemrosesan (Ekstraksi Ciri)", desc: "Pemotongan citra (ROI) dan konversi warna RGB ke ruang warna yang optimal (Grayscale/HSV/Lab)." },
              { icon: BrainCircuit, color: "text-teal-600", bg: "bg-teal-100", title: "Klasterisasi Fuzzy Iteratif", desc: "Perhitungan berulang matriks derajat keanggotaan (U) dan pusat klaster (C) hingga stabil/konvergen." },
              { icon: ScatterChart, color: "text-indigo-600", bg: "bg-indigo-100", title: "Rekonstruksi & Masking", desc: "Piksel luka diberi nilai 1 (putih) dan sisanya 0 (hitam) menghasilkan citra masker biner." },
              { icon: Microscope, color: "text-emerald-600", bg: "bg-emerald-100", title: "Estimasi Luas Definitif", desc: "Kalkulasi total piksel putih pada masker dikalikan dengan rasio piksel-ke-cm² dari kalibrasi." },
            ].map((step, index) => (
              <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className={`flex items-center justify-center w-16 h-16 rounded-full border-4 border-white ${step.bg} ${step.color} shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}>
                  <step.icon className="w-7 h-7" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <span className={`text-sm font-bold tracking-wider uppercase mb-1 block ${step.color.replace('text', 'text').replace('600', '400')}`}>Fase {index + 1}</span>
                  <h4 className="font-display font-bold text-xl text-slate-800 mb-3">{step.title}</h4>
                  <p className="text-slate-600 leading-relaxed text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ARTICLES SECTION */}
      <motion.section
        id="artikel"
        className="py-24 bg-white relative border-t border-slate-200/60 scroll-mt-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div variants={fadeInUp} className="mb-12 text-center md:text-left">
            <h2 className="text-3xl font-display font-bold text-slate-800 mb-2">Artikel Terkini</h2>
            <p className="text-slate-600 text-lg">Edukasi seputar Diabetes Mellitus dan keseharian.</p>
          </motion.div>

          <div className="space-y-6">
            {articlesData.map((article) => (
              <motion.div variants={fadeInUp} key={article.id}>
                <Link
                  to={`/artikel/${article.id}`}
                  className="group flex flex-col md:flex-row gap-6 bg-white p-4 rounded-3xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-label={`Baca artikel: ${article.title}`}
                >
                  <div className="w-full md:w-1/3 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-56 md:h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="w-full md:w-2/3 flex flex-col justify-center py-2 pr-4">
                    <div className="flex items-center gap-3 text-sm font-medium text-slate-500 mb-3">
                      <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md">{article.category}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-teal-600 transition-colors leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-slate-600 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FOOTER / CONTACT INFO */}
      <footer className="bg-slate-900 pt-20 pb-10 border-t-4 border-teal-600 text-slate-300">
        <motion.div
          className="max-w-7xl mx-auto px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-teal-600 p-2 rounded-lg">
                  <Stethoscope className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <h2 className="font-display font-bold text-2xl text-white tracking-tight">
                  Diabetic<span className="text-teal-500">Care</span>
                </h2>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6">
                Sebuah inovasi sistem rekam medis cerdas untuk meningkatkan kualitas penanganan dan observasi ulkus diabetikum berbasis komputasi modern.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="lg:col-span-2 bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-4">
                RSUD Kolonel Abundjani Bangko
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-700 p-3 rounded-xl shrink-0">
                    <MapPin className="w-5 h-5 text-teal-400" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200 mb-2">Alamat Institusi</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Jl. Kesehatan No. 20, Pematang Kandis,<br />
                      Kec. Bangko, Kabupaten Merangin,<br />
                      Provinsi Jambi 37311
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-700 p-3 rounded-xl shrink-0">
                      <Phone className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-1">Telepon</h4>
                      <p className="text-slate-400 text-sm">(0746) 322118 / IGD 24 Jam</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-slate-700 p-3 rounded-xl shrink-0">
                      <Mail className="w-5 h-5 text-indigo-400" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-200 mb-1">Email Resmi</h4>
                      <p className="text-slate-400 text-sm hover:text-teal-400 transition-colors cursor-pointer">
                        rsud.abundjani@meranginkab.go.id
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div variants={fadeInUp} className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} Zikra - Skripsi Ilmu Komputer. Semua Hak Cipta Dilindungi.</p>
            <div className="flex gap-6">
              <a href="#panduan" onClick={(e) => scrollToSection(e, 'panduan')} className="hover:text-teal-400 transition-colors">Panduan Sistem</a>
              <a href="#tentang" onClick={(e) => scrollToSection(e, 'tentang')} className="hover:text-teal-400 transition-colors">Dokumentasi Algoritma</a>
            </div>
          </motion.div>
        </motion.div>
      </footer>
    </div>
  );
}
