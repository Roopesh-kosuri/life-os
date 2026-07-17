import { useState, useMemo } from 'react'
import { Music, ExternalLink } from 'lucide-react'
import { workoutPlaylist } from '../../data/defaults'
import Button from '../ui/Button'

export default function MusicButtons() {
  const [showPanel, setShowPanel] = useState(false)
  
  const randomSong = useMemo(() => {
    return workoutPlaylist[Math.floor(Math.random() * workoutPlaylist.length)]
  }, [])

  const spotifyUrl = `https://open.spotify.com/search/${encodeURIComponent(randomSong.title + ' ' + randomSong.artist)}`
  const appleMusicUrl = `https://music.apple.com/us/search?term=${encodeURIComponent(randomSong.title + ' ' + randomSong.artist)}`

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowPanel(!showPanel)}
        className="w-9 h-9 rounded-full cursor-pointer"
      >
        <Music size={16} />
      </Button>

      {showPanel && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowPanel(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-[var(--bg-surface)] border border-[var(--border-main)] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.15)] p-4 animate-fade-in-up">
            <p className="text-xs text-[var(--text-secondary)] mb-1">Today's workout track</p>
            <p className="font-semibold text-sm mb-0.5">{randomSong.title}</p>
            <p className="text-xs text-[var(--text-secondary)] mb-3">{randomSong.artist}</p>
            
            <div className="flex gap-2">
              <a
                href={spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#1DB954]/10 text-[#1DB954] border border-[#1DB954]/20 hover:bg-[#1DB954]/20 transition-colors"
              >
                <span>Spotify</span>
                <ExternalLink size={11} />
              </a>
              <a
                href={appleMusicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#FA2D48]/10 text-[#FA2D48] border border-[#FA2D48]/20 hover:bg-[#FA2D48]/20 transition-colors"
              >
                <span>Apple</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

