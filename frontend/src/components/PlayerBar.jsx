import { usePlayer } from '../context/PlayerContext'

export default function PlayerBar() {
  const { current, isPlaying, togglePlay } = usePlayer()

  if (!current) return null

  return (
    <div className="player-bar">
      <div className={`disc${isPlaying ? ' spinning' : ''}`} />
      <div className="player-meta">
        <div className="player-track">{current.title}</div>
        <div className="player-artist">{current.artist}</div>
      </div>
      <div className="player-controls">
        <button className="play-toggle" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? '❚❚' : '▶'}
        </button>
      </div>
    </div>
  )
}
