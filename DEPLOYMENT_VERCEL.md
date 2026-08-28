# Deployment ke Vercel - Panduan Lengkap

## Prasyarat
1. Akun GitHub dengan repo `Talentfitai/Talent-AI`
2. Akun Vercel (login dengan GitHub di https://vercel.com)
3. Database PostgreSQL yang accessible dari internet:
   - **Rekomendasi terbaik**: Neon (neon.tech) atau Supabase (supabase.com)
   - Keduanya punya free tier dan connection pooling untuk serverless

---

## Langkah 1: Siapkan Database

### Opsi A: Menggunakan Neon (Recommended)
1. Buka https://neon.tech → Sign Up
2. Buat project baru
3. Di dashboard, copy **Pooled Connection String** (port 6543)
   - Format: `postgresql://user:password@host.neon.tech:6543/dbname?schema=public`
4. Simpan URL ini untuk nanti

### Opsi B: Menggunakan Supabase
1. Buka https://supabase.com → Sign Up
2. Buat project baru
3. Di **Settings → Database → Connection String**, pilih mode **"Connection pooling"**
   - Port biasanya 6543 (bukan 5432)
   - Format: `postgresql://postgres:password@pooler.host:6543/postgres`
4. Simpan URL ini untuk nanti

---

## Langkah 2: Push Schema ke Database Production

Sebelum deploy ke Vercel, push schema Prisma ke database production:

```bash
# Di komputer lokal, set DATABASE_URL ke database production sementara
export DATABASE_URL="postgresql://user:password@host:6543/dbname?schema=public"

# Push schema
npx prisma db push

# (Optional) Isi data contoh
npm run db:seed
```

Setelah berhasil, kembali ke `.env` lokal (jangan push ke GitHub).

---

## Langkah 3: Deploy ke Vercel

### 3a. Login ke Vercel dan Import Project
1. Buka https://vercel.com → **New Project**
2. Pilih **Import Git Repository**
3. Cari & pilih `Talentfitai/Talent-AI`
4. Klik **Import**

### 3b. Konfigurasi Environment Variables
Di halaman konfigurasi Vercel sebelum deploy, isi **Environment Variables**:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Connection string pooled dari Neon/Supabase (copy dari langkah 1) |
| `NEXTAUTH_SECRET` | Generate dengan: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://nama-project.vercel.app` (atau custom domain jika punya) |

Contoh:
- `DATABASE_URL`: `postgresql://neon_user:abc123@ep-xyz.neon.tech:6543/hr_db?schema=public`
- `NEXTAUTH_SECRET`: `xY7kL9mN2pQ5tR8vW3xZ/BcDeFgHiJkLmNoPqRsT==`
- `NEXTAUTH_URL`: `https://hr-assessment.vercel.app`

### 3c. Deploy
1. Klik **Deploy**
2. Tunggu ~2-5 menit hingga selesai
3. Setelah sukses, klik **Visit** untuk membuka aplikasi

---

## Langkah 4: Verifikasi Deployment

1. Buka URL aplikasi Vercel
2. Coba register kandidat baru di `/register`
3. Coba login dengan email HRD: `hrd@contoh.com` / `password123`
4. Akses `/dashboard` untuk lihat HRD features

---

## Troubleshooting

### ❌ Error: "P1002 - Timed out fetching a new connection from the connection pool"
**Solusi**: Pastikan menggunakan **pooled connection string** (port 6543), bukan port 5432.

### ❌ Error: "PrismaClientInitializationError"
**Solusi**: 
- Cek environment variable `DATABASE_URL` sudah benar di dashboard Vercel
- Klik **Redeploy** untuk rebuild dengan variabel terbaru

### ❌ Error: "NextAuth Secret is not set"
**Solusi**: Pastikan `NEXTAUTH_SECRET` sudah diisi di environment variables Vercel

### ❌ Database masih kosong setelah deploy
**Solusi**: Jalankan seed di production:
```bash
# Di lokal, dengan DATABASE_URL pointing ke production
npm run db:seed
```

---

## Auto-Deploy

Setelah setup awal selesai:
- Setiap kali push ke branch `main` di GitHub → Vercel otomatis rebuild & deploy
- Logs bisa dilihat di dashboard Vercel → Deployments

---

## Tips Penting untuk Production

1. **Jangan hardcode credential di kode** - gunakan environment variables
2. **Set NEXTAUTH_URL dengan benar** - jika tidak, login mungkin error
3. **Backup database secara berkala** - Neon/Supabase punya built-in backup
4. **Monitor build logs** - jika ada error saat build, lihat Vercel logs
5. **Gunakan custom domain** - di Vercel Settings → Domains
6. **Enable HTTPS** - Vercel otomatis provide SSL certificate

---

## Custom Domain (Optional)

Jika punya domain sendiri (misal `hr-assessment.com`):

1. Di Vercel project → **Settings → Domains**
2. Tambah domain baru
3. Follow instruksi DNS pointing ke Vercel
4. Update `NEXTAUTH_URL` ke domain baru
5. **Redeploy** aplikasi

---

## Rollback ke Version Sebelumnya

Jika ada bug di production:
1. Di Vercel → **Deployments**
2. Pilih deployment yang stabil
3. Klik **Promote to Production**

---

**Selamat! Aplikasi sudah live di Vercel! 🚀**
