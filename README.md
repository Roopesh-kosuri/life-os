# 🚀 LIFE OS

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?logo=firebase)](https://firebase.google.com/)
[![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?logo=pwa)](https://web.dev/progressive-web-apps/)
[![Live Demo](https://img.shields.io/badge/Live_Demo-lifeosweb.vercel.app-000000?logo=vercel)](https://lifeosweb.vercel.app)

> **A unified, installable Progressive Web App for holistic personal management.**
> Started as a simple personal gym tracker and evolved into a full "Life OS" — one dashboard to manage Fitness, Skincare, and Productivity, with real-time sync and a native-app feel.

**🔗 Live Deployment:** [lifeosweb.vercel.app](https://lifeosweb.vercel.app)

---

## 🌟 About The Project

Keeping track of personal growth usually means juggling separate apps — one for workouts, another for habits, another for skincare routines. **LIFE OS** consolidates all of that into a single, fast, offline-capable PWA.

It's built with a modern React front end and backed by Firebase for authentication and real-time data, with interactive charts (via Recharts) to visualize progress over time.

### 🎯 Key Features

- 🏋️ **Fitness Tracker** — Log workouts, track progressive overload, and visualize strength gains over time.
- 🧴 **Skincare Routine Manager** — Track daily regimens, product usage, and skin progress.
- ⚡ **Productivity Hub** — Manage daily tasks, habits, and focus sessions.
- 📱 **PWA Ready** — Installable on iOS and Android for a native-app experience, with offline support.
- 📊 **Data Visualization** — Interactive charts to track trends and progress at a glance.
- 🔒 **Secure Authentication** — Firebase-backed auth for reliable, secure sign-in.
- 🎨 **Modern UI/UX** — Clean, responsive design built with Tailwind CSS v4 and Lucide icons.

---

## 🛠️ Tech Stack

| Category     | Technologies Used                              |
|--------------|-------------------------------------------------|
| **Frontend** | React 19, Vite, React Router DOM                 |
| **Styling**  | Tailwind CSS v4, Lucide React (Icons)            |
| **Backend**  | Firebase (Authentication, Firestore Database)    |
| **Data Viz** | Recharts                                         |
| **Tooling**  | Oxlint, Vite Plugin PWA, Crypto-JS               |
| **Hosting**  | Vercel                                           |

---

## 📂 Project Architecture

```text
src/
├── components/     # Reusable UI components (auth, layout, ui, feature-specific)
├── context/        # React Context for global state management
├── data/           # Static data, mock data, or constants
├── hooks/          # Custom React hooks for reusable logic
├── pages/          # Top-level route components (Fitness, Skincare, Productivity, Settings)
├── services/       # External API calls and Firebase service configurations
├── App.jsx         # Main application router and layout shell
└── main.jsx        # Application entry point
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A [Firebase](https://firebase.google.com/) project (for Auth & Firestore)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Roopesh-kosuri/life-os.git
   cd life-os
   ```

2. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Run the development server**
   ```bash
   npm install
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

4. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

---

## 🔮 Future Enhancements

LIFE OS is actively evolving. Planned features include:

- **AI-Powered Insights** — Automated suggestions for workout deloads or routine optimizations based on historical data.
- **Wearable Integration** — Sync data directly from Apple Health / Google Fit APIs.
- **Dark Mode Toggle** — Enhanced theming support in the Settings panel.
- **TypeScript Migration** — Upgrading the codebase to strict TypeScript for better type safety.

---

## 🤝 Contributing & Feedback

This is a personal project, but feedback is always welcome — feel free to open an [Issue](https://github.com/Roopesh-kosuri/life-os/issues) or reach out.

---

## 👨‍💻 Author

**Roopesh Kosuri**
🐙 [GitHub](https://github.com/Roopesh-kosuri)

---

<p align="center">Built with ❤️ and lots of ☕ during late-night coding sessions.</p>
