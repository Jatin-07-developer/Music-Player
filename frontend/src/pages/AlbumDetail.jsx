import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import * as musicApi from '../api/music'
import TrackRow from '../components/TrackRow'

export default function AlbumDetail() {
  const { albumId } = useParams()
  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    musicApi
      .getAlbumById(albumId)
      .then(({ data }) => setAlbum(data.album))
      .catch((err) => setError(err.response?.data?.message || 'Could not load this album.'))
      .finally(() => setLoading(false))
  }, [albumId])

  if (loading) return <p className="status-msg">Loading album…</p>
  if (error) return <p className="status-msg error">{error}</p>
  if (!album) return null

  const tracks = (album.musics || []).map((m) => ({
    id: m._id,
    title: m.title,
    uri: m.uri,
    artist: album.artist?.username || 'Unknown artist',
  }))

  return (
    <div>
      <Link to="/albums" className="page-eyebrow" style={{ textDecoration: 'none' }}>
        ← Back to albums
      </Link>
      <h1 className="page-title">{album.title}</h1>
      <p className="page-sub">{album.artist?.username || 'Unknown artist'}</p>

      {tracks.length === 0 ? (
        <div className="empty-state">This album has no tracks yet.</div>
      ) : (
        <div className="tracklist">
          {tracks.map((t, i) => (
            <TrackRow key={t.id} index={i} track={t} />
          ))}
        </div>
      )}
    </div>
  )
}
