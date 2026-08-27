import { createContext, useContext, useEffect, useRef, useState } from "react";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [track, setTrack] = useState(null); // { id, title, uri, artistName }
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => playNextInQueue();
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, track]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  function playTrack(t, contextQueue = null) {
    if (contextQueue) setQueue(contextQueue);
    setTrack(t);
    setIsPlaying(true);
    requestAnimationFrame(() => {
      if (audioRef.current) {
        audioRef.current.src = t.uri;
        audioRef.current.play().catch(() => {});
      }
    });
  }

  function togglePlay() {
    if (!track) return;
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }

  function seek(time) {
    if (audioRef.current) audioRef.current.currentTime = time;
    setProgress(time);
  }

  function playNextInQueue() {
    if (!queue.length || !track) {
      setIsPlaying(false);
      return;
    }
    const idx = queue.findIndex((q) => q.id === track.id);
    const next = queue[idx + 1];
    if (next) playTrack(next, queue);
    else setIsPlaying(false);
  }

  function playPrevInQueue() {
    if (!queue.length || !track) return;
    const idx = queue.findIndex((q) => q.id === track.id);
    const prev = queue[idx - 1];
    if (prev) playTrack(prev, queue);
    else seek(0);
  }

  return (
    <PlayerContext.Provider
      value={{
        track,
        isPlaying,
        progress,
        duration,
        volume,
        setVolume,
        playTrack,
        togglePlay,
        seek,
        playNextInQueue,
        playPrevInQueue,
      }}
    >
      {children}
      <audio ref={audioRef} preload="metadata" />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
