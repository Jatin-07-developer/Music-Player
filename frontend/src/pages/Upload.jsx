import { useState } from 'react'
import * as musicApi from '../api/music'

export default function Upload() {
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState(null) // { type: 'success'|'error', text }
  const [submitting, setSubmitting] = useState(false)

  const [albumTitle, setAlbumTitle] = useState('')
  const [musicIds, setMusicIds] = useState('')
  const [albumStatus, setAlbumStatus] = useState(null)
  const [albumSubmitting, setAlbumSubmitting] = useState(false)

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) {
      setStatus({ type: 'error', text: 'Choose an audio file first.' })
      return
    }
    setSubmitting(true)
    setStatus(null)
    try {
      const { data } = await musicApi.uploadMusic({ title, file })
      setStatus({ type: 'success', text: `Uploaded — track id: ${data.music.id}` })
      setTitle('')
      setFile(null)
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Upload failed.' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateAlbum = async (e) => {
    e.preventDefault()
    setAlbumSubmitting(true)
    setAlbumStatus(null)
    try {
      const ids = musicIds
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      const { data } = await musicApi.createAlbum({ title: albumTitle, musicIds: ids })
      setAlbumStatus({ type: 'success', text: `Album "${data.music.title}" created.` })
      setAlbumTitle('')
      setMusicIds('')
    } catch (err) {
      setAlbumStatus({ type: 'error', text: err.response?.data?.message || 'Could not create album.' })
    } finally {
      setAlbumSubmitting(false)
    }
  }

  return (
    <div>
      <p className="page-eyebrow">Artist tools</p>
      <h1 className="page-title">Upload</h1>
      <p className="page-sub">Add a new track, then group your tracks into an album.</p>

      <div className="card" style={{ marginBottom: 28 }}>
        <form onSubmit={handleUpload}>
          <div className="field">
            <label htmlFor="track-title">Track title</label>
            <input id="track-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="track-file">Audio file</label>
            <label
              htmlFor="track-file"
              className={`file-drop${file ? ' has-file' : ''}`}
            >
              {file ? file.name : 'Click to choose an audio file'}
            </label>
            <input
              id="track-file"
              type="file"
              accept="audio/*"
              style={{ display: 'none' }}
              onChange={(e) => setFile(e.target.files[0] || null)}
            />
          </div>
          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Uploading…' : 'Upload track'}
          </button>
          {status && <p className={`status-msg ${status.type}`}>{status.text}</p>}
        </form>
      </div>

      <div className="card">
        <form onSubmit={handleCreateAlbum}>
          <div className="field">
            <label htmlFor="album-title">Album title</label>
            <input id="album-title" value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="music-ids">Track IDs</label>
            <input
              id="music-ids"
              value={musicIds}
              onChange={(e) => setMusicIds(e.target.value)}
              placeholder="comma-separated track ids from uploads above"
              required
            />
          </div>
          <button className="btn-primary" type="submit" disabled={albumSubmitting}>
            {albumSubmitting ? 'Creating…' : 'Create album'}
          </button>
          {albumStatus && <p className={`status-msg ${albumStatus.type}`}>{albumStatus.text}</p>}
        </form>
      </div>
    </div>
  )
}
