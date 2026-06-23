import React from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, ScanLine, Clock, ArrowUpRight, TrendingUp } from 'lucide-react';
import { mockPatients } from '../../data/mockPatients';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';

export default function Overview() {
  // Simple Mock Stats
  const activePatients = mockPatients.filter(p => p.status === 'Aktif').length;
  const completedPatients = mockPatients.filter(p => p.status === 'Selesai').length;

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-slate-800">Selamat datang, Dr. Zikra! 👋</h1>
        <p className="text-slate-500 mt-2">Berikut adalah ringkasan aktivitas klinik DiabeticCare hari ini.</p>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-white/80 backdrop-blur border-slate-100 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <span className="flex items-center text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-full">
                  <ArrowUpRight className="w-4 h-4 mr-1" /> +2 Minggu ini
                </span>
              </div>
              <h3 className="text-slate-500 text-sm font-medium mb-1">Pasien Aktif (Dirawat)</h3>
              <p className="text-3xl font-display font-bold text-slate-800">{activePatients}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-white/80 backdrop-blur border-slate-100 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-slate-500 text-sm font-medium mb-1">Pasien Selesai</h3>
              <p className="text-3xl font-display font-bold text-slate-800">{completedPatients}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-lg shadow-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <ScanLine className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-blue-100 text-sm font-medium mb-1">Total Analisis FCM</h3>
              <p className="text-3xl font-display font-bold text-white">24 <span className="text-lg font-normal text-blue-200">Bulan ini</span></p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-display font-bold text-slate-800 mb-4">Aktivitas Terakhir</h2>
          <Card className="border-slate-100 shadow-sm bg-white/80 backdrop-blur">
            <div className="divide-y divide-slate-100">
              {mockPatients.slice(0, 3).map((patient, i) => (
                <div key={patient.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{patient.name}</p>
                      <div className="flex items-center text-xs text-slate-500 mt-0.5">
                        <Clock className="w-3.5 h-3.5 mr-1" /> {patient.lastVisit}
                      </div>
                    </div>
                  </div>
                  <Link to={`/patient/${patient.id}`}>
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      Lihat Detail
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
              <Link to="/patients">
                <Button variant="link" className="text-slate-500 hover:text-blue-600">
                  Lihat Semua Pasien &rarr;
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Insight Card */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-display font-bold text-slate-800 mb-4">Insight Sistem</h2>
          <Card className="border-slate-100 shadow-sm bg-white/80 backdrop-blur p-6">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 text-amber-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">Performa Algoritma FCM</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Akurasi rata-rata (IoU) dari sistem segmentasi Fuzzy C-Means selama bulan ini mencapai <strong>89.4%</strong>. Sistem berjalan stabil dan siap digunakan.
            </p>
            <Link to="/analyze">
              <Button className="w-full bg-slate-800 hover:bg-slate-900 text-white">
                Buka Workspace
              </Button>
            </Link>
          </Card>
        </div>

      </div>
    </div>
  );
}
