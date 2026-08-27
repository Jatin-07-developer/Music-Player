import { useEffect, useState } from "react";
import { musicApi } from "../api/client";
import AlbumCard from "../components/AlbumCard";

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    musicApi
      .getAllAlbums()
      .then(({ data }) => alive && setAlbums(data.albums || []))
      .catch((e) => alive && setErr(e.response?.data?.message || "Couldn't load albums."))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div>
      <p className="page-eyebrow">The crate</p>
      <h1 className="page-title">Albums</h1>
      <p className="page-sub">Full-length pressings from every artist on Waveline.</p>

      {loading && (
        <div className="empty-state">
          <div className="spinner" style={{ margin: "0 auto 14px" }} />
          Flipping through the crate…
        </div>
      )}

      {!loading && err && <div className="empty-state">{err}</div>}

      {!loading && !err && albums.length === 0 && (
        <div className="empty-state">
          <div className="needle">♫</div>
          No albums pressed yet.
        </div>
      )}

      {!loading && albums.length > 0 && (
        <div className="album-grid">
          {albums.map((a) => (
            <AlbumCard key={a._id} album={a} />
          ))}
        </div>
      )}
    </div>
  );
}
