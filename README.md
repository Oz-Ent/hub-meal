# Hub-Meal

## Environment setup

Create a `.env.local` in the project root (not committed) with your Firebase config:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

You can use `.env.example` as a template.

## Development

- `npm run dev`
- `npm run build`
- `npm run preview`

## Security

- No secrets in source: Firebase config is loaded from environment variables.
- Hosting headers enforce CSP, X-Frame-Options, and nosniff. Adjust CSP if adding new third-party origins.
- Avoid logging sensitive data. Do not store tokens in localStorage; rely on Firebase SDK session handling.
