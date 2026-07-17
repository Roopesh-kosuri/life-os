# LIFE OS — Deployment Guide (Free Tier)

This guide walks you through deploying LIFE OS using **Firebase Spark (Free Plan)** for database/real-time sync and **Vercel (Free Tier)** for hosting.

---

## 1. Firebase Setup (Database & Sync)

Since LIFE OS uses client-side passphrase-based hashing to sync data in Firestore, you need a free Firebase project.

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and name it `life-os`.
3. Disable Google Analytics (optional, to keep it light and clean).
4. Once the project is ready, click **Build > Firestore Database** in the sidebar.
5. Click **Create database**.
   - Select your database location (close to you).
   - Start in **production mode** or **test mode**.
6. Set your Firestore rules. Go to the **Rules** tab in Firestore and replace them with:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/{document=**} {
         allow read, write: if true; // Deterministic passphrase hash checks
       }
     }
   }
   ```
7. Go to **Project Settings** (gear icon in top-left sidebar) > **General**.
8. Scroll down to "Your apps" and click the web icon (`</>`) to register a web app.
9. Name it `life-os-web` and click **Register app**.
10. Copy the `firebaseConfig` object containing:
    - `apiKey`
    - `authDomain`
    - `projectId`
    - `storageBucket`
    - `messagingSenderId`
    - `appId`
11. Paste this configuration into your local file: [src/firebase.js](file:///d:/HTML/life-os/src/firebase.js) in the config placeholder.

---

## 2. Local Build Verification

Before deploying, make sure the project builds locally without errors:

```bash
# Install dependencies (if not already done)
npm install

# Run verification build
npm run build
```

This will output the static files to the `dist/` directory.

---

## 3. Deploying to Vercel (Free Tier)

Vercel is the easiest place to host Vite PWAs for free.

### Option A: Via Vercel CLI (Simplest)
1. In the terminal, run Vercel to initialize and log in:
   ```bash
   npx vercel
   ```
2. Follow the prompts:
   - *Set up and deploy?* Yes
   - *Which scope?* (Your personal account)
   - *Link to existing project?* No
   - *What's your project's name?* `life-os`
   - *In which directory is your code located?* `./`
   - *Want to modify settings?* No (Vite settings are auto-detected)
3. To deploy to production, run:
   ```bash
   npx vercel --prod
   ```

### Option B: Via GitHub Integration
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and sign in with your GitHub account.
3. Click **Add New > Project**.
4. Import your `life-os` repository.
5. Click **Deploy**. Vercel will automatically build and deploy every time you push to your `main` branch.

---

## 4. Install LIFE OS on Mobile / Desktop

Because the app is configured with `vite-plugin-pwa`:
- **iOS (Safari)**: Open the URL, tap the **Share** button, scroll down, and select **Add to Home Screen**.
- **Android (Chrome)**: Open the URL, and click the **Add to Home Screen** banner, or tap the three dots in Chrome and select **Install App**.
- **Desktop (Chrome/Edge)**: Click the install icon in the URL search bar.
