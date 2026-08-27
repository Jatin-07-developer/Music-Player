# Waveline — frontend for your music backend

A React + Vite frontend built for your Express/Mongo backend (auth + music/album routes).
Theme: an analog late-night radio desk — deep plum-black chassis, warm amber tape-deck
accents, a spinning vinyl in the player bar, and VU-meter animations that react to playback.

## Setup

```bash
npm install
cp .env.example .env   # then edit VITE_API_URL to point at your backend
npm run dev
```

The app runs on **http://localhost:5173** by default — this matches the `FRONTEND_URL`
your backend's CORS config already falls back to, so as long as your backend is running
(with `MONGO_URI`, `JWT_SECRET`, and `IMAGEKIT_PRIVATE_KEY` set) and reachable at the
address in `.env`, everything should connect with no extra config.

## What's wired up

- **Auth** — `/api/auth/register` and `/api/auth/login` (username or email + password),
  with a role picker (listener vs artist) on sign-up, and `/api/auth/logout`. The backend
  sets an auth cookie, so every request goes through with `withCredentials: true`.
- **Library** — `GET /api/music` renders as a track list; click a row to play, click again
  to pause. The now-playing bar shows a spinning vinyl, scrub bar, volume, and a live
  VU meter.
- **Albums** — `GET /api/music/albums` renders as a sleeve grid; opening one calls
  `GET /api/music/albums/:albumId` and lists its tracks.
- **Artist studio** — visible only to `role: "artist"` accounts. Uploads a track via
  `POST /api/music/upload` (multipart, field name `music`), then lets you group your
  session's uploads into an album via `POST /api/music/album`.

## A heads-up about one backend quirk

`GET /api/music` is gated by `authUser`, which only allows `role: "user"` — so an artist
account can't call it to fetch their own back-catalog to build an album from. The Studio
page works around this by keeping a running list of whatever you upload in the current
session, so you can still select tracks and press an album without that endpoint. If you
open a fresh tab, that in-session list resets — re-upload or extend the backend with an
artist-scoped "my tracks" endpoint if you want persistence across sessions.

Also worth knowing: `getAllMusics` currently `.limit(2)` server-side, so the Library page
will only ever show two tracks at a time regardless of how many exist — that's a backend
setting, not a frontend bug.

## Cover art

There's no artwork field in your `music`/`album` schemas, so covers are generated
client-side as deterministic gradients (same title/id always produces the same sleeve).
Add an `artUrl` field to the schemas and swap in `<img>` tags in `AlbumCard`/`TrackRow`
whenever you're ready for real artwork.
