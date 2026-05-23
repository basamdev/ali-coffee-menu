# Firebase Debug & Recovery Instructions

This file contains exact rule snippets and step-by-step instructions to test and fix Storage/Firestore upload problems. Follow only the steps marked **DEBUG** for short-term testing, then revert to the secure rules shown below.

---

## 1) Quick permissive rules (DEBUG only)

Paste these temporarily to allow all reads/writes while testing uploads.

Firestore (DEBUG):

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}

Storage (DEBUG):

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}

**How to apply:**
- Open Firebase Console → Project → Firestore → Rules (or Storage → Rules).
- Replace the content with the snippets above and click **Publish**.
- Test the `Save Item` behavior in your admin UI.

**Important:** DO NOT leave these rules published — they make your project public.

---

## 2) Secure rules to revert to (recommended)

Firestore (authenticated writes only):

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}

Storage (authenticated writes only):

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write: if request.auth != null;
    }
  }
}

Optional: restrict Storage writes to `menu-items/` path only:

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /menu-items/{allPaths=**} {
      allow read;
      allow write: if request.auth != null;
    }
    match /{allPaths=**} {
      allow read;
      allow write: if false;
    }
  }
}

---

## 3) Testing checklist

1. Open admin UI → Manage Items → Add New Item.
2. Open DevTools (F12) → Console.
3. Click `Log Firebase Status` (button in the admin UI). Copy the logged object and paste it here or send it to your developer.
4. Add image + Save Item.
   - Copy the `#uploadStatus` text visible in the modal.
   - Copy any console error (code + message + stack).
   - In DevTools → Network, find the failed Storage request and copy its response and status.
5. If the permissive rules made uploads succeed, revert to the secure rules above and implement a proper auth-based rule (the `request.auth != null` rules).

---

## 4) Common causes & quick checks

- Wrong `storageBucket` value in your Firebase config (should be `PROJECT_ID.appspot.com`).
- Storage rules denying writes for unauthenticated users.
- Cloud Storage API not enabled or project billing/quota issues.
- Browser blocked uploads (adblocker, network proxy, blocked third-party requests).

---

If you'd like, I can prepare a secure rule that allows writes only from a specific admin UID — provide the admin UID and I will create the snippet for you to paste.

