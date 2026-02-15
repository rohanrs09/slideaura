# 🔥 Firebase Setup Guide - Fix "Client is Offline" Error

## 🚨 Current Issue
```
FirebaseError: Failed to get document because the client is offline
```

This error means **Firestore database is not properly configured**.

---

## ✅ Step-by-Step Fix

### **Step 1: Check Firebase Console**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **aigen-b3e60**
3. Look at the left sidebar

---

### **Step 2: Create Firestore Database**

#### If you see "Create Database" button:

1. Click **"Firestore Database"** in left menu
2. Click **"Create Database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location (e.g., `us-central1`)
5. Click **"Enable"**

#### If Firestore already exists:

1. Click **"Firestore Database"**
2. You should see your collections

---

### **Step 3: Set Firestore Rules (IMPORTANT)**

1. In Firestore Database, click **"Rules"** tab
2. Replace with these **test rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all reads and writes (TEST MODE ONLY)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **"Publish"**

⚠️ **Note**: These rules allow all access. Use only for development!

---

### **Step 4: Verify Firebase Configuration**

Check your `.env` file has the correct API key:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key_here
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
```

#### Get your Firebase API Key:

1. Firebase Console → Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Find "Web app" or create one
4. Copy the `apiKey` value
5. Paste it in your `.env` file

---

### **Step 5: Check Firestore Database Name**

In `FirebaseConfig.ts`, line 41:

```typescript
export const firebaseDb = getFirestore(app,'ai-ppt-gen');
```

The database name is `'ai-ppt-gen'`.

#### Verify this database exists:

1. Firebase Console → Firestore Database
2. Check the dropdown at the top
3. You should see `(default)` or `ai-ppt-gen`

#### If database doesn't exist:

Change line 41 to use default database:

```typescript
export const firebaseDb = getFirestore(app); // Remove 'ai-ppt-gen'
```

---

### **Step 6: Test Connection**

1. Stop your dev server (`Ctrl+C`)
2. Clear browser cache and storage:
   - Open DevTools (F12)
   - Right-click refresh button → "Empty Cache and Hard Reload"
3. Restart dev server:
   ```bash
   npm run dev
   ```

---

## 🔍 Common Issues & Solutions

### Issue 1: "404 firebase.googleapis.com"

**Cause**: Wrong project ID or Firestore not enabled

**Fix**:
- Enable Firestore Database (Step 2)
- Verify `projectId` in FirebaseConfig matches Firebase Console

---

### Issue 2: "Permission Denied"

**Cause**: Firestore rules too restrictive

**Fix**:
- Set test mode rules (Step 3)
- Make sure rules are published

---

### Issue 3: "API Key Invalid"

**Cause**: Wrong or missing API key

**Fix**:
- Copy API key from Firebase Console
- Update `.env` file
- Restart dev server

---

## 🎯 Production Firestore Rules

When deploying to production, use proper security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.token.email == userId;
    }
    
    // Projects collection
    match /projects/{projectId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        resource.data.createdBy == request.auth.token.email;
    }
  }
}
```

---

## ✅ Verification Checklist

- [ ] Firestore Database is created
- [ ] Firestore Rules are set to test mode
- [ ] `.env` file has correct `VITE_FIREBASE_API_KEY`
- [ ] Database name matches in `FirebaseConfig.ts`
- [ ] Dev server restarted
- [ ] Browser cache cleared
- [ ] No console errors about Firebase

---

## 🆘 Still Not Working?

### Check Console Logs:

Look for these specific errors:

1. **"VITE_FIREBASE_API_KEY is required"**
   - Your `.env` file is missing or not loaded
   - Create `.env` file in project root
   - Add `VITE_FIREBASE_API_KEY=your_key`

2. **"@firebase/firestore: Firestore (10.x.x): Could not reach Cloud Firestore backend"**
   - Firestore not enabled
   - Wrong project ID
   - Network/firewall blocking Firebase

3. **"Missing or insufficient permissions"**
   - Firestore rules too strict
   - Set test mode rules

---

## 📞 Need Help?

If still having issues, provide:
1. Screenshot of Firestore Database page
2. Your `firebaseConfig` (hide API key)
3. Full error message from console
4. Result of running: `console.log(import.meta.env.VITE_FIREBASE_API_KEY)`
