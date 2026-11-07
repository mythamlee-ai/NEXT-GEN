import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const assetsDir = path.join(distDir, 'assets');
const publicDir = path.resolve('public');

if (!fs.existsSync(assetsDir)) {
  console.error('Error: dist/assets not found. Run npm run build first.');
  process.exit(1);
}

const files = fs.readdirSync(assetsDir);
const cssFiles = files.filter(f => f.endsWith('.css'));
const jsFiles = files.filter(f => f.endsWith('.js'));

let cssContent = '';
for (const f of cssFiles) {
  cssContent += fs.readFileSync(path.join(assetsDir, f), 'utf-8') + '\n';
}

let jsContent = '';
for (const f of jsFiles) {
  jsContent += fs.readFileSync(path.join(assetsDir, f), 'utf-8') + '\n';
}

// Inline internal images into base64 Data URLs
const imageMap = [
  { webPath: '/src/assets/images/science_banner_1791188435725.jpg', localPath: 'src/assets/images/science_banner_1791188435725.jpg' },
  { webPath: '/src/assets/images/nextgen_chest_1791188403890.jpg', localPath: 'src/assets/images/nextgen_chest_1791188403890.jpg' },
  { webPath: '/src/assets/images/chibi_mascot_1791188388736.jpg', localPath: 'src/assets/images/chibi_mascot_1791188388736.jpg' },
  { webPath: '/src/assets/images/chibi_robot_1791188420275.jpg', localPath: 'src/assets/images/chibi_robot_1791188420275.jpg' }
];

for (const img of imageMap) {
  const fullPath = path.resolve(img.localPath);
  if (fs.existsSync(fullPath)) {
    const b64 = fs.readFileSync(fullPath).toString('base64');
    const dataUri = `data:image/jpeg;base64,${b64}`;
    jsContent = jsContent.replaceAll(img.webPath, dataUri);
  }
}

// Ensure safe embedding inside script tag
jsContent = jsContent.replaceAll('</script', '<\\/script');

const singleHtml = `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pétrus Ký Science Quest - The Next Gen (Standalone)</title>
    <meta name="description" content="Một hành trình – Bốn mật mã – Một nhà vô địch. Nền tảng game giải mật thư khoa học đỉnh cao dành cho học sinh THPT của Tổ Khoa học Tự nhiên Trường Pétrus Ký." />
    <meta property="og:title" content="Pétrus Ký Science Quest - The Next Gen" />
    <meta property="og:description" content="Một hành trình – Bốn mật mã – Một nhà vô địch. Nền tảng game giải mật thư khoa học đỉnh cao dành cho học sinh THPT của Tổ Khoa học Tự nhiên Trường Pétrus Ký." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
${cssContent}
    </style>
  </head>
  <body class="bg-[#060a19] text-white min-h-screen antialiased selection:bg-cyan-500 selection:text-white">
    <div id="root"></div>
    <script>
${jsContent}
    </script>
  </body>
</html>
`;

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pek-science-quest-standalone.html'), singleHtml, 'utf-8');
fs.writeFileSync(path.join(distDir, 'pek-science-quest-standalone.html'), singleHtml, 'utf-8');
fs.writeFileSync(path.join(publicDir, 'pek-science-quest.html'), singleHtml, 'utf-8');
fs.writeFileSync(path.join(distDir, 'pek-science-quest.html'), singleHtml, 'utf-8');

console.log('✅ Single-file HTML successfully created at:');
console.log(' - public/pek-science-quest.html');
console.log(' - public/pek-science-quest-standalone.html');
console.log(`Size: ${(Buffer.byteLength(singleHtml, 'utf-8') / (1024 * 1024)).toFixed(2)} MB`);
