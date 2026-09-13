# Cute Teddy Love – Fast Admin v5

## Files
- `index.html` – public love question page
- `admin.html` – private response dashboard
- `app.js` / `admin.js` – Firebase logic
- `firestore.rules` – response write/read rules

## Admin
Open `/admin.html` and sign in with the authorized Google account configured in `admin.js`.

## Firebase checklist
1. Firebase Console → Authentication → Sign-in method → Google → Enable.
2. Authentication → Settings → Authorized domains → add your GitHub Pages domain (for example `sandip2007mukherjee-lgtm.github.io`).
3. Firestore Database → create the database if it does not exist.
4. Firestore Database → Rules → paste the supplied `firestore.rules` and Publish.
5. Confirm that the admin Google account email exactly matches the email in `admin.js`.
6. Test the public page once, then open `/admin.html` and sign in again.

## Why this version is faster
The dashboard no longer uses Firestore `orderBy('createdAt')`, so it does not depend on a Firestore index/query ordering. Responses are sorted in the browser instead. It also shows a useful Firebase error instead of staying on “Loading responses…” forever.
