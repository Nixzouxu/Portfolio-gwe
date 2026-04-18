# 💬 Comment System - PHP + PostgreSQL + React

Full-stack comment system untuk portfolio website kamu.

**Architecture:** React (Netlify) → PHP API (Railway) → PostgreSQL (Railway)

---

## 📦 What's Included

### Backend (PHP + PostgreSQL)
- ✅ `config.php` - Database connection & utilities
- ✅ `comments.php` - GET all comments
- ✅ `submit.php` - POST new comment
- ✅ `delete.php` - DELETE comment (admin)
- ✅ `database.sql` - PostgreSQL schema

### Frontend (React Component)
- ✅ `Comments.jsx` - Full comment system UI
- ✅ Form validation
- ✅ Real-time comment display
- ✅ Loading & error states
- ✅ Responsive design

### Documentation
- ✅ `DEPLOYMENT-RAILWAY.md` - Complete Railway deployment guide
- ✅ This README

---

## 🚀 Quick Start

### 1. Deploy Backend to Railway

Follow step-by-step guide in **`DEPLOYMENT-RAILWAY.md`**

TLDR:
1. Create Railway account
2. Deploy PostgreSQL
3. Deploy PHP service from GitHub
4. Run database.sql
5. Set environment variables
6. Get API URL

### 2. Update React Frontend

**A. Copy `Comments.jsx` to your project:**

```bash
cp Comments.jsx portfolio-nxozu-v2-flip/src/components/
```

**B. Update API URL in `Comments.jsx`:**

```javascript
const API_URL = 'https://your-api.railway.app'; // CHANGE THIS!
```

**C. Add to App.jsx:**

```javascript
import Comments from './components/Comments'

function App() {
  return (
    <div>
      {/* ... existing components ... */}
      <Comments />  {/* ADD THIS */}
      <Footer />
    </div>
  )
}
```

### 3. Deploy to Netlify

```bash
npm run build
```

Upload `dist/` folder to Netlify atau push to GitHub.

---

## 🎯 Features

### User Features
- ✅ Submit comment (name, email, message)
- ✅ View all comments
- ✅ Real-time updates
- ✅ Timestamp display
- ✅ Avatar initials

### Technical Features
- ✅ Input validation (frontend & backend)
- ✅ SQL injection protection
- ✅ XSS protection
- ✅ CORS configured
- ✅ Rate limiting ready
- ✅ Pagination support
- ✅ Error handling
- ✅ Loading states

### Admin Features
- ✅ Delete comments (with API key)
- ✅ Comment moderation (is_approved field)
- ✅ IP tracking
- ✅ User agent logging

---

## 📁 File Structure

```
comment-system-php-api/
├── api/                    # PHP Backend
│   ├── config.php          # Database & utilities
│   ├── comments.php        # GET endpoint
│   ├── submit.php          # POST endpoint
│   └── delete.php          # DELETE endpoint
├── database.sql            # PostgreSQL schema
├── Comments.jsx            # React component
├── DEPLOYMENT-RAILWAY.md   # Deployment guide
└── README.md               # This file
```

---

## 🔧 Configuration

### Backend (config.php)

**1. CORS - Add your Netlify URL:**

```php
$allowed_origins = [
    'http://localhost:5173',
    'https://YOUR-PORTFOLIO.netlify.app', // CHANGE!
];
```

**2. Admin API Key (Railway Environment Variable):**

```
ADMIN_API_KEY=your-secret-key-12345
```

### Frontend (Comments.jsx)

**1. API URL:**

```javascript
const API_URL = 'https://your-api.railway.app'; // CHANGE!
```

---

## 🧪 Testing

### Local Testing (Backend)

```bash
# Start PHP server
php -S localhost:8000 -t api

# Test endpoints
curl http://localhost:8000/comments.php
curl -X POST http://localhost:8000/submit.php \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Hello"}'
```

### Test Live API

```bash
# Health check
curl https://your-api.railway.app/

# Get comments
curl https://your-api.railway.app/comments.php

# Submit comment
curl -X POST https://your-api.railway.app/submit.php \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","message":"Great site!"}'
```

---

## 🗄️ Database Schema

```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN DEFAULT TRUE,
    ip_address VARCHAR(45),
    user_agent TEXT
);
```

---

## 🔒 Security Features

- ✅ **Input Sanitization**: All inputs cleaned
- ✅ **SQL Injection Protection**: Prepared statements
- ✅ **XSS Protection**: htmlspecialchars
- ✅ **CORS**: Whitelist allowed origins
- ✅ **Rate Limiting**: Ready to implement
- ✅ **Admin Authentication**: API key required
- ✅ **HTTPS**: Enforced by Railway

---

## 📊 API Endpoints

### GET /comments.php
Fetch all approved comments

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Results per page (default: 20, max: 50)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

### POST /submit.php
Submit a new comment

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Great portfolio!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Comment submitted successfully",
  "data": {
    "id": 123,
    "created_at": "2024-01-15 10:30:00"
  }
}
```

### DELETE /delete.php
Delete a comment (admin only)

**Headers:**
```
Authorization: Bearer YOUR_API_KEY
```

**Request Body:**
```json
{
  "id": 123
}
```

**Response:**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

---

## 🐛 Troubleshooting

**"Failed to fetch comments"**
- Check API URL is correct
- Check CORS settings
- Check Railway service is running

**"Database connection failed"**
- Verify DATABASE_URL is set in Railway
- Check PostgreSQL service is running

**"Unauthorized" on delete**
- Check ADMIN_API_KEY is set
- Check Authorization header

**CORS error**
- Add your domain to allowed_origins
- Redeploy Railway

---

## 💰 Cost

**Railway Free Tier:**
- ✅ 500 hours/month (24/7 uptime)
- ✅ PostgreSQL included
- ✅ No credit card required

**Netlify Free Tier:**
- ✅ Unlimited sites
- ✅ 100GB bandwidth/month
- ✅ Auto HTTPS

**Total: FREE! 🎉**

---

## 📚 Next Steps

1. ✅ Deploy backend to Railway
2. ✅ Setup PostgreSQL database
3. ✅ Add React component
4. ✅ Configure CORS
5. ✅ Test functionality
6. ✅ Deploy frontend to Netlify

**Read `DEPLOYMENT-RAILWAY.md` for detailed instructions!**

---

## 🤝 Support

Issues? Check:
1. Railway logs (Deployments → View Logs)
2. Browser console (F12)
3. Network tab (API responses)

---

**Made with ❤️ for Nxozu Portfolio**

Stack: React + PHP + PostgreSQL
Hosting: Netlify + Railway
