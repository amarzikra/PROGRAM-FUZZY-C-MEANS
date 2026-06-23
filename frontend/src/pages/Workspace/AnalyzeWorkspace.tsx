import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import InteractiveCanvas from "../../components/workspace/InteractiveCanvas";
import { useWorkspaceStore } from "../../store/useWorkspaceStore";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useSearchParams } from "react-router-dom";
import { apiClient } from "../../api/client";
import { UploadCloud, Maximize, Settings2, Play, Download, Save, Activity, User as UserIcon } from "lucide-react";

import { useToast } from "../../hooks/use-toast";

export default function AnalyzeWorkspace() {
  const { toast } = useToast();
  const workspace = useWorkspaceStore();
  const [calibrating, setCalibrating] = useState(false);

  const [searchParams] = useSearchParams();
  const patientIdFromUrl = searchParams.get("patientId");
  // Use URL parameter if available, otherwise fallback to store
  const currentPatientId = patientIdFromUrl ? parseInt(patientIdFromUrl) : workspace.activePatientId;
  const currentPatientName = workspace.activePatientName || "Pasien Tidak Diketahui";

  // State to hold uploaded image ID
  const [uploadedImageId, setUploadedImageId] = useState<number | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (!currentPatientId) {
        toast({ variant: "destructive", title: "Pilih Pasien", description: "Pilih atau buat pasien terlebih dahulu sebelum mengunggah foto." });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        workspace.setRawImage(reader.result as string);
        setCalibrating(true); // Open the canvas automatically
      };
      reader.readAsDataURL(file);
    }
  }, [workspace, currentPatientId, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!workspace.croppedImageUrl || !workspace.pixelPerCm2) {
      toast({ variant: "destructive", title: "Aksi Ditolak", description: "Harap unggah foto dan lakukan kalibrasi terlebih dahulu!" });
      return;
    }
    
    if (!uploadedImageId) {
      toast({ variant: "destructive", title: "Aksi Ditolak", description: "Gagal memproses karena ID gambar tidak ditemukan di server." });
      return;
    }
    
    workspace.setAnalyzing(true);
    try {
      const payload = {
        image_id: uploadedImageId,
        fcm: {
          clusters: workspace.fcmParams.clusters,
          fuzziness: workspace.fcmParams.fuzziness,
          max_iter: workspace.fcmParams.maxIter,
          epsilon: workspace.fcmParams.epsilon
        },
        color_space: workspace.colorSpace,
        filter: workspace.filterType,
        pixel_per_cm2: workspace.pixelPerCm2
      };

      const response = await apiClient.post("/analyze", payload);
      const result = response.data;
      
      workspace.setResults({
        maskUrl: result.mask_url,
        overlayUrl: result.overlay_url,
        areaPixel: result.area_pixel,
        areaCm2: result.area_cm2,
        centroids: result.centroids,
        metrics: result.metrics
      });
      toast({ title: "Analisis Berhasil", description: `Luas luka diestimasi ${result.area_cm2} cm²` });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Gagal", description: e.response?.data?.detail || "Terjadi kesalahan pada mesin segmentasi FCM." });
    } finally {
      workspace.setAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      {/* Settings Panel / Sidebar */}
      <div className="w-[340px] bg-white/70 backdrop-blur-2xl border-r border-slate-200/60 p-6 flex flex-col gap-8 overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        
        <div className="mb-2">
          <h1 className="text-2xl font-display font-bold text-slate-800">Ruang Analisis</h1>
          <div className="mt-2 flex items-center gap-2 bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg border border-teal-100 text-sm font-medium w-fit">
            <UserIcon className="w-4 h-4" />
            {currentPatientId ? `Pasien: ${currentPatientName}` : "Pilih pasien di Daftar Pasien"}
          </div>
        </div>

        {/* Step 1: Upload */}
        <div className="relative">
          <div className="absolute -left-3 top-0 bottom-0 w-1 bg-slate-100 rounded-full">
            <div className="h-1/3 w-full bg-teal-500 rounded-full" />
          </div>
          <h2 className="text-sm font-semibold mb-3 text-slate-800 flex items-center tracking-wide uppercase">
            <UploadCloud className="w-4 h-4 mr-2 text-teal-600" /> 1. Akuisisi Citra
          </h2>
          <div 
            {...getRootProps()}
            className={`w-full h-24 border-dashed border-2 rounded-xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
              isDragActive ? "border-teal-500 bg-teal-50" : "border-slate-300 hover:border-teal-500 hover:bg-teal-50/50 text-slate-600"
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className={`w-6 h-6 ${isDragActive ? "text-teal-500" : "text-slate-400"}`} />
            <span className="text-sm font-medium text-center px-2">
              {isDragActive ? "Lepaskan gambar di sini..." : "Tarik & Lepas Foto, atau Klik"}
            </span>
          </div>
        </div>

        {/* Step 2: Calibration */}
        <div className="relative">
          <div className="absolute -left-3 top-0 bottom-0 w-1 bg-slate-100 rounded-full">
            <div className={`h-1/3 w-full rounded-full transition-all ${workspace.pixelPerCm2 ? 'bg-emerald-500' : 'bg-transparent'}`} />
          </div>
          <h2 className="text-sm font-semibold mb-3 text-slate-800 flex items-center tracking-wide uppercase">
            <Maximize className="w-4 h-4 mr-2 text-indigo-600" /> 2. Kalibrasi Skala
          </h2>
          <div className="p-3 bg-indigo-50/50 backdrop-blur-sm border border-indigo-100/50 rounded-xl text-xs text-indigo-800/80 mb-3 leading-relaxed">
            Pilih area referensi persegi berukuran persis 1x1 cm pada citra untuk menghitung rasio spasial luka.
          </div>
          <Button 
            onClick={() => {
              if (workspace.rawImageUrl) setCalibrating(true);
              else toast({ variant: "destructive", title: "Aksi Ditolak", description: "Silakan unggah gambar terlebih dahulu!" });
            }} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            Buka Editor (Crop & Kalibrasi)
          </Button>
          {workspace.pixelPerCm2 && (
            <div className="mt-3 flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
              <span className="text-sm font-medium text-emerald-800">Status Kalibrasi</span>
              <span className="text-sm font-bold text-emerald-600 bg-emerald-100/50 px-2 py-1 rounded-md">{workspace.pixelPerCm2} px/cm²</span>
            </div>
          )}
        </div>

        {/* Step 3: FCM Parameters */}
        <div className="relative">
          <h2 className="text-sm font-semibold mb-4 text-slate-800 flex items-center tracking-wide uppercase">
            <Settings2 className="w-4 h-4 mr-2 text-slate-600" /> 3. Parameter FCM
          </h2>
          <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-slate-500">Jumlah Klaster (c)</Label>
                <span className="text-xs font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">{workspace.fcmParams.clusters}</span>
              </div>
              <Input 
                type="number" 
                className="bg-white/80 border-slate-200 shadow-sm rounded-lg" 
                value={workspace.fcmParams.clusters} 
                onChange={e => workspace.setFCMParams({clusters: +e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-slate-500">Fuzziness (m)</Label>
                <span className="text-xs font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">{workspace.fcmParams.fuzziness}</span>
              </div>
              <Input 
                type="number" step="0.1" 
                className="bg-white/80 border-slate-200 shadow-sm rounded-lg" 
                value={workspace.fcmParams.fuzziness} 
                onChange={e => workspace.setFCMParams({fuzziness: +e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-slate-500">Maks. Iterasi</Label>
                <span className="text-xs font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">{workspace.fcmParams.maxIter}</span>
              </div>
              <Input 
                type="number" 
                className="bg-white/80 border-slate-200 shadow-sm rounded-lg" 
                value={workspace.fcmParams.maxIter} 
                onChange={e => workspace.setFCMParams({maxIter: +e.target.value})} 
              />
            </div>
          </div>
        </div>

        {/* Execute Button */}
        <div className="mt-auto pt-4 relative">
          <Button 
            onClick={handleAnalyze} 
            disabled={!workspace.croppedImageUrl || !workspace.pixelPerCm2 || workspace.isAnalyzing}
            className={`w-full h-14 rounded-xl text-white font-medium text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
              workspace.isAnalyzing 
                ? "bg-slate-400 cursor-not-allowed shadow-none" 
                : "bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/40 transform hover:-translate-y-0.5"
            }`}
          >
            {workspace.isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Mulai Segmentasi</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="flex-1 p-8 flex flex-col gap-6 overflow-y-auto">
        
        {/* Results Banner (Top) */}
        {workspace.results && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-emerald-100/50 p-6 flex flex-col md:flex-row items-center justify-between animate-in slide-in-from-top-4 fade-in duration-500">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-700/80 uppercase tracking-widest mb-1 font-display">Hasil Estimasi Luas</p>
                <div className="flex items-baseline gap-2">
                  <h1 className="text-5xl font-display font-bold text-slate-800 tracking-tight">{workspace.results.areaCm2}</h1>
                  <span className="text-2xl font-semibold text-slate-400">cm²</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-8 md:border-l border-slate-200/60 md:pl-8 mt-6 md:mt-0">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Piksel Luka</span>
                <span className="text-xl font-display font-semibold text-slate-700">{workspace.results.areaPixel?.toLocaleString()} <span className="text-sm text-slate-400">px</span></span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Akurasi (IoU)</span>
                <span className="text-xl font-display font-semibold text-slate-700">
                  {workspace.results.metrics?.iou ? `${(workspace.results.metrics.iou * 100).toFixed(1)}%` : "N/A"}
                </span>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50">
                  <Download className="w-4 h-4 mr-2" /> PDF
                </Button>
                <Button className="rounded-xl bg-slate-800 hover:bg-slate-900 text-white shadow-md">
                  <Save className="w-4 h-4 mr-2" /> Simpan
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 4-Panel Image Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[600px]">
          
          <Card className="flex flex-col bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm overflow-hidden rounded-2xl transition-all hover:shadow-md">
            <CardHeader className="py-3 px-5 border-b border-slate-100/80 bg-white/40 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-700 font-display">A. Citra ROI Asli</CardTitle>
              <div className="w-2 h-2 rounded-full bg-slate-300" />
            </CardHeader>
            <CardContent className="flex-1 p-0 relative bg-slate-100/50 flex items-center justify-center">
              {workspace.rawImageUrl ? (
                <img src={workspace.rawImageUrl} alt="Raw ROI" className="object-cover w-full h-full absolute inset-0 mix-blend-multiply opacity-90" />
              ) : (
                <div className="text-slate-400 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">?</div>
                  <span className="text-xs font-medium uppercase tracking-widest">Kosong</span>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="flex flex-col bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm overflow-hidden rounded-2xl transition-all hover:shadow-md">
            <CardHeader className="py-3 px-5 border-b border-slate-100/80 bg-white/40 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-700 font-display">B. Filter & Grayscale</CardTitle>
              <div className="w-2 h-2 rounded-full bg-teal-300" />
            </CardHeader>
            <CardContent className="flex-1 p-0 relative bg-slate-100/50 flex items-center justify-center">
               {workspace.croppedImageUrl ? (
                 <img src={workspace.croppedImageUrl} alt="Pre-processed" className="object-cover w-full h-full absolute inset-0 filter grayscale mix-blend-multiply opacity-90" />
               ) : (
                <div className="text-slate-400 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">?</div>
                  <span className="text-xs font-medium uppercase tracking-widest">Kosong</span>
                </div>
               )}
            </CardContent>
          </Card>

          <Card className="flex flex-col bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm overflow-hidden rounded-2xl transition-all hover:shadow-md">
            <CardHeader className="py-3 px-5 border-b border-slate-100/80 bg-white/40 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-700 font-display">C. Mask Biner (FCM)</CardTitle>
              <div className="w-2 h-2 rounded-full bg-indigo-300" />
            </CardHeader>
            <CardContent className="flex-1 p-0 relative bg-slate-900 flex items-center justify-center overflow-hidden group">
              {workspace.results?.maskUrl ? (
                <>
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_linear_infinite]" />
                  <img src={workspace.results.maskUrl} alt="Mask" className="object-cover w-full h-full absolute inset-0 filter contrast-200 grayscale" />
                </>
              ) : (
                <div className="text-slate-600 flex flex-col items-center gap-2 z-10">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">?</div>
                  <span className="text-xs font-medium uppercase tracking-widest">Menunggu Hasil</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="flex flex-col bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm overflow-hidden rounded-2xl transition-all hover:shadow-md">
            <CardHeader className="py-3 px-5 border-b border-slate-100/80 bg-white/40 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-slate-700 font-display">D. Overlay Diagnosis</CardTitle>
              <div className="w-2 h-2 rounded-full bg-emerald-300" />
            </CardHeader>
            <CardContent className="flex-1 p-0 relative bg-slate-100/50 flex items-center justify-center">
              {workspace.results?.overlayUrl ? (
                <div className="absolute inset-0 border-4 border-emerald-400/30 m-2 rounded-xl overflow-hidden">
                  <img src={workspace.results.overlayUrl} alt="Overlay" className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay" />
                </div>
              ) : (
                <div className="text-slate-400 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">?</div>
                  <span className="text-xs font-medium uppercase tracking-widest">Menunggu Hasil</span>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
      
      {/* Interactive Canvas Modal */}
      {calibrating && workspace.rawImageUrl && (
        <InteractiveCanvas
          isOpen={calibrating}
          onClose={() => setCalibrating(false)}
          imageUrl={workspace.rawImageUrl}
          onSave={async (croppedUrl, pixelPerCm2) => {
            workspace.setCroppedImage(croppedUrl);
            workspace.setPixelPerCm2(pixelPerCm2);
            setCalibrating(false);
            
            // Convert base64 to file and upload
            try {
              const res = await fetch(croppedUrl);
              const blob = await res.blob();
              const file = new File([blob], "cropped_image.jpg", { type: "image/jpeg" });
              
              const formData = new FormData();
              formData.append("file", file);
              if (currentPatientId) {
                formData.append("patient_id", currentPatientId.toString());
              }

              const response = await apiClient.post("/upload/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
              });
              
              setUploadedImageId(response.data.image_id);
              toast({ title: "Persiapan Selesai", description: `Gambar dipotong & diunggah. Kalibrasi diatur: ${pixelPerCm2} px/cm²` });
            } catch (error) {
              toast({ variant: "destructive", title: "Gagal", description: "Gagal mengunggah gambar hasil potongan ke server." });
            }
          }}
        />
      )}
    </div>
  );
}
