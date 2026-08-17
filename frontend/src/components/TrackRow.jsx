import { usePlayer } from '../context/PlayerContext'

export default function TrackRow({ index, track }) {
  const { current, isPlaying, play, togglePlay } = usePlayer()
  const isCurrent = current?.id === track.id
  const showPause = isCurrent && isPlaying

  const handleClick = () => {
    if (isCurrent) togglePlay()
    else play(track)
  }

  return (
    <div className={`track-row${isCurrent ? ' playing' : ''}`}>
      <span className="track-num">{String(index + 1).padStart(2, '0')}</span>
      <div>
        <div className="track-title">{track.title}</div>
        <div className="track-artist">{track.artist}</div>
      </div>
      <span />
      <button className="track-play-btn" onClick={handleClick} aria-label={showPause ? 'Pause' : 'Play'}>
        {showPause ? '❚❚' : '▶'}
      </button>
    </div>
  )
}
