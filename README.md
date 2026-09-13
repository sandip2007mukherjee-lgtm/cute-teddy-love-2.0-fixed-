# Cute Teddy Love – Fast GitHub Pages build

## Files
- `index.html` – public love question page
- `admin.html` – private response dashboard
- `app.js` / `admin.js` – Firebase logic
- `firestore.rules` – response write/read rules

## Admin
Open `/admin.html` on the same GitHub Pages site and sign in with the authorized Google account configured in `admin.js`.

The dashboard uses a realtime Firestore listener, so new names/responses appear automatically without repeatedly reloading the page.
