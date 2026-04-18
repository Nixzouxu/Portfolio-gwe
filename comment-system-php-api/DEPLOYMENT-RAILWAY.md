# 🚀 Deployment Guide - Railway (Backend PHP API + PostgreSQL)

Complete step-by-step guide untuk deploy PHP API + PostgreSQL ke Railway.

---

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Railway account (daftar di [railway.app](https://railway.app))
- ✅ Git installed di computer

---

## 🔧 Part 1: Setup Railway Project

### Step 1: Create New Project

1. **Login ke Railway**: [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy PostgreSQL"**
4. Tunggu deployment selesai (~30 detik)

### Step 2: Add PHP Service

1. Di project yang sama, click **"+ New"**
2. Select **"Empty Service"**
3. Rename service jadi `php-api`

---

## 📦 Part 2: Prepare PHP Files

### Step 1: Create Project Structure

```bash
# Create directory
mkdir portfolio-api
cd portfolio-api

# Create API folder
mkdir api
```

### Step 2: Upload Files

Copy semua file ini ke folder `api/`:
- ✅ `config.php`
- ✅ `comments.php`
- ✅ `submit.php`
- ✅ `delete.php`

### Step 3: Create Railway Config Files

**Create `nixpacks.toml` di root folder:**

```toml
[phases.setup]
nixPkgs = ['...', 'php81', 'php81Packages.composer']

[phases.install]
cmds = ['echo "PHP 8.1 installed"']

[start]
cmd = 'php -S 0.0.0.0:$PORT -t api'
```

**Create `runtime.txt`:**

```
php-8.1
```

### Step 4: Create `index.php` (Landing Page)

Create `api/index.php`:

```php
<?php
header('Content-Type: application/json');
echo json_encode([
    'status' => 'ok',
    'message' => 'Portfolio API is running',
    'endpoints' => [
        'GET /comments.php' => 'Get all comments',
        'POST /submit.php' => 'Submit new comment',
        'DELETE /delete.php' => 'Delete comment (admin)'
    ]
]);
?>
```

---

## 🗄️ Part 3: Setup PostgreSQL Database

### Step 1: Connect to Database

1. Di Railway dashboard, click **PostgreSQL service**
2. Go to **"Data" tab**
3. Click **"Query"**

### Step 2: Run Database Schema

Copy paste isi file `database.sql` ke Query editor, lalu **Execute**

Atau via command line:
```bash
# Get PostgreSQL connection string from Railway
# Variables tab → Copy DATABASE_URL

# Run SQL file
psql YOUR_DATABASE_URL < database.sql
```

---

## 🌐 Part 4: Deploy to Railway

### Step 1: Initialize Git

```bash
cd portfolio-api

git init
git add .
git commit -m "Initial commit - PHP API"
```

### Step 2: Push to GitHub

```bash
# Create new repo di GitHub, lalu:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio-api.git
git push -u origin main
```

### Step 3: Connect Railway to GitHub

1. Di Railway, click `php-api` service
2. Click **"Settings"** tab
3. Scroll ke **"Source"**
4. Click **"Connect GitHub Repo"**
5. Select repository `portfolio-api`
6. Click **"Deploy"**

---

## 🔐 Part 5: Environment Variables

### Step 1: Link PostgreSQL to PHP Service

1. Click `php-api` service
2. Go to **"Variables" tab**
3. Click **"+ New Variable"**
4. Click **"Add Reference"**
5. Select **PostgreSQL → DATABASE_URL**
6. Click **"Add"**

### Step 2: Add Admin API Key

1. Still in Variables tab
2. Click **"+ New Variable"**
3. Key: `ADMIN_API_KEY`
4. Value: `your-secret-key-12345` (ganti dengan random string)
5. Click **"Add"**

### Step 3: Get API URL

1. Go to **"Settings" tab**
2. Scroll ke **"Domains"**
3. Click **"Generate Domain"**
4. Copy URL (misal: `php-api-production-xxxx.up.railway.app`)

---

## ✅ Part 6: Test API

### Test 1: Health Check

```bash
curl https://your-api.railway.app/
```

Expected response:
```json
{
  "status": "ok",
  "message": "Portfolio API is running"
}
```

### Test 2: Get Comments

```bash
curl https://your-api.railway.app/comments.php
```

### Test 3: Submit Comment

```bash
curl -X POST https://your-api.railway.app/submit.php \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test comment!"
  }'
```

---

## 🔧 Part 7: Update React Frontend

### Step 1: Update API URL

Edit `Comments.jsx`:

```javascript
// CHANGE THIS LINE:
const API_URL = 'https://your-api.railway.app';

// TO YOUR ACTUAL RAILWAY URL:
const API_URL = 'https://php-api-production-xxxx.up.railway.app';
```

### Step 2: Update CORS Settings

Edit `config.php`:

```php
$allowed_origins = [
    'http://localhost:5173',
    'https://your-portfolio.netlify.app', // YOUR NETLIFY URL!
];
```

### Step 3: Add Comments to Portfolio

Edit `src/App.jsx`:

```javascript
import Comments from './components/Comments'

function App() {
  return (
    <div>
      {/* ... existing components ... */}
      <Comments />
      <Footer />
    </div>
  )
}
```

### Step 4: Deploy to Netlify

```bash
cd portfolio-nxozu-v2-flip
npm run build
```

Drag & drop folder `dist/` ke Netlify atau push ke GitHub dan connect.

---

## 🎯 Final Checklist

- [ ] PostgreSQL deployed di Railway
- [ ] Database schema created
- [ ] PHP API deployed di Railway
- [ ] Environment variables set
- [ ] API URL copied
- [ ] CORS configured
- [ ] React component updated with API URL
- [ ] Portfolio deployed to Netlify
- [ ] Test submit comment
- [ ] Test view comments

---

## 🐛 Troubleshooting

### API returns 500 error
- Check Railway logs: Service → Deployments → View Logs
- Check DATABASE_URL is set
- Verify PostgreSQL is running

### CORS error in browser
- Add your Netlify URL to `$allowed_origins` in `config.php`
- Redeploy Railway

### Comments not showing
- Check API URL is correct in `Comments.jsx`
- Open browser DevTools → Network tab
- Check API response

### Database connection failed
- Verify DATABASE_URL is linked
- Check PostgreSQL service is running
- Test connection with `psql`

---

## 📊 Railway Free Tier Limits

- ✅ 500 hours/month (enough for 24/7)
- ✅ PostgreSQL included
- ✅ Custom domain
- ✅ Auto HTTPS

---

## 🔒 Security Tips

1. **Change Admin API Key** to strong random string
2. **Enable HTTPS only** (Railway does this automatically)
3. **Implement rate limiting** (optional)
4. **Sanitize all inputs** (already done in code)
5. **Use environment variables** for secrets

---

## 📚 Useful Commands

```bash
# View Railway logs
railway logs

# Connect to PostgreSQL
railway connect postgres

# Redeploy
git push origin main
```

---

**Done! Your comment system is live!** 🎉

Railway URL: `https://your-api.railway.app`
Frontend: `https://your-portfolio.netlify.app`
