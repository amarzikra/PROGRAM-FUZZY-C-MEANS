# CLAUDE.md

> Panduan ini dibaca otomatis oleh Claude Code / Antigravity di setiap sesi.
> Tujuannya: menjaga konsistensi saat me-redesign UI tanpa merusak logika inti.

---

## 1. Tentang Proyek

Aplikasi web untuk **segmentasi dan estimasi luas luka ulkus diabetikum** dari citra RGB (foto luka). Bagian dari skripsi penelitian (RSUD Kolonel Abundjani Bangko).

Alur kerja aplikasi:
1. Upload citra luka (JPG/PNG).
2. Preprocessing: crop ROI, resize 512x512, filtering (median/Gaussian), konversi color space (RGB -> Grayscale/HSV).
3. Segmentasi memakai **Fuzzy C-Means (FCM)** dengan parameter: `c` (jumlah cluster), `m` (fuzziness), `MaxIter`, `epsilon`. Cluster dengan centroid lebih gelap = area luka.
4. Kalibrasi: objek referensi 1x1 cm untuk konversi piksel -> cm.
5. Evaluasi: **Dice Similarity Coefficient (DSC)**, **Intersection over Union (IoU)**, **Pixel Accuracy** (target >= 80%).
6. Output: visual hasil segmentasi + luas luka (cm^2) + nilai metrik.

---

## 2. Tech Stack (JANGAN diganti tanpa diminta)

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v3 (config di `tailwind.config.js`, CSS variables di `src/index.css`)
- **Component Library:** shadcn/ui (style: "new-york", baseColor: slate, alias `@/`)
- **Animasi:** Magic UI + Framer Motion (`motion`)
- **Ikon:** `lucide-react` dan `@tabler/icons-react`
- **Grafik:** Recharts (utamakan ini; `chart.js` lama boleh diganti bertahap ke Recharts)
- **Font:** Outfit (display) + Plus Jakarta Sans (body) -- sudah di-load via Google Fonts di `index.html`
- **State:** Zustand
- **Form:** React Hook Form + Zod
- **Upload:** react-dropzone
- **Canvas/anotasi:** react-konva / konva
- **Export:** html2canvas + jspdf
- **HTTP:** axios
- **Routing:** react-router-dom

### Path alias
- Gunakan `@/` untuk import dari `src/` (mis. `@/components/ui/button`, `@/lib/utils`).
- Util className: gunakan `cn()` dari `@/lib/utils`.

---

## 3. ATURAN PENTING (Do & Don't)

### JANGAN (kritis):
- JANGAN mengubah logika algoritma **Fuzzy C-Means** atau parameternya (`c`, `m`, `MaxIter`, `epsilon`).
- JANGAN mengubah perhitungan **luas luka (cm^2)** dan logika kalibrasi piksel.
- JANGAN mengubah perhitungan metrik evaluasi **Dice / IoU / Pixel Accuracy**.
- JANGAN mengubah endpoint/pemanggilan API atau kontrak data (request/response) tanpa diminta.
- JANGAN menambah library besar baru kalau yang ada sudah cukup (hindari duplikasi, mis. Recharts + chart.js sekaligus).
- JANGAN mengganti versi dependency di `package.json` tanpa diminta.

### LAKUKAN:
- FOKUS pada UI/UX: layout, spacing, warna, tipografi, komponen, animasi halus, responsivitas.
- Gunakan komponen shadcn/ui yang sudah ada; tambah komponen baru via `npx shadcn@latest add <nama>`.
- Pertahankan struktur folder & penamaan yang sudah ada.
- Buat UI **responsive** (mobile & desktop).
- Sertakan state **loading**, **error**, dan **empty** untuk setiap proses (terutama saat segmentasi berjalan).
- Pastikan **aksesibilitas** dasar (kontras warna, label, alt text).

---

## 4. Pedoman Desain (Tema: Clinical / Medical)

- **Kesan:** bersih, profesional, tenang -- seperti aplikasi rumah sakit modern.
- **Warna:**
  - Dominan putih / abu sangat terang sebagai background.
  - Aksen utama: biru / teal (kesan medis & terpercaya).
  - Hijau: untuk status sukses / hasil valid.
  - Merah/oranye: hanya untuk error atau peringatan.
  - Atur lewat CSS variables di `src/index.css` (jangan hardcode warna di tiap komponen).
- **Layout dashboard yang disarankan:**
  - Panel kiri: upload citra + form parameter FCM (`c`, `m`, `MaxIter`, `epsilon`) + tombol proses.
  - Panel kanan: preview citra asli vs hasil segmentasi, kartu luas luka (cm^2), dan kartu metrik (Dice/IoU/Pixel Accuracy).
- **Tipografi:** judul pakai Outfit, body pakai Plus Jakarta Sans. Hierarki jelas, jangan terlalu banyak ukuran font.
- **Spacing:** gunakan whitespace yang lega; hindari elemen terlalu padat.
- **Sudut & bayangan:** border-radius lembut (sudah diset: lg=1rem), shadow halus -- jangan berlebihan.
- **Animasi:** halus & fungsional (transisi, fade, skeleton loading). Hindari animasi berlebihan yang mengganggu.

---

## 5. Alur Kerja saat Mengubah UI

1. Pahami komponen/halaman target sebelum mengubah.
2. Lakukan perubahan bertahap (satu halaman/komponen per langkah), jangan rombak semua sekaligus.
3. Setelah mengubah, pastikan `npm run dev` jalan tanpa error & cek tampilan di browser.
4. Jika ada MCP Playwright/Chrome DevTools, ambil screenshot dan verifikasi hasil secara visual.
5. Jalankan `npm run lint` dan pastikan tidak ada error TypeScript.
6. Jelaskan singkat perubahan yang dibuat.

---

## 6. Perintah Penting

```bash
npm install        # install dependency
npm run dev        # jalankan dev server (cek tampilan di browser)
npm run build      # build production (tsc -b && vite build)
npm run lint       # cek lint & error
npx shadcn@latest add <komponen>   # tambah komponen shadcn (mis. card button tabs badge progress chart)
```

---

## 7. Bahasa

- UI aplikasi memakai **Bahasa Indonesia** (label, tombol, pesan).
- Komentar kode boleh Bahasa Indonesia atau Inggris -- konsisten dengan file yang sedang diedit.
