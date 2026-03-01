# README Khusus Auth, Authorization, dan Session Management

Dokumen ini fokus menjelaskan mekanisme autentikasi, otorisasi berbasis role, dan manajemen session di proyek Pertamina IMS.

## 1. Ringkasan Arsitektur

Aplikasi menggunakan:

- **NextAuth v4** dengan **Credentials Provider**
- **Backend Auth API** untuk validasi kredensial (`POST /auth/login`)
- **JWT session strategy** dari NextAuth (stateless)
- **Role-based authorization** untuk dua role: `admin` dan `technician`

Flow utama:

1. User login dari halaman `/auth`.
2. Frontend memanggil `signIn("credentials")`.
3. NextAuth meneruskan kredensial ke backend `/auth/login`.
4. Jika valid, backend mengembalikan `accessToken` + data user.
5. NextAuth menyimpan data penting ke token JWT dan session.
6. User diarahkan ke halaman sesuai role (`/admin` atau `/technician`).
7. Tiap halaman role melakukan pengecekan session + role di server.

## 2. Konfigurasi Environment Wajib

File `.env`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-pertamina-ims-nextauth-secret
```

Penjelasan:

- `NEXT_PUBLIC_API_BASE_URL`: base URL backend API auth.
- `NEXTAUTH_URL`: origin frontend yang dipakai NextAuth.
- `NEXTAUTH_SECRET`: secret signing JWT NextAuth.

> Penting: untuk production, ganti `NEXTAUTH_SECRET` dengan nilai random yang kuat.

## 3. Komponen Utama dan Tanggung Jawab

### `lib/auth.ts`

Pusat konfigurasi NextAuth:

- Mengaktifkan `session.strategy = "jwt"`.
- Menetapkan halaman sign-in custom ke `/auth`.
- Mendefinisikan `CredentialsProvider` dengan field `username`, `password`, `role`.
- Menjalankan `authorize()` untuk request login ke backend.
- Mapping data backend ke object `user` NextAuth.
- Menyimpan nilai penting ke JWT (`id`, `username`, `role`, `accessToken`).
- Mengekspos nilai penting ke object `session`.

### `app/api/auth/[...nextauth]/route.ts`

Handler route App Router untuk NextAuth (`GET` dan `POST`).

### `types/next-auth.d.ts`

Type augmentation agar TypeScript paham field tambahan:

- `session.user.id`
- `session.user.username`
- `session.user.role`
- `session.accessToken`
- field yang sama di `JWT`

### `app/provider.tsx`

Membungkus aplikasi dengan `SessionProvider` agar komponen client bisa akses session.

### `app/auth/page.tsx`

UI login + submit logic:

- User memilih role di tab (`admin` / `technician`).
- Memanggil `signIn("credentials", { redirect: false })`.
- Mengecek hasil login.
- Mengambil session dengan `getSession()`.
- Validasi role dari session harus sama dengan role pilihan user.
- Logging hasil submit ke console.
- Redirect:
  - `admin` -> `/admin`
  - `technician` -> `/technician`

### `app/admin/page.tsx` dan `app/technician/page.tsx`

Proteksi server-side menggunakan `getServerSession(authOptions)`:

- Jika belum login -> redirect `/auth`
- Jika role salah -> redirect ke halaman role yang benar

## 4. Detail Flow Login (Step-by-Step)

### Step A: User submit form

Dari `/auth`, user mengirim:

- `username`
- `password`
- `role`

### Step B: NextAuth authorize

`authorize(credentials)` di `lib/auth.ts`:

1. Validasi field tidak kosong.
2. Ambil `NEXT_PUBLIC_API_BASE_URL`.
3. `fetch` ke `POST {BASE_URL}/auth/login`.
4. Jika response bukan 2xx -> return `null` (login gagal).
5. Jika sukses -> parsing response backend.
6. Jika data wajib tidak lengkap -> return `null`.
7. Jika valid -> return user object untuk NextAuth.

### Step C: JWT callback

Saat login sukses, callback `jwt` menyimpan:

- `token.id`
- `token.username`
- `token.role`
- `token.accessToken`

### Step D: Session callback

Data dari token dipindahkan ke session:

- `session.user.id`
- `session.user.username`
- `session.user.role`
- `session.accessToken`

### Step E: Redirect role-based

Di login page:

- Ambil `session.user.role`
- Jika berbeda dengan role pilihan -> paksa `signOut`
- Jika cocok -> redirect sesuai role

## 5. Authorization (Role-Based Access)

Model authorization saat ini:

- **Page-level authorization** pada halaman role (`/admin`, `/technician`) menggunakan server-side check.
- Belum menggunakan middleware global, jadi proteksi dilakukan per halaman protected.

Keuntungan pendekatan saat ini:

- Sederhana, jelas, mudah di-debug.
- Aman untuk route yang sudah diproteksi dengan `getServerSession`.

Hal yang perlu diperhatikan:

- Route baru yang butuh proteksi harus ditambah check yang sama.

## 6. Session Management

Strategi session saat ini:

- **JWT stateless session** dari NextAuth.
- Session disediakan ke client melalui `SessionProvider`.
- Session dapat dibaca:
  - Client side: `useSession` atau `getSession`
  - Server side: `getServerSession(authOptions)`

Data session yang tersedia:

- `session.user.id`
- `session.user.name` (dari backend response)
- `session.user.username`
- `session.user.role`
- `session.accessToken`

Logout:

- Tombol logout menjalankan `signOut({ callbackUrl: "/auth" })`.
- User kembali ke halaman login.

## 7. Contract API Backend

Endpoint login yang dipakai frontend:

- Method: `POST`
- URL: `/auth/login`

Request body:

```json
{
  "username": "superadmin",
  "password": "your-password",
  "role": "admin"
}
```

Response sukses (contoh):

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

## 8. Cara Penggunaan (End-to-End)

### Menjalankan aplikasi

```bash
pnpm install
pnpm dev
```

Buka `http://localhost:3000`.

### Uji login admin

1. Masuk ke `/auth`.
2. Pilih role `Admin`.
3. Isi kredensial admin.
4. Klik **Sign In**.
5. Pastikan redirect ke `/admin`.

### Uji login technician

1. Masuk ke `/auth`.
2. Pilih role `Technician`.
3. Isi kredensial technician.
4. Klik **Sign In**.
5. Pastikan redirect ke `/technician`.

### Uji mismatch role

1. Gunakan akun valid tapi pilih role yang salah.
2. Submit login.
3. Pastikan login dibatalkan (sign out) + muncul pesan error role mismatch.

### Uji proteksi halaman

1. Akses `/admin` tanpa login -> harus diarahkan ke `/auth`.
2. Login sebagai technician, lalu akses `/admin` -> harus diarahkan ke `/technician`.
3. Login sebagai admin, lalu akses `/technician` -> harus diarahkan ke `/admin`.

## 9. Poin Penting Tambahan (Rekomendasi)

### Security hardening

- Gunakan `NEXTAUTH_SECRET` kuat di production.
- Gunakan HTTPS di production agar cookie/session lebih aman.
- Hindari log data sensitif (password, token) ke console.

### Konsistensi role

- Saat ini role dikirim dari frontend ke backend saat login.
- Backend harus tetap menjadi sumber kebenaran akhir role user.

### Skalabilitas authorization

- Jika route protected bertambah banyak, pertimbangkan menambah `middleware.ts` untuk proteksi global berbasis role.

### Integrasi API lanjutan

- Untuk request API yang butuh bearer token, ambil `session.accessToken` di server/client lalu kirim sebagai header `Authorization: Bearer <token>`.

## 10. Troubleshooting

### Login selalu gagal

Cek:

- Backend `http://localhost:3001` hidup.
- Endpoint `/auth/login` dapat diakses.
- Nilai `.env` benar.
- Response backend memiliki field `accessToken` dan `user.role`.

### Redirect tidak sesuai role

Cek:

- Role dari backend (`user.role`) benar.
- Role yang dipilih di form sesuai akun.

### Session kosong setelah login

Cek:

- `SessionProvider` aktif di root provider.
- `callbacks.jwt` dan `callbacks.session` tidak menghapus field penting.
- `NEXTAUTH_SECRET` tersedia.

## 11. Ringkasan Singkat

- **Authentication**: Credentials -> backend `/auth/login`.
- **Authorization**: server-side role check di halaman protected.
- **Session Management**: NextAuth JWT + custom fields (`id`, `username`, `role`, `accessToken`).

Dokumen ini menjadi referensi utama untuk pengembangan fitur auth berikutnya.
