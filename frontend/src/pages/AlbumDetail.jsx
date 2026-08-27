import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { musicApi } from "../api/client";
import TrackRow from "../components/TrackRow";
import { coverGradient } from "../utils/cover";

export default function AlbumDetail() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    musicApi
      .getAlbumById(albumId)
      .then(({ data }) => alive && setAlbum(data.album))
      .catch((e) => alive && setErr(e.response?.data?.message || "Couldn't load this album."))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [albumId]);

  if (loading) {
    return (
      <div className="empty-state">
        <div className="spinner" style={{ margin: "0 auto 14px" }} />
        Dropping the needle…
      </div>
    );
  }

  if (err || !album) {
    return (
      <div className="empty-state">
        <div className="needle">✕</div>
        {err || "Album not found."}
        <div style={{ marginTop: 16 }}>
          <Link to="/albums" className="btn btn-ghost">
            ← Back to albums
          </Link>
        </div>
      </div>
    );
  }

  const musics = album.musics || [];

  return (
    <div>
      <div style={{ display: "flex", gap: 26, alignItems: "flex-end", marginBottom: 30 }}>
        <div
          className="album-sleeve"
          style={{ width: 180, height: 180, background: coverGradient(album.title + album._id) }}
        >
          <div className="album-vinyl-peek" />
        </div>
        <div>
          <p className="page-eyebrow">Album</p>
          <h1 className="page-title" style={{ fontSize: 38, marginBottom: 6 }}>
            {album.title}
          </h1>
          <p className="page-sub" style={{ margin: 0 }}>
            {album.artist?.username || "Unknown artist"} · {musics.length} track{musics.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {musics.length === 0 ? (
        <div className="empty-state">
          <div className="needle">♪</div>
          No tracks on this pressing yet.
        </div>
      ) : (
        <div className="track-list">
          {musics.map((m, i) => (
            <TrackRow key={m._id} index={i} music={{ ...m, artist: m.artist || album.artist }} queue={musics} />
          ))}
        </div>
      )}
    </div>
  );
}
