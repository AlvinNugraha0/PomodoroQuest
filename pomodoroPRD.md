
# PRD: Pomodoro Quest (Retro Pixel Art Edition)

## 1. Project Overview

Membangun aplikasi web **Pomodoro Timer** dengan estetika **Retro Pixel Art** bernama **"Pomodoro Quest"**. Aplikasi ini berfungsi sebagai alat produktivitas yang menggabungkan elemen *gamifikasi* untuk membantu pengguna fokus pada tugas mereka.

* **Tujuan:** Membantu pengguna mengelola waktu kerja dan istirahat.
* **Tech Stack:** HTML5, Tailwind CSS, Vanilla JavaScript (Frontend-only).
* **Target:** Pelajar atau developer yang menyukai gaya visual video game klasik.

---

## 2. Core Features (Functional Requirements)

### A. Timer System

* **Countdown Logic:** Timer harus bisa berhitung mundur dari waktu yang ditentukan.
* **Custom Duration:** Pengguna bisa mengatur durasi menit untuk sesi **Focus** (default: 25) dan **Rest** (default: 5).
* **Controls:** Memiliki tombol **Start Work**, **Rest**, dan **Reset System**.
* **Auto-Update:** Tampilan angka besar (`25:00`) harus terupdate secara *real-time* setiap detik.

### B. Quest Log (To-Do List)

* **CRUD Tasks:** Pengguna bisa menambah tugas baru melalui tombol "+ ADD NEW QUEST".
* **Task Completion:** Pengguna bisa mencentang tugas yang sudah selesai.
* **Progress Bar:** Setiap tugas memiliki progress bar visual yang menunjukkan status penyelesaian.

### C. Gamification & Persistence

* **Total Focus:** Sistem menghitung akumulasi waktu fokus yang berhasil diselesaikan dan menampilkannya di bagian bawah.
* **LocalStorage:** Semua data (daftar tugas, total menit fokus, dan pengaturan timer) harus tersimpan di browser. Jika halaman di-*refresh*, data tidak boleh hilang.

---

## 3. User Interface (UI) Specifications

Gunakan desain yang sudah ada dalam kode HTML dengan ketentuan berikut:

* **Tema Warna:** * Primary: Amber-600 (`#D97706`).
* Background Dark: Deep dark brown (`#1a120b`).
* Card: Purplish brown (`#432C3A`).


* **Tipografi:**
* Display: "Press Start 2P" (untuk judul/tombol).
* Mono: "VT323" (untuk angka/teks detail).


* **Efek Visual:** * Wajib menyertakan **CRT Overlay** (garis-garis halus monitor lama).
* Gunakan **Pixel Borders** (box-shadow bertumpuk) untuk memberikan kesan 8-bit.


* **Layout:** 3 Kolom (Desktop) -> Distractions (Kiri), Timer (Tengah), Quest Log (Kanan).

---

## 4. Technical Instructions for AI Agent

Saat memberikan instruksi ke AI Agent, pastikan hal-hal berikut diimplementasikan:

1. **State Management:** Buat objek JavaScript tunggal untuk mengelola status timer (running/paused), sisa detik, dan array tugas.
2. **Audio (Opsional):** Tambahkan bunyi "Level Up" atau "Ping" sederhana saat timer mencapai angka nol.
3. **Responsiveness:** Pastikan layout berubah menjadi 1 kolom saat dibuka di perangkat mobile.
4. **Dark Mode:** Pastikan fungsi *toggle* mode gelap yang sudah ada di HTML terhubung dengan baik ke semua elemen kartu.
