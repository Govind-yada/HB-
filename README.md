# HB+ Fit Authentication Portal

[![Platform](https://img.shields.io/badge/Platforms-Android%20%7C%20iOS%20%7C%20Web-blue.svg)](https://reactnative.dev/)
[![React Native Web](https://img.shields.io/badge/React%20Native%20Web-0.21-61dafb.svg)](https://necolas.github.io/react-native-web/)
[![Firebase Auth](https://img.shields.io/badge/Firebase%20Auth-v13-FFA611.svg)](https://firebase.google.com/)
[![Deployment](https://img.shields.io/badge/Deploy-Netlify%20Ready-00C7B7.svg)](https://www.netlify.com/)

A complete, production-ready cross-platform authentication application built with **React Native + React Native Web** using a **single codebase** supporting Android, iOS, and Web. 

This application implements corporate single sign-on (SSO) with **Google OAuth 2.0 via Firebase Authentication**, strictly restricting access to verified users belonging exclusively to the official **`@hbplus.fit`** corporate domain.

---

## 🌟 Key Features

1. **Unified Cross-Platform Codebase**: Single TypeScript codebase powered by Expo and React Native Web running seamlessly across Android, iOS, and Web browsers.
2. **Google OAuth 2.0 Authentication**: Modern, secure authentication utilizing the official Firebase Authentication modular SDK.
3. **Strict Domain Enforcement (`@hbplus.fit`)**:
   - Only emails ending with `@hbplus.fit` are permitted to authenticate.
   - Any other domain (e.g., `@gmail.com`, `@yahoo.com`, or spoofed domains) is immediately rejected.
   - Returns the exact error message required:
     > `"Access restricted. Please login using your official domain email."`
4. **Immediate Session Termination on Invalid Domain**:
   - If an unauthorized domain signs in, the app invokes `signOut(auth)` immediately, purges cached tokens/AsyncStorage, and clears authentication state.
5. **Protected Dashboard & Direct URL Security**:
   - Unauthorized direct access to `/dashboard` or internal URLs via browser address bar or deep link is instantly intercepted and redirected to `/login`.
   - Logged-in users are automatically routed to the Dashboard.
6. **Cross-Platform Session Persistence**:
   - Web: IndexedDB / Browser Local Storage.
   - Android / iOS: Encrypted `@react-native-async-storage/async-storage`.
7. **Role-Based Access Control (Admin / User)**:
   - Stores and synchronizes user profiles in **Firebase Firestore** under `users/{uid}`.
   - **Admin Role**: Grants access to the Administrator Security Console, domain metrics, active rules, and registered team directory.
   - **User Role**: Standard athlete/employee hub with workout tracking and member portals.
8. **Fully Responsive Modern UI**:
   - Responsive breakpoints for Mobile (< 768px), Tablet (768px–1024px), and Desktop (≥ 1024px).
   - Minimalist, high-contrast dark palette (Slate / Navy / Sky Blue / Emerald Green).
   - Includes custom 4-color Google Sign-In button, avatars with initials fallback, and status badges.
9. **Interactive Verification Lab**:
   - Embedded interactive testing panel directly on the login screen to verify accepted domains, admin permissions, and exact domain rejection error behavior without requiring live Google Cloud configuration upfront.
10. **Complementary Enterprise Features**:
   - **`ErrorBoundary`**: Graceful crash prevention with friendly retry mechanism.
   - **`ToastProvider`**: Slick, animated non-blocking notifications for authentication events and role changes.
   - **`RoleGuard`**: Declarative RBAC authorization component.
   - **`AuditLogViewer`**: Real-time domain access event tracking (Granted, Blocked, Logout, Role Changes).
   - **`RoleUpdateModal`**: Interactive admin dialog allowing one-click promotion/demotion of team members.

---

## 📁 Project Structure & Decomposed Components

```text
hbplus-auth-app/
├── assets/                          # App icons, adaptive splash screens, favicon
├── src/
│   ├── components/
│   │   ├── common/                  # Modular Primitive & Utility Components
│   │   │   ├── AlertBox.tsx         # Domain rejection alert & error banners
│   │   │   ├── Avatar.tsx           # Profile picture with fallback initials
│   │   │   ├── Badge.tsx            # Role & Domain Verified status badges
│   │   │   ├── Card.tsx             # Responsive elevated container cards
│   │   │   ├── ErrorBoundary.tsx    # Crash containment with retry handler
│   │   │   ├── LoadingOverlay.tsx   # Branded full-screen activity spinner
│   │   │   ├── RoleGuard.tsx        # Declarative RBAC authorization gate
│   │   │   └── Toast.tsx            # Animated notification toast cards
│   │   ├── login/                   # Decomposed Login Screen Components
│   │   │   ├── BrandHeader.tsx      # HB+ logo pill, title, and tagline
│   │   │   ├── DomainSecurityBanner.tsx # Whitelist domain notice with lock icon
│   │   │   └── VerificationLab.tsx  # Interactive domain rejection & role testing
│   │   ├── dashboard/               # Decomposed Dashboard Screen Components
│   │   │   ├── WelcomeBanner.tsx    # Personal greeting, refresh data & signout
│   │   │   ├── QuickMetricsBar.tsx  # Security status, domain & role cards
│   │   │   └── AthleteHub.tsx       # Standard user athletic programs & biometrics
│   │   ├── profile/                 # Decomposed Profile Components
│   │   │   ├── ProfileHeader.tsx    # Avatar, verification tag, role badges
│   │   │   └── ProfileDetailItem.tsx# Single attribute with monospace UID support
│   │   ├── admin/                   # Decomposed Admin Console Components
│   │   │   ├── AdminHeader.tsx      # Admin privileges badge & description
│   │   │   ├── AdminMetricsGrid.tsx # 4 quick stat cards (Members, Admins, Compliance)
│   │   │   ├── SecurityRuleChecklist.tsx # Authorization rules & guard summary
│   │   │   ├── TeamMemberRow.tsx    # Single directory row with promote/demote action
│   │   │   ├── TeamDirectoryTable.tsx # Filterable team table with search & modal
│   │   │   ├── AuditLogViewer.tsx   # Live domain access logs (Granted/Blocked)
│   │   │   └── RoleUpdateModal.tsx  # Confirmation modal for changing member roles
│   │   ├── session/                 # Decomposed Session Diagnostics
│   │   │   └── DiagnosticItem.tsx   # Single diagnostic attribute with status dot
│   │   ├── GoogleSignInButton.tsx   # Official branded 4-color Google sign-in button
│   │   ├── Navbar.tsx               # Responsive header with BrandLogo & UserNavMenu
│   │   ├── UserProfileCard.tsx      # Main composite profile card
│   │   ├── AdminPanel.tsx           # Main composite admin console
│   │   ├── SessionDetailsCard.tsx   # Main composite session diagnostic card
│   │   └── index.ts                 # Unified component exports
│   ├── config/
│   │   ├── constants.ts             # Whitelist domain (@hbplus.fit) & exact error strings
│   │   ├── env.ts                   # Environment variables and fallback validation
│   │   └── firebase.ts              # Cross-platform Firebase Auth & Firestore init
│   ├── context/
│   │   ├── AuthContext.tsx          # Auth provider, onAuthStateChanged, audit logging
│   │   └── ToastContext.tsx         # Global toast notification provider
│   ├── hooks/
│   │   ├── useAuth.ts               # Convenience hook for authentication state & actions
│   │   ├── useResponsive.ts         # Viewport detection (isMobile, isTablet, isDesktop)
│   │   └── useToast.ts              # Convenience hook for showSuccess / showError
│   ├── navigation/
│   │   └── Navigation.tsx           # Route guarding, direct URL security & loaders
│   ├── screens/
│   │   ├── LoginScreen.tsx          # Composed sign-in screen
│   │   └── DashboardScreen.tsx      # Composed protected dashboard
│   ├── services/
│   │   ├── authService.ts           # Domain validation, Google OAuth & immediate signout
│   │   └── firestoreService.ts      # Firestore profile sync, audit logs & role changes
│   ├── theme/
│   │   └── colors.ts                # Professional color tokens & status palettes
│   └── types/
│       └── auth.ts                  # TypeScript interfaces & types
├── test-domain.js                   # Automated verification script for domain security
├── firestore.rules                  # Production Firestore backend security rules
├── netlify.toml                     # Netlify deployment build & SPA redirect config
├── app.json                         # Expo application metadata (Web, iOS, Android)
├── package.json                     # Dependencies and execution scripts
├── .env.example                     # Environment configuration template
└── App.tsx                          # Root application with ToastProvider & AuthProvider
```

---

## 🔒 Security Architecture

### 1. Multi-Layer Domain Enforcement
Domain security is enforced at every layer of the architecture:

```
[ User Initiates Google OAuth ]
               │
               ▼
   [ Firebase Google Sign-In ]
               │
               ▼
    [ Domain Validation Guard ]
               │
      Is email ending with
         @hbplus.fit?
        /            \
      NO              YES
      /                 \
[ Immediate Sign Out ]   [ Sync to Firestore users/{uid} ]
[ Purge Local Session ]  [ Fetch Assigned Role (Admin/User) ]
[ Throw Exact Error:  ]  [ Grant Access to Protected Dashboard ]
  "Access restricted.
   Please login using
   your official domain email."
```

### 2. Backend Security Rules (`firestore.rules`)
Frontend checks are backed by strict Firebase Firestore security rules ensuring that even forged direct API requests cannot read or write data unless the verified token email ends with `@hbplus.fit`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }

    // Verify email domain ends with @hbplus.fit
    function isHbPlusEmail() {
      return isAuthenticated() &&
             request.auth.token.email != null &&
             request.auth.token.email.matches('.*@hbplus[.]fit$');
    }

    // Role check: custom claim or Firestore user role
    function isAdmin() {
      return isHbPlusEmail() && (
        request.auth.token.admin == true ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }

    match /users/{userId} {
      allow read: if isHbPlusEmail();
      allow create, update: if isHbPlusEmail() &&
                               request.auth.uid == userId &&
                               request.resource.data.email.matches('.*@hbplus[.]fit$');
      allow delete: if isAdmin();
    }
  }
}
```

---

## ⚙️ Prerequisites & Setup

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd hbplus-auth-app

# Install dependencies
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your Firebase credentials in `.env`:

```env
# Firebase Configuration (From Firebase Console -> Project Settings -> General)
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyYourActualApiKeyHere123456
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Domain Enforcement
EXPO_PUBLIC_ALLOWED_DOMAIN=@hbplus.fit

# Google OAuth 2.0 Web Client ID
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Initial Super Administrators (Comma separated list)
EXPO_PUBLIC_INITIAL_ADMIN_EMAILS=admin@hbplus.fit,lead@hbplus.fit
```

---

## 🔥 Firebase & Google OAuth Configuration Guide

### Step 1: Create a Firebase Project
1. Navigate to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project**, enter project name (e.g., `hbplus-auth-portal`), and continue.
3. Under **Project Settings (Gear Icon) > General**, click the Web icon (`</>`) to create a Web app.
4. Copy the `firebaseConfig` keys into your `.env` file.

### Step 2: Enable Google Authentication
1. In the Firebase console left menu, go to **Build > Authentication**.
2. Click **Get Started**, then click **Sign-in method**.
3. Select **Google** from the list of providers:
   - Enable the toggle.
   - Set the **Project public-facing name** (e.g., `HB+ Fit`).
   - Select a project support email.
   - Click **Save**.
4. Under **Authentication > Settings > Authorized domains**, add:
   - `localhost`
   - Your Netlify production domain (e.g., `hbplus-auth.netlify.app`).

### Step 3: Create Firestore Database
1. Go to **Build > Firestore Database** and click **Create database**.
2. Choose **Production mode** and pick your preferred region (e.g., `us-central1`).
3. Click on the **Rules** tab and paste the contents of `firestore.rules` from this repository, then click **Publish**.

---

## 🚀 Running the Application

### 1. Run on Web
To start the development server for web browsers:

```bash
npm run web
```
The application will launch at `http://localhost:8081` (or your assigned Metro port).

### 2. Run on Android
To launch on an Android emulator or connected device:

```bash
npm run android
```

### 3. Run on iOS
To launch in the iOS Simulator (macOS required):

```bash
npm run ios
```

Or run the universal development server:
```bash
npm start
```
Scan the QR code with the **Expo Go** app on your physical iOS or Android device.

---

## 🧪 Automated Security & Domain Tests

Run the domain verification test suite:

```bash
npm test
```

Expected output:
```text
====================================================
HB+ Fit Domain Authorization Security Test Runner
Target Whitelist Domain: @hbplus.fit
Required Error Text: "Access restricted. Please login using your official domain email."
====================================================

[PASS] Official team member: "sarah.connor@hbplus.fit" -> Valid = true
[PASS] Case-insensitive domain: "ADMIN@HBPLUS.FIT" -> Valid = true
[PASS] Plus-aliased email: "athlete.lead+test@hbplus.fit" -> Valid = true
[PASS] Gmail user (Must be rejected): "baduser@gmail.com" -> Valid = false
[PASS] Yahoo user (Must be rejected): "hacker@yahoo.com" -> Valid = false
[PASS] Subdomain spoofing attack (Must be rejected): "spoof@hbplus.fit.evil.com" -> Valid = false
[PASS] Prefix match spoof (Must be rejected): "fakehbplus.fit@outlook.com" -> Valid = false
[PASS] Alternative TLD .org (Must be rejected): "athlete@hbplus.org" -> Valid = false
[PASS] Empty email (Must be rejected): "" -> Valid = false
[PASS] Null email (Must be rejected): "null" -> Valid = false
[PASS] Undefined email (Must be rejected): "undefined" -> Valid = false

Testing direct session enforcement error string...
[PASS] Exact error matched: "Access restricted. Please login using your official domain email."

====================================================
Summary: 12 Passed, 0 Failed
====================================================
ALL SECURITY & DOMAIN SPECIFICATIONS VERIFIED.
```

---

## 🌐 Netlify Deployment

This repository includes a pre-configured `netlify.toml` file with Single Page Application (SPA) rewrite rules and HTTP security headers.

### Option 1: Automatic Deployment via Git (Recommended)
1. Push your repository to **GitHub / GitLab / Bitbucket**.
2. Log in to [Netlify](https://app.netlify.com/).
3. Click **Add new site > Import an existing project**.
4. Select your repository. Netlify automatically detects settings from `netlify.toml`:
   - **Build Command**: `npm run build:web`
   - **Publish Directory**: `dist`
5. In **Site Configuration > Environment Variables**, add all `EXPO_PUBLIC_*` variables from your `.env` file.
6. Click **Deploy Site**.

### Option 2: Manual Build & Deploy via Netlify CLI
```bash
# 1. Build the production web bundle
npm run build:web

# 2. Deploy to Netlify
npx netlify deploy --dir=dist --prod
```

### Direct URL Rewrite Verification
When visiting direct paths such as `https://your-site.netlify.app/dashboard`, Netlify uses the rule:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```
The React Native client router will securely check the session:
- If unauthenticated: instantly redirects to `/login`.
- If authenticated: renders the protected `/dashboard`.

---

## 🛡️ License

This project is licensed under the MIT License. Designed and engineered for **HB+ Fit**.
