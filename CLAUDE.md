# Child Tax Credit Calculator

React + Mantine v8 + Recharts frontend with a Modal (policyengine-us) API backend.

## Architecture

- `frontend/` - Vite React-TS app with Mantine v8 UI and Recharts
- `api/modal_app.py` - Modal serverless function using policyengine-us for CTC calculations

## Development

```bash
cd frontend
npm install
npm run dev
```

## Testing

```bash
cd frontend
npx vitest run
```

## Build

```bash
cd frontend
npm run build
```

## Deploy

### Frontend (Vercel)
Vercel config is at repo root (`vercel.json`). Deploys `frontend/dist`.

### API (Modal)
```bash
unset MODAL_TOKEN_ID MODAL_TOKEN_SECRET
modal deploy api/modal_app.py
```

Set `VITE_API_URL` env var in Vercel to point to the Modal endpoint.

## Design standards
- Primary teal: #319795
- Font: Inter
- Mantine v8 components
- Sentence case for all headings
