import { useEffect, useState } from 'react'
import * as musicApi from '../api/music'
import TrackRow from '../components/TrackRow'

export default function Home() {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    musicApi
      .getAllMusics()
      .then(({ data }) => {
        const mapped = data.musics.map((m) => ({
          id: m._id,
          title: m.title,
          uri: m.uri,
          artist: m.artist?.username || 'Unknown artist',
        }))
        setTracks(mapped)
      })
      .catch((err) => setError(err.response?.data?.message || 'Could not load tracks.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <p className="page-eyebrow">Now streaming</p>
      <h1 className="page-title">Tracks</h1>
      <p className="page-sub">Freshly uploaded tracks from artists on Groove.</p>

      {loading && <p className="status-msg">Loading tracks…</p>}
      {error && <p className="status-msg error">{error}</p>}

      {!loading && !error && tracks.length === 0 && (
        <div className="empty-state">No tracks yet. Once an artist uploads something, it'll show up here.</div>
      )}

      {!loading && tracks.length > 0 && (
        <div className="tracklist">
          {tracks.map((t, i) => (
            <TrackRow key={t.id} index={i} track={t} />
          ))}
        </div>
      )}
    </div>
  )
}
