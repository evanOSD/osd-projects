## Rencana Perbaikan Arsitektur & Perencanaan Proyek (Issue #6 Lanjutan)

Berdasarkan analisis kebutuhan lapangan dan struktur aplikasi saat ini, sebuah **Rencana Proyek Penerjemahan** secara esensi bersifat jangka panjang (*Multi-year*). Oleh karena itu, kita perlu melakukan *refactoring* besar untuk menggeser batasan Tahun Fiskal dari tingkat teratas proyek turun ke tingkat kegiatan (*Activity* & *Stages*), sekaligus memberikan dukungan multi-bahasa yang lebih kokoh.

Berikut adalah temuan dan daftar tugas (*To-Do List*) yang harus dieksekusi:

### 1. Migrasi Skema Database (Menuju Multi-year Plan)
- [ ] **Hapus Kolom `fiscal_year` dari `project_plans`**: Jalankan *script* SQL untuk mendrop kolom `fiscal_year` dari tabel `project_plans`.
- [ ] **Bersihkan Duplikasi Rencana Proyek**: Pastikan hanya ada 1 (satu) entri `project_plan` untuk setiap `project_id`.
- [ ] **Tambahkan Constraint UNIQUE**: Jalankan `ALTER TABLE project_plans ADD CONSTRAINT project_plans_project_id_key UNIQUE (project_id);` agar tabel ini menjadi ekstensi 1-to-1 mutlak dengan tabel `projects`.
- [ ] **Ubah Relasi `project_planning_stages`**: Ubah Foreign Key dari `project_plan_id` menjadi `translation_goal_id` (merujuk ke tabel `project_translation_goals`). Ini memastikan tahapan terikat pada *kitab/terjemahan*, bukan rencana umum tahunan.

### 2. Refactoring Rencana Tahapan (Planning Stages)
- [ ] **Tab Khusus Tahapan (Stages)**: Buat Tab khusus untuk *Planning Stages* yang terpisah. Di sini, *user* harus memilih *Translation Goal* (kitab) mana yang ingin dikelola tahapannya terlebih dahulu.
- [ ] **Input Manual Tahapan**: Hapus mekanisme *generate* otomatis yang kaku. Ganti dengan fungsionalitas UI (dropdown/modal) agar *user* bisa menambahkan tahapan secara manual berdasarkan tabel master `steps`.
- [ ] **Penjadwalan Spesifik (Granular Scheduling)**: Integrasikan komponen `@/components/DatePicker` atau `@/components/MonthPicker` ke dalam setiap baris Tahapan (*Stage*) dan Kegiatan (*Activity*). Ini memungkinkan *user* menentukan bulan/tahun kapan persisnya tahap *Exegesis*, *Team Check*, dll., dieksekusi secara terukur.

### 3. Pembaruan Antarmuka Pengguna (UI) Tab Rencana
- [ ] **Hapus *Selector* Tahun Fiskal di Level Root**: Singkirkan *Card* "Tahun Fiskal Rencana Proyek" (Dropdown FY) dari komponen kerangka utama `plan/page.tsx` karena perannya sudah dipindahkan ke level *Activity/Stage*.
- [ ] **Tambahkan Global *Language Selector***: Letakkan komponen *Dropdown* pemilih bahasa di sisi kanan atas (satu baris dengan *navigation tabs*: Team Information, Rencana Kerja, dll.).
- [ ] **Sinkronisasi Data dengan Pemilih Bahasa**: Pastikan *query* API `getProjectContextByShortId` mengambil **SEMUA** bahasa proyek tersebut (bukan lagi `.maybeSingle()`). Selanjutnya, pastikan data yang tampil di tab **Rencana Kitab** (*TabTranslation*) dan tab **Tahapan** otomatis di-*filter* berdasarkan ID bahasa yang sedang aktif di *Global Language Selector*.

---
**Referensi Komponen Tambahan:**
- `src/app/(dashboard)/dummy/DatePicker.tsx`
- `src/app/(dashboard)/dummy/MonthPicker.tsx`
