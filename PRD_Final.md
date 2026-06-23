# PRD — Sistem Segmentasi & Estimasi Luas Luka Ulkus Diabetikum

**Berbasis Web App dengan Tampilan Multi-Panel (mirip MATLAB GUI)**

> Disusun berdasarkan skripsi BAB 1–BAB 4:
> *"Segmentasi dan Estimasi Luas Luka Ulkus Diabetikum Menggunakan Fuzzy C-Means pada RSUD Kolonel Abundjani Bangko"*

| Item | Keterangan |
|---|---|
| Versi Dokumen | 1.0 (Final untuk hand-off coding) |
| Status | Siap dikembangkan |
| Metode Inti | Fuzzy C-Means (FCM) |
| Target Akurasi | DSC, IoU, Pixel Accuracy ≥ 80% |
| Aktor | Tenaga Medis (dokter/perawat) |

---

## Daftar Isi

1. [Latar Belakang & Tujuan](#1-latar-belakang--tujuan)
2. [Ruang Lingkup](#2-ruang-lingkup)
3. [Aktor & Persona](#3-aktor--persona)
4. [User Flow (Diagram)](#4-user-flow-diagram)
5. [Pipeline Teknis End-to-End (Flowchart)](#5-pipeline-teknis-end-to-end-flowchart)
6. [Algoritma Fuzzy C-Means (Flowchart)](#6-algoritma-fuzzy-c-means-flowchart)
7. [Arsitektur Sistem (Diagram)](#7-arsitektur-sistem-diagram)
8. [Sequence Diagram](#8-sequence-diagram)
9. [Spesifikasi Fungsional](#9-spesifikasi-fungsional)
10. [Kontrak API (REST)](#10-kontrak-api-rest)
11. [Skema Database (ERD + SQL)](#11-skema-database-erd--sql)
12. [Tech Stack](#12-tech-stack)
13. [Spesifikasi Data Input](#13-spesifikasi-data-input)
14. [Rencana Pengujian](#14-rencana-pengujian)
15. [Kebutuhan Non-Fungsional](#15-kebutuhan-non-fungsional)
16. [Milestone & Roadmap](#16-milestone--roadmap)
17. [Struktur Proyek](#17-struktur-proyek)
18. [Acceptance Criteria (Definition of Done)](#18-acceptance-criteria-definition-of-done)

---

## 1. Latar Belakang & Tujuan

### 1.1 Masalah Saat Ini
Pengukuran luas luka ulkus diabetikum di RSUD Kolonel Abundjani Bangko masih dilakukan **manual** (penggaris / taksiran visual), dengan kelemahan:

- **Subjektif & tidak presisi** — bergantung persepsi pengukur.
- **Lambat & tidak efisien** — memakan waktu.
- **Risiko infeksi silang** — kontak fisik langsung dengan luka.
- **Tidak konsisten** — progres penyembuhan antar sesi sulit dibandingkan.

### 1.2 Solusi yang Diusulkan
Aplikasi **web** berbasis Digital Image Processing (DIP) yang:

1. Menyediakan **antarmuka multi-panel** mirip MATLAB GUI (beberapa panel citra dalam satu layar).
2. Melakukan **segmentasi otomatis** area luka vs kulit sehat dengan **Fuzzy C-Means (FCM)**.
3. Menghitung **estimasi luas luka dalam cm²** via kalibrasi piksel objek referensi 1×1 cm.
4. Menampilkan **visualisasi** segmentasi, overlay, dan grafik progres penyembuhan.
5. Menghitung **metrik evaluasi**: DSC, IoU, Pixel Accuracy.

### 1.3 Tujuan Produk
- Menggantikan pengukuran manual dengan pengukuran objektif, cepat, dan tanpa kontak fisik.
- Mendokumentasikan progres penyembuhan luka secara terstruktur dan dapat diaudit.
- Mencapai akurasi segmentasi **≥ 80%** pada ketiga metrik evaluasi.

### 1.4 Target Performa

| Metrik | Target Minimal |
|---|---|
| Dice Similarity Coefficient (DSC) | ≥ 80% |
| Intersection over Union (IoU) | ≥ 80% |
| Pixel Accuracy | ≥ 80% |
| Selisih estimasi luas vs manual | Seminimal mungkin |
| Waktu proses 1 citra | < beberapa detik (Ryzen 5 5600H / 16 GB) |

---

## 2. Ruang Lingkup

### Di Dalam Ruang Lingkup
- Autentikasi & manajemen akun (dokter/perawat) berbasis peran.
- Upload foto luka (JPG/PNG) dari browser.
- Preprocessing: crop ROI, resize 512×512, filtering, konversi ruang warna.
- Segmentasi FCM dengan parameter yang dapat dikonfigurasi.
- Kalibrasi piksel dengan objek referensi 1×1 cm.
- Estimasi luas luka dalam cm².
- Visualisasi multi-panel (asli, konversi, mask, overlay).
- Riwayat pasien + grafik progres penyembuhan.
- Evaluasi DSC/IoU/Pixel Accuracy (bila ada ground truth).
- Ekspor hasil (PNG/PDF).
- Penyimpanan data berbasis PostgreSQL + Docker.

### Di Luar Ruang Lingkup
- Diagnosis klinis otomatis (sistem hanya alat bantu pengukuran).
- Aplikasi mobile native.
- Integrasi rekam medis eksternal (tahap pertama).

---

## 3. Aktor & Persona

- **Aktor tunggal:** Tenaga Medis (dokter/perawat) RSUD Kolonel Abundjani Bangko.
- Kemampuan: registrasi, login, kelola pasien, unggah citra, jalankan analisis, baca & ekspor hasil.
- Catatan UX: pengguna **tidak teknis** → antarmuka wajib intuitif, minim istilah teknis.

---

## 4. User Flow (Diagram)

```mermaid
flowchart TD
    A([Mulai]) --> B["Registrasi / Login (JWT)"]
    B --> C[Dashboard: Daftar Pasien]
    C --> D{Pasien sudah ada?}
    D -- Tidak --> E[Tambah Pasien Baru]
    D -- Ya --> F[Pilih Pasien]
    E --> F
    F --> G[Halaman Riwayat Luka Pasien]
    G --> H["Unggah Foto Luka (JPG/PNG)"]
    H --> I["Preprocessing: Crop ROI, Resize, Filter, Convert"]
    I --> J["Kalibrasi Objek Referensi 1x1 cm"]
    J --> K["Atur Parameter FCM lalu Analisis"]
    K --> L["Multi-Panel: Asli, Konversi, Mask, Overlay + Luas cm2"]
    L --> M{Ada Ground Truth?}
    M -- Ya --> N["Evaluasi: DSC, IoU, Pixel Accuracy"]
    M -- Tidak --> O[Simpan Hasil + Catatan Klinis]
    N --> O
    O --> P["Grafik Progres Penyembuhan"]
    P --> Q["Ekspor PNG / PDF"]
    Q --> R([Selesai])
```

---

## 5. Pipeline Teknis End-to-End (Flowchart)

```mermaid
flowchart TD
    subgraph FE["Frontend (React)"]
        A1["Login / Auth"] --> A2["Pilih / Tambah Pasien"]
        A2 --> A3["Upload Foto Luka"]
        A3 --> A4["Crop ROI (Konva.js)"]
        A4 --> A5["Resize 512x512"]
        A5 --> A6["Filter: Median / Gaussian"]
        A6 --> A7["Convert: Grayscale / HSV"]
        A7 --> A8["Tandai Referensi 1x1 cm"]
        A8 --> A9["Hitung pixel_per_cm2"]
    end

    A9 --> B1

    subgraph BE["Backend (FastAPI)"]
        B1["POST /analyze"] --> B2["Validasi Input + Parameter FCM"]
        B2 --> B3["Jalankan FCM (iteratif)"]
        B3 --> B4["Pelabelan Cluster (centroid gelap = luka)"]
        B4 --> B5["Hitung area_pixel & area_cm2"]
        B5 --> B6["Evaluasi (opsional, bila ada ground truth)"]
        B6 --> B7["Simpan ke PostgreSQL"]
        B7 --> B8["Response JSON: mask, overlay, luas, metrik"]
    end

    B8 --> C1["Render Multi-Panel + Grafik"]
    C1 --> C2["Ekspor PNG / PDF"]
```

---

## 6. Algoritma Fuzzy C-Means (Flowchart)

FCM dipilih karena mampu menangani batas objek yang **tidak tegas** (gradasi warna pada tepi luka).

**Parameter:**

| Parameter | Keterangan | Nilai Default |
|---|---|---|
| `c` | Jumlah cluster | 2 (atau 3) |
| `m` | Fuzziness (derajat kekaburan) | 2.0 |
| `MaxIter` | Maksimum iterasi | 100 |
| `epsilon` | Ambang konvergensi | 1e-5 |

```mermaid
flowchart TD
    S([Mulai]) --> P1["Set parameter: c, m, MaxIter, epsilon"]
    P1 --> P2["Inisialisasi matriks partisi U secara acak (sum tiap piksel = 1)"]
    P2 --> P3["t = 1, P0 = 0"]
    P3 --> L1["Hitung pusat cluster Vk (rata-rata berbobot U^m)"]
    L1 --> L2["Hitung fungsi objektif Pt"]
    L2 --> L3["Perbarui derajat keanggotaan U"]
    L3 --> D1{"|Pt - Pt-1| < epsilon  ATAU  t > MaxIter ?"}
    D1 -- Belum --> L4["t = t + 1"]
    L4 --> L1
    D1 -- Ya --> O1["Konvergen: hasilkan mask cluster"]
    O1 --> O2["Label cluster: centroid TERGELAP = AREA LUKA"]
    O2 --> E([Selesai])
```

**Validasi acuan (BAB 4):** untuk data sampel 6 piksel `[210,190,200,85,70,60]`, hasil harus mendekati:
- `V1 = 192.57` (kulit sehat — lebih terang)
- `V2 = 78.15` (area luka — lebih gelap)

**Estimasi luas:**
```
pixel_per_cm2 = luas_area_referensi_dalam_piksel   (contoh BAB 4: 38x38 = 1.444 px/cm2)
pixel_luka    = jumlah piksel dengan mask == 1
luas_cm2      = pixel_luka / pixel_per_cm2
```

---

## 7. Arsitektur Sistem (Diagram)

```mermaid
flowchart LR
    User(["Dokter / Perawat"]) --> FE["Frontend React<br/>Multi-panel UI, Konva.js, Chart.js, Tailwind"]
    FE -->|"HTTP / REST (JWT)"| BE["Backend FastAPI<br/>Auth, Patients, Analyze"]
    BE --> AI["Segmentation Service<br/>FCM (scikit-fuzzy / NumPy), OpenCV"]
    BE --> DB[("PostgreSQL 16")]
    BE --> FS["File Storage<br/>(lokal / MinIO / S3)"]
    AI --> BE

    subgraph Docker["Docker Compose"]
        BE
        AI
        DB
    end
```

---

## 8. Sequence Diagram

```mermaid
sequenceDiagram
    actor U as Dokter/Perawat
    participant FE as Frontend (React)
    participant BE as Backend (FastAPI)
    participant AI as FCM Service
    participant DB as PostgreSQL

    U->>FE: Login (email, password)
    FE->>BE: POST /api/v1/auth/login
    BE-->>FE: JWT token

    U->>FE: Upload foto + crop + kalibrasi 1x1 cm
    FE->>BE: POST /api/v1/upload (multipart)
    BE-->>FE: image_id

    U->>FE: Klik "Analisis FCM"
    FE->>BE: POST /api/v1/analyze (image_id, params, pixel_per_cm2)
    BE->>AI: Preprocessing + FCM iteratif
    AI-->>BE: mask, overlay, area_pixel, area_cm2
    BE->>DB: INSERT wound_images
    BE-->>FE: JSON (overlay_url, mask_url, luas, metrik)
    FE-->>U: Render multi-panel + nilai luas
```

---

## 9. Spesifikasi Fungsional

### 9.1 Autentikasi & Akun
- [ ] Registrasi: email, password (bcrypt), peran (dokter/perawat).
- [ ] Login via JWT Bearer Token (OAuth2).
- [ ] Pengaturan profil pengguna.

### 9.2 Manajemen Pasien
- [ ] CRUD pasien (nama, no. rekam medis).
- [ ] 1 user → banyak pasien; 1 pasien → banyak foto luka.

### 9.3 Upload & Preprocessing
- [ ] Upload JPG/PNG (drag-and-drop / file dialog) + preview.
- [ ] **Crop ROI** interaktif (Konva.js).
- [ ] **Resize** ke 512×512.
- [ ] **Filter:** Median (noise impulsif) / Gaussian (smoothing).
- [ ] **Konversi warna:** Grayscale `[intensity]` atau HSV `[H,S,V]`.

### 9.4 Kalibrasi & Estimasi Luas
- [ ] Tandai objek referensi 1×1 cm di canvas (klik/drag).
- [ ] Hitung `pixel_per_cm2` otomatis.
- [ ] Hitung & tampilkan `luas_cm2`.

### 9.5 Segmentasi FCM
- [ ] Backend menerima citra terpreprocessing.
- [ ] Jalankan FCM (parameter dari user).
- [ ] Kembalikan mask biner, overlay, dan luas cm².

### 9.6 Visualisasi Multi-Panel

| Panel | Konten |
|---|---|
| A | Citra asli (RGB) |
| B | Citra hasil konversi (Grayscale/HSV) |
| C | Mask segmentasi FCM (biner) |
| D | Overlay mask pada citra asli |
| Output | Luas luka (cm² & piksel) |
| Opsional | DSC, IoU, Pixel Accuracy |

- [ ] Layout multi-panel (CSS Grid/Flexbox).
- [ ] Canvas interaktif (Konva.js) untuk crop & kalibrasi.
- [ ] Tombol aksi: Upload, Preprocessing, Kalibrasi, Analisis, Evaluasi, Simpan, Ekspor.

### 9.7 Pemantauan Progres
- [ ] Linimasa foto per pasien (kronologis).
- [ ] Grafik luas luka antar waktu (Chart.js).
- [ ] Perbandingan dua gambar berdampingan.

### 9.8 Evaluasi (Opsional)
```
TP = piksel luka terdeteksi benar
FP = bukan luka, salah terdeteksi luka
FN = piksel luka tidak terdeteksi
TN = bukan luka, benar tidak terdeteksi

DSC            = 2*TP / (2*TP + FP + FN)
IoU            = TP / (TP + FP + FN)
Pixel Accuracy = (TP + TN) / (TP + TN + FP + FN)
```
- [ ] Upload ground truth (mask manual).
- [ ] Backend hitung DSC/IoU/Pixel Accuracy.
- [ ] Tampilkan & simpan ke DB.

### 9.9 Ekspor & Laporan
- [ ] Unduh mask/overlay (PNG).
- [ ] Unduh ringkasan + luas sebagai PDF.
- [ ] Akses hasil hanya untuk pemilik akun.

---

## 10. Kontrak API (REST)

Base path: `/api/v1`

| Method | Endpoint | Body / Params | Response |
|---|---|---|---|
| POST | `/auth/register` | email, password, nama, role | user object |
| POST | `/auth/login` | email, password | `{ access_token, token_type }` |
| GET | `/patients` | — | daftar pasien milik user |
| POST | `/patients` | nama, no_rekam_medis | patient object |
| GET | `/patients/{id}` | — | detail + riwayat foto |
| PUT | `/patients/{id}` | nama, no_rekam_medis | patient object |
| DELETE | `/patients/{id}` | — | status |
| POST | `/upload` | multipart: file, patient_id | `{ image_id, image_url }` |
| POST | `/analyze` | image_id, fcm params, pixel_per_cm2 | `{ mask_url, overlay_url, area_pixel, area_cm2, metrik? }` |
| POST | `/evaluate` | image_id, ground_truth (file) | `{ dsc, iou, pixel_accuracy }` |
| GET | `/patients/{id}/progress` | — | deret waktu luas luka |
| GET | `/wound-images/{id}/export` | format=png\|pdf | file |

> Semua endpoint (kecuali auth) wajib header `Authorization: Bearer <JWT>`.

**Contoh request `/analyze`:**
```json
{
  "image_id": 123,
  "fcm": { "clusters": 2, "fuzziness": 2.0, "max_iter": 100, "epsilon": 1e-5 },
  "color_space": "hsv",
  "filter": "median",
  "pixel_per_cm2": 1444.0
}
```

**Contoh response `/analyze`:**
```json
{
  "image_id": 123,
  "mask_url": "/files/mask_123.png",
  "overlay_url": "/files/overlay_123.png",
  "area_pixel": 17700,
  "area_cm2": 12.26,
  "centroids": [192.57, 78.15],
  "metrik": { "dsc": null, "iou": null, "pixel_accuracy": null }
}
```

---

## 11. Skema Database (ERD + SQL)

```mermaid
erDiagram
    USERS ||--o{ PATIENTS : mengelola
    PATIENTS ||--o{ WOUND_IMAGES : memiliki

    USERS {
        int id PK
        string email UK
        string password_hash
        string nama
        string role
        timestamp created_at
    }
    PATIENTS {
        int id PK
        string nama
        string no_rekam_medis UK
        int user_id FK
        timestamp created_at
    }
    WOUND_IMAGES {
        int id PK
        int patient_id FK
        text image_path
        text result_overlay_path
        text mask_path
        float area_pixel
        float area_real
        float pixel_per_cm2
        int fcm_clusters
        float fcm_fuzziness
        int fcm_max_iter
        float fcm_epsilon
        float dsc
        float iou
        float pixel_accuracy
        text catatan
        timestamp captured_at
    }
```

```sql
-- Tabel USERS
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,        -- bcrypt
    nama          VARCHAR(255),
    role          VARCHAR(50),                  -- 'dokter' | 'perawat'
    created_at    TIMESTAMP DEFAULT NOW()
);

-- Tabel PATIENTS
CREATE TABLE patients (
    id              SERIAL PRIMARY KEY,
    nama            VARCHAR(255),
    no_rekam_medis  VARCHAR(100) UNIQUE,
    user_id         INTEGER REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT NOW()
);

-- Tabel WOUND_IMAGES
CREATE TABLE wound_images (
    id                   SERIAL PRIMARY KEY,
    patient_id           INTEGER REFERENCES patients(id),
    image_path           TEXT,
    result_overlay_path  TEXT,
    mask_path            TEXT,
    area_pixel           FLOAT,
    area_real            FLOAT,        -- cm2 (NULL bila belum dikalibrasi)
    pixel_per_cm2        FLOAT,
    fcm_clusters         INTEGER,
    fcm_fuzziness        FLOAT,
    fcm_max_iter         INTEGER,
    fcm_epsilon          FLOAT,
    dsc                  FLOAT,
    iou                  FLOAT,
    pixel_accuracy       FLOAT,
    catatan              TEXT,
    captured_at          TIMESTAMP DEFAULT NOW()
);
```

---

## 12. Tech Stack

| Komponen | Teknologi |
|---|---|
| Frontend | React 18+ (Vite), TypeScript, Tailwind CSS, shadcn/ui, React Router |
| Canvas Interaktif | Konva.js (crop ROI, kalibrasi, overlay) |
| Grafik | react-chartjs-2 (Chart.js) |
| Backend | Python 3.11+, FastAPI, Pydantic, SQLAlchemy, Alembic |
| Algoritma Segmentasi | Fuzzy C-Means — scikit-fuzzy / custom NumPy + OpenCV |
| Preprocessing | OpenCV, Pillow |
| Database | PostgreSQL 16 (Docker) |
| Autentikasi | FastAPI Security + OAuth2 JWT (Bearer) |
| Penyimpanan File | Filesystem lokal (upgrade ke MinIO/S3) |
| Infrastruktur | Docker Compose, Nginx (opsional reverse proxy) |
| Spesifikasi Uji | AMD Ryzen 5 5600H / RAM 16 GB |

---

## 13. Spesifikasi Data Input

- **Format:** JPG / PNG.
- **Kondisi foto:** jarak & pencahayaan konsisten antar sesi.
- **Objek referensi:** wajib ada (benda fisik 1×1 cm untuk kalibrasi).
- **Ground truth:** mask manual ahli (opsional, untuk evaluasi).
- **Dataset:** citra luka RSUD Kolonel Abundjani Bangko.

---

## 14. Rencana Pengujian

### 14.1 Black Box (UI)

| Skenario | Expected Output |
|---|---|
| Login kredensial valid | Masuk dashboard |
| Upload JPG/PNG valid | Citra tampil di panel asli |
| Proses tanpa upload | Pesan error |
| Tandai kalibrasi 1×1 cm | `pixel_per_cm2` terhitung |
| Jalankan analisis FCM | Mask + overlay tampil |
| Lihat grafik progres | Grafik luas antar waktu tampil |
| Ekspor PDF | File PDF terunduh |

### 14.2 Validasi Algoritma FCM
- Bandingkan centroid program vs perhitungan manual BAB 4 (`V1 ≈ 192.57`, `V2 ≈ 78.15`).

### 14.3 Evaluasi Performa

| Metrik | Formula | Target |
|---|---|---|
| DSC | `2TP / (2TP + FP + FN)` | ≥ 80% |
| IoU | `TP / (TP + FP + FN)` | ≥ 80% |
| Pixel Accuracy | `(TP+TN) / Total` | ≥ 80% |
| Selisih luas | `|luas_sistem - luas_manual|` | Minimal |

### 14.4 Performance
- Waktu analisis 1 citra < beberapa detik (Ryzen 5 5600H / 16 GB).

---

## 15. Kebutuhan Non-Fungsional

- **Keamanan:** bcrypt untuk password; data hanya untuk pemilik akun; HTTPS.
- **Konsistensi:** hasil deterministik untuk citra & parameter yang sama (gunakan random seed tetap untuk inisialisasi FCM).
- **Usability:** antarmuka intuitif, tanpa pelatihan teknis.
- **Portability:** jalan via Docker Compose tanpa konfigurasi manual.

---

## 16. Milestone & Roadmap

```mermaid
flowchart LR
    A["Alpha: Prototipe Inti"] --> B["Beta: Penyempurnaan & Evaluasi"] --> C["GA: Finalisasi & Dokumentasi"]
```

### Alpha — Prototipe Inti
- [ ] Setup Docker Compose (backend, PostgreSQL, frontend dev).
- [ ] Auth: registrasi, login, JWT.
- [ ] CRUD pasien.
- [ ] Upload + preview foto.
- [ ] Preprocessing pipeline (crop, resize, filter, convert).
- [ ] Kalibrasi 1×1 cm + estimasi cm².
- [ ] FCM di backend Python.
- [ ] Multi-panel UI.

### Beta — Penyempurnaan & Evaluasi
- [ ] Riwayat pasien + grafik progres.
- [ ] Modul evaluasi (DSC/IoU/PA).
- [ ] Optimasi parameter FCM (dataset RSUD).
- [ ] Black box testing UC-01..06.
- [ ] Ekspor PDF/PNG.
- [ ] Perbaikan UI/UX.

### GA — Finalisasi & Dokumentasi
- [ ] Pengujian dataset penuh.
- [ ] Validasi centroid vs BAB 4.
- [ ] Laporan performa akhir (untuk BAB 5).
- [ ] Dokumentasi API (Swagger).
- [ ] Panduan instalasi & deployment (README).

---

## 17. Struktur Proyek

```
project/
├── docker-compose.yml
├── frontend/                        # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── MultiPanelViewer/    # Tampilan multi-panel
│   │   │   ├── CanvasEditor/        # Crop ROI + kalibrasi (Konva.js)
│   │   │   ├── FCMControls/         # Panel parameter FCM
│   │   │   └── WoundChart/          # Grafik progres luka
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── PatientDetail.tsx
│   │   │   └── Analysis.tsx
│   │   └── api/                     # Axios / fetch wrappers
│   └── Dockerfile
│
├── backend/                         # Python FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── patients.py
│   │   │   └── analyze.py
│   │   ├── services/
│   │   │   ├── fcm_service.py       # Implementasi Fuzzy C-Means
│   │   │   ├── preprocessing.py     # OpenCV preprocessing
│   │   │   └── evaluation.py        # DSC, IoU, Pixel Accuracy
│   │   └── models/                  # SQLAlchemy models
│   ├── requirements.txt
│   └── Dockerfile
│
└── database/
    └── init.sql                     # Inisialisasi schema PostgreSQL
```

---

## 18. Acceptance Criteria (Definition of Done)

Sebuah modul dianggap **selesai** bila:

1. Semua checklist fungsional modul tercentang dan teruji.
2. Endpoint API sesuai kontrak di Bagian 10 (status code & schema benar).
3. Hasil FCM tervalidasi terhadap acuan BAB 4 (centroid mendekati `192.57` & `78.15`).
4. Untuk citra ber–ground-truth, DSC/IoU/Pixel Accuracy terukur dan dilaporkan.
5. Hasil deterministik (citra + parameter sama → output sama).
6. Seluruh layanan berjalan via `docker compose up` tanpa konfigurasi manual.
7. UI multi-panel menampilkan keempat panel + nilai luas cm² dengan benar.

---

### Urutan Pengerjaan yang Disarankan (untuk Coding Agent)

```mermaid
flowchart TD
    S1["1. Scaffold + Docker Compose + DB schema"] --> S2["2. Auth (register/login/JWT)"]
    S2 --> S3["3. CRUD Pasien"]
    S3 --> S4["4. Upload + preview citra"]
    S4 --> S5["5. Preprocessing (crop/resize/filter/convert)"]
    S5 --> S6["6. Kalibrasi + estimasi luas cm2"]
    S6 --> S7["7. FCM engine + validasi BAB 4"]
    S7 --> S8["8. Multi-panel UI + render hasil"]
    S8 --> S9["9. Evaluasi DSC/IoU/PA"]
    S9 --> S10["10. Grafik progres + Ekspor PNG/PDF"]
    S10 --> S11["11. Testing + dokumentasi"]
```
