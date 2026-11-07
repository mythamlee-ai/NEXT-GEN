import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  X,
  RefreshCw,
  Check,
  Upload,
  AlertCircle,
  Sparkles,
  Users,
  RotateCcw,
  FlipHorizontal,
} from 'lucide-react';
import { audioManager } from '../services/audioManager';
import { cameraService } from '../services/cameraService';

interface TeamCameraModalProps {
  currentPhoto?: string;
  onPhotoCaptured: (photoDataUrl: string) => void;
  onClose: () => void;
  teamName: string;
}

export const TeamCameraModal: React.FC<TeamCameraModalProps> = ({
  currentPhoto,
  onPhotoCaptured,
  onClose,
  teamName,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(currentPhoto || null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  // Khởi động Camera khi mở modal nếu chưa có ảnh
  useEffect(() => {
    startCamera(facingMode);
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async (mode: 'user' | 'environment') => {
    stopCamera();
    setCameraError(null);

    try {
      const mediaStream = await cameraService.startCamera({ facingMode: mode });
      setStream(mediaStream);
      setCameraActive(true);

      if (videoRef.current) {
        await cameraService.attachToVideoElement(videoRef.current, mediaStream);
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setCameraActive(false);
      setCameraError(err.message || 'Không thể mở camera. Vui lòng cấp quyền truy cập camera.');
    }
  };

  const stopCamera = () => {
    cameraService.stopCamera();
    setStream(null);
    setCameraActive(false);
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Đếm ngược 3 giây trước khi chụp để cả đội tạo dáng
  const triggerCountdownSnapshot = () => {
    if (countdown !== null) return;
    setCountdown(3);
    audioManager.playPop();

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          takeSnapshot();
          return null;
        }
        audioManager.playPop();
        return prev - 1;
      });
    }, 1000);
  };

  const takeSnapshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Hiệu ứng flash máy ảnh
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 250);
    audioManager.playUnlock();

    // Nếu quay camera trước thì lật gương cho tự nhiên
    if (facingMode === 'user') {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, w, h);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedPreview(dataUrl);
    stopCamera();
  };

  // Tải tệp ảnh có sẵn từ máy
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WebP)!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) {
        setCapturedPreview(res);
        stopCamera();
        audioManager.playPop();
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRetake = () => {
    setCapturedPreview(null);
    startCamera(facingMode);
  };

  const handleConfirmPhoto = () => {
    if (capturedPreview) {
      onPhotoCaptured(capturedPreview);
      audioManager.playVictory();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-amber-400/50 rounded-3xl w-full max-w-2xl p-4 sm:p-6 flex flex-col shadow-2xl overflow-hidden relative">
        {/* Flash Overlay */}
        {isFlashing && (
          <div className="absolute inset-0 bg-white z-50 animate-out fade-out duration-300 pointer-events-none" />
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Chụp Ảnh Kỷ Niệm Cả Đội</span>
                <span className="text-xs font-mono text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  {teamName}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Hình ảnh sẽ được chèn trang trọng vào phần trống trên Giấy chứng nhận
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden Canvas for snapshot drawing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Hidden File Input for fallback */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Viewfinder / Preview Screen */}
        <div className="relative aspect-video sm:aspect-16/10 bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-inner flex items-center justify-center mb-4">
          {capturedPreview ? (
            // Captured Photo Preview
            <div className="relative w-full h-full group">
              <img
                src={capturedPreview}
                alt="Ảnh cả đội"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-xs text-amber-400 border border-amber-400/40 px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>ẢNH ĐÃ SẴN SÀNG</span>
              </div>
            </div>
          ) : cameraActive ? (
            // Live Video Camera Stream
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${
                  facingMode === 'user' ? 'scale-x-[-1]' : ''
                }`}
              />

              {/* Viewfinder frame overlay */}
              <div className="absolute inset-4 sm:inset-6 border-2 border-dashed border-amber-400/60 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between text-[11px] font-mono text-amber-300 font-bold bg-slate-950/60 px-2 py-0.5 rounded-md self-start">
                  <span>[ KHUNG ẢNH ĐỘI THI ]</span>
                </div>
                <div className="text-center text-xs font-mono text-white/80 bg-slate-950/60 py-1 px-3 rounded-full self-center">
                  Cả đội hãy nhìn vào camera và cười thật tươi nhé!
                </div>
              </div>

              {/* Big Countdown Badge */}
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs z-20">
                  <span className="text-7xl sm:text-8xl font-black font-mono text-amber-400 animate-ping">
                    {countdown}
                  </span>
                </div>
              )}
            </div>
          ) : (
            // Fallback screen when camera is disabled or error
            <div className="p-6 text-center max-w-md">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mx-auto flex items-center justify-center mb-3">
                <Camera className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">
                Camera chưa kích hoạt
              </h4>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                {cameraError || 'Bấm nút "Bật Camera" hoặc chọn tải tệp ảnh cả đội từ máy tính/điện thoại.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => startCamera(facingMode)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Bật Camera Lại</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-sky-400" />
                  <span>Chọn Tệp Ảnh Từ Máy</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
          {capturedPreview ? (
            // Controls when photo is taken
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chụp Lại Ảnh Khác</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Đổi Tệp Khác</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmPhoto}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer transform hover:scale-102"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>SỬ DỤNG ẢNH NÀY CHO CHỨNG NHẬN</span>
                </button>
              </div>
            </>
          ) : (
            // Controls when camera is live
            <>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1 border border-slate-700 transition-all cursor-pointer"
                  title="Đổi camera trước/sau"
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                  <span>Lật Cam</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1 border border-slate-700 transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-sky-400" />
                  <span>Tải Tệp Ảnh</span>
                </button>
              </div>

              {cameraActive && (
                <button
                  type="button"
                  onClick={triggerCountdownSnapshot}
                  disabled={countdown !== null}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 transition-all cursor-pointer transform hover:scale-102"
                >
                  <Camera className="w-5 h-5 stroke-[2.5]" />
                  <span>{countdown !== null ? `ĐANG ĐẾM (${countdown})...` : 'CHỤP ẢNH CẢ ĐỘI (3s)'}</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
