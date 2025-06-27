# [Artifex](https://artifex-tan.vercel.app/)

A modern **web-based image editor** with background removal, text overlay, and filter effects.

# Features

- **Client-Side Editing** – Built with **Next.js 15**, **React**, **Tailwind CSS**, and **HTML5 Canvas**.
- **Smart Image Tools** – Upload, remove backgrounds, add text, and apply filters.
- **Auth System** – Secure login/signup via **NextAuth.js** (credentials provider).
- **Credits & Billing** – Manage user access with **Stripe**-powered credit system.
- **Cloud Storage** – Store images on **AWS S3** for reliability and scale.
-  **PostgreSQL Database** – User & image data handled via **Prisma ORM**.
- **Optimized Backend** – Server actions for fast, seamless user experience.
- **Production Ready** – Deployed on **Vercel** with CI/CD support.
---

## 🛠️ Get Started

### 1. Clone the repository:

```bash
git clone https://github.com/anupkumar43/artifex.git
cd artifex
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Set up environment variables:

Create a `.env` file in the root of the project with the following values:

```env
DATABASE_URL=<your_postgresql_connection_url>
MY_AWS_ACCESS_KEY_ID=<your_aws_access_key>
MY_AWS_SECRET_ACCESS_KEY=<your_aws_secret_key>
MY_AWS_REGION=<your_aws_region>
S3_BUCKET_NAME=<your_s3_bucket>
STRIPE_SECRET_KEY=<your_stripe_secret_key>
NEXTAUTH_SECRET=<your_auth_secret>
BASE_URL=http://localhost:3000
```

### 4. Generate Prisma client:

```bash
npx prisma generate
```

### 5. Run the development server:

```bash
npm run dev
```

---

