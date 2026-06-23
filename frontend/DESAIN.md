# DESAIN.md — Sistem Desain Frontend

> Panduan visual untuk redesign aplikasi **Segmentasi & Estimasi Luas Luka Ulkus Diabetikum**.
> Dibaca bersama `CLAUDE.md`. Ikuti panduan ini agar seluruh halaman konsisten.
> Tema: **Clinical / Medical** — bersih, profesional, tenang.

---

## 1. Prinsip Desain

1. **Clarity first** — informasi medis harus mudah dibaca; hindari dekorasi berlebihan.
2. **Whitespace lega** — beri ruang napas antar elemen.
3. **Konsisten** — gunakan token warna, spacing, dan komponen yang sama di semua halaman.
4. **Hierarki jelas** — judul, sub-judul, dan data utama (luas luka, metrik) harus menonjol.
5. **Tenang & terpercaya** — palet medis (biru/teal), bukan warna mencolok.
6. **Feedback jelas** — setiap aksi punya state loading / success / error.

---

## 2. Palet Warna (CSS Variables)

Masukkan nilai berikut ke `src/index.css`. Format shadcn (HSL tanpa `hsl()`).
`tailwind.config.js` sudah memetakan variabel ini.

```css
:root {
  /* Dasar */
  --background: 210 40% 99%;        /* putih kebiruan sangat terang */
  --foreground: 222 47% 11%;        /* teks gelap */
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;
  --popover: 0 0% 100%;
  --popover-foreground: 222 47% 11%;

  /* Warna utama: TEAL medis */
  --primary: 187 85% 33%;
  --primary-foreground: 0 0% 100%;

  /* Sekunder: BIRU lembut */
  --secondary: 204 94% 94%;
  --secondary-foreground: 201 96% 27%;

  /* Muted / netral */
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;

  /* Accent (highlight halus) */
  --accent: 187 60% 95%;
  --accent-foreground: 187 85% 25%;

  /* Status */
  --destructive: 0 72% 51%;         /* error / merah */
  --destructive-foreground: 0 0% 100%;
  --success: 142 71% 45%;           /* hijau (hasil valid) */
  --success-foreground: 0 0% 100%;
  --warning: 38 92% 50%;            /* oranye (peringatan) */

  /* Border & input */
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 187 85% 33%;

  /* Warna grafik (Recharts) */
  --chart-1: 187 85% 33%;   /* teal */
  --chart-2: 204 94% 50%;   /* biru */
  --chart-3: 142 71% 45%;   /* hijau */
  --chart-4: 38 92% 50%;    /* oranye */
  --chart-5: 262 60% 55%;   /* ungu */

  --radius: 1rem;
}

.dark {
  --background: 222 47% 11%;
  --foreground: 210 40% 98%;
  --card: 222 44% 14%;
  --card-foreground: 210 40% 98%;
  --popover: 222 44% 14%;
  --popover-foreground: 210 40% 98%;
  --primary: 187 80% 45%;
  --primary-foreground: 222 47% 11%;
  --secondary: 217 33% 20%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217 33% 18%;
  --muted-foreground: 215 20% 65%;
  --accent: 217 33% 20%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 63% 45%;
  --destructive-foreground: 210 40% 98%;
  --success: 142 65% 45%;
  --warning: 38 90% 55%;
  --border: 217 33% 24%;
  --input: 217 33% 24%;
  --ring: 187 80% 45%;
}
```

**Aturan pakai warna:**
- Background dominan putih/terang. Teal sebagai aksi utama (tombol proses, link, highlight).
- Hijau HANYA untuk hasil valid / sukses (mis. metrik >= 80%).
- Merah HANYA untuk error. Oranye untuk peringatan (mis. metrik di bawah target).
- Jangan hardcode warna di komponen — selalu pakai token (`bg-primary`, `text-muted-foreground`, dll).

---

## 3. Tipografi

- **Display / Judul:** `Outfit` (class `font-display`)
- **Body / Teks:** `Plus Jakarta Sans` (class `font-sans`)

Skala:

| Elemen | Ukuran | Weight |
|---|---|---|
| H1 (judul halaman) | `text-3xl` / `text-4xl` | 700 (bold) |
| H2 (judul section) | `text-2xl` | 600 |
| H3 (judul kartu) | `text-lg` / `text-xl` | 600 |
| Body | `text-sm` / `text-base` | 400 |
| Caption / label | `text-xs` | 500 |
| Angka data utama (luas cm2, metrik) | `text-3xl` / `text-4xl` | 700, `font-display` |

- Jangan pakai terlalu banyak ukuran berbeda dalam satu layar.
- Line-height nyaman dibaca (`leading-relaxed` untuk paragraf).

---

## 4. Spacing, Radius, Shadow

- **Spacing:** kelipatan 4px (Tailwind: `gap-4`, `p-6`, `space-y-4`). Antar section: `gap-6` / `gap-8`.
- **Border radius:** kartu & tombol membulat lembut (`rounded-lg` = 1rem; sudah diset di config).
- **Shadow:** halus saja (`shadow-sm` / `shadow-md`). Hindari shadow tebal/berlebihan.
- **Border:** gunakan `border border-border` tipis untuk memisahkan area, bukan shadow berat.

---

## 5. Komponen (shadcn/ui)

Gunakan komponen shadcn ini (tambah via `npx shadcn@latest add <nama>`):

- **Card** — wadah utama tiap section (upload, parameter, hasil, metrik)
- **Button** — aksi (`default` untuk proses utama, `outline`/`ghost` untuk aksi sekunder)
- **Input / Label / Form** — form parameter FCM
- **Slider** — alternatif input parameter `m`, `epsilon` (lebih intuitif)
- **Tabs** — pisahkan tampilan (mis. "Hasil" / "Detail" / "Evaluasi")
- **Badge** — status (mis. "Valid" hijau, "Di bawah target" oranye)
- **Progress** — indikator proses segmentasi berjalan
- **Tooltip** — penjelasan istilah (Dice, IoU, epsilon)
- **Skeleton** — placeholder saat loading
- **Dialog / Sheet** — detail / pengaturan lanjutan
- **Sonner (Toast)** — notifikasi sukses/gagal

Animasi: gunakan **Magic UI** + Framer Motion untuk transisi halus (fade-in kartu hasil, angka metrik yang animasi naik). Jangan berlebihan.

---

## 6. Layout Halaman

### Header (atas)
- Logo/nama aplikasi (kiri) + judul "Segmentasi & Estimasi Luas Luka Ulkus Diabetikum".
- Opsional: toggle dark mode (kanan).

### Halaman Utama — Dashboard 2 Kolom

```
+-----------------------------------------------------------+
|  Header                                                   |
+----------------------+------------------------------------+
|  PANEL KIRI          |  PANEL KANAN                       |
|  (input)             |  (hasil)                           |
|                      |                                    |
|  [ Upload Citra ]    |  [ Citra Asli | Hasil Segmentasi ] |
|  - dropzone          |   (side-by-side preview)           |
|  - preview thumbnail |                                    |
|                      |  [ Kartu Luas Luka: XX.X cm2 ]     |
|  [ Parameter FCM ]   |                                    |
|  - c (cluster)       |  [ Kartu Metrik Evaluasi ]         |
|  - m (fuzziness)     |   Dice | IoU | Pixel Accuracy      |
|  - MaxIter           |   (badge hijau jika >= 80%)        |
|  - epsilon           |                                    |
|                      |  [ Grafik Recharts ]               |
|  [ Tombol PROSES ]   |   (perbandingan metrik / cluster)  |
+----------------------+------------------------------------+
```

- Di layar kecil (mobile): panel menumpuk vertikal (kiri di atas, kanan di bawah).
- Panel kiri bisa `sticky` di desktop agar tetap terlihat saat scroll.

### Kartu Metrik
- Tampilkan angka besar + label kecil + ikon (Lucide/Tabler).
- Warna badge mengikuti nilai: hijau jika memenuhi target (>= 80%), oranye jika di bawah.

---

## 7. State Wajib (jangan dilupakan)

Untuk setiap proses (terutama segmentasi):
- **Empty:** sebelum upload — tampilkan placeholder ramah ("Unggah citra luka untuk memulai").
- **Loading:** saat FCM berjalan — Progress bar / Skeleton + teks "Memproses segmentasi...".
- **Success:** hasil tampil dengan animasi fade-in.
- **Error:** pesan jelas + saran (mis. "Gagal memproses. Pastikan citra valid dan objek referensi 1x1 cm terlihat.").

---

## 8. Aksesibilitas

- Kontras teks cukup (WCAG AA): teks gelap di atas background terang.
- Setiap input punya `<Label>`.
- Gambar punya `alt` deskriptif.
- Area klik (tombol) cukup besar (min. 40px tinggi).
- Fokus keyboard terlihat (ring teal).

---

## 9. Bahasa

Semua teks UI dalam **Bahasa Indonesia** (label, tombol, pesan error, tooltip).
