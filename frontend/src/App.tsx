import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { Toaster } from './components/ui/toaster';
import { Stethoscope, LayoutDashboard, ActivitySquare, User, LogOut, Users, Settings as SettingsIcon } from 'lucide-react';
import { cn } from './lib/utils';
import AnalyzeWorkspace from './pages/Workspace/AnalyzeWorkspace';
import Login from './pages/Auth/Login';
import Landing from './pages/Home/Landing';
import ArticleDetail from './pages/Article/ArticleDetail';
import Dashboard from './pages/Dashboard/Dashboard';
import PatientDetail from './pages/Dashboard/PatientDetail';
import Overview from './pages/Dashboard/Overview';
import Settings from './pages/Settings/Settings';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Premium Navigation Component
const Sidebar = () => {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-20 md:w-64 h-screen border-r border-slate-200/60 bg-white/50 backdrop-blur-xl flex flex-col justify-between fixed left-0 top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50">
      <div>
        <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-200/50">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Stethoscope className="text-white w-6 h-6" />
          </div>
          <h1 className="hidden md:block ml-3 font-display font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 leading-tight">
            Diabetic<br /><span className="text-blue-600">Care</span>
          </h1>
        </div>

        <nav className="mt-8 px-3 md:px-4 space-y-2">
          <Link to="/dashboard">
            <div className={cn(
              "flex items-center px-3 py-3 rounded-xl transition-all duration-300 group",
              isActive('/dashboard')
                ? "bg-blue-50/80 text-blue-700 shadow-sm border border-blue-100/50"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}>
              <LayoutDashboard className={cn("w-5 h-5", isActive('/dashboard') ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
              <span className="hidden md:block ml-3 font-medium">Ringkasan</span>
            </div>
          </Link>

          <Link to="/patients">
            <div className={cn(
              "flex items-center px-3 py-3 rounded-xl transition-all duration-300 group",
              isActive('/patients') || location.pathname.includes('/patient/')
                ? "bg-blue-50/80 text-blue-700 shadow-sm border border-blue-100/50"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}>
              <Users className={cn("w-5 h-5", isActive('/patients') || location.pathname.includes('/patient/') ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
              <span className="hidden md:block ml-3 font-medium">Daftar Pasien</span>
            </div>
          </Link>

          <Link to="/analyze">
            <div className={cn(
              "flex items-center px-3 py-3 rounded-xl transition-all duration-300 group",
              isActive('/analyze')
                ? "bg-blue-50/80 text-blue-700 shadow-sm border border-blue-100/50"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}>
              <ActivitySquare className={cn("w-5 h-5", isActive('/analyze') ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
              <span className="hidden md:block ml-3 font-medium">Ruang Analisis</span>
            </div>
          </Link>

          <Link to="/settings">
            <div className={cn(
              "flex items-center px-3 py-3 rounded-xl transition-all duration-300 group",
              isActive('/settings')
                ? "bg-blue-50/80 text-blue-700 shadow-sm border border-blue-100/50"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}>
              <SettingsIcon className={cn("w-5 h-5", isActive('/settings') ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
              <span className="hidden md:block ml-3 font-medium">Pengaturan</span>
            </div>
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-200/50 space-y-2">
        <div className="flex items-center p-2 md:p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors text-slate-600">
          <User className="w-5 h-5 md:mr-3 text-slate-400" />
          <div className="hidden md:block text-sm">
            <p className="font-semibold text-slate-800">Dr. Zikra</p>
            <p className="text-xs text-slate-500">Spesialis Luka</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center p-2 md:p-3 rounded-xl hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors text-slate-600"
        >
          <LogOut className="w-5 h-5 md:mr-3" />
          <span className="hidden md:block text-sm font-medium">Keluar (Logout)</span>
        </button>
      </div>
    </div>
  );
};

// Layout for pages with Sidebar
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-200 flex">
      <Sidebar />
      <main className="flex-1 ml-20 md:ml-64 relative min-h-screen">
        {/* Subtle background glows */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/40 blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'red', fontFamily: 'monospace' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error?.message}</pre>
          <pre>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/artikel/:id" element={<ArticleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Navigate to="/login" replace />} />

          {/* Protected Routes inside Main Layout */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <MainLayout><Overview /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/patients" element={
            <ProtectedRoute>
              <MainLayout><Dashboard /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/patient/:id" element={
            <ProtectedRoute>
              <MainLayout><PatientDetail /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/analyze" element={
            <ProtectedRoute>
              <MainLayout><AnalyzeWorkspace /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <MainLayout><Settings /></MainLayout>
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
