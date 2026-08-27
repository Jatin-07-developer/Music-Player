import { useState } from "react";
import { musicApi } from "../api/client";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const [toast, setToast] = useState("");

  const [sessionTracks, setSessionTracks] = useState([]); // tracks uploaded this session, for album building
  const [albumTitle, setAlbumTitle] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [albumBusy, setAlbumBusy] = useState(false);
  const [albumErr, setAlbumErr] = useState("");

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;
    setUploadErr("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("music", file);
      const { data } = await musicApi.uploadMusic(fd);
      setSessionTracks((t) => [data.music, ...t]);
      setTitle("");
      setFile(null);
      showToast(`"${data.music.title}" is pressed and live.`);
    } catch (err) {
      setUploadErr(err.response?.data?.message || "Upload failed. Try a different file or title.");
    } finally {
      setUploading(false);
    }
  }

  function toggleTrack(id) {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }

  async function handleCreateAlbum(e) {
    e.preventDefault();
    if (!albumTitle || selectedIds.length === 0) return;
    setAlbumErr("");
    setAlbumBusy(true);
    try {
      await musicApi.createAlbum({ title: albumTitle, musicIds: selectedIds });
      showToast(`Album "${albumTitle}" pressed with ${selectedIds.length} track(s).`);
      setAlbumTitle("");
      setSelectedIds([]);
    } catch (err) {
      setAlbumErr(err.response?.data?.message || "Couldn't press that album.");
    } finally {
      setAlbumBusy(false);
    }
  }

  return (
    <div>
      <p className="page-eyebrow">Studio</p>
      <h1 className="page-title">Press something new</h1>
      <p className="page-sub">
        Upload a track, then group your session's uploads into an album. Waveline only lets you build
        albums from tracks you've just pressed here — keep this tab open while you work.
      </p>

      <div className="upload-grid">
        <div className="upload-card">
          <h3>Upload a track</h3>
          <p className="hint">MP3, WAV, or whatever your masters export.</p>
          <form onSubmit={handleUpload}>
            <div className="field">
              <label>Track title</label>
              <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Midnight Static" />
            </div>
            <div className="field">
              <label>Audio file</label>
              <div className={`dropzone ${file ? "has-file" : ""}`}>
                {file ? `♪ ${file.name}` : "Choose an audio file to attach"}
                <input
                  required
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  style={{ display: "block", marginTop: 10, width: "100%" }}
                />
              </div>
            </div>
            {uploadErr && <div className="auth-error">{uploadErr}</div>}
            <button className="btn btn-primary" style={{ width: "100%" }} disabled={uploading}>
              {uploading ? "Pressing…" : "Upload track"}
            </button>
          </form>
        </div>

        <div className="upload-card">
          <h3>Build an album</h3>
          <p className="hint">Pick from what you've uploaded this session.</p>
          <form onSubmit={handleCreateAlbum}>
            <div className="field">
              <label>Album title</label>
              <input
                required
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                placeholder="Late Night Frequencies"
              />
            </div>

            {sessionTracks.length === 0 ? (
              <p className="hint">Upload a track on the left to see it here.</p>
            ) : (
              <div className="chip-list">
                {sessionTracks.map((t) => (
                  <div
                    key={t.id}
                    className="chip"
                    style={{
                      borderColor: selectedIds.includes(t.id) ? "var(--amber)" : undefined,
                      color: selectedIds.includes(t.id) ? "var(--amber-soft)" : undefined,
                      cursor: "pointer",
                    }}
                    onClick={() => toggleTrack(t.id)}
                  >
                    {selectedIds.includes(t.id) ? "✓ " : ""}
                    {t.title}
                  </div>
                ))}
              </div>
            )}

            {albumErr && <div className="auth-error">{albumErr}</div>}
            <button
              className="btn btn-primary"
              style={{ width: "100%" }}
              disabled={albumBusy || selectedIds.length === 0}
            >
              {albumBusy ? "Pressing album…" : `Create album (${selectedIds.length} selected)`}
            </button>
          </form>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
