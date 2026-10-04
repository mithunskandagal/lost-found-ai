# Lost & Found AI — Full Stack Project

An advanced Lost & Found web application for a college/community.

## Features
- User registration and login with JWT
- Report Lost / Found items
- Image upload
- AI image/description analysis
- AI-powered matching between lost and found reports
- Search and filters
- User dashboard
- Claim/report ownership workflow
- Admin-ready item status fields
- MongoDB database
- React frontend + Express backend

## Stack
Frontend: React + Vite + React Router + Axios
Backend: Node.js + Express + MongoDB/Mongoose
AI: OpenAI Responses API
Authentication: JWT + bcryptjs
Image upload: Multer (local development)

## 1. Requirements
Install:
- Node.js LTS
- VS Code
- MongoDB locally OR a MongoDB Atlas connection
- Git (optional)

Check Node:
```bash
node -v
npm -v
```

## 2. Backend setup
```bash
cd backend
npm install
copy .env.example .env
```
On PowerShell:
```powershell
Copy-Item .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/lost_found_ai
JWT_SECRET=change_this_to_a_long_random_secret
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-6-luna
CLIENT_URL=http://localhost:5173
```

Start:
```bash
npm run dev
```

## 3. Frontend setup
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, normally:
http://localhost:5173

## 4. MongoDB
If using MongoDB Atlas, replace MONGODB_URI with your Atlas connection string.

## 5. AI
AI features require an OpenAI API key. Keep it in `backend/.env`.
Never put OPENAI_API_KEY in frontend/.env or commit it to Git.

## 6. Suggested project presentation
Demonstrate:
1. Register
2. Login
3. Report a lost item
4. Report a found item
5. Upload a photo
6. Use AI analysis
7. Search/filter items
8. Show AI match suggestions
9. Submit a claim
10. Explain admin moderation and notifications

## 7. Future upgrades
- Email/SMS notifications
- Firebase/FCM push notifications
- Cloudinary/S3 image storage
- Google Maps/Mapbox location picker
- QR-code based item handover
- Admin analytics dashboard
- Vector/embedding similarity search
- Duplicate/spam detection
- College ID verification
- Audit logs
