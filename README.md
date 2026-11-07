# 🏆 PÉTRUS KÝ SCIENCE QUEST – THE NEXT GEN

> **Một Hành Trình – Bốn Mật Mã – Một Nhà Vô Địch**  
> Nền tảng Web Game giải mật thư khoa học đỉnh cao dành cho học sinh THPT của **Tổ Khoa học Tự nhiên – Trường THPT Pétrus Ký**.

---

## 🌟 TỔNG QUAN GIẢI ĐẤU & 4 VÒNG THI

1. **VÒNG 1: SCIENCE CODE BREAKER (Hòn Đảo Khoa Học)**
   - Ngân hàng chuẩn **90 câu hỏi trắc nghiệm** (30 Vật lý, 30 Hóa học, 30 Sinh học).
   - Hệ thống xáo trộn ngẫu nhiên đề thi cho từng đội dựa trên mã hạt giống (Seed PRNG).
   - Đồng hồ đếm ngược, tính điểm tốc độ và độ chính xác thời gian thực.

2. **VÒNG 2: AI ĐÂY? (Mật Thư Giáo Viên Pétrus Ký)**
   - Ngân hàng **10 Giáo viên chính thức** (GV01 → GV10) với hình vẽ avatar nhận diện đặc trưng.
   - Mỗi lượt thi chọn ngẫu nhiên **2 câu hỏi giáo viên**.
   - Cơ chế bẻ khóa gợi ý 4 tầng: mỗi lần mở thêm gợi ý điểm thưởng giảm dần (40 → 30 → 20 → 10 điểm). Học sinh đoán sai vẫn có thể mở tiếp gợi ý; hết 4 gợi ý sẽ công bố đáp án.

3. **VÒNG 3: PICTURE PUZZLE (Đuổi Hình Bắt Chữ Khoa Học)**
   - Mỗi lượt thi chọn ngẫu nhiên **3 câu hỏi ghép tranh**.
   - Hỗ trợ câu hỏi tự luận nhập từ khóa hoặc trắc nghiệm.
   - Game Master có thể tải lên hoặc kéo thả ảnh câu đố trực tiếp, chỉnh sửa đáp án linh hoạt.

4. **VÒNG 4: THE FINAL MISSION (Rương Kho Báu Cuối Cùng)**
   - **Hoàn toàn không cần camera**: Học sinh bẻ khóa mật thư thực địa, nhập mật mã trạm trực tiếp trên bàn phím.
   - Hệ thống đối soát tức thì, trả về **Đáp án giải mã khoa học chi tiết**.
   - Kích hoạt vòng quay điểm thưởng may mắn theo 6 hiệu ứng: `+5, +10, -5, -10, *2, :2` trên tổng điểm 3 vòng trước.

5. **GAME MASTER COMMAND CENTER & TIỆN ÍCH**
   - Theo dõi trạng thái từng đội (tiến độ từng vòng, điểm số, thời gian, câu trả lời).
   - Điều khiển vòng thi tập trung (Bắt đầu, Tạm dừng, Chuyển vòng, Kết thúc).
   - Xuất báo cáo kết quả thi đấu toàn giải định dạng Excel (`.xlsx`).
   - In thẻ trạm mật mã thực địa định dạng PDF/In ấn (`Station Cards`).
   - Màn hình Leaderboard sân khấu cho máy chiếu (Projector View).
   - Xuất **Giấy Chứng Nhận Điện Tử** chất lượng cao PNG (1200 × 850 px) kèm con dấu đỏ và huy hiệu danh dự Tổ KHTN.

---

## 🛠️ KIẾN TRÚC & CÔNG NGHỆ

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Motion, Lucide Icons, Canvas-Confetti.
- **Audio Engine**: Bộ tạo âm thanh sống động bằng Web Audio API (Synthesizer không phụ thuộc file ngoài).
- **Lưu trữ**: 
  - **Chế độ Static SPA (Miễn phí 100%)**: Hoạt động hoàn toàn trên `localStorage` và `BroadcastChannel` của trình duyệt. Không cần database hay server bên ngoài.
  - **Chế độ Full-stack (Tùy chọn)**: Đi kèm Express server (`server.ts`) hỗ trợ đồng bộ dữ liệu thời gian thực giữa nhiều máy tính và màn hình Game Master.
- **Bảo mật**: Không chứa bất kỳ API Key, Secret hay Private Token nào trong mã nguồn.

---

## 🚀 HƯỚNG DẪN CHẠY DỰ ÁN TRÊN MÁY CỤC BỘ (LOCAL)

### Yêu cầu
- Node.js version 18.0 trở lên.
- Trình quản lý gói `npm`.

### Cài đặt & Khởi động
```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Chạy môi trường phát triển (Full-stack Server + Vite)
npm run dev

# Hoặc chạy Vite Frontend thuần:
npm run dev:client

# 3. Mở trình duyệt tại địa chỉ
http://localhost:3000
```

---

## 📦 BUILD PRODUCTION CHO HOSTING MIỄN PHÍ

```bash
# Lệnh build sản phẩm
npm run build
```

- **Thư mục đầu ra (Output Directory)**: `dist/`
- Thư mục `dist/` chứa toàn bộ tệp HTML, CSS, JavaScript tĩnh và đã bao gồm:
  - `dist/_redirects`: Cấu hình SPA routing cho **Cloudflare Pages** & **Netlify**.
  - `dist/404.html`: Cấu hình chuyển hướng cho **GitHub Pages**.

---

## 🌐 HƯỚNG DẪN TRIỂN KHAI MIỄN PHÍ (DEPLOY)

### CÁCH 1: CLOUDFLARE PAGES (KHUYÊN DÙNG – TỐC ĐỘ CAO, MIỄN PHÍ 100%)

1. Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com/) (Tài khoản miễn phí).
2. Chọn **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Chọn kho chứa GitHub `pek-science-quest-next-gen`.
4. Cấu hình cài đặt Build:
   - **Framework preset**: `Vite` (hoặc `None`)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (để trống)
5. Nhấn **Save and Deploy**. Sau 1-2 phút, game sẽ chạy trên tên miền miễn phí dạng `https://<ten-project>.pages.dev`.

---

### CÁCH 2: GITHUB PAGES (MIỄN PHÍ 100%)

Dự án đã được cấu hình đường dẫn tương đối (`base: './'`), tương thích ngay lập tức với tên miền phụ `https://<username>.github.io/pek-science-quest-next-gen/`.

#### Sử dụng GitHub Actions (Tự động):
Tạo file `.github/workflows/deploy.yml` trong repo:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Vào repo trên GitHub: **Settings** → **Pages** → **Build and deployment** → chọn **GitHub Actions**. Khi push code lên nhánh `main`, game sẽ tự động được xuất bản!

---

### CÁCH 3: VERCEL HOẶC NETLIFY (MIỄN PHÍ)

- **Vercel**: Import Git Repository → Vercel tự nhận diện Vite → Nhấn **Deploy**.
- **Netlify**: Import Git Repository → Build command: `npm run build`, Publish directory: `dist` → Nhấn **Deploy**.

---

### CÁCH 4: TRIỂN KHAI PHÒNG MÁY LAN / TRƯỜNG HỌC (FULL-STACK MULTI-DEVICE)

Nếu tổ chức giải đấu tại trường học với 1 máy chủ (Server của giáo viên) và nhiều máy tính trạm của học sinh:
1. Kết nối tất cả máy vào cùng mạng LAN hoặc Wi-Fi trường.
2. Trên máy chủ, chạy:
   ```bash
   npm run build
   npm run start
   ```
3. Xem địa chỉ IP của máy chủ (ví dụ `http://192.168.1.100:3000`).
4. Tất cả máy học sinh và máy chiếu truy cập vào IP này để thi đấu đồng bộ dữ liệu thời gian thực!

---

## 🔒 TÍNH RIÊNG TƯ & AN TOÀN

- Ứng dụng không thu thập thông tin cá nhân.
- Không yêu cầu quyền camera vật lý.
- Mật khẩu mặc định của Game Master: `PEK2026` (có thể đổi trực tiếp trong giao diện Master).

---

*Bản quyền nội dung học thuật thuộc về Tổ Khoa học Tự nhiên – Trường THPT Pétrus Ký.*
