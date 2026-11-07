import React, { useRef, useEffect, useState } from 'react';
import { Download, X, Award, Sparkles, Check } from 'lucide-react';
import { Team } from '../../types';
import { ScoringEngine } from '../../services/scoringEngine';
import { storageService } from '../../services/storageService';

interface CertificateModalProps {
  team: Team;
  rank: number;
  onClose: () => void;
  onUpdateTeamPhoto?: (photoUrl: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  team,
  rank,
  onClose,
  onUpdateTeamPhoto,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState<string | undefined>(team.teamPhoto);

  const drawCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution: 1200 x 850
    const w = 1200;
    const h = 850;
    canvas.width = w;
    canvas.height = h;

    // 1. Dark Blue / Navy Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#070b19');
    bgGrad.addColorStop(0.5, '#0b132b');
    bgGrad.addColorStop(1, '#070b19');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Ornate Border Frame
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, w - 60, h - 60);

    ctx.strokeStyle = 'rgba(234, 179, 8, 0.7)';
    ctx.lineWidth = 2;
    ctx.strokeRect(42, 42, w - 84, h - 84);

    // Corner decorative accents
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 35);
      ctx.lineTo(0, 0);
      ctx.lineTo(35, 0);
      ctx.stroke();
      ctx.restore();
    };
    drawCorner(42, 42, 0);
    drawCorner(w - 42, 42, Math.PI / 2);
    drawCorner(w - 42, h - 42, Math.PI);
    drawCorner(42, h - 42, -Math.PI / 2);

    // 3. Organization Header
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TRƯỜNG PÉTRUS KÝ • TỔ KHOA HỌC TỰ NHIÊN', w / 2, 95);

    // 4. Main Event Title
    ctx.fillStyle = '#00f5ff';
    ctx.font = '800 24px "Outfit", sans-serif';
    ctx.fillText('PÉTRUS KÝ SCIENCE QUEST • THE FINAL CODE', w / 2, 135);

    ctx.fillStyle = '#eab308';
    ctx.font = '900 48px "Outfit", sans-serif';
    ctx.fillText('GIẤY CHỨNG NHẬN HOÀN THÀNH', w / 2, 205);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Ban Tổ chức vinh danh thành tích xuất sắc của tập thể đội thi:', w / 2, 255);

    // 5. Team Name & Class
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 46px "Outfit", sans-serif';
    ctx.fillText(`ĐỘI: ${team.teamName.toUpperCase()}`, w / 2, 325);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Chi đoàn / Lớp: ${team.className}   •   Mã số: ${team.teamCode}`, w / 2, 370);

    // Captain Name
    ctx.fillStyle = '#fde047';
    ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      `Đội Trưởng: ${team.captainName || (team.members && team.members[0]) || 'Đại diện'}`,
      w / 2,
      410
    );

    // 6. Achievement Details Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.fillRect(w / 2 - 380, 450, 760, 140);
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(w / 2 - 380, 450, 760, 140);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Thành tích giải mã 4 Vòng Mật mã Khoa học:', w / 2, 480);

    // Score & Rank metrics
    ctx.fillStyle = '#facc15';
    ctx.font = '800 28px "Outfit", sans-serif';
    ctx.fillText(`HẠNG #${rank}`, w / 2 - 220, 535);

    ctx.fillStyle = '#00f5ff';
    ctx.fillText(`${team.score} ĐIỂM`, w / 2, 535);

    ctx.fillStyle = '#c084fc';
    ctx.fillText(`${ScoringEngine.formatTime(team.elapsedTime)}`, w / 2 + 220, 535);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Xếp hạng toàn đoàn', w / 2 - 220, 565);
    ctx.fillText('Tổng điểm đạt được', w / 2, 565);
    ctx.fillText('Tổng thời gian thi đấu', w / 2 + 220, 565);

    // 7. Golden Stamp Seal (Left side)
    const sealX = w / 2 - 340;
    const sealY = 715;
    ctx.save();
    ctx.translate(sealX, sealY);
    ctx.beginPath();
    ctx.arc(0, 0, 52, 0, Math.PI * 2);
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★ PÉTRUS KÝ ★', 0, -22);
    ctx.fillText('TỔ KHOA HỌC', 0, -3);
    ctx.fillText('TỰ NHIÊN', 0, 13);
    ctx.fillText('ĐÃ CHỨNG NHẬN', 0, 31);
    ctx.restore();

    // 8. Signature line (Right side)
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Pétrus Ký, ngày 20 tháng 11 năm 2026', w / 2 + 340, 670);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('TTCM Tổ KHTN', w / 2 + 340, 698);

    ctx.fillStyle = '#eab308';
    ctx.font = 'italic 700 22px "Outfit", cursive, sans-serif';
    ctx.fillText('Thầy Nguyễn Minh Tiến', w / 2 + 340, 755);

    // 9. DEDICATED TEAM PHOTO FRAME (Phần trống trung tâm giữa Con dấu và Chữ ký)
    const photoW = 270;
    const photoH = 175;
    const photoX = w / 2 - photoW / 2;
    const photoY = 625;
    const radius = 12;

    // Helper for rounded rect path
    const roundedRectPath = (x: number, y: number, width: number, height: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + width - r, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + r);
      ctx.lineTo(x + width, y + height - r);
      ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      ctx.lineTo(x + r, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    if (currentPhoto) {
      // Draw Team Photo inside ornate gold frame
      const img = new Image();
      img.onload = () => {
        ctx.save();
        roundedRectPath(photoX, photoY, photoW, photoH, radius);
        ctx.clip();

        // Fit cover calculation
        const imgRatio = img.width / img.height;
        const targetRatio = photoW / photoH;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        if (imgRatio > targetRatio) {
          sw = img.height * targetRatio;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / targetRatio;
          sy = (img.height - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, photoX, photoY, photoW, photoH);
        ctx.restore();

        // Gold border stroke
        ctx.save();
        roundedRectPath(photoX, photoY, photoW, photoH, radius);
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        // Banner label above/below photo
        ctx.save();
        ctx.fillStyle = 'rgba(7, 11, 25, 0.85)';
        ctx.fillRect(photoX + 25, photoY + photoH - 24, photoW - 50, 20);
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1;
        ctx.strokeRect(photoX + 25, photoY + photoH - 24, photoW - 50, 20);

        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('★ ẢNH LƯU NIỆM ĐỘI THI ★', photoX + photoW / 2, photoY + photoH - 10);
        ctx.restore();
      };
      img.src = currentPhoto;
    } else {
      // Prestigious Official Science Quest Crest & Badge of Honor (No camera needed)
      ctx.save();
      // Glowing dark navy shield background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      roundedRectPath(photoX, photoY, photoW, photoH, radius);
      ctx.fill();

      // Double Gold & Cyan Tech Border
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2.5;
      roundedRectPath(photoX, photoY, photoW, photoH, radius);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(0, 245, 255, 0.4)';
      ctx.lineWidth = 1;
      roundedRectPath(photoX + 4, photoY + 4, photoW - 8, photoH - 8, radius - 2);
      ctx.stroke();

      // Science Honor Crest Icon
      ctx.textAlign = 'center';
      ctx.fillStyle = '#facc15';
      ctx.font = '32px sans-serif';
      ctx.fillText('🏆', photoX + photoW / 2, photoY + 50);

      // Gold Title
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 13px "Outfit", sans-serif';
      ctx.fillText('★ HUY HIỆU DANH DỰ PEK ★', photoX + photoW / 2, photoY + 82);

      // Motto
      ctx.fillStyle = '#00f5ff';
      ctx.font = '700 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('BẢN LĨNH • TRÍ TUỆ • TIÊN PHONG', photoX + photoW / 2, photoY + 105);

      // Sub-text
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Hoàn thành xuất sắc 4 Vòng Mật mã', photoX + photoW / 2, photoY + 128);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '400 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Tổ Khoa học Tự nhiên THPT Pétrus Ký', photoX + photoW / 2, photoY + 146);

      ctx.restore();
    }
  };

  useEffect(() => {
    drawCertificate();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        drawCertificate();
      });
    }
  }, [team, rank, currentPhoto]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `ChungNhan_${team.teamName}_${team.teamCode}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-yellow-500/40 rounded-3xl w-full max-w-4xl p-4 sm:p-6 flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-yellow-400" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Giấy Chứng Nhận Điện Tử Vinh Danh</span>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Pétrus Ký Science Quest 2026
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Chứng nhận chính thức từ Ban Tổ chức & Tổ Khoa học Tự nhiên Trường Pétrus Ký
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Preview Frame */}
        <div className="bg-slate-950 p-2 sm:p-4 rounded-2xl border border-slate-800 flex items-center justify-center overflow-x-auto shadow-inner mb-4">
          <canvas
            ref={canvasRef}
            className="w-full max-w-3xl h-auto rounded-xl shadow-2xl border border-yellow-500/30"
          />
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Kích thước bản in chuẩn: 1200 × 850 px (Định dạng PNG chất lượng cao)</span>
          </div>

          <button
            onClick={handleDownload}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-yellow-500/25 transition-all cursor-pointer transform hover:scale-102"
          >
            <Download className="w-4 h-4 stroke-[3]" />
            <span>TẢI GIẤY CHỨNG NHẬN VỀ MÁY (.PNG)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
