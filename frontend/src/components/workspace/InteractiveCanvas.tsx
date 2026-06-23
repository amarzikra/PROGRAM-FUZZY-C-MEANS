import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Transformer } from 'react-konva';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';

interface InteractiveCanvasProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onSave: (croppedImageUrl: string, pixelPerCm2: number) => void;
}

export default function InteractiveCanvas({ isOpen, onClose, imageUrl, onSave }: InteractiveCanvasProps) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imageUrl) return;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      setImage(img);
    };
  }, [imageUrl]);

  const stageRef = useRef<any>(null);
  const cropRectRef = useRef<any>(null);
  const calibRectRef = useRef<any>(null);
  const cropTransformerRef = useRef<any>(null);
  const calibTransformerRef = useRef<any>(null);
  
  const [activeTab, setActiveTab] = useState('crop');
  
  // Default sizes
  const [cropBox, setCropBox] = useState({ x: 50, y: 50, width: 200, height: 200 });
  const [calibBox, setCalibBox] = useState({ x: 100, y: 100, width: 40, height: 40 });

  // Calculate container size
  const containerWidth = 500;
  const containerHeight = 400;

  // Scale image to fit container
  const scale = image ? Math.min(containerWidth / image.width, containerHeight / image.height) : 1;
  const imageWidth = image ? image.width * scale : containerWidth;
  const imageHeight = image ? image.height * scale : containerHeight;

  useEffect(() => {
    if (activeTab === 'crop' && cropTransformerRef.current && cropRectRef.current) {
      cropTransformerRef.current.nodes([cropRectRef.current]);
      cropTransformerRef.current.getLayer().batchDraw();
    }
    if (activeTab === 'calibrate' && calibTransformerRef.current && calibRectRef.current) {
      calibTransformerRef.current.nodes([calibRectRef.current]);
      calibTransformerRef.current.getLayer().batchDraw();
    }
  }, [activeTab, image]);

  const handleSave = () => {
    if (!image || !stageRef.current) return;
    
    // 1. Crop Image
    // Create an offscreen canvas to crop the actual original image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate actual coordinates on the original image
    const actualCropX = cropBox.x / scale;
    const actualCropY = cropBox.y / scale;
    const actualCropW = cropBox.width / scale;
    const actualCropH = cropBox.height / scale;

    canvas.width = actualCropW;
    canvas.height = actualCropH;
    
    ctx.drawImage(
      image,
      actualCropX, actualCropY, actualCropW, actualCropH, // Source
      0, 0, actualCropW, actualCropH // Destination
    );

    const croppedDataUrl = canvas.toDataURL('image/jpeg');

    // 2. Calculate pixelPerCm2
    // The calibration box represents 1x1 cm
    const actualCalibW = calibBox.width / scale;
    const actualCalibH = calibBox.height / scale;
    const pixelPerCm2 = Math.round(actualCalibW * actualCalibH);

    onSave(croppedDataUrl, pixelPerCm2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-white p-0 overflow-hidden rounded-3xl border-0 shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle className="text-xl font-display font-bold text-slate-800">
            Persiapan Analisis (Crop & Kalibrasi)
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <div className="w-full">
            <div className="flex w-full mb-4 bg-slate-100 rounded-lg p-1">
              <button 
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'crop' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                onClick={() => setActiveTab('crop')}
              >
                1. Potong Area Luka (Crop)
              </button>
              <button 
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'calibrate' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                onClick={() => setActiveTab('calibrate')}
              >
                2. Tandai Ukuran 1x1 cm
              </button>
            </div>
            
            <div className="bg-slate-900 rounded-xl flex items-center justify-center overflow-hidden" style={{ width: containerWidth, height: containerHeight, margin: '0 auto' }}>
              {image && (
                <Stage width={imageWidth} height={imageHeight} ref={stageRef}>
                  <Layer>
                    <KonvaImage image={image} width={imageWidth} height={imageHeight} />
                    
                    {/* Dark overlay outside crop box when cropping */}
                    {activeTab === 'crop' && (
                      <Rect
                        x={cropBox.x}
                        y={cropBox.y}
                        width={cropBox.width}
                        height={cropBox.height}
                        stroke="#3b82f6"
                        strokeWidth={2}
                        draggable
                        ref={cropRectRef}
                        onDragEnd={(e) => {
                          setCropBox({
                            ...cropBox,
                            x: e.target.x(),
                            y: e.target.y()
                          });
                        }}
                        onTransformEnd={(e) => {
                          const node = cropRectRef.current;
                          const scaleX = node.scaleX();
                          const scaleY = node.scaleY();
                          node.scaleX(1);
                          node.scaleY(1);
                          setCropBox({
                            x: node.x(),
                            y: node.y(),
                            width: Math.max(5, node.width() * scaleX),
                            height: Math.max(5, node.height() * scaleY),
                          });
                        }}
                      />
                    )}
                    {activeTab === 'crop' && (
                      <Transformer
                        ref={cropTransformerRef}
                        boundBoxFunc={(oldBox, newBox) => newBox}
                      />
                    )}

                    {/* Calibration Box */}
                    {activeTab === 'calibrate' && (
                      <Rect
                        x={calibBox.x}
                        y={calibBox.y}
                        width={calibBox.width}
                        height={calibBox.height}
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="rgba(16, 185, 129, 0.3)"
                        draggable
                        ref={calibRectRef}
                        onDragEnd={(e) => {
                          setCalibBox({
                            ...calibBox,
                            x: e.target.x(),
                            y: e.target.y()
                          });
                        }}
                        onTransformEnd={(e) => {
                          const node = calibRectRef.current;
                          const scaleX = node.scaleX();
                          const scaleY = node.scaleY();
                          node.scaleX(1);
                          node.scaleY(1);
                          setCalibBox({
                            x: node.x(),
                            y: node.y(),
                            width: Math.max(5, node.width() * scaleX),
                            height: Math.max(5, node.height() * scaleY),
                          });
                        }}
                      />
                    )}
                    {activeTab === 'calibrate' && (
                      <Transformer
                        ref={calibTransformerRef}
                        boundBoxFunc={(oldBox, newBox) => newBox}
                      />
                    )}

                  </Layer>
                </Stage>
              )}
            </div>
            
            <div className="mt-4 text-center text-sm text-slate-500">
              {activeTab === 'crop' 
                ? "Sesuaikan kotak biru untuk memotong gambar fokus pada area luka saja."
                : "Geser dan sesuaikan kotak hijau agar mewakili area berukuran 1x1 cm di dunia nyata pada foto."}
            </div>

          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            Simpan & Terapkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
