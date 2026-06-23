// Mock API implementation to test the frontend before backend is ready
import type { AnalysisResults, FCMParams } from "../store/useWorkspaceStore";

export const mockAnalyze = async (
  imageUrl: string,
  params: FCMParams,
  pixelPerCm2: number
): Promise<AnalysisResults> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate backend processing
      const simulatedAreaPixel = Math.floor(Math.random() * 50000) + 10000;
      const simulatedAreaCm2 = parseFloat((simulatedAreaPixel / pixelPerCm2).toFixed(2));

      resolve({
        maskUrl: imageUrl, // for mock, just reuse the cropped image for now or use a placeholder
        overlayUrl: imageUrl,
        areaPixel: simulatedAreaPixel,
        areaCm2: simulatedAreaCm2,
        centroids: [192.57, 78.15], // mock values from PRD
        metrics: {
          dsc: 0.85,
          iou: 0.82,
          pixelAccuracy: 0.90,
        }
      });
    }, 2000); // 2 second mock delay
  });
};

export const mockPatients = [
  { id: 1, nama: "Bapak Ahmad", no_rekam_medis: "RM-001", created_at: "2024-05-01T10:00:00Z" },
  { id: 2, nama: "Ibu Siti", no_rekam_medis: "RM-002", created_at: "2024-05-02T11:30:00Z" }
];

export const mockWoundHistory = [
  { id: 1, area_cm2: 15.3, captured_at: "2024-05-01T10:00:00Z", image_path: "mock1.jpg" },
  { id: 2, area_cm2: 12.5, captured_at: "2024-05-08T10:00:00Z", image_path: "mock2.jpg" },
  { id: 3, area_cm2: 9.8, captured_at: "2024-05-15T10:00:00Z", image_path: "mock3.jpg" },
];
