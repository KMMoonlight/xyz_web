import { IUser, IPermission, IEpisode } from "@/types/type.ts";
import { emitter } from "@/utils";
import { Headphones, MessageSquareText, CirclePlay } from "lucide-react";
import * as React from "react";
import { useNavigate } from "react-router-dom";

interface DiscoveryEditorPickItem {
  episode: IEpisode;
  recentAudiences: IUser[];
  comment: {
    id: string;
    type: string;
    owner: {
      id: string;
      type: string;
    };
    author: IUser;
    authorAssociation: string;
    text: string;
    isFriendly: boolean;
    level: number;
    likeCount: number;
    liked: boolean;
    collected: false;
    createdAt: string;
    status: string;
    permissions: IPermission[];
    pid: string;
    pinned: boolean;
    isAuthorMuted: boolean;
    ipLoc: string;
    replyCount: number;
  };
}

const DiscoveryEditorPick: React.FC<{
  data: DiscoveryEditorPickItem[];
}> = (props: { data: DiscoveryEditorPickItem[] }) => {
  const navigate = useNavigate();

  const jumpToEpisodeDetail = (index: number) => {
    const targetEpisode = props.data[index];
    navigate(`/overview/episode/${targetEpisode.episode.eid}`);
  };

  const goToPodcast = (index: number) => {
    const podcastId = props.data[index].episode.podcast.pid;
    navigate(`/overview/podcast/${podcastId}`);
  };

  const playPodcast = ({
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
    emitter.emit("play", { url, title, image, eid, pid });
  };

  return (
    <>
      <div className="text-2xl ml-4 mt-4 w-[30%]" style={{ color: "#25b4e1" }}>
        编辑精选
      </div>
      <div className="mt-2 max-w-[440px] flex flex-col justify-start items-center">
        {props.data.map((cell, index) => {
          return (
            <div
              key={cell.episode.eid}
              className="h-[194px] mx-4 rounded-md border border-neutral-100 shadow-sm mb-6"
            >
              <div className="flex justify-around mx-4 my-2">
                <img
                  src={cell.episode.podcast.image.thumbnailUrl}
                  alt="podcast"
                  className="w-[64px] h-[64px] rounded cursor-pointer"
                  onClick={() => jumpToEpisodeDetail(index)}
                />

                <div className="flex flex-1 items-center justify-between">
                  <div className="flex flex-col h-full ml-2 mr-2">
                    <span
                      className="text-neutral-400 text-sm cursor-pointer"
                      onClick={() => goToPodcast(index)}
                    >
                      {cell.episode.podcast.title}
                    </span>
                    <span
                      className="line-clamp-2 color-neutral-900 text-sm font-bold cursor-pointer"
                      title={cell.episode.title}
                      onClick={() => jumpToEpisodeDetail(index)}
                    >
                      {cell.episode.title}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CirclePlay
                      color="#25b4e1"
                      size={32}
                      className="cursor-pointer"
                      onClick={() =>
                        playPodcast({
                          url: cell.episode.enclosure.url,
                          title: cell.episode.title,
                          image: cell.episode.podcast.image.thumbnailUrl,
                          eid: cell.episode.eid,
                          pid: cell.episode.podcast.pid,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div
                className="bg-stone-100 ml-[80px] mr-2 rounded rounded-md p-2"
                title={cell.comment.text}
              >
                <div className="line-clamp-3 text-sm">
                  {cell.comment.author.nickname}: {cell.comment.text}
                </div>
              </div>
              <div className="flex w-full pl-[80px] justify-between text-neutral-400 text-xs mt-2 pr-3">
                <div className="flex items-center">
                  <div className="flex">
                    {cell.recentAudiences.map((item) => {
                      return (
                        <img
                          src={item.avatar.picture.thumbnailUrl}
                          key={item.uid}
                          alt="avatar"
                          className="w-[16px] h-[16px] mr-[1px] rounded-[8px]"
                        />
                      );
                    })}
                  </div>
                  <span className="ml-2">听过</span>
                </div>
                <div className="flex">
                  <div className="flex items-center">
                    <Headphones size={12} />
                    <span className="ml-1">{cell.episode.playCount}</span>
                  </div>
                  <div className="ml-4 flex items-center">
                    <MessageSquareText size={12} />
                    <span className="ml-1">{cell.episode.commentCount}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default DiscoveryEditorPick;
