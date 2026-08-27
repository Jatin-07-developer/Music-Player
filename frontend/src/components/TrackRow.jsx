import { usePlayer } from "../context/PlayerContext";
import { coverGradient } from "../utils/cover";

export default function TrackRow({ index, music, queue }) {
  const { track, isPlaying, playTrack, togglePlay } = usePlayer();
  const isCurrent = track?.id === music._id;

  function handleClick() {
    if (isCurrent) {
      togglePlay();
      return;
    }
    playTrack(
      {
        id: music._id,
        title: music.title,
        uri: music.uri,
        artistName: music.artist?.username,
      },
      queue.map((m) => ({
        id: m._id,
        title: m.title,
        uri: m.uri,
        artistName: m.artist?.username,
      }))
    );
  }

  return (
    <div className={`track-row ${isCurrent && isPlaying ? "playing" : ""}`} onClick={handleClick}>
      <div className="track-index">
        {isCurrent && isPlaying ? (
          <span className="vu-mini">
            <span />
            <span />
            <span />
          </span>
        ) : (
          <span>{index + 1}</span>
        )}
        <span className="track-play-hover" aria-hidden>
          {isCurrent && isPlaying ? "❚❚" : "▶"}
        </span>
      </div>
      <div className="track-art" style={{ background: coverGradient(music._id) }} />
      <div>
        <div className="track-title">{music.title}</div>
        <div className="track-artist">{music.artist?.username || "Unknown artist"}</div>
      </div>
      <div className="track-badge">{music.artist?.role || "artist"}</div>
      <div className="track-time">▸</div>
    </div>
  );
}
