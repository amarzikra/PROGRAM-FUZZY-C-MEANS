import { create } from 'zustand';

export interface FCMParams {
  clusters: number;
  fuzziness: number;
  maxIter: number;
  epsilon: number;
}

export interface AnalysisResults {
  maskUrl: string | null;
  overlayUrl: string | null;
  areaPixel: number | null;
  areaCm2: number | null;
  centroids: number[];
  metrics?: {
    dsc: number | null;
    iou: number | null;
    pixelAccuracy: number | null;
  };
}

interface WorkspaceState {
  rawImageUrl: string | null;
  croppedImageUrl: string | null;
  pixelPerCm2: number | null;
  
  fcmParams: FCMParams;
  colorSpace: 'grayscale' | 'hsv';
  filterType: 'median' | 'gaussian' | 'none';
  
  isAnalyzing: boolean;
  results: AnalysisResults | null;

  activePatientId: number | null;
  activePatientName: string | null;

  setRawImage: (url: string | null) => void;
  setCroppedImage: (url: string | null) => void;
  setPixelPerCm2: (val: number | null) => void;
  setFCMParams: (params: Partial<FCMParams>) => void;
  setOptions: (colorSpace: 'grayscale' | 'hsv', filterType: 'median' | 'gaussian' | 'none') => void;
  setAnalyzing: (status: boolean) => void;
  setResults: (results: AnalysisResults | null) => void;
  setActivePatient: (id: number | null, name: string | null) => void;
  resetWorkspace: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  rawImageUrl: null,
  croppedImageUrl: null,
  pixelPerCm2: null,
  
  fcmParams: {
    clusters: 2,
    fuzziness: 2.0,
    maxIter: 100,
    epsilon: 0.00001,
  },
  colorSpace: 'hsv',
  filterType: 'median',
  
  isAnalyzing: false,
  results: null,
  activePatientId: null,
  activePatientName: null,

  setRawImage: (url) => set({ rawImageUrl: url, croppedImageUrl: null, results: null }),
  setCroppedImage: (url) => set({ croppedImageUrl: url, results: null }),
  setPixelPerCm2: (val) => set({ pixelPerCm2: val }),
  setFCMParams: (params) => set((state) => ({ fcmParams: { ...state.fcmParams, ...params } })),
  setOptions: (colorSpace, filterType) => set({ colorSpace, filterType }),
  setAnalyzing: (status) => set({ isAnalyzing: status }),
  setResults: (results) => set({ results }),
  setActivePatient: (id, name) => set({ activePatientId: id, activePatientName: name }),
  resetWorkspace: () => set({
    rawImageUrl: null,
    croppedImageUrl: null,
    pixelPerCm2: null,
    results: null,
    isAnalyzing: false,
    activePatientId: null,
    activePatientName: null,
  })
}));
