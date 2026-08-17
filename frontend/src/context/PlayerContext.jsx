import { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react'

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  const audioRef = useRef(null)
  const [current, setCurrent] = useState(null) // { id, title, artist, uri }
  const [isPlaying, setIsPlaying] = useState(false)

  if (!audioRef.current && typeof Audio !== 'undefined') {
    audioRef.current = new Audio()
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onEnded = () => setIsPlaying(false)
    audio.addEventListener('ended', onEnded)
    return () => audio.removeEventListener('ended', onEnded)
  }, [])

  const play = useCallback((track) => {
    const audio = audioRef.current
    if (!audio) return
    if (current?.id !== track.id) {
      audio.src = track.uri
      setCurrent(track)
    }
    audio.play()
    setIsPlaying(true)
  }, [current])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !current) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }, [isPlaying, current])

  return (
    <PlayerContext.Provider value={{ current, isPlaying, play, togglePlay }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider')
  return ctx
}
