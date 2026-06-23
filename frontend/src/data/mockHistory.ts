export interface WoundAnalysisResult {
  id: string;
  patientId: string;
  date: string;
  area_cm2: number;
  area_pixel: number;
  imageUrl: string;
  overlayUrl: string;
  fcm_metrics: {
    iou: number;
    dsc: number;
    accuracy: number;
  };
  notes: string;
}

export const mockHistory: Record<string, WoundAnalysisResult[]> = {
  "P001": [
    {
      id: "A-001",
      patientId: "P001",
      date: "2024-05-10",
      area_cm2: 12.5,
      area_pixel: 18050,
      imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300",
      overlayUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300", // using same placeholder
      fcm_metrics: { iou: 0.85, dsc: 0.91, accuracy: 0.94 },
      notes: "Luka tampak bernanah, dilakukan pembersihan dasar."
    },
    {
      id: "A-002",
      patientId: "P001",
      date: "2024-05-24",
      area_cm2: 10.2,
      area_pixel: 14730,
      imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300",
      overlayUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300",
      fcm_metrics: { iou: 0.88, dsc: 0.93, accuracy: 0.95 },
      notes: "Infeksi berkurang, area kemerahan membaik."
    },
    {
      id: "A-003",
      patientId: "P001",
      date: "2024-06-10",
      area_cm2: 7.8,
      area_pixel: 11260,
      imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300",
      overlayUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300",
      fcm_metrics: { iou: 0.89, dsc: 0.94, accuracy: 0.96 },
      notes: "Jaringan granulasi tumbuh dengan baik."
    }
  ],
  "P002": [
    {
      id: "A-004",
      patientId: "P002",
      date: "2024-06-01",
      area_cm2: 5.4,
      area_pixel: 7800,
      imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300",
      overlayUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300",
      fcm_metrics: { iou: 0.82, dsc: 0.90, accuracy: 0.92 },
      notes: "Luka baru pada telapak kaki."
    },
    {
      id: "A-005",
      patientId: "P002",
      date: "2024-06-12",
      area_cm2: 6.1,
      area_pixel: 8800,
      imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300",
      overlayUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300",
      fcm_metrics: { iou: 0.86, dsc: 0.92, accuracy: 0.93 },
      notes: "Luka sedikit membesar, perlu penyesuaian dosis insulin."
    }
  ],
  "P003": [
    {
      id: "A-006",
      patientId: "P003",
      date: "2024-04-15",
      area_cm2: 4.2,
      area_pixel: 6060,
      imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300",
      overlayUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300",
      fcm_metrics: { iou: 0.81, dsc: 0.89, accuracy: 0.91 },
      notes: "Perawatan rutin."
    },
    {
      id: "A-007",
      patientId: "P003",
      date: "2024-05-20",
      area_cm2: 0.5,
      area_pixel: 720,
      imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300",
      overlayUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300",
      fcm_metrics: { iou: 0.91, dsc: 0.95, accuracy: 0.97 },
      notes: "Luka hampir tertutup sempurna, status diselesaikan."
    }
  ]
};
