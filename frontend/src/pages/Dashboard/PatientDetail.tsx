import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, User, Activity, ScanLine, Clock, 
  ArrowRight, CalendarDays, FileImage, ClipboardCheck
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { apiClient } from '../../api/client';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const setActivePatient = useWorkspaceStore(state => state.setActivePatient);
  
  const [patient, setPatient] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPatientDetail();
    }
  }, [id]);

  const fetchPatientDetail = async () => {
    try {
      const response = await apiClient.get(`/patients/${id}`);
      setPatient(response.data);
      // Backend returns wound_images as history
      setHistory(response.data.wound_images || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeNew = () => {
    if (patient) {
      setActivePatient(patient.id, patient.nama);
      navigate(`/analyze?patientId=${patient.id}`);
    }
  };

  const exportToPDF = async () => {
    const reportElement = document.getElementById('patient-report-content');
    if (!reportElement) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Laporan_Luka_${patient?.nama || 'Pasien'}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Gagal mengekspor PDF", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Memuat data...</div>;
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Pasien tidak ditemukan</h2>
        <Link to="/patients">
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Daftar Pasien</Button>
        </Link>
      </div>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: history.map(h => new Date(h.captured_at).toLocaleDateString()),
    datasets: [
      {
        label: 'Luas Luka (cm²)',
        data: history.map(h => h.area_real || 0),
        borderColor: '#0d9488', // teal-600
        backgroundColor: 'rgba(13, 148, 136, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#0d9488',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4, // Smooth curve
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { family: 'Plus Jakarta Sans', size: 13 },
        bodyFont: { family: 'Plus Jakarta Sans', size: 14, weight: 'bold' as const },
        displayColors: false,
        callbacks: {
          label: (context: any) => `${context.parsed.y} cm²`,
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9', borderDash: [5, 5] },
        border: { display: false },
        ticks: { color: '#64748b', font: { family: 'Plus Jakarta Sans' } }
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: '#64748b', font: { family: 'Plus Jakarta Sans' } }
      }
    },
    interaction: { intersect: false, mode: 'index' as const },
  };

  return (
    <div className="p-6 md:p-8 pb-24 max-w-7xl mx-auto min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div className="flex items-center gap-4">
          <Link to="/patients">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-200/50">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-800">Detail Pasien</h1>
            <p className="text-slate-500 mt-1">Kelola dan pantau riwayat perawatan luka</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={exportToPDF} variant="outline" className="rounded-xl border-teal-200 text-teal-700 hover:bg-teal-50" disabled={isExporting}>
            {isExporting ? "Mengekspor..." : "Unduh Laporan PDF"}
          </Button>
          <Button onClick={handleAnalyzeNew} className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-lg shadow-teal-600/20 px-6 transition-all hover:-translate-y-1">
            <ScanLine className="w-4 h-4 mr-2" /> Analisis Luka Baru
          </Button>
        </div>
      </motion.div>

      <div id="patient-report-content" className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#f8fafc] p-2 rounded-3xl">
        
        {/* LEFT COLUMN: Profile & Stats */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Profile Card */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-indigo-500" />
            <div className="flex items-center gap-4 mb-6 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-100 to-indigo-100 text-teal-700 flex items-center justify-center font-bold text-2xl border border-teal-200 shadow-sm">
                {patient.nama.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-slate-800">{patient.nama}</h2>
                <div className="flex items-center text-slate-500 text-sm mt-1">
                  <User className="w-4 h-4 mr-1" /> {patient.no_rekam_medis}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500 text-sm">Usia</span>
                <span className="font-medium text-slate-800">- Tahun</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500 text-sm">Jenis Kelamin</span>
                <span className="font-medium text-slate-800">-</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-slate-500 text-sm">Status</span>
                <span className={`px-3 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-600`}>
                  Aktif
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center mb-3">
                <Activity className="w-5 h-5 text-teal-600" />
              </div>
              <p className="text-slate-500 text-xs font-medium mb-1">Total Analisis</p>
              <p className="text-2xl font-display font-bold text-slate-800">{history.length}</p>
            </div>
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-3">
                <CalendarDays className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-slate-500 text-xs font-medium mb-1">Kunjungan Terakhir</p>
              <p className="text-lg font-display font-bold text-slate-800 truncate">
                {history.length > 0 ? new Date(history[history.length-1].captured_at).toLocaleDateString() : '-'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Chart & Timeline */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Trend Chart */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-display font-bold text-slate-800">Tren Perkembangan Luka</h3>
                <p className="text-slate-500 text-sm mt-1">Grafik luas area luka (cm²)</p>
              </div>
                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-teal-600" />
              </div>
            </div>
            {history.length > 0 ? (
              <div className="h-64 w-full">
                <Line data={chartData} options={chartOptions} />
              </div>
            ) : (
              <div className="h-64 w-full flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <Activity className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-slate-500 font-medium">Belum ada data analisis</p>
              </div>
            )}
          </div>

          {/* Timeline History */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-lg font-display font-bold text-slate-800 mb-6">Riwayat Pemeriksaan</h3>
            
            {history.length > 0 ? (
              <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 pb-4">
                {[...history].reverse().map((record, index) => (
                  <div key={record.id} className="relative pl-8">
                    {/* Timeline Node */}
                    <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-white border-4 border-blue-500 shadow-sm" />
                    
                    <div className="flex flex-col sm:flex-row gap-5">
                      {/* Image Thumbnail */}
                      <div className="shrink-0 w-full sm:w-32 h-24 rounded-xl overflow-hidden relative border border-slate-200 group">
                        <img src={record.result_overlay_path ? `http://127.0.0.1:8000/files/${record.result_overlay_path}` : 'https://placehold.co/128x96?text=Proses'} alt="Luka" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ScanLine className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                            {new Date(record.captured_at).toLocaleString('id-ID')}
                          </div>
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                            {record.area_real || 0} cm²
                          </span>
                        </div>
                        
                        <p className="text-slate-700 font-medium mb-2">Pemeriksaan Luka</p>
                        
                        <div className="flex flex-wrap gap-3 mt-3">
                          <div className="flex items-center text-xs text-slate-500">
                            <FileImage className="w-3.5 h-3.5 mr-1" />
                            ID Gambar: {record.id}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-slate-300" />
                </div>
                <h4 className="text-slate-700 font-medium">Belum ada riwayat</h4>
                <p className="text-slate-500 text-sm mt-1">Lakukan analisis luka pertama untuk pasien ini.</p>
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </div>
  );
}
