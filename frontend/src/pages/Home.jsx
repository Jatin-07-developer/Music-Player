import { useEffect, useState } from "react";
import { musicApi } from "../api/client";
import TrackRow from "../components/TrackRow";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    musicApi
      .getAllMusics()
      .then(({ data }) => alive && setMusics(data.musics || []))
      .catch((e) => alive && setErr(e.response?.data?.message || "Couldn't load the library."))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div>
      <p className="page-eyebrow">On the air</p>
      <h1 className="page-title">Evening, {user?.username}.</h1>
      <p className="page-sub">
        Fresh cuts from the crate, queued up and ready to spin. Click any row to start playing.
      </p>

      <div className="section">
        <div className="section-head">
          <h2>Fresh cuts</h2>
          <span className="section-count">{musics.length} tracks</span>
        </div>

        {loading && (
          <div className="empty-state">
            <div className="spinner" style={{ margin: "0 auto 14px" }} />
            Cueing up the library…
          </div>
        )}

        {!loading && err && <div className="empty-state">{err}</div>}

        {!loading && !err && musics.length === 0 && (
          <div className="empty-state">
            <div className="needle">♪</div>
            Nothing's been pressed yet. Check back once an artist uploads a track.
          </div>
        )}

        {!loading && musics.length > 0 && (
          <div className="track-list">
            {musics.map((m, i) => (
              <TrackRow key={m._id} index={i} music={m} queue={musics} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
