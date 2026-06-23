import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Plus, Users, ArrowRight, UserPlus, FileText, Clock
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import { useToast } from '../../hooks/use-toast';

export interface Patient {
  id: number;
  nama: string;
  no_rekam_medis: string;
  created_at: string;
  status?: string; // Optional since API doesn't return status yet
}

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Add Patient Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRM, setNewRM] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newGender, setNewGender] = useState('Laki-laki');
  const navigate = useNavigate();
  const { toast } = useToast();
  const setActivePatient = useWorkspaceStore(state => state.setActivePatient);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await apiClient.get('/patients/');
      setPatients(response.data);
    } catch (error) {
      toast({ variant: "destructive", title: "Gagal", description: "Tidak dapat mengambil data pasien." });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.no_rekam_medis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/patients/', {
        nama: newName,
        no_rekam_medis: newRM
      });
      
      const newPatient = response.data;
      setPatients([newPatient, ...patients]);
      setIsAddModalOpen(false);
      
      toast({ title: "Berhasil", description: "Pasien baru berhasil ditambahkan." });
      
      // Set active patient in workspace store and navigate to analyze
      setActivePatient(newPatient.id, newPatient.nama);
      navigate(`/analyze?patientId=${newPatient.id}`);
      
    } catch (error: any) {
      toast({ variant: "destructive", title: "Gagal", description: error.response?.data?.detail || "Gagal menambahkan pasien." });
    }
  };

  return (
    <div className="p-6 md:p-8 pb-24 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 text-teal-600 mb-2">
            <Users className="w-5 h-5" />
            <span className="font-semibold tracking-wide uppercase text-sm">Dashboard Utama</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-2">Daftar Pasien</h1>
          <p className="text-slate-500 max-w-lg">Kelola data rekam medis dan histori perawatan luka pasien Anda di sini secara terpusat.</p>
        </motion.div>

        {/* Stats Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-6"
        >
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Total Pasien</p>
            <p className="text-2xl font-bold text-slate-800">{patients.length}</p>
          </div>
          <div className="h-12 w-px bg-slate-200" />
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Pasien Aktif</p>
            <p className="text-2xl font-bold text-teal-600">{patients.length}</p>
          </div>
        </motion.div>
      </div>

      {/* Action Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8"
      >
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input 
            placeholder="Cari berdasarkan nama atau No. Rekam Medis..." 
            className="pl-12 h-14 rounded-2xl border-slate-200 shadow-sm bg-white/80 backdrop-blur-md text-base focus-visible:ring-teal-500 transition-all focus:bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto h-14 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white px-8 text-base shadow-lg shadow-teal-500/25 transition-all hover:-translate-y-1 hover:shadow-teal-500/40">
              <UserPlus className="w-5 h-5 mr-2" />
              Tambah Pasien Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg rounded-3xl p-0 overflow-hidden border-0 shadow-2xl backdrop-blur-xl">
            <div className="bg-gradient-to-br from-teal-600 to-indigo-700 p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-400/20 rounded-full blur-3xl" />
              <DialogHeader className="relative z-10">
                <DialogTitle className="text-2xl font-display font-bold text-white mb-2">Registrasi Pasien Baru</DialogTitle>
                <DialogDescription className="text-teal-50 text-base">
                  Masukkan data demografis dasar pasien untuk keperluan rekam medis elektronik.
                </DialogDescription>
              </DialogHeader>
            </div>
            
            <form onSubmit={handleAddPatient} className="p-8 space-y-6 bg-white">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="rm" className="text-slate-600 font-semibold">No. Rekam Medis</Label>
                  <Input id="rm" placeholder="Contoh: RM-2024-001" className="h-12 rounded-xl" value={newRM} onChange={(e) => setNewRM(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-600 font-semibold">Nama Lengkap Pasien</Label>
                  <Input id="name" placeholder="Nama Pasien" className="h-12 rounded-xl" value={newName} onChange={(e) => setNewName(e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-slate-600 font-semibold">Usia (Tahun)</Label>
                    <Input id="age" type="number" placeholder="60" className="h-12 rounded-xl" value={newAge} onChange={(e) => setNewAge(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-slate-600 font-semibold">Jenis Kelamin</Label>
                    <div className="relative">
                      <select 
                        id="gender" 
                        className="flex h-12 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                        value={newGender}
                        onChange={(e) => setNewGender(e.target.value as any)}
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-8 pt-6 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="rounded-xl h-12 px-6 text-slate-600 border-slate-200 hover:bg-slate-50 transition-colors">Batal</Button>
                <Button type="submit" className="rounded-xl h-12 px-8 bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20 transition-all hover:shadow-teal-500/40">Simpan Pasien</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Table Data Display */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
      >
        {isLoading ? (
          <div className="text-center py-24 text-slate-500">Memuat data pasien...</div>
        ) : filteredPatients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link to={`/patients/${patient.id}`} className="block group">
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 hover:border-teal-100 relative overflow-hidden">
                    {/* Decorative gradient blob */}
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-teal-50 to-indigo-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-lg border border-teal-100/50 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                        {patient.nama.charAt(0).toUpperCase()}
                      </div>
                      <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" /> Aktif
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                      <h3 className="font-display font-bold text-slate-800 text-lg mb-1 group-hover:text-teal-700 transition-colors">{patient.nama}</h3>
                      <p className="text-slate-500 text-sm font-medium mb-5">{patient.no_rekam_medis}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                      <div className="flex items-center text-xs text-slate-400 font-medium">
                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                        Terdaftar: {new Date(patient.created_at).toLocaleDateString()}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Belum ada data pasien</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Anda belum menambahkan data pasien atau pasien tidak ditemukan.</p>
            <Button onClick={() => setIsAddModalOpen(true)} className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/20">
              <Plus className="w-4 h-4 mr-2" /> Tambah Pasien Sekarang
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
