import * as React from 'react'
import AudioPlayer from 'react-h5-audio-player'
import { useEffect, useRef, useState } from 'react'
import { emitter } from '@/utils'
import './player.scss'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const PlayerPage: React.FC = () => {
  const audioPlayerRef = useRef(null)
  const [audioSrc, setAudioSrc] = useState<string | undefined>(undefined)
  const [audioTitle, setAudioTitle] = useState<string>('')
  const [playbackRate, setPlaybackRate] = useState<string>('1')

  const handleSpeedChange = (speed: string) => {
    if (audioPlayerRef.current?.audio?.current) {
      audioPlayerRef.current.audio.current.playbackRate = Number(speed)
      setPlaybackRate(speed)
    }
  }

  const handlePlay = React.useCallback(
    ({ url, title }: { url: string; title: string }) => {
      if (url) {
        setAudioSrc(url)
        setAudioTitle(title)
      }
    },
    []
  )

  useEffect(() => {
    emitter.on('play', handlePlay as any)
    return () => emitter.off('play', handlePlay as any)
  }, [])

  return (
    <div className="w-[980px] relative">
      <AudioPlayer
        ref={audioPlayerRef}
        src={audioSrc}
        customAdditionalControls={[
          <div key="speed-control">
            <Select
              onValueChange={handleSpeedChange}
              defaultValue={playbackRate}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Speed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1x</SelectItem>
                <SelectItem value="1.5">1.5x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
              </SelectContent>
            </Select>
          </div>,
        ]}
      />
      <div
        className="line-clamp-1 absolute bottom-5 left-28 w-[200px] text-sm text-neutral-400"
        title={audioTitle}
      >
        正在播放: {audioTitle}
      </div>
    </div>
  )
}

export default PlayerPage
