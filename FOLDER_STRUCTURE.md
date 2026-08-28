# Struktur Folder Proyek

Panduan lengkap struktur folder dan file yang diharapkan untuk deployment di Vercel.

## 📁 Struktur Direktori Lengkap

```
hr-assessment/
├── app/                           # Next.js 14 App Router
│   ├── api/                       # API Routes (backend)
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts
│   │   ├── register/route.ts
│   │   ├── jobs/route.ts
│   │   ├── applications/route.ts
│   │   └── tests/route.ts
│   ├── (auth)/                    # Route group untuk login/register
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (candidate)/               # Route group untuk kandidat
│   │   ├── jobs/page.tsx
│   │   ├── jobs/[id]/apply/page.tsx
│   │   ├── tests/[sessionId]/page.tsx
│   │   └── status/[appId]/page.tsx
│   ├── (hrd)/                     # Route group untuk HRD
│   │   ├── dashboard/page.tsx
│   │   ├── jobs/create/page.tsx
│   │   └── jobs/[id]/edit/page.tsx
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Landing page
│
├── lib/                           # Utility & logic
│   ├── auth.ts                    # NextAuth config
│   ├── prisma.ts                  # Prisma client
│   ├── matching.ts                # Matching engine
│   ├── scoring/
│   │   ├── disc.ts               # DISC scoring
│   │   ├── mbti.ts               # MBTI scoring
│   │   └── iq.ts                 # IQ scoring
│   └── pdf/
│       └── candidate-report.tsx   # PDF template
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Data seed
│
├── public/                        # Static assets (jika ada)
│   └── (favicon, images, dll)
│
├── .env.example                  # Environment variables template
├── .env                          # Local only (jangan push!)
├── .env.local                    # Local only (jangan push!)
├── .gitignore                    # Already configured
├── next.config.js                # Next.js config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies & scripts
├── package-lock.json             # Lock file
├── vercel.json                   # Vercel deployment config
├── DEPLOYMENT_VERCEL.md          # Deployment guide
├── README.md                     # Project documentation
└── FOLDER_STRUCTURE.md           # This file
```

---

## 🔧 File Kunci yang WAJIB Ada

### Root Level
- ✅ `package.json` - Sudah ada
- ✅ `package-lock.json` - Sudah ada
- ✅ `tsconfig.json` - Sudah ada
- ✅ `next.config.js` - Sudah ada
- ✅ `.gitignore` - Sudah ada
- ✅ `.env.example` - Sudah ditambahkan
- ✅ `vercel.json` - Sudah ditambahkan
- ✅ `DEPLOYMENT_VERCEL.md` - Sudah ditambahkan

### Prisma
- ✅ `prisma/schema.prisma` - Sudah ada
- ✅ `prisma/seed.ts` - Sudah ada

### Lib (Business Logic)
- ✅ `lib/auth.ts` - Sudah ada
- ✅ `lib/prisma.ts` - Sudah ada
- ✅ `lib/matching.ts` - Sudah ada
- ✅ `lib/scoring/disc.ts` - Sudah ada
- ✅ `lib/scoring/mbti.ts` - Sudah ada
- ✅ `lib/scoring/iq.ts` - Sudah ada
- ✅ `lib/pdf/candidate-report.tsx` - Sudah ada

### App (Frontend)
- ⚠️ `app/layout.tsx` - Sudah ada (basic)
- ⚠️ `app/page.tsx` - Mungkin perlu di-update
- ⚠️ `app/(auth)/register/page.tsx` - Sudah ada
- ⚠️ API Routes - Harus dibuat

### Styling
- ✅ `app/globals.css` - Sudah ada

---

## ⚠️ File yang MASIH HARUS DIBUAT

### API Routes (Backend Endpoints)

#### `app/api/auth/[...nextauth]/route.ts`
```typescript
import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

#### `app/api/register/route.ts`
```typescript
// POST endpoint untuk register kandidat baru
// Validasi email & password, hash password, simpan ke DB
```

#### `app/api/jobs/route.ts`
```typescript
// GET: list semua job (untuk kandidat)
// POST: create job baru (hanya HRD)
```

#### `app/api/applications/route.ts`
```typescript
// POST: kandidat apply ke job
// GET: list applications (filter by candidateId atau jobId)
```

#### `app/api/tests/route.ts`
```typescript
// POST: start test session
// PUT: submit jawaban test
// GET: check test results
```

### Pages (Frontend)

#### `app/page.tsx` (Landing)
```typescript
// Homepage - bisa redirect ke login atau show info
```

#### `app/(auth)/login/page.tsx`
```typescript
// Login page untuk HRD & Kandidat
```

#### `app/(candidate)/jobs/page.tsx`
```typescript
// Daftar lowongan yang available
```

#### `app/(candidate)/jobs/[id]/apply/page.tsx`
```typescript
// Detail job dan tombol apply
```

#### `app/(candidate)/tests/[sessionId]/page.tsx`
```typescript
// Form test - render soal & option berdasarkan testTypeId
```

#### `app/(candidate)/status/[appId]/page.tsx`
```typescript
// Status lamaran & hasil tes kandidat
// Ada tombol download PDF report
```

#### `app/(hrd)/dashboard/page.tsx`
```typescript
// Dashboard HRD - list aplikasi, skor kecocokan, actions
```

#### `app/(hrd)/jobs/create/page.tsx`
```typescript
// Create job baru + set profil ideal per test type
```

---

## 📦 Dependencies Check

### Wajib Ada (di package.json)
- ✅ `next@14.2.5`
- ✅ `react@18.3.1`
- ✅ `react-dom@18.3.1`
- ✅ `@prisma/client@5.18.0`
- ✅ `prisma@5.18.0` (devDependency)
- ✅ `next-auth@4.24.7`
- ✅ `@next-auth/prisma-adapter@1.0.7`
- ✅ `bcryptjs@2.4.3`
- ✅ `zod@3.23.8`
- ✅ `@react-pdf/renderer@3.4.4`
- ✅ `typescript@5.5.4` (devDependency)
- ✅ `@types/react@18.3.3` (devDependency)
- ✅ `@types/node@20.14.15` (devDependency)
- ✅ `tsx@4.16.5` (devDependency)

### Postinstall Script (Penting untuk Vercel!)
```json
{
  "postinstall": "prisma generate"
}
```
✅ Sudah ada di package.json

---

## 🔍 Cek Sebelum Deploy ke Vercel

### Checklist
- [ ] Semua file di root level sudah ada (`.env.example`, `vercel.json`, dll)
- [ ] `prisma/schema.prisma` lengkap & valid
- [ ] `lib/` folder berisi semua scoring engines & auth
- [ ] `.gitignore` includes `.env`, `.env.local`, `node_modules`
- [ ] `package.json` includes `"postinstall": "prisma generate"`
- [ ] Database connection string sudah siap (Neon/Supabase)
- [ ] `NEXTAUTH_SECRET` sudah di-generate: `openssl rand -base64 32`

### Test di Local Dulu
```bash
npm install
npm run db:push          # Push schema ke local/dev DB
npm run db:seed          # (Optional) Isi data contoh
npm run dev              # Jalankan di localhost:3000
```

Jika semua berjalan lancar di lokal → siap deploy ke Vercel!

---

## 🚀 Saat Deploy ke Vercel

1. **Push ke GitHub** (pastikan `.env` tidak ikut)
2. **Di Vercel dashboard**, set Environment Variables:
   - `DATABASE_URL` → connection string pooled dari Neon/Supabase
   - `NEXTAUTH_SECRET` → hasil generate openssl
   - `NEXTAUTH_URL` → domain Vercel atau custom domain
3. **Deploy** → tunggu hingga selesai
4. **Push schema ke production DB**:
   ```bash
   export DATABASE_URL="..."
   npx prisma db push
   npm run db:seed  # (Optional)
   ```
5. **Test di URL Vercel** → register, login, apply test, dll

---

## 📝 Notes

- Semua API routes harus di folder `app/api/` (bukan di root)
- Semua pages harus di folder `app/` dengan naming yang jelas
- Route groups `(auth)`, `(candidate)`, `(hrd)` opsional tapi membantu organisasi
- `.env` file JANGAN pernah push ke GitHub → sudah di `.gitignore`
- `package-lock.json` HARUS di-commit untuk reproducible builds

---

**Referensi**: [Next.js App Router Docs](https://nextjs.org/docs/app)
