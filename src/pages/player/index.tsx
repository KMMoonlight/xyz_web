import * as React from "react";
import AudioPlayer from "react-h5-audio-player";
import { useEffect, useRef, useState } from "react";
import { emitter } from "@/utils";
import "./player.scss";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import cosmos from "@/assets/cosmos.svg";
//import { api } from "@/utils/index";

const PlayerPage: React.FC = () => {
  const audioPlayerRef: any = useRef(null);
  const [audioSrc, setAudioSrc] = useState<string | undefined>(undefined);
  const [audioTitle, setAudioTitle] = useState<string>("");
  const [playbackRate, setPlaybackRate] = useState<string>("1");
  const [image, setImage] = useState<string>("");
  const [eid, setEid] = useState<string>("");
  const [pid, setPid] = useState<string>("");

  const handleSpeedChange = (speed: string) => {
    if (audioPlayerRef.current?.audio?.current) {
      audioPlayerRef.current.audio.current.playbackRate = Number(speed);
      setPlaybackRate(speed);
    }
  };

  const handlePlay = React.useCallback(
    ({
      url,
      title,
      image,
      eid,
      pid,
    }: {
      url: string;
      title: string;
      image: string;
      eid: string;
      pid: string;
    }) => {
      if (url) {
        setAudioSrc(url);
        setAudioTitle(title);
        setImage(image);
        setEid(eid);
        setPid(pid);
      }
    },
    []
  );

  // const updatePlaybackProgress = (e: any) => {
  //   const currentTime = Math.floor(e.target.currentTime);
  //   const data = {
  //     data: [
  //       {
  //         pid,
  //         eid,
  //         progress: currentTime,
  //         playedAt: new Date().toISOString(),
  //       },
  //     ],
  //   };
  //   api.apiUpdatePlaybackProgress(data);
  // };

  useEffect(() => {
    emitter.on("play", handlePlay as any);
    return () => emitter.off("play", handlePlay as any);
  }, []);

  return (
    <div className="w-[580px] bg-white border border-neutral-200 shadow-md rounded-md flex items-center mt-3">
      <div className="h-[60px] w-[60px] flex items-center justify-center rounded-md ml-2">
        {image && (
          <img src={image} alt="podcast" className="w-full h-full rounded-md" />
        )}
        {!image && (
          <img
            src={cosmos}
            alt="podcast"
            className="w-full h-full p-2 rounded-md"
          />
        )}
      </div>
      <div className="flex-1 relative flex flex-col items-center rounded">
        <div className="text-sm text-neutral-400 h-[26px] flex justify-center pt-[4px]">
          {audioTitle || "欢迎来探索小宇宙~"}
        </div>
        <div className="rounded-md w-full">
          <AudioPlayer
            ref={audioPlayerRef}
            src={audioSrc}
            autoPlay={true}
            showJumpControls={false}
            customAdditionalControls={[
              <div
                key="speed-control"
                className="absolute left-4 bottom-2 play-speed"
              >
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
            className="rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;
