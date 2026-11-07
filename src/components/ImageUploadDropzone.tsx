import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Check, RefreshCw } from 'lucide-react';

interface ImageUploadDropzoneProps {
  value: string;
  onChange: (dataUrlOrSvg: string) => void;
  label?: string;
  helperText?: string;
  recommendedPresets?: Array<{
    name: string;
    image: string;
  }>;
}

export const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  value,
  onChange,
  label = 'Hình Ảnh / Avatar Nhân Vật',
  helperText = 'Kéo thả ảnh trực tiếp vào đây hoặc bấm để chọn tệp từ máy tính (PNG, JPG, WebP, SVG). Không cần nhập mã.',
  recommendedPresets = [],
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFile = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WebP, SVG)!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-bold text-slate-700 block text-xs">{label}</label>
        {value && (
          <span className="text-[11px] font-mono text-emerald-600 font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            Đã tải ảnh
          </span>
        )}
      </div>

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed p-4 sm:p-5 transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/80 scale-[1.01]'
            : value
            ? 'border-emerald-300 bg-emerald-50/30 hover:bg-emerald-50/50'
            : 'border-slate-300 bg-slate-50 hover:bg-indigo-50/40 hover:border-indigo-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {value ? (
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-900 shadow-sm flex-shrink-0 group">
              <img
                src={value}
                alt="Xem trước hình ảnh"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-mono font-bold">
                Bấm để đổi
              </div>
            </div>

            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                  Ảnh đã sẵn sàng
                </span>
                <span className="text-[11px] text-slate-500">
                  (Bấm vùng này hoặc kéo ảnh mới để thay đổi)
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">
                Đã nạp tệp hình ảnh vào hệ thống. Ảnh sẽ tự động tối ưu và lưu vào cơ sở dữ liệu.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-indigo-600" />
                  <span>Chọn Tệp Khác</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange('');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <X className="w-3 h-3 text-rose-500" />
                  <span>Xóa Ảnh</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-2 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mb-2 shadow-xs">
              <Upload className="w-6 h-6 animate-bounce" />
            </div>
            <p className="font-bold text-xs sm:text-sm text-slate-800">
              Kéo & Thả ảnh vào đây, hoặc <span className="text-indigo-600 underline">Bấm để Chọn Tệp</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-sm">
              {helperText}
            </p>
          </div>
        )}
      </div>

      {/* Recommended Presets / Sẵn có (nếu có) */}
      {recommendedPresets.length > 0 && (
        <div className="pt-2">
          <span className="text-[11px] font-mono font-bold text-slate-500 uppercase block mb-1.5">
            Hoặc chọn ảnh có sẵn:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {recommendedPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(preset.image)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-xs font-semibold text-slate-700 flex items-center gap-2 cursor-pointer transition-all shadow-xs"
              >
                <img
                  src={preset.image}
                  alt={preset.name}
                  className="w-5 h-5 rounded-md object-cover border border-slate-200"
                />
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
