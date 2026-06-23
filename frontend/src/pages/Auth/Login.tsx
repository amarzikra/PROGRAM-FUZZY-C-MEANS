import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { apiClient } from "../../api/client";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { Stethoscope, ArrowRight, Activity, ShieldCheck, Mail, Lock, User as UserIcon } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        if (!email || !password) {
          toast({ variant: "destructive", title: "Login Gagal", description: "Email dan password wajib diisi." });
          setIsLoading(false);
          return;
        }
        
        const response = await apiClient.post("/auth/login", { email, password, nama: "", role: "perawat" });
        const { access_token } = response.data;
        
        // Use placeholder user data for now, ideally backend returns user info
        login({ id: 1, email, nama: "Pengguna Medis", role: "perawat" }, access_token);
        toast({ title: "Login Berhasil", description: "Selamat datang kembali di sistem." });
        navigate("/dashboard");
        
      } else {
        if (!email || !password || !name) {
          toast({ variant: "destructive", title: "Registrasi Gagal", description: "Semua kolom wajib diisi." });
          setIsLoading(false);
          return;
        }
        
        await apiClient.post("/auth/register", { email, password, nama: name, role: "perawat" });
        toast({ title: "Registrasi Berhasil", description: "Akun Anda telah dibuat. Silakan login." });
        setIsLogin(true); // Switch to login view
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "Terjadi kesalahan pada server.";
      toast({ variant: "destructive", title: isLogin ? "Login Gagal" : "Registrasi Gagal", description: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast({ variant: "destructive", title: "Gagal", description: "Email wajib diisi." });
      return;
    }
    // Simulate sending email
    toast({ title: "Email Terkirim", description: "Tautan untuk mereset kata sandi telah dikirim ke email Anda." });
    setIsForgotPasswordOpen(false);
    setForgotEmail("");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      
      {/* Left Panel: Branding & Features (Hero/Landing section) */}
      <div className="hidden lg:flex lg:w-3/5 relative bg-gradient-to-br from-teal-900 via-indigo-900 to-slate-900 text-white p-12 flex-col justify-between overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/20 blur-[120px]" />
        
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl">
              <Stethoscope className="w-8 h-8 text-teal-300" />
            </div>
            <h1 className="font-display font-bold text-3xl tracking-tight">Diabetic<span className="text-teal-400">Care</span></h1>
          </Link>
        </div>

        <div className="relative z-10 max-w-2xl mt-12 mb-auto pt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-sm font-medium mb-6 backdrop-blur-sm">
            <Activity className="w-4 h-4" /> Akses Medis Terbatas
          </div>
          <h2 className="text-5xl md:text-6xl font-display font-bold leading-[1.1] mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-teal-200">
            {isLogin ? "Sistem Analisis Luka Terintegrasi" : "Bergabung dengan Platform Kami"}
          </h2>
          <p className="text-lg text-teal-100/80 leading-relaxed max-w-xl">
            {isLogin 
              ? "Masuk untuk mengakses data pasien dan menjalankan segmentasi luka otomatis dengan algoritma Fuzzy C-Means." 
              : "Daftarkan diri Anda sebagai tenaga medis untuk mulai mengelola rekaman luka pasien dengan sistem cerdas kami."}
          </p>
        </div>

        <div className="relative z-10 text-sm text-teal-200/50">
          &copy; 2024 Zikra. Hak Cipta Dilindungi.
        </div>
      </div>

      {/* Right Panel: Auth Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-white relative">
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-teal-600 p-2 rounded-xl">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-display font-bold text-xl text-slate-800">Diabetic<span className="text-teal-600">Care</span></h1>
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-display font-bold text-slate-800 mb-2">
              {isLogin ? "Selamat Datang 👋" : "Daftar Akun Baru 🩺"}
            </h2>
            <p className="text-slate-500">
              {isLogin ? "Silakan masuk menggunakan kredensial medis Anda." : "Lengkapi form berikut untuk mendaftarkan akun."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2 relative animate-in fade-in slide-in-from-top-2 duration-300">
                <Label htmlFor="name" className="text-slate-600">Nama Lengkap</Label>
                <div className="relative">
                  <UserIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input 
                    id="name" 
                    placeholder="Dr. Nama Anda" 
                    className="pl-10 h-12 bg-slate-50 border-slate-200 focus-visible:ring-teal-600 rounded-xl"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 relative">
              <Label htmlFor="email" className="text-slate-600">Email Address</Label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="dokter@rsud-bangko.go.id" 
                  className="pl-10 h-12 bg-slate-50 border-slate-200 focus-visible:ring-teal-600 rounded-xl"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2 relative">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-600">Password</Label>
                {isLogin && (
                  <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
                    <DialogTrigger asChild>
                      <button type="button" className="text-sm font-medium text-teal-600 hover:text-teal-700">Lupa sandi?</button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reset Kata Sandi</DialogTitle>
                        <DialogDescription>
                          Masukkan email yang terdaftar untuk menerima tautan reset kata sandi.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleForgotPassword} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="forgot-email">Email Address</Label>
                          <Input
                            id="forgot-email"
                            type="email"
                            placeholder="dokter@rsud-bangko.go.id"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                          Kirim Tautan Reset
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 h-12 bg-slate-50 border-slate-200 focus-visible:ring-teal-600 rounded-xl"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium text-base shadow-lg shadow-teal-500/30 transition-all hover:-translate-y-0.5 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? "Masuk ke Sistem" : "Daftar Sekarang"} 
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            {isLogin ? "Belum memiliki akun medis? " : "Sudah punya akun? "}
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)} 
              className="font-medium text-teal-600 hover:text-teal-700 underline underline-offset-4"
            >
              {isLogin ? "Daftar Akun" : "Masuk ke Sistem"}
            </button>
          </p>
        </div>
      </div>
      
    </div>
  );
}
