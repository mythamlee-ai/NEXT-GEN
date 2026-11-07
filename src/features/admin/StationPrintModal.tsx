import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Printer, X, Download, ShieldCheck, QrCode, Compass, Sparkles, Key, Gift } from 'lucide-react';
import { Challenge } from '../../types';
import { storageService } from '../../services/storageService';

interface StationPrintModalProps {
  onClose: () => void;
}

const BONUS_STATIONS_DATA = [
  {
    id: 'bonus-phy',
    code: 'PEK-PHYSICS-BONUS',
    title: 'Trạm Bí Mật 01: Lab Quang Học & Sóng',
    task: 'Khám phá hiện tượng khúc xạ ánh sáng và giải mã vạch quang phổ.',
    subject: 'Vật Lý',
    points: 20,
  },
  {
    id: 'bonus-chem',
    code: 'PEK-CHEM-BONUS',
    title: 'Trạm Bí Mật 02: Bảng Tuần Hoàn & Phản Ứng PeK',
    task: 'Nhận diện chất xúc tác và viết phương trình hóa học bí truyền.',
    subject: 'Hóa Học',
    points: 20,
  },
  {
    id: 'bonus-bio',
    code: 'PEK-BIO-BONUS',
    title: 'Trạm Bí Mật 03: Vườn Sinh Thái & Bản Đồ Gene DNA',
    task: 'Giải mã quy luật di truyền Menđen và cấu trúc chuỗi xoắn kép.',
    subject: 'Sinh Học',
    points: 20,
  },
  {
    id: 'bonus-nextgen',
    code: 'NEXTGEN-SECRET-PEK',
    title: 'Trạm Bí Mật Next Gen: Biểu Tượng Khoa Học Tương Lai',
    task: 'Quét biểu tượng Next Gen đặt tại sảnh trung tâm Trường PeK.',
    subject: 'Next Gen',
    points: 30,
  },
];

export const StationPrintModal: React.FC<StationPrintModalProps> = ({ onClose }) => {
  const challenges = storageService.getChallenges();
  const [qrMap, setQrMap] = useState<Record<string, string>>({});

  useEffect(() => {
    // Generate QR for all challenges
    challenges.forEach((ch) => {
      QRCode.toDataURL(ch.expectedCode, {
        width: 350,
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' },
      })
        .then((url) => {
          setQrMap((prev) => ({ ...prev, [ch.id]: url }));
        })
        .catch(() => {});
    });

    // Generate QR for bonus stations
    BONUS_STATIONS_DATA.forEach((s) => {
      QRCode.toDataURL(s.code, {
        width: 350,
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' },
      })
        .then((url) => {
          setQrMap((prev) => ({ ...prev, [s.id]: url }));
        })
        .catch(() => {});
    });
  }, [challenges]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-white border-2 border-slate-200 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Bar - Hidden when printing */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between print:hidden bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-300">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Thẻ Mật Thư Trạm Thực Địa & Trạm Điểm Thưởng (QR)
              </h3>
              <p className="text-xs text-slate-500">
                In và dán tại các trạm thi đấu trong khuôn viên trường
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In Tất Cả Thẻ Trạm (Ctrl + P)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Cards List */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-8 bg-slate-100 print:p-0 print:space-y-6 print:bg-white print:text-black">
          {/* Section 1: Main Challenges */}
          <div className="print:hidden">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>1. THẺ TRẠM CHUNG CUỘC (VÒNG 4)</span>
            </h4>
          </div>

          {challenges.map((ch, idx) => {
            const qrUrl = qrMap[ch.id];
            return (
              <div
                key={ch.id}
                className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border-4 border-slate-900 shadow-xl max-w-2xl mx-auto break-inside-avoid print:shadow-none print:border-2 print:border-black"
              >
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-900 text-amber-400 rounded-2xl flex items-center justify-center font-black text-xl">
                      #{idx + 1}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600 block">
                        TỔ KHOA HỌC TỰ NHIÊN – TRƯỜNG PÉTRUS KÝ
                      </span>
                      <h2 className="text-xl font-black text-slate-950 tracking-tight">
                        PÉTRUS KÝ SCIENCE QUEST • THẺ TRẠM #{idx + 1}
                      </h2>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-100 border border-slate-300 px-3 py-1 rounded-full text-slate-800">
                    VÒNG 4: THE FINAL CODE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-2xl border border-slate-300">
                    {qrUrl ? (
                      <img
                        src={qrUrl}
                        alt={`QR Trạm ${idx + 1}`}
                        className="w-48 h-48 rounded-xl bg-white p-1"
                      />
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
                        Đang tạo mã QR...
                      </div>
                    )}
                    <span className="text-[11px] font-mono font-bold text-slate-700 mt-2">
                      QUÉT MÃ BẰNG CAMERA NHIỆM VỤ
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                        Nhiệm Vụ Trạm:
                      </span>
                      <h4 className="text-base font-bold text-slate-950 mt-0.5">
                        {ch.title}
                      </h4>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                        {ch.task}
                      </p>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-950">
                      <strong>Vật phẩm giải mã:</strong> {ch.secretArtifactName}
                    </div>

                    <div className="p-3 bg-slate-900 text-white rounded-xl">
                      <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-bold uppercase mb-1">
                        <Key className="w-3 h-3" />
                        <span>MÃ DỰ PHÒNG (NẾU CAMERA LỖI):</span>
                      </div>
                      <span className="font-mono font-black text-base tracking-widest text-amber-300 select-all">
                        {ch.expectedCode}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                  <span>* Giám thị trạm cấp mã này cho đội thi sau khi hoàn thành nhiệm vụ thực địa.</span>
                  <span className="font-mono font-bold">Điểm thưởng: +{ch.points} pts</span>
                </div>
              </div>
            );
          })}

          {/* Section 2: Secret Bonus Stations */}
          <div className="print:hidden pt-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-600" />
              <span>2. THẺ CÁC TRẠM QR BÍ MẬT (CỘNG ĐIỂM THƯỞNG)</span>
            </h4>
          </div>

          {BONUS_STATIONS_DATA.map((s) => {
            const qrUrl = qrMap[s.id];
            return (
              <div
                key={s.id}
                className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border-4 border-emerald-600 shadow-xl max-w-2xl mx-auto break-inside-avoid print:shadow-none print:border-2 print:border-black"
              >
                <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-xl">
                      🎁
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 block">
                        TRẠM BÍ MẬT • BỘ MÔN {s.subject.toUpperCase()}
                      </span>
                      <h2 className="text-xl font-black text-slate-950 tracking-tight">
                        {s.title}
                      </h2>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full text-emerald-900">
                    +{s.points} ĐIỂM THƯỞNG
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <div className="flex flex-col items-center justify-center bg-slate-50 p-4 rounded-2xl border border-slate-300">
                    {qrUrl ? (
                      <img
                        src={qrUrl}
                        alt={s.title}
                        className="w-48 h-48 rounded-xl bg-white p-1"
                      />
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
                        Đang tạo mã QR...
                      </div>
                    )}
                    <span className="text-[11px] font-mono font-bold text-slate-700 mt-2">
                      QUÉT NHẬN NGAY +{s.points} ĐIỂM
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                        Thử Thách Tại Trạm:
                      </span>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                        {s.task}
                      </p>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-xs text-emerald-950 font-medium">
                      Mỗi đội chơi chỉ được cộng điểm thưởng từ trạm này một lần duy nhất.
                    </div>

                    <div className="p-3 bg-slate-900 text-white rounded-xl">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase mb-1">
                        <Key className="w-3 h-3" />
                        <span>MÃ DỰ PHÒNG THỦ CÔNG:</span>
                      </div>
                      <span className="font-mono font-black text-base tracking-widest text-emerald-300 select-all">
                        {s.code}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
