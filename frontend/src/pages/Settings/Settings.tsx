import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Bell, Key, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuthStore } from '../../store/useAuthStore';
import { useToast } from '../../hooks/use-toast';

export default function Settings() {
  const logout = useAuthStore(state => state.logout);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Profil Diperbarui",
      description: "Perubahan preferensi Anda telah disimpan secara lokal.",
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-slate-800">Pengaturan Akun</h1>
        <p className="text-slate-500 mt-1">Kelola profil, preferensi, dan keamanan akun Anda.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sidebar Settings Menu (Visual only) */}
        <div className="col-span-1 space-y-1">
          <Button variant="ghost" className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100/50 hover:text-blue-800">
            <User className="w-4 h-4 mr-3" /> Profil Publik
          </Button>
          <Button variant="ghost" className="w-full justify-start text-slate-600 hover:bg-slate-50">
            <Bell className="w-4 h-4 mr-3" /> Notifikasi
          </Button>
          <Button variant="ghost" className="w-full justify-start text-slate-600 hover:bg-slate-50">
            <Shield className="w-4 h-4 mr-3" /> Keamanan & Password
          </Button>
          <div className="pt-4 mt-4 border-t border-slate-200">
            <Button variant="ghost" onClick={logout} className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700">
              <LogOut className="w-4 h-4 mr-3" /> Keluar (Logout)
            </Button>
          </div>
        </div>

        {/* Settings Form */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <Card className="bg-white/80 backdrop-blur border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Informasi Pribadi</CardTitle>
              <CardDescription>Perbarui foto profil dan detail pribadi Anda di sini.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                  <User className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <Button variant="outline" className="mb-2">Ubah Foto</Button>
                  <p className="text-xs text-slate-500">JPG, GIF atau PNG. Maks 1MB.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <Input defaultValue="Dr. Zikra" />
                </div>
                <div className="space-y-2">
                  <Label>NIP / ID Dokter</Label>
                  <Input defaultValue="1982390183" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Alamat Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input defaultValue="zikra@rsudbangko.com" className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Spesialisasi / Peran</Label>
                <Input defaultValue="Perawat / Operator FCM" readOnly className="bg-slate-50 text-slate-500" />
              </div>

            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline">Batal</Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">Simpan Perubahan</Button>
          </div>
        </div>

      </div>
    </div>
  );
}
