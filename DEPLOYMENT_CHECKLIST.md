# ✅ Pre-Deployment Checklist untuk Vercel

Panduan lengkap memastikan semua sudah siap sebelum deploy.

## 📋 Fase 1: Setup Lokal

### Database Setup
- [ ] Buat akun Neon (neon.tech) atau Supabase (supabase.com)
- [ ] Create project database baru
- [ ] Copy **Pooled Connection String** (gunakan port 6543, bukan 5432)
- [ ] Test koneksi lokal dengan `psql` atau DBeaver

### Local Environment
```bash
# 1. Clone repo (jika belum)
git clone https://github.com/Talentfitai/Talent-AI.git
cd Talent-AI

# 2. Install dependencies
npm install

# 3. Buat .env (copy dari .env.example)
cp .env.example .env

# 4. Edit .env dengan nilai production DATABASE_URL
# DATABASE_URL="postgresql://user:password@host:6543/dbname?schema=public"
```

- [ ] `.env` file sudah dibuat dengan `DATABASE_URL` yang benar
- [ ] `NEXTAUTH_URL=http://localhost:3000` untuk testing lokal
- [ ] Generate `NEXTAUTH_SECRET`: `openssl rand -base64 32` dan isi di `.env`

### Database Migration Lokal
```bash
# Push schema ke database
npx prisma db push

# Isi data seed (optional tapi recommended untuk testing)
npm run db:seed

# Verifikasi: buka Prisma Studio
npx prisma studio
```

- [ ] Schema sudah di-push ke database
- [ ] Data seed berhasil (bisa lihat di Prisma Studio)
- [ ] `hrd@contoh.com` / `password123` bisa login (test)

### Local Testing
```bash
npm run dev
# Buka http://localhost:3000
```

- [ ] Landing page load tanpa error
- [ ] Bisa register kandidat baru
- [ ] Bisa login dengan HRD account
- [ ] Bisa lihat daftar jobs
- [ ] Bisa apply ke job
- [ ] Bisa start test dan submit jawaban
- [ ] Dashboard HRD bisa diakses
- [ ] PDF report bisa di-download

---

## 📋 Fase 2: GitHub Setup

### Repository Check
```bash
# Pastikan repo sudah clean
git status
```

- [ ] `.env` TIDAK di-track (sudah di `.gitignore`)
- [ ] `node_modules/` TIDAK di-track
- [ ] `*.log` files TIDAK di-track
- [ ] `.next/` folder TIDAK di-track

### Push ke GitHub
```bash
# Add all changes
git add .

# Commit dengan message yang jelas
git commit -m "Ready for Vercel deployment: add vercel.json, .env.example, deployment guides"

# Push ke main branch
git push origin main
```

- [ ] Semua file sudah di-push ke GitHub (except `.env` dan folder yg di `.gitignore`)
- [ ] GitHub repo menunjukkan latest commit
- [ ] Tidak ada uncommitted changes

---

## 📋 Fase 3: Vercel Setup

### Vercel Account & Project Import
1. Buka https://vercel.com
2. Sign in dengan GitHub account
3. Click **"New Project"**
4. Pilih **"Import Git Repository"**
5. Search dan select `Talentfitai/Talent-AI`

- [ ] Project sudah di-import ke Vercel
- [ ] Framework otomatis detect sebagai "Next.js"

### Environment Variables di Vercel
Di halaman konfigurasi sebelum deploy, tambahkan:

| Key | Value | Catatan |
|-----|-------|---------|
| `DATABASE_URL` | `postgresql://...@host:6543/...?schema=public` | Dari Neon/Supabase pooled connection |
| `NEXTAUTH_SECRET` | `xY7kL9mN2pQ5tR...` | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://nama-project.vercel.app` | Atau custom domain jika ada |

```
Contoh DATABASE_URL (Neon):
postgresql://neon_user:abc123xyz@ep-cool-cloud-12345.neon.tech:6543/hr_db?schema=public

Contoh NEXTAUTH_URL:
https://hr-assessment-talent.vercel.app
```

- [ ] `DATABASE_URL` sudah diisi dengan pooled connection string
- [ ] `NEXTAUTH_SECRET` sudah di-generate dan diisi
- [ ] `NEXTAUTH_URL` sudah diisi dengan Vercel domain

### Deploy
1. Review konfigurasi
2. Click **"Deploy"**
3. Tunggu build selesai (~2-5 menit)
4. Jika sukses, akan muncul **"Visit"** button

- [ ] Build process selesai tanpa error
- [ ] Dapat URL domain Vercel (misal: `https://hr-assessment-talent.vercel.app`)
- [ ] Deployment status menunjukkan "Production" atau "Ready"

---

## 📋 Fase 4: Production Database Setup

Setelah deployment Vercel berhasil, push schema ke production database:

```bash
# Di komputer lokal, update .env untuk production
export DATABASE_URL="postgresql://...@host:6543/...?schema=public"

# Push schema ke production
npx prisma db push

# (Optional) Seed data ke production
npm run db:seed
```

- [ ] Schema sudah di-push ke production database
- [ ] Data seed sudah diisi (optional)
- [ ] Bisa connect ke production DB dengan Prisma Studio

---

## 📋 Fase 5: Testing di Production

Akses URL Vercel dan test:

```
URL: https://nama-project.vercel.app
```

### Candidate Flow
- [ ] Buka `/register` → daftar akun baru
- [ ] Buka `/login` → login dengan akun baru
- [ ] Buka `/jobs` → lihat daftar lowongan
- [ ] Apply ke lowongan → start test
- [ ] Complete semua 3 tes (DISC, MBTI, IQ)
- [ ] Lihat hasil + skor kecocokan di status lamaran
- [ ] Download PDF report → file terbuka dengan benar

### HRD Flow
- [ ] Login dengan `hrd@contoh.com` / `password123`
- [ ] Akses `/dashboard` (atau redirect otomatis)
- [ ] Lihat daftar aplikasi + skor kecocokan kandidat
- [ ] Klik nama kandidat → lihat detail hasil tes
- [ ] Download PDF report dari dashboard
- [ ] Create lowongan baru
- [ ] Set profil ideal per test type
- [ ] Test aplikasi baru yang apply ke lowongan baru

### Performance Check
- [ ] Halaman load dengan cepat (< 3 detik)
- [ ] Form submission lancar
- [ ] PDF generation tidak timeout
- [ ] Login/logout berfungsi dengan benar

---

## 📋 Fase 6: Monitoring & Maintenance

### Vercel Dashboard
- [ ] Buka Deployments untuk lihat build history
- [ ] Check Logs jika ada error
- [ ] Enable "GitHub Integration" untuk auto-deploy

### Database Monitoring (Neon/Supabase)
- [ ] Monitoring query performance
- [ ] Check storage usage
- [ ] Setup automated backups

### Error Tracking (Optional)
- [ ] Install Sentry (optional) untuk error monitoring
- [ ] Setup email alerts jika ada error

- [ ] Vercel Deployments sudah di-monitor
- [ ] Database sudah di-monitor
- [ ] Have a plan untuk maintenance rutin

---

## 🚨 Troubleshooting Umum

### Build Error: "PrismaClientInitializationError"
**Solusi**: 
- Cek `DATABASE_URL` di Vercel environment variables
- Pastikan pooled connection string (port 6543)
- Klik Redeploy

### Database Connection Timeout
**Solusi**:
- Jangan gunakan port 5432, harus 6543 (pooled)
- Cek IP whitelist di Neon/Supabase (allow all IPs untuk Vercel)

### NextAuth "Secret is not set"
**Solusi**:
- Pastikan `NEXTAUTH_SECRET` sudah di-set di Vercel
- Jangan lupa commit `.env.example` (jangan `.env`!)

### PDF Download Fails
**Solusi**:
- Pastikan `@react-pdf/renderer` terinstall (`npm install` di Vercel)
- Check server logs di Vercel

---

## ✨ Post-Deployment (Optional Improvements)

### Custom Domain
1. Di Vercel project → Settings → Domains
2. Add custom domain
3. Update DNS pointing ke Vercel
4. Update `NEXTAUTH_URL` ke custom domain

### Performance Optimization
- [ ] Enable caching di Vercel (CDN)
- [ ] Optimize images jika ada
- [ ] Monitor Core Web Vitals

### Security
- [ ] Enable HTTPS (otomatis oleh Vercel)
- [ ] Set rate limiting di API routes
- [ ] Enable email verification (future enhancement)

---

## ✅ Deployment Sukses!

Jika semua checklist sudah ✅, aplikasi siap digunakan di production! 🎉

**Selamat berjaya dengan HR Assessment Platform!** 🚀

---

**Pertanyaan?** Lihat `DEPLOYMENT_VERCEL.md` untuk panduan detail.
