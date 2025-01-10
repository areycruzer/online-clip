# ✨ Magic Clipboard

A modern, magical web application for sharing clipboard content across devices with real-time synchronization and an enchanting user experience.

![Magic Clipboard Demo](demo-screenshot.png)

## ✨ Features

- Magical user interface with animated components
- Dark/Light mode with beautiful transitions
- Create, read, update, and delete clipboard entries
- Real-time synchronization across devices
- Private and public clipboard entries
- Share clipboard entries with magic links
- File attachments support
- Responsive design for all devices
- Secure password protection

## 🎨 UI Features

- Animated background effects
- Interactive hover animations
- Floating magical elements
- Smooth transitions
- Glassmorphism effects
- Mobile-friendly design
- Dark mode optimization
- Loading animations

## 🛠 Tech Stack

### Frontend:
- React.js
- Tailwind CSS with custom animations
- Heroicons
- Context API for state management
- Custom animations and transitions

### Backend:
- Node.js
- Express.js
- MongoDB
- Firebase Storage (for file attachments)
- JWT Authentication

## 🚀 Live Demo

Visit the live application: [Magic Clipboard](https://huu-5cjkh62vo-areycruzers-projects.vercel.app)

## 💻 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/magic-clipboard.git
cd magic-clipboard
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:

Frontend `.env`:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

Backend `.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

## 🏃‍♂️ Running Locally

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## 🚀 Deployment

The application is deployed using:
- Frontend: Vercel
- Backend: Vercel Serverless Functions
- Database: MongoDB Atlas
- File Storage: Firebase Storage

To deploy your own instance:

1. Frontend deployment:
```bash
cd frontend
vercel --prod
```

2. Backend deployment:
```bash
cd backend
vercel --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## ✨ Acknowledgments

- Design inspiration from modern web applications
- Tailwind CSS for the amazing utility classes
- Heroicons for beautiful icons
- The open-source community 