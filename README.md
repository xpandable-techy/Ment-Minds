# MentMinds

This is the MentMinds React app. Below are quick deployment notes for Vercel.

## Environment
- Copy `.env.example` to `.env` (or set Vercel project vars) and fill in:
	- `VITE_SUPABASE_URL`
	- `VITE_SUPABASE_ANON_KEY`

## Build
- Install dependencies: `npm install`
- Build: `npm run build`

On Vercel, set the framework to `Vite` / `Other` and the build command to `npm run build`.

## Notes
- Create a Supabase Storage bucket named `avatars` if using avatars upload.
- The app falls back to localStorage when Supabase is not configured for local development.