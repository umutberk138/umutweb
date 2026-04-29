# Umut İnce — Portfolio & Apex Hub OS

> Yönetim Bilişim Sistemleri öğrencisi, Full-Stack Geliştirici ve Amazon E-Ticaret Stratejisti.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=flat&logo=firebase)](https://firebase.google.com)

---

## ✨ Özellikler

| Modül | Açıklama |
|---|---|
| **Portfolio** | Hakkımda, deneyim, yetenekler, projeler, SSS ve iletişim bölümleri |
| **Bento Grid** | Dinamik, kartlara dayalı ana sayfa |
| **Darknet Gate** | Kullanıcı kayıt ve giriş sistemi — Firebase Firestore destekli |
| **Admin Paneli** | Kayıtlı düğümleri listele, detaylarına göz at, sil |
| **Terminal** | İnteraktif komut satırı arayüzü ile snake oyunu, chat ve araçlar |
| **Dark/Light Mod** | Tema tercihi localStorage'de kalıcı olarak saklanır |
| **TR/EN Dil Desteği** | Tam çeviri tablosu ile anlık dil değiştirme |
| **Command Palette** | `Ctrl+K` ile hızlı navigasyon |
| **Bildirim Merkezi** | Gerçek zamanlı sistem bildirimleri |

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Adımlar

```bash
# 1. Repoyu klonla
git clone https://github.com/umutberk138/umut-ince.git
cd umut-ince

# 2. Bağımlılıkları yükle
npm install

# 3. Ortam değişkenlerini ayarla
cp .env.example .env
# .env dosyasını düzenle ve Firebase / Gemini API anahtarlarını gir

# 4. Geliştirme sunucusunu başlat
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

---

## 🔧 Ortam Değişkenleri

`.env.example` dosyasını kopyala ve aşağıdaki değerleri doldur:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
GEMINI_API_KEY=...
```

---

## 📁 Proje Yapısı

```
.
├── src/
│   ├── components/          # UI bileşenleri
│   │   ├── AdminPanel.tsx   # Admin yönetim paneli
│   │   ├── AmbientSystem.tsx
│   │   ├── BentoGrid.tsx    # Ana dashboard grid
│   │   ├── CommandPalette.tsx
│   │   ├── DarknetGate.tsx  # Kullanıcı auth + kayıt
│   │   ├── DarknetDashboard.tsx
│   │   ├── MatrixBackground.tsx
│   │   ├── NotificationCenter.tsx
│   │   ├── PortfolioView.tsx # CV / portfolyo sayfası
│   │   ├── Profile.tsx
│   │   ├── Terminal.tsx     # İnteraktif terminal
│   │   └── ...
│   ├── lib/
│   │   ├── firebase.ts      # Firebase yapılandırması
│   │   └── i18n.tsx         # TR/EN çeviri sistemi
│   ├── App.tsx              # Kök bileşen + navigasyon
│   ├── App.css              # Tasarım sistemi (animasyonlar, scrollbar)
│   ├── index.css            # Tailwind v4 + tema değişkenleri
│   ├── main.tsx             # React giriş noktası
│   └── types.ts             # TypeScript tipleri
├── public/
├── firebase-blueprint.json  # Firestore kuralları şeması
├── firestore.rules          # Güvenlik kuralları
├── vite.config.ts
└── package.json
```

---

## 🛠️ Teknoloji Yığını

- **Framework:** React 19 + TypeScript 5.8
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS v4 + Vanilla CSS design tokens
- **Animations:** Motion (Framer Motion v12)
- **Database:** Firebase Firestore
- **Auth:** Firebase Auth (Google + özel sistem)
- **Icons:** Lucide React
- **Fonts:** Outfit (sans-serif) + Fira Code (monospace)

---

## 📜 Komutlar

```bash
npm run dev      # Geliştirme sunucusu (localhost:3000)
npm run build    # Üretim build'i
npm run preview  # Build önizleme
npm run lint     # TypeScript tip kontrolü
```

---

## 🔒 Güvenlik

- Firestore güvenlik kuralları `firestore.rules` dosyasında tanımlanmıştır
- `.env` dosyaları `.gitignore` kapsamındadır — asla commit edilmez
- Admin paneli şifre korumalıdır

---

## 📬 İletişim

- **E-posta:** umut@umutince.online
- **GitHub:** [@umutberk138](https://github.com/umutberk138)
- **Instagram:** [@umutberknc](https://instagram.com/umutberknc)
- **WhatsApp:** [+90 540 089 32 52](https://wa.me/905400893252)

---

<p align="center">
  © 2026 Umut İnce — Node_ID: 24903032 — Kapadokya Üniversitesi BIS
</p>
