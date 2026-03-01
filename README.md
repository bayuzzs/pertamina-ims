# Pertamina IMS

Web aplikasi inventory management berbasis Next.js (App Router) dengan autentikasi NextAuth menggunakan endpoint backend, serta otorisasi berbasis role (`admin` dan `technician`).

## Teknologi Utama

- Next.js 16 (App Router)
- React 19
- NextAuth v4 (Credentials Provider, JWT session)
- HeroUI

## Prasyarat

- Node.js 20+
- pnpm
- Backend auth service aktif di `http://localhost:3001`

## Konfigurasi Environment

Buat/cek file `.env`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-pertamina-ims-nextauth-secret
```

Keterangan:

- `NEXT_PUBLIC_API_BASE_URL`: base URL backend.
- `NEXTAUTH_URL`: URL frontend aplikasi ini.
- `NEXTAUTH_SECRET`: secret untuk menandatangani JWT NextAuth.

## Instalasi dan Menjalankan Aplikasi

1. Install dependency:

   ```bash
   pnpm install
   ```

2. Jalankan development server:

   ```bash
   pnpm dev
   ```

3. Buka browser:

   ```
   http://localhost:3000
   ```

## Endpoint Backend yang Digunakan

### Login

- Method: `POST`
- URL: `/auth/login`
- Full URL (lokal): `http://localhost:3001/auth/login`

Body yang dikirim dari frontend:

```json
{
  "username": "superadmin",
  "password": "your-password",
  "role": "admin"
}
```

Contoh response sukses dari backend:

```json
{
  "accessToken": "<jwt-token>",
  "user": {
    "id": "5843cdf4-a94a-48d7-8477-c48c5dd4c6a6",
    "username": "superadmin",
    "name": "Super Admin",
    "role": "admin"
  }
}
```

## Cara Kerja (Awal sampai Akhir)

1. User membuka root `/`.
2. Aplikasi redirect ke `/auth`.
3. User memilih role (`admin`/`technician`), isi username dan password, lalu klik **Sign In**.
4. Frontend memanggil `signIn("credentials")` ke NextAuth.
5. NextAuth menjalankan `authorize()` dan meneruskan request login ke backend `/auth/login`.
6. Jika backend valid:
   - `accessToken`, `id`, `username`, `role`, `name` disimpan ke JWT callback.
   - Data tersebut diteruskan ke session callback.
7. Frontend mengambil session terbaru:
   - Jika role dari session tidak sama dengan role yang dipilih, user langsung `signOut` dan ditolak.
   - Jika cocok, user diarahkan ke halaman sesuai role (`/admin` atau `/technician`).
8. Halaman `/admin` dan `/technician` melakukan validasi server-side session:
   - Jika belum login → redirect `/auth`.
   - Jika role tidak sesuai → redirect ke halaman role yang benar.
9. User dapat logout via tombol **Sign Out**, lalu kembali ke `/auth`.

## Struktur File Auth yang Relevan

- `lib/auth.ts`
  - Konfigurasi NextAuth.
  - Credentials Provider.
  - Callback `jwt` dan `session` untuk menyimpan role dan access token.
- `app/api/auth/[...nextauth]/route.ts`
  - Handler route NextAuth (`GET` dan `POST`).
- `types/next-auth.d.ts`
  - Type augmentation untuk `Session`, `User`, dan `JWT` (termasuk `role`).
- `app/provider.tsx`
  - Membungkus aplikasi dengan `SessionProvider`.
- `app/auth/page.tsx`
  - UI login, submit credentials, validasi role, redirect halaman role.
- `app/admin/page.tsx`
  - Halaman test untuk role `admin` (protected).
- `app/technician/page.tsx`
  - Halaman test untuk role `technician` (protected).
- `app/components/sign-out-button.tsx`
  - Tombol logout.

## Cara Penggunaan (Testing Manual)

### 1) Test Login Admin

1. Buka `/auth`.
2. Pilih role **Admin**.
3. Masukkan akun admin yang valid.
4. Klik **Sign In**.
5. Hasil yang diharapkan:
   - Masuk ke `/admin`.
   - Informasi user tampil sesuai session.

### 2) Test Login Technician

1. Buka `/auth`.
2. Pilih role **Technician**.
3. Masukkan akun technician yang valid.
4. Klik **Sign In**.
5. Hasil yang diharapkan:
   - Masuk ke `/technician`.
   - Informasi user tampil sesuai session.

### 3) Test Mismatch Role

1. Pilih role yang tidak sesuai dengan akun (misal akun admin tapi pilih technician).
2. Login.
3. Hasil yang diharapkan:
   - Login dibatalkan (auto sign out).
   - Muncul error role tidak sesuai.

### 4) Test Proteksi Halaman

1. Akses `/admin` atau `/technician` tanpa login.
2. Hasil yang diharapkan:
   - Redirect ke `/auth`.

3. Login sebagai technician lalu buka `/admin` (atau sebaliknya).
4. Hasil yang diharapkan:
   - Redirect ke halaman sesuai role.

## Script yang Tersedia

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## Catatan

- Pastikan backend `/auth/login` aktif sebelum login.
- Pada production, gunakan `NEXTAUTH_SECRET` yang aman (random panjang), jangan gunakan nilai development.
