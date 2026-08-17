import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as musicApi from '../api/music'

export default function Albums() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    musicApi
      .getAllAlbums()
      .then(({ data }) => setAlbums(data.albums))
      .catch((err) => setError(err.response?.data?.message || 'Could not load albums.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <p className="page-eyebrow">Collections</p>
      <h1 className="page-title">Albums</h1>
      <p className="page-sub">Full releases, grouped by artist.</p>

      {loading && <p className="status-msg">Loading albums…</p>}
      {error && <p className="status-msg error">{error}</p>}

      {!loading && !error && albums.length === 0 && (
        <div className="empty-state">No albums yet.</div>
      )}

      {!loading && albums.length > 0 && (
        <div className="album-grid">
          {albums.map((a) => (
            <Link key={a._id} to={`/albums/${a._id}`} className="album-card">
              <div className="album-cover" />
              <div className="album-name">{a.title}</div>
              <div className="album-artist">{a.artist?.username || 'Unknown artist'}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
