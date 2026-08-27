import { usePlayer } from "../context/PlayerContext";
import { formatTime } from "../utils/cover";

export default function PlayerBar() {
  const {
    track,
    isPlaying,
    progress,
    duration,
    volume,
    setVolume,
    togglePlay,
    seek,
    playNextInQueue,
    playPrevInQueue,
  } = usePlayer();

  function handleScrub(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(Math.max(0, Math.min(1, ratio)) * (duration || 0));
  }

  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="player-bar">
      <div className="player-now">
        <div className={`vinyl ${isPlaying ? "spinning" : ""}`} />
        {track ? (
          <div className="now-meta">
            <div className="now-title">{track.title}</div>
            <div className="now-artist">{track.artistName || "Unknown artist"}</div>
          </div>
        ) : (
          <div className="now-empty">Nothing spinning yet</div>
        )}
      </div>

      <div className="player-center">
        <div className="transport">
          <button className="transport-btn" onClick={playPrevInQueue} aria-label="Previous" disabled={!track}>
            ⏮
          </button>
          <button className="transport-btn play" onClick={togglePlay} aria-label="Play / Pause" disabled={!track}>
            {isPlaying ? "❚❚" : "▶"}
          </button>
          <button className="transport-btn" onClick={playNextInQueue} aria-label="Next" disabled={!track}>
            ⏭
          </button>
        </div>
        <div className="scrub-row">
          <span className="time-label">{formatTime(progress)}</span>
          <div className="scrub-track" onClick={handleScrub}>
            <div className="scrub-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="time-label right">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-right">
        <div className={`vu-live ${isPlaying ? "" : "paused"}`}>
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="volume-row">
          <span style={{ fontSize: 13, color: "var(--cream-faint)" }}>🔉</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: "var(--amber)" }}
          />
        </div>
      </div>
    </div>
  );
}
