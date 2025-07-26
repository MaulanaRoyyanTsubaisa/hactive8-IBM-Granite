# Royyan IBM AI GRANITE, Live Preview : https://hactive8-ibm-granite.vercel.app/

Aplikasi web AI Assistant berbasis Next.js, menggunakan IBM watsonx Granite untuk Chatbot dan Code Generation.

---

## 📋 Deskripsi

Aplikasi ini dibuat untuk tugas Hactive8 oleh **Maulana Royyan Tsubaisa**. Fitur utamanya adalah chatbot AI dan generator kode otomatis, dengan UI modern dan responsif.

---

## 🚀 Fitur Utama

- **Chatbot**: Interaksi percakapan dengan AI Granite (IBM) melalui tab Chatbot.
- **Code Generator**: Menghasilkan kode program otomatis dari prompt pengguna.
- **Riwayat Chat & Code**: Semua riwayat tersimpan di localStorage browser.
- **UI Modern**: Menggunakan shadcn/ui, Radix UI, dan TailwindCSS.
- **Responsif**: Dapat diakses melalui perangkat apa pun.
- **model**: Menggunakan model IBM Granite 3.3 untuk Chatbot dan Code Generator.

---

## 🗂️ Struktur Folder

```
app/
  page.tsx           # Halaman utama (tab Chatbot & Code Generator)
  layout.tsx         # Layout global aplikasi
  api/
    chat/route.ts        # Endpoint chat ke IBM Granite
    generate/route.ts    # Simulasi response AI
    generate-code/route.ts # Generate kode via IBM Granite
components/
  chatbot-tab.tsx         # Komponen tab Chatbot
  code-generator-tab.tsx  # Komponen tab Code Generator
  ui/                     # Komponen UI (button, card, dsb)
hooks/                    # Custom React hooks
lib/                      # Utility functions
public/                   # Asset gambar/logo
styles/                   # File CSS global
```

---

## ⚙️ Cara Install & Menjalankan

1. **Clone repo**
2. **Install dependencies**
   ```bash
   npm install
   # atau
   pnpm install
   ```
3. **Jalankan development**
   ```bash
   npm run dev
   # atau
   pnpm dev
   ```
4. **Build production**
   ```bash
   npm run build
   npm start
   ```

---

## 🌐 API Endpoints

- `POST /api/chat` — Chat dengan AI Granite (IBM watsonx, via Replicate API)
- `POST /api/generate` — Simulasi response AI (untuk testing)
- `POST /api/generate-code` — Generate kode program via AI Granite

---

## 🛠️ Teknologi & Library

- **Next.js 14**
- **React 18**
- **TailwindCSS**
- **shadcn/ui** & **Radix UI**
- **IBM watsonx Granite** (via Replicate API)
- **TypeScript**

---

## 👤 Pembuat

Tugas Hactive8 — dibuat oleh **Maulana Royyan Tsubaisa**

---

## 📄 Lisensi

Project ini untuk keperluan pembelajaran/tugas. Silakan modifikasi sesuai kebutuhan.
