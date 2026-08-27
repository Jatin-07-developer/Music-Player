import { useNavigate } from "react-router-dom";
import { coverGradient } from "../utils/cover";

export default function AlbumCard({ album }) {
  const navigate = useNavigate();

  return (
    <div className="album-card" onClick={() => navigate(`/albums/${album._id}`)}>
      <div className="album-sleeve" style={{ background: coverGradient(album.title + album._id) }}>
        <div className="album-vinyl-peek" />
        <div className="album-sleeve-label">{album.title}</div>
      </div>
      <div className="album-name">{album.title}</div>
      <div className="album-artist">{album.artist?.username || "Unknown artist"}</div>
    </div>
  );
}
